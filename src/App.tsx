/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SetupData, QuestionDifficulty, AnswerEvaluation, QuestionHistoryItem, FinalReport } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { HomeScreen } from './components/HomeScreen.tsx';
import { SetupScreen } from './components/SetupScreen.tsx';
import { InterviewScreen } from './components/InterviewScreen.tsx';
import { ResultScreen } from './components/ResultScreen.tsx';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<'home' | 'setup' | 'interview' | 'result'>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Setup state
  const [setupData, setSetupData] = useState<SetupData>({
    name: '',
    jobRole: 'Java Developer',
    experienceLevel: 'Fresher',
    interviewType: 'Technical',
    totalQuestions: 5,
  });

  // Active Interview state
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentHint, setCurrentHint] = useState('');
  const [currentDifficulty, setCurrentDifficulty] = useState<QuestionDifficulty>('Standard');
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [nextDifficulty, setNextDifficulty] = useState<QuestionDifficulty | null>(null);
  const [nextQuestionCache, setNextQuestionCache] = useState<string | null>(null);
  const [nextHintCache, setNextHintCache] = useState<string | null>(null);
  const [qaHistory, setQaHistory] = useState<QuestionHistoryItem[]>([]);

  // Final Report state
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null);

  // Reset all to initial state
  const handleResetToHome = () => {
    setStep('home');
    setErrorMessage(null);
    setEvaluation(null);
    setQaHistory([]);
    setFinalReport(null);
    setCurrentQuestionNumber(1);
  };

  // Start interview from Setup Screen
  const handleStartInterview = async (config: SetupData) => {
    setSetupData(config);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Could not connect to interviewer. Please try again.');
      }

      const data = await response.json();
      setCurrentQuestion(data.question || 'Tell me about yourself and your background.');
      setCurrentDifficulty(data.difficulty || 'Standard');
      setCurrentHint(data.hint || '');
      setCurrentQuestionNumber(1);
      setEvaluation(null);
      setQaHistory([]);
      setStep('interview');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Answer to current question
  const handleSubmitAnswer = async (answer: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/interview/evaluate-and-next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: setupData.name,
          jobRole: setupData.jobRole,
          experienceLevel: setupData.experienceLevel,
          interviewType: setupData.interviewType,
          currentQuestionNumber,
          totalQuestions: setupData.totalQuestions,
          currentQuestion,
          userAnswer: answer,
          currentDifficulty,
          history: qaHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Evaluation request failed. Please try again.');
      }

      const data = await response.json();
      const evalData: AnswerEvaluation = data.evaluation || {
        score: 7,
        verdict: 'Good Attempt',
        feedback: 'Thank you for your answer. Keep focusing on clarity and depth.',
        keyTakeaways: ['Good foundational knowledge', 'Can add more real-world examples'],
      };

      setEvaluation(evalData);
      setNextDifficulty(data.nextDifficulty || currentDifficulty);
      setNextQuestionCache(data.nextQuestion || null);
      setNextHintCache(data.nextHint || '');

      // Append to history
      const newHistoryItem: QuestionHistoryItem = {
        questionNumber: currentQuestionNumber,
        question: currentQuestion,
        answer,
        score: evalData.score,
        verdict: evalData.verdict,
        feedback: evalData.feedback,
        difficulty: currentDifficulty,
        keyTakeaways: evalData.keyTakeaways,
      };

      setQaHistory((prev) => [...prev, newHistoryItem]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to evaluate answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Proceed to next question or trigger final report
  const handleProceedToNext = async () => {
    if (currentQuestionNumber >= setupData.totalQuestions) {
      // Last question finished -> generate Final Report
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch('/api/interview/finish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: setupData.name,
            jobRole: setupData.jobRole,
            experienceLevel: setupData.experienceLevel,
            interviewType: setupData.interviewType,
            qaPairs: qaHistory,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate final report.');
        }

        const reportData: FinalReport = await response.json();
        setFinalReport(reportData);
        setStep('result');
      } catch (err: any) {
        console.error(err);
        setErrorMessage(err.message || 'Failed to complete interview assessment.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Advance to next question
      if (nextQuestionCache) {
        setCurrentQuestion(nextQuestionCache);
        setCurrentHint(nextHintCache || '');
        if (nextDifficulty) {
          setCurrentDifficulty(nextDifficulty);
        }
      }
      setCurrentQuestionNumber((prev) => prev + 1);
      setEvaluation(null);
      setNextQuestionCache(null);
      setNextHintCache(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        onReset={handleResetToHome}
        inProgress={step === 'interview' || step === 'setup'}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 sm:py-6">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Screen 1: Home Page */}
        {step === 'home' && (
          <HomeScreen onStart={() => setStep('setup')} />
        )}

        {/* Screen 2: Interview Setup */}
        {step === 'setup' && (
          <SetupScreen
            onBack={() => setStep('home')}
            onSubmit={handleStartInterview}
            isLoading={isLoading}
          />
        )}

        {/* Screen 3: AI Interview Active Session */}
        {step === 'interview' && (
          <InterviewScreen
            setupData={setupData}
            currentQuestionNumber={currentQuestionNumber}
            currentQuestion={currentQuestion}
            currentHint={currentHint}
            currentDifficulty={currentDifficulty}
            evaluation={evaluation}
            nextDifficulty={nextDifficulty}
            history={qaHistory}
            isSubmitting={isLoading}
            onSubmitAnswer={handleSubmitAnswer}
            onProceedToNext={handleProceedToNext}
            isLastQuestion={currentQuestionNumber >= setupData.totalQuestions}
          />
        )}

        {/* Screen 4: Final Result Report */}
        {step === 'result' && finalReport && (
          <ResultScreen
            setupData={setupData}
            report={finalReport}
            history={qaHistory}
            onRestart={() => setStep('setup')}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} AI Interviewer • Practice technical & HR interviews powered by Gemini AI</p>
      </footer>
    </div>
  );
}
