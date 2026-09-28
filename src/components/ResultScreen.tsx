import React, { useState } from 'react';
import { SetupData, FinalReport, QuestionHistoryItem } from '../types.ts';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Share2,
  Printer,
  Sparkles,
  Bot,
} from 'lucide-react';

interface ResultScreenProps {
  setupData: SetupData;
  report: FinalReport;
  history: QuestionHistoryItem[];
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  setupData,
  report,
  history,
  onRestart,
}) => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 60) return 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10';
    if (score >= 40) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-teal-600';
    if (score >= 60) return 'from-blue-600 to-indigo-600';
    if (score >= 40) return 'from-amber-500 to-orange-600';
    return 'from-rose-500 to-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Top Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Interview Completed
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Performance Report
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {setupData.name} • {setupData.jobRole} ({setupData.experienceLevel}) • {setupData.interviewType} Interview
        </p>
      </div>

      {/* Main Score & Summary Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
          {/* Left: Overall Score Circle */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full flex items-center justify-center bg-slate-950 border-4 border-slate-800 shadow-inner">
              <div
                className={`absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-tr ${getScoreGradient(
                  report.overallScore
                )} opacity-20`}
              />
              <div className="text-center z-10">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {report.overallScore}
                </span>
                <span className="text-slate-400 text-xs sm:text-sm block font-medium">out of 100</span>
              </div>
            </div>

            <div className={`mt-4 px-3.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(report.overallScore)}`}>
              {report.performanceLevel}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-indigo-400">
              <Award className="w-5 h-5" />
              <h3 className="font-bold text-white text-lg">Interview Summary</h3>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
              {report.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Strengths & Areas to Improve Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Strengths */}
        <div className="bg-slate-900/70 border border-emerald-500/20 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Key Strengths</h3>
          </div>
          <ul className="space-y-3">
            {report.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  ✓
                </span>
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="bg-slate-900/70 border border-amber-500/20 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4 text-amber-400">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Areas to Improve</h3>
          </div>
          <ul className="space-y-3">
            {report.areasToImprove.map((area, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  !
                </span>
                <span className="leading-relaxed">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Improvement Suggestions */}
      {report.improvementSuggestions && report.improvementSuggestions.length > 0 && (
        <div className="bg-slate-900/70 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl mb-8">
          <div className="flex items-center gap-2 mb-4 text-indigo-400">
            <Lightbulb className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Actionable Suggestions for Real Interviews</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {report.improvementSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question by Question Review Accordion */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl mb-8">
        <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          Detailed Question Breakdown ({history.length} Questions)
        </h3>

        <div className="space-y-3">
          {history.map((item) => {
            const isExpanded = expandedQuestion === item.questionNumber;
            return (
              <div
                key={item.questionNumber}
                className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/50 transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedQuestion(isExpanded ? null : item.questionNumber)}
                  className="w-full p-4 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      Q{item.questionNumber}
                    </span>
                    <span className="text-sm font-semibold text-white line-clamp-1">
                      {item.question}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getScoreColor(item.score * 10)}`}>
                      {item.score}/10
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-800/80 space-y-3 text-xs sm:text-sm">
                    <div className="mt-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Full Question
                      </span>
                      <p className="text-slate-200">{item.question}</p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Your Submitted Answer
                      </span>
                      <p className="text-slate-300 italic bg-slate-900/80 p-3 rounded-xl border border-slate-800 leading-relaxed">
                        &ldquo;{item.answer}&rdquo;
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Interviewer Evaluation & Feedback
                      </span>
                      <p className="text-slate-200 leading-relaxed">{item.feedback}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onRestart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-base bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Practice Another Interview</span>
        </button>

        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer text-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF</span>
        </button>
      </div>
    </div>
  );
};
