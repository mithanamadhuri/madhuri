import React, { useState } from 'react';
import { SetupData, QuestionDifficulty, AnswerEvaluation, QuestionHistoryItem } from '../types.ts';
import {
  Bot,
  Send,
  Sparkles,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  History,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface InterviewScreenProps {
  setupData: SetupData;
  currentQuestionNumber: number;
  currentQuestion: string;
  currentHint: string;
  currentDifficulty: QuestionDifficulty;
  evaluation: AnswerEvaluation | null;
  nextDifficulty: QuestionDifficulty | null;
  history: QuestionHistoryItem[];
  isSubmitting: boolean;
  onSubmitAnswer: (answer: string) => void;
  onProceedToNext: () => void;
  isLastQuestion: boolean;
}

export const InterviewScreen: React.FC<InterviewScreenProps> = ({
  setupData,
  currentQuestionNumber,
  currentQuestion,
  currentHint,
  currentDifficulty,
  evaluation,
  nextDifficulty,
  history,
  isSubmitting,
  onSubmitAnswer,
  onProceedToNext,
  isLastQuestion,
}) => {
  const [answerText, setAnswerText] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const progressPercentage = Math.round(((currentQuestionNumber - 1) / setupData.totalQuestions) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim() || isSubmitting) return;
    onSubmitAnswer(answerText.trim());
  };

  const getDifficultyBadge = (diff: QuestionDifficulty) => {
    switch (diff) {
      case 'Advanced':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="w-3 h-3" /> Advanced
          </span>
        );
      case 'Introductory':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <HelpCircle className="w-3 h-3" /> Introductory
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Sparkles className="w-3 h-3" /> Standard
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 5) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Top Status & Progress Bar */}
      <div className="mb-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
              Question {currentQuestionNumber} of {setupData.totalQuestions}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {setupData.jobRole} ({setupData.interviewType})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Difficulty:</span>
            {getDifficultyBadge(currentDifficulty)}
          </div>
        </div>

        {/* Progress bar track */}
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${Math.max(5, progressPercentage)}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl mb-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-600/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                AI Interviewer Question
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQuestion}
            </h2>
          </div>
        </div>

        {/* Optional Hint Toggle */}
        {currentHint && (
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{showHint ? 'Hide answering hint' : 'Need guidance on what to cover?'}</span>
            </button>
            {showHint && (
              <p className="mt-2 text-xs text-slate-300 bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 leading-relaxed">
                💡 <strong className="text-amber-300">Interviewer Tip:</strong> {currentHint}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Evaluation Result View OR Answer Form */}
      {evaluation ? (
        /* Evaluation Card */
        <div className="bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">AI Evaluation</h3>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(evaluation.score)}`}>
              Score: {evaluation.score} / 10
            </div>
          </div>

          {/* Verdict and Feedback */}
          <div className="space-y-4 mb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Evaluation Verdict
              </span>
              <p className="text-sm font-semibold text-indigo-300 mt-0.5">
                {evaluation.verdict}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Feedback
              </span>
              <p className="text-sm text-slate-200 mt-1 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {evaluation.feedback}
              </p>
            </div>

            {evaluation.keyTakeaways && evaluation.keyTakeaways.length > 0 && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Key Points for a Complete Answer
                </span>
                <ul className="mt-2 space-y-1.5">
                  {evaluation.keyTakeaways.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Difficulty notification */}
            {nextDifficulty && !isLastQuestion && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between">
                <span>Next question adapted difficulty:</span>
                <span className="font-bold">{nextDifficulty}</span>
              </div>
            )}
          </div>

          {/* Proceed Button */}
          <button
            onClick={() => {
              setAnswerText('');
              setShowHint(false);
              onProceedToNext();
            }}
            className="w-full py-4 px-6 rounded-xl font-bold text-white text-base bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isLastQuestion ? 'View Final Results' : 'Next Question'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        /* Answer Input Card */
        <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl mb-6">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-200">
              Your Answer
            </label>
            <span className="text-xs text-slate-400">
              {answerText.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            disabled={isSubmitting}
            placeholder="Type your answer here in detail... Explain core concepts, practical examples, or your reasoning..."
            rows={7}
            className="w-full px-4 py-3.5 rounded-2xl bg-slate-950/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm leading-relaxed mb-4 resize-y"
            required
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 self-start sm:self-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              AI will evaluate your answer and adjust the next question.
            </span>

            <button
              type="submit"
              disabled={isSubmitting || !answerText.trim()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Evaluating Answer...</span>
                </>
              ) : (
                <>
                  <span>Submit Answer</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Previous Questions History Toggle */}
      {history.length > 0 && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              Previous Questions ({history.length})
            </span>
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showHistory && (
            <div className="mt-4 space-y-3 pt-3 border-t border-slate-800">
              {history.map((item) => (
                <div key={item.questionNumber} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-indigo-300">
                      Q{item.questionNumber}: {item.question}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold border ${getScoreColor(item.score)}`}>
                      {item.score}/10
                    </span>
                  </div>
                  <p className="text-slate-400 italic line-clamp-2">
                    &ldquo;{item.answer}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
