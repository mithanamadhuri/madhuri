import React, { useState } from 'react';
import { SetupData, ExperienceLevel, InterviewType } from '../types.ts';
import { User, Briefcase, GraduationCap, Clock, ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';

interface SetupScreenProps {
  onBack: () => void;
  onSubmit: (data: SetupData) => void;
  isLoading: boolean;
}

const POPULAR_ROLES = [
  'Java Developer',
  'Python Developer',
  'Web Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
];

export const SetupScreen: React.FC<SetupScreenProps> = ({ onBack, onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [jobRole, setJobRole] = useState('Java Developer');
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Fresher');
  const [interviewType, setInterviewType] = useState<InterviewType>('Technical');
  const [totalQuestions, setTotalQuestions] = useState<5 | 10>(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRole = isCustomRole ? (customRoleInput.trim() || 'Software Developer') : jobRole;
    onSubmit({
      name: name.trim() || 'Candidate',
      jobRole: finalRole,
      experienceLevel,
      interviewType,
      totalQuestions,
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Back button */}
      <button
        onClick={onBack}
        disabled={isLoading}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Main Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Interview Configuration
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Set Up Your Interview
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Customize your role and preferences to receive tailored questions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Smith"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
              required
            />
          </div>

          {/* 2. Job Role */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                Job Role
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsCustomRole(!isCustomRole);
                  if (!isCustomRole) setCustomRoleInput('');
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {isCustomRole ? 'Choose from list' : '+ Enter custom role'}
              </button>
            </label>

            {!isCustomRole ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {POPULAR_ROLES.map((role) => {
                    const isSelected = jobRole === role;
                    return (
                      <button
                        type="button"
                        key={role}
                        onClick={() => setJobRole(role)}
                        className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                            : 'bg-slate-950/60 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <input
                type="text"
                value={customRoleInput}
                onChange={(e) => setCustomRoleInput(e.target.value)}
                placeholder="e.g. Cloud Architect, Mobile Developer, QA Engineer..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                required={isCustomRole}
              />
            )}
          </div>

          {/* 3. Experience Level & 4. Interview Type (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Experience Level */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                Experience Level
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
                {(['Fresher', 'Experienced'] as ExperienceLevel[]).map((level) => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => setExperienceLevel(level)}
                    className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      experienceLevel === level
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Interview Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Interview Type
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
                {(['Technical', 'HR'] as InterviewType[]).map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setInterviewType(type)}
                    className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      interviewType === type
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Number of Questions */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Number of Questions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTotalQuestions(5)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  totalQuestions === 5
                    ? 'bg-indigo-950/40 border-indigo-500/60 ring-2 ring-indigo-500/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">5 Questions</span>
                  {totalQuestions === 5 && (
                    <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Quick practice (~5-10 mins)</p>
              </button>

              <button
                type="button"
                onClick={() => setTotalQuestions(10)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  totalQuestions === 10
                    ? 'bg-indigo-950/40 border-indigo-500/60 ring-2 ring-indigo-500/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">10 Questions</span>
                  {totalQuestions === 10 && (
                    <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Comprehensive mock (~15-20 mins)</p>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl font-bold text-white text-base bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Preparing AI Interviewer...</span>
                </>
              ) : (
                <>
                  <span>Start Interview</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
