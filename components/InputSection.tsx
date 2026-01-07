
import React from 'react';
import { QUESTIONS, StartupInput } from '../types';

interface InputSectionProps {
  formData: StartupInput;
  setFormData: React.Dispatch<React.SetStateAction<StartupInput>>;
  onAnalyze: () => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ formData, setFormData, onAnalyze, isLoading }) => {
  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Fix: Explicitly cast 'val' to string to fix "Property 'trim' does not exist on type 'unknown'" TS error.
  const isFormComplete = Object.values(formData).every(val => (val as string).trim().length > 10);

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-12 transition-all border border-slate-100">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Evaluate Your Vision</h2>
        <p className="text-slate-600 mt-3 text-lg">Provide detailed answers to help Gemini analyze your startup's potential.</p>
      </div>

      <div className="space-y-10">
        {QUESTIONS.map((q, index) => (
          <div key={q.id} className="group space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100 group-focus-within:bg-indigo-600 group-focus-within:text-white transition-all duration-300 group-focus-within:scale-110">
                {index + 1}
              </span>
              <label className="block text-base font-bold text-slate-800 tracking-tight transition-colors group-focus-within:text-indigo-600">
                {q.label}
              </label>
            </div>
            <div className="relative transform transition-all duration-300">
              <textarea
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 
                           hover:border-slate-300 hover:shadow-md 
                           focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 focus:shadow-xl focus:-translate-y-1
                           transition-all duration-300 outline-none min-h-[140px] resize-none leading-relaxed text-base shadow-sm"
                placeholder={q.placeholder}
                value={(formData as any)[q.id]}
                onChange={(e) => handleChange(q.id, e.target.value)}
                disabled={isLoading}
              />
              <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                {((formData as any)[q.id] || "").length} chars
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 sticky bottom-8">
        <div className="p-1 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl">
          <button
            onClick={onAnalyze}
            disabled={!isFormComplete || isLoading}
            className={`w-full py-5 rounded-xl font-black text-lg text-white shadow-2xl transform transition-all active:scale-[0.98] flex items-center justify-center gap-4
              ${isFormComplete && !isLoading 
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 cursor-pointer hover:shadow-indigo-500/25' 
                : 'bg-slate-300 cursor-not-allowed opacity-60'}
            `}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Consulting Gemini Intelligence...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate Analysis</span>
              </>
            )}
          </button>
        </div>
        {!isFormComplete && !isLoading && (
          <div className="text-center mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest border border-slate-200">
              Incomplete Form
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSection;
