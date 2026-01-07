
import React, { useState, useRef } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { EvaluationResult, Verdict } from '../types';
import { generateAudioPitch, decodeAudioData } from '../services/geminiService';

interface ResultsSectionProps {
  result: EvaluationResult;
  onReset: () => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ result, onReset }) => {
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const getDecisionStyles = (decision: Verdict) => {
    switch (decision) {
      case 'GO':
        return { 
          bg: 'bg-emerald-50 border-emerald-200', 
          text: 'text-emerald-700', 
          badge: 'bg-emerald-500 text-white', 
          desc: 'High potential. Market need is clear and solution is uniquely positioned.' 
        };
      case 'PIVOT':
        return { 
          bg: 'bg-amber-50 border-amber-200', 
          text: 'text-amber-700', 
          badge: 'bg-amber-500 text-white', 
          desc: 'Significant potential exists, but core assumptions need rethinking.' 
        };
      case 'NO-GO':
        return { 
          bg: 'bg-rose-50 border-rose-200', 
          text: 'text-rose-700', 
          badge: 'bg-rose-500 text-white', 
          desc: 'Faces critical structural barriers or lacks competitive advantage.' 
        };
    }
  };

  const styles = getDecisionStyles(result.decision);

  const playPitch = async () => {
    if (isPlaying) {
      sourceRef.current?.stop();
      setIsPlaying(false);
      return;
    }

    setIsAudioLoading(true);
    try {
      const audioBytes = await generateAudioPitch(result.executiveSummary);
      if (audioBytes) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const buffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
        
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlaying(false);
        sourceRef.current = source;
        source.start();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAudioLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Brand & Verdict Hero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {result.brandImageUrl && (
          <div className="md:col-span-1 bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">AI-Generated Brand Concept</p>
            <img src={result.brandImageUrl} alt="Startup Logo Concept" className="w-full aspect-square object-contain rounded-xl shadow-inner bg-slate-50" />
            <div className="mt-4 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500">Visual Identity V1</div>
          </div>
        )}

        <div className={`md:col-span-${result.brandImageUrl ? '2' : '3'} rounded-2xl border-2 p-8 ${styles.bg} transition-all relative overflow-hidden flex flex-col justify-center`}>
          <div className="absolute top-0 right-0 p-4">
             <button 
              onClick={playPitch}
              disabled={isAudioLoading}
              className={`p-3 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95 ${isPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-indigo-600'}`}
              title="Listen to AI Executive Pitch"
             >
               {isAudioLoading ? (
                 <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               ) : isPlaying ? (
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
               ) : (
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
               )}
             </button>
          </div>

          <div className="space-y-4">
            <span className={`inline-block px-4 py-1 rounded-full font-bold text-xs tracking-widest uppercase ${styles.badge}`}>
              Analysis Verdict
            </span>
            <h2 className={`text-4xl font-extrabold ${styles.text} leading-tight`}>{result.decision === 'GO' ? 'Market Disruptor' : result.decision === 'PIVOT' ? 'Needs Pivot' : 'High Risk Profile'}</h2>
            <p className={`text-xl font-semibold ${styles.text} leading-relaxed opacity-90`}>{result.executiveSummary}</p>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-full bg-slate-200/50 rounded-full h-3 max-w-[200px]">
                <div className={`h-3 rounded-full ${styles.badge}`} style={{ width: `${result.overallScore}%` }}></div>
              </div>
              <span className={`text-sm font-black ${styles.text}`}>{result.overallScore}% Potential</span>
            </div>
          </div>
        </div>
      </div>

      {/* Competitors Found via Google Search */}
      {result.competitors && result.competitors.length > 0 && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Real-World Competitors Found
            </h3>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">Live Search Grounding</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.competitors.map((comp, idx) => (
              <a 
                key={idx} 
                href={comp.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 line-clamp-1">{comp.name}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{comp.url}</p>
                </div>
                <div className="mt-3 flex items-center justify-end">
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
            Metric Analysis
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={result.ratings}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Category Scores
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={result.ratings} margin={{ left: 20, right: 30 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis dataKey="category" type="category" width={100} tick={{ fontSize: 10 }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {result.ratings.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 70 ? '#10b981' : entry.score > 40 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-emerald-500">
          <h3 className="text-emerald-700 font-bold mb-6 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            Key Strengths
          </h3>
          <div className="space-y-6">
            {result.strengths.map((s, i) => (
              <div key={i} className="group">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <p className="font-bold text-slate-900 text-sm tracking-tight">{s.title}</p>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed ml-3.5">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-rose-500">
          <h3 className="text-rose-700 font-bold mb-6 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
            Critical Weaknesses
          </h3>
          <div className="space-y-6">
            {result.weaknesses.map((w, i) => (
              <div key={i} className="group">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  <p className="font-bold text-slate-900 text-sm tracking-tight">{w.title}</p>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed ml-3.5">{w.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <h3 className="text-xl font-bold mb-8 flex items-center gap-2 relative z-10">
          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          Strategic Roadmap
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
          {result.suggestions.map((s, i) => (
            <div key={i} className="bg-white/5 p-5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-indigo-400 font-black text-[10px] uppercase tracking-widest">PHASE 0{i + 1}</span>
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                  {i + 1}
                </div>
              </div>
              <p className="text-white font-bold text-sm mb-2 group-hover:text-indigo-300 transition-colors">{s.title}</p>
              <p className="text-slate-400 text-xs leading-relaxed group-hover:text-slate-200">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 pb-12 flex justify-center">
        <button
          onClick={() => {
            if (isPlaying) sourceRef.current?.stop();
            onReset();
          }}
          className="px-8 py-4 bg-white border border-slate-200 text-slate-900 font-black text-sm uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Reset Analysis
        </button>
      </div>
    </div>
  );
};

export default ResultsSection;
