import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, TrendingUp, Cpu, Award } from 'lucide-react';

interface HomeScreenProps {
  onStart: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4 text-center max-w-4xl mx-auto">
      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm animate-pulse">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <span>Powered by Gemini AI • Real-time adaptive evaluation</span>
      </div>

      {/* Main Title & Subtitle */}
      <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
        AI Interviewer
      </h1>
      <p className="text-lg sm:text-2xl text-slate-300 max-w-2xl font-normal mb-10 leading-relaxed">
        Practice your interviews with AI
      </p>

      {/* Primary CTA Button */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
        <button
          onClick={onStart}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base sm:text-lg font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <span>Start Interview</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 3 Clean Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full text-left">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-colors shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white mb-2">Adaptive Questions</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Questions dynamically adjust in difficulty based on your answers to simulate a real interviewer.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-colors shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white mb-2">Instant Feedback</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Get immediate evaluations after every answer with helpful scoring, strengths, and missing points.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-colors shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white mb-2">Comprehensive Report</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Receive an overall score out of 100 with identified strengths, areas to improve, and guidance.
          </p>
        </div>
      </div>

      {/* Trust & Simplicity Footer note */}
      <div className="mt-12 flex items-center gap-6 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No signup required
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free & instant
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tailored to your role
        </span>
      </div>
    </div>
  );
};
