import React from 'react';
import { Bot, Sparkles, RefreshCw } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  inProgress: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, inProgress }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-indigo-950/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group transition-opacity hover:opacity-90"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-white tracking-tight">AI Interviewer</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-2.5 h-2.5" />
                Gemini
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Practice your interviews with AI</p>
          </div>
        </div>

        {/* Action */}
        {inProgress && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to end this interview session and return to home?')) {
                onReset();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>End Interview</span>
          </button>
        )}
      </div>
    </header>
  );
};
