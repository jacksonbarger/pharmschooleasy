// Quiz Types and Interfaces
export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'drag-drop';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string | string[];
  explanation: string;
  references?: string[];
  tags: string[];
  estimatedTime: number; // in seconds
}

export interface QuizAttempt {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  timestamp: Date;
}

export interface QuizSession {
  id: string;
  moduleId: string;
  topic: string;
  questions: QuizQuestion[];
  attempts: QuizAttempt[];
  startedAt: Date;
  completedAt?: Date;
  score: number;
  totalQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  status: 'in-progress' | 'completed' | 'paused';
}

export interface QuizPerformance {
  moduleId: string;
  totalQuizzes: number;
  averageScore: number;
  strongTopics: string[];
  weakTopics: string[];
  improvementTrends: {
    date: string;
    score: number;
    topic: string;
  }[];
  masteryLevel: {
    [topic: string]: number; // 0-100 percentage
  };
}

export interface StudyContent {
  slides: {
    slideNumber: number;
    title: string;
    keyPoints: string[];
    drugReferences: string[];
    clinicalPearls: string[];
  }[];
  pharmacologyTopics: {
    topic: string;
    description: string;
    relevantDrugs: string[];
    clinicalSignificance: string;
  }[];
  identifiedGaps: string[];
}
