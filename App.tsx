
import React, { useState } from 'react';
import { StartupInput, EvaluationResult, SAMPLES } from './types';
import { evaluateStartupIdea } from './services/geminiService';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';

const App: React.FC = () => {
  const [formData, setFormData] = useState<StartupInput>({
    problem: '',
    targetUsers: '',
    existingSolutions: '',
    uniqueness: '',
    revenueModel: '',
    feasibility: '',
    scalability: '',
    longTermVision: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const evaluation = await evaluateStartupIdea(formData);
      setResult(evaluation);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError("Evaluation failed. Please check your connection or API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData({
      problem: '',
      targetUsers: '',
      existingSolutions: '',
      uniqueness: '',
      revenueModel: '',
      feasibility: '',
      scalability: '',
      longTermVision: '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadSample = (key: string) => {
    const sample = SAMPLES[key];
    if (sample) {
      const { title, icon, tagline, ...data } = sample;
      setFormData(data);
      // Smooth scroll to the form
      const element = document.querySelector('main');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const featuredSamples = Object.entries(SAMPLES).slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={handleReset}>
            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-100 group-hover:scale-110 transition-all">
              I
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">IdeaSpark <span className="text-indigo-600">AI</span></h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Founders Lab</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-6">
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               Live Intelligence
             </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      {!result && (
        <div className="bg-slate-900 pt-16 pb-32 md:pt-24 md:pb-48 px-6 text-center text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.3),transparent)] pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
              Predict your startup's <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">future today.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-16 font-medium max-w-2xl mx-auto leading-relaxed">
              Google Gemini analyzes your business model across 8 critical vectors to provide Venture Capital grade feedback.
            </p>
            
            <div className="space-y-12">
              <div className="flex items-center justify-center gap-4">
                <div className="h-px bg-white/10 flex-grow max-w-[150px]"></div>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Featured Startup Concepts</span>
                <div className="h-px bg-white/10 flex-grow max-w-[150px]"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
                {featuredSamples.map(([key, sample]) => (
                  <button
                    key={key}
                    onClick={() => loadSample(key)}
                    className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group flex flex-col text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                      {sample.icon}
                    </div>
                    <h3 className="font-bold text-white mb-1 text-sm group-hover:text-indigo-400 transition-colors">{sample.title}</h3>
                    <p className="text-[10px] text-slate-400 leading-tight group-hover:text-slate-200 transition-colors">{sample.tagline}</p>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">More:</span>
                {Object.entries(SAMPLES).slice(5).map(([key, sample]) => (
                  <button
                    key={key}
                    onClick={() => loadSample(key)}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/30 transition-all text-[10px] font-bold text-slate-400 hover:text-white"
                  >
                    {sample.icon} {sample.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-8 p-5 bg-rose-50 border-2 border-rose-100 text-rose-800 rounded-2xl flex items-start gap-4 animate-bounce-short">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-600 mt-0.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-widest mb-1">Analysis Error</p>
              <p className="font-medium text-slate-600">{error}</p>
            </div>
          </div>
        )}

        {result ? (
          <ResultsSection result={result} onReset={handleReset} />
        ) : (
          <div className="-mt-20 md:-mt-40 relative z-20">
            <InputSection 
              formData={formData} 
              setFormData={setFormData} 
              onAnalyze={handleAnalyze} 
              isLoading={isLoading} 
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-16 mt-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest">
            Gemini 3 Pro Integration
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-2xl mx-auto">
            <div className="flex flex-col">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">100%</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Zero Bias AI</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">Instant</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">VC Feedback</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">8</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Metrics</span>
            </div>
          </div>
        </div>
      </footer>
      <style>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-short {
          animation: bounce-short 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
