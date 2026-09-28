export type ExperienceLevel = 'Fresher' | 'Experienced';
export type InterviewType = 'Technical' | 'HR';
export type QuestionDifficulty = 'Introductory' | 'Standard' | 'Advanced';

export interface SetupData {
  name: string;
  jobRole: string;
  experienceLevel: ExperienceLevel;
  interviewType: InterviewType;
  totalQuestions: 5 | 10;
}

export interface AnswerEvaluation {
  score: number;
  verdict: string;
  feedback: string;
  keyTakeaways: string[];
}

export interface QuestionHistoryItem {
  questionNumber: number;
  question: string;
  answer: string;
  score: number;
  verdict: string;
  feedback: string;
  difficulty: QuestionDifficulty;
  keyTakeaways?: string[];
}

export interface FinalReport {
  overallScore: number;
  performanceLevel: string;
  summary: string;
  strengths: string[];
  areasToImprove: string[];
  improvementSuggestions: string[];
}
