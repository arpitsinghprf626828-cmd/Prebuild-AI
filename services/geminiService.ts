
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { EvaluationResult, StartupInput, Competitor } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const DETAIL_POINT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'A short, punchy title for the point' },
    detail: { type: Type.STRING, description: 'A detailed 1-2 sentence explanation or evidence' },
  },
  required: ['title', 'detail'],
};

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER, description: 'Overall score from 0 to 100' },
    ratings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          score: { type: Type.NUMBER },
        },
        required: ['category', 'score'],
      },
    },
    strengths: { type: Type.ARRAY, items: DETAIL_POINT_SCHEMA },
    weaknesses: { type: Type.ARRAY, items: DETAIL_POINT_SCHEMA },
    suggestions: { type: Type.ARRAY, items: DETAIL_POINT_SCHEMA },
    decision: { type: Type.STRING, description: 'One of GO, PIVOT, or NO-GO' },
    executiveSummary: { type: Type.STRING, description: 'A 2-3 sentence high-level summary' },
  },
  required: ['overallScore', 'ratings', 'strengths', 'weaknesses', 'suggestions', 'decision', 'executiveSummary'],
};

export const evaluateStartupIdea = async (data: StartupInput): Promise<EvaluationResult> => {
  const prompt = `
    You are a world-class Venture Capitalist and Startup Strategist. 
    Evaluate the following startup idea based on the provided answers.
    
    Problem: ${data.problem}
    Target Users: ${data.targetUsers}
    Existing Solutions: ${data.existingSolutions}
    Uniqueness: ${data.uniqueness}
    Revenue Model: ${data.revenueModel}
    Feasibility: ${data.feasibility}
    Scalability: ${data.scalability}
    Long-term Vision: ${data.longTermVision}

    Provide a rigorous analysis. Be honest, critical, but constructive.
    For strengths, weaknesses, and suggestions, provide a clear 'title' and a supporting 'detail' paragraph that explains the reasoning or suggests a path forward.
    Use your internal search capabilities to find actual real-world competitors for this specific niche.
  `;

  try {
    // 1. Core Analysis with Google Search Grounding
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a highly analytical, experienced startup judge. You provide evidence-based decisions (GO, PIVOT, or NO-GO) with precise scores and reasoning. Do not be overly optimistic; identify real risks.",
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    const evaluation = JSON.parse(response.text) as EvaluationResult;
    
    // Extract competitors from grounding metadata
    const competitors: Competitor[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          competitors.push({ name: chunk.web.title, url: chunk.web.uri });
        }
      });
    }
    evaluation.competitors = competitors.slice(0, 5); // Take top 5 unique-ish results

    // 2. Generate Brand Visual
    try {
      const imagePrompt = `A high-quality, professional, modern logo and minimalist brand visual for a startup that solves: ${data.problem}. The brand style is clean, premium, and innovative. White background.`;
      const imgResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: imagePrompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      for (const part of imgResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          evaluation.brandImageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    } catch (imgErr) {
      console.warn("Image generation failed", imgErr);
    }

    return evaluation;
  } catch (error) {
    console.error("Evaluation failed:", error);
    throw error;
  }
};

export const generateAudioPitch = async (text: string): Promise<Uint8Array | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say with a professional and inspiring venture capitalist voice: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Charon' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return decode(base64Audio);
    }
    return null;
  } catch (err) {
    console.error("TTS failed", err);
    return null;
  }
};

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
