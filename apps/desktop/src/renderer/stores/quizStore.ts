import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Quiz Types and Interfaces (embedded for now)
interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'drag-drop';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  references?: string[];
  tags: string[];
  estimatedTime: number;
}

interface QuizAttempt {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  timestamp: Date;
}

interface QuizSession {
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

interface QuizPerformance {
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
    [topic: string]: number;
  };
}

interface QuizStore {
  // Current quiz state
  currentSession: QuizSession | null;
  currentQuestionIndex: number;
  isLoading: boolean;
  error: string | null;

  // Quiz history and performance
  completedSessions: QuizSession[];
  performance: Record<string, QuizPerformance>;

  // Actions
  startQuiz: (
    moduleId: string,
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard' | 'adaptive',
    questions: QuizQuestion[]
  ) => void;
  submitAnswer: (answer: string | string[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeQuiz: () => void;
  pauseQuiz: () => void;
  resumeQuiz: () => void;
  generateQuestions: (
    content: any,
    topic: string,
    difficulty: string,
    count: number
  ) => Promise<QuizQuestion[]>;
  updatePerformance: (moduleId: string, session: QuizSession) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentSession: null,
      currentQuestionIndex: 0,
      isLoading: false,
      error: null,
      completedSessions: [],
      performance: {},

      // Start a new quiz session
      startQuiz: (moduleId, topic, difficulty, questions) => {
        const newSession: QuizSession = {
          id: `quiz-${Date.now()}`,
          moduleId,
          topic,
          questions,
          attempts: [],
          startedAt: new Date(),
          score: 0,
          totalQuestions: questions.length,
          difficulty,
          status: 'in-progress',
        };

        set({
          currentSession: newSession,
          currentQuestionIndex: 0,
          error: null,
        });
      },

      // Submit answer for current question
      submitAnswer: answer => {
        const { currentSession, currentQuestionIndex } = get();
        if (!currentSession) return;

        const currentQuestion = currentSession.questions[currentQuestionIndex];
        if (!currentQuestion) return;

        const isCorrect = Array.isArray(answer)
          ? JSON.stringify(answer.sort()) ===
            JSON.stringify((currentQuestion.correctAnswer as string[]).sort())
          : answer === currentQuestion.correctAnswer;

        const attempt: QuizAttempt = {
          questionId: currentQuestion.id,
          userAnswer: answer,
          isCorrect,
          timeSpent: 30, // TODO: Implement actual time tracking
          timestamp: new Date(),
        };

        const updatedSession = {
          ...currentSession,
          attempts: [...currentSession.attempts, attempt],
          score: isCorrect ? currentSession.score + 1 : currentSession.score,
        };

        set({
          currentSession: updatedSession,
        });
      },

      // Navigate to next question
      nextQuestion: () => {
        const { currentSession, currentQuestionIndex } = get();
        if (!currentSession) return;

        if (currentQuestionIndex < currentSession.questions.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        }
      },

      // Navigate to previous question
      previousQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
      },

      // Complete the quiz
      completeQuiz: () => {
        const { currentSession, completedSessions } = get();
        if (!currentSession) return;

        const completedSession = {
          ...currentSession,
          completedAt: new Date(),
          status: 'completed' as const,
        };

        set({
          completedSessions: [...completedSessions, completedSession],
          currentSession: null,
          currentQuestionIndex: 0,
        });

        get().updatePerformance(currentSession.moduleId, completedSession);
      },

      // Pause quiz
      pauseQuiz: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        set({
          currentSession: {
            ...currentSession,
            status: 'paused',
          },
        });
      },

      // Resume quiz
      resumeQuiz: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        set({
          currentSession: {
            ...currentSession,
            status: 'in-progress',
          },
        });
      },

      // AI Quiz Generation
      generateQuestions: async (content, topic, difficulty, count) => {
        set({ isLoading: true, error: null });

        try {
          // This would integrate with your AI service
          // For now, I'll create a mock generator based on the content
          const questions = await mockQuestionGenerator(content, topic, difficulty, count);

          set({ isLoading: false });
          return questions;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to generate questions',
          });
          return [];
        }
      },

      // Update performance metrics
      updatePerformance: (moduleId, session) => {
        const { performance } = get();
        const existingPerf = performance[moduleId] || {
          moduleId,
          totalQuizzes: 0,
          averageScore: 0,
          strongTopics: [],
          weakTopics: [],
          improvementTrends: [],
          masteryLevel: {},
        };

        const scorePercentage = (session.score / session.totalQuestions) * 100;
        const newAverage =
          (existingPerf.averageScore * existingPerf.totalQuizzes + scorePercentage) /
          (existingPerf.totalQuizzes + 1);

        const updatedPerf: QuizPerformance = {
          ...existingPerf,
          totalQuizzes: existingPerf.totalQuizzes + 1,
          averageScore: newAverage,
          improvementTrends: [
            ...existingPerf.improvementTrends,
            {
              date: new Date().toISOString(),
              score: scorePercentage,
              topic: session.topic,
            },
          ],
          masteryLevel: {
            ...existingPerf.masteryLevel,
            [session.topic]: scorePercentage,
          },
        };

        set({
          performance: {
            ...performance,
            [moduleId]: updatedPerf,
          },
        });
      },

      // Reset quiz state
      reset: () => {
        set({
          currentSession: null,
          currentQuestionIndex: 0,
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: 'pharmacy-quiz-store',
    }
  )
);

// Mock AI Question Generator (replace with real AI integration)
async function mockQuestionGenerator(
  content: any,
  topic: string,
  difficulty: string,
  count: number
): Promise<QuizQuestion[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const questions: QuizQuestion[] = [];

  // Generate questions based on content
  if (content.slides) {
    content.slides.forEach((slide: any, index: number) => {
      if (questions.length >= count) return;

      // Multiple choice question from key points
      if (slide.keyPoints && slide.keyPoints.length > 0) {
        questions.push({
          id: `mc-${index}-${Date.now()}`,
          type: 'multiple-choice',
          topic: slide.title || topic,
          difficulty: difficulty as any,
          question: `Which of the following is a key characteristic of ${slide.title}?`,
          options: [
            slide.keyPoints[0],
            'Decreased protein synthesis',
            'Enhanced renal clearance',
            'Reduced bioavailability',
          ],
          correctAnswer: slide.keyPoints[0],
          explanation: `${slide.keyPoints[0]} is indeed a key aspect of ${slide.title}. This is important for understanding hepatic function.`,
          tags: ['hepatic', 'physiology'],
          estimatedTime: 45,
        });
      }

      // True/false question from clinical pearls
      if (slide.clinicalPearls && slide.clinicalPearls.length > 0 && questions.length < count) {
        questions.push({
          id: `tf-${index}-${Date.now()}`,
          type: 'true-false',
          topic: slide.title || topic,
          difficulty: difficulty as any,
          question: `True or False: ${slide.clinicalPearls[0]}`,
          correctAnswer: 'True',
          explanation: `This is correct. ${slide.clinicalPearls[0]} This clinical pearl is essential for pharmaceutical practice.`,
          tags: ['clinical', 'hepatic'],
          estimatedTime: 30,
        });
      }
    });
  }

  // Generate questions from pharmacology topics
  if (content.pharmacologyTopics) {
    content.pharmacologyTopics.forEach((pharmTopic: any, index: number) => {
      if (questions.length >= count) return;

      questions.push({
        id: `pharm-${index}-${Date.now()}`,
        type: 'multiple-choice',
        topic: pharmTopic.topic || topic,
        difficulty: difficulty as any,
        question: `What is the clinical significance of ${pharmTopic.topic}?`,
        options: [
          pharmTopic.clinicalSignificance,
          'Minimal clinical impact',
          'Only affects elderly patients',
          'Primarily concerns injection site reactions',
        ],
        correctAnswer: pharmTopic.clinicalSignificance,
        explanation: `${pharmTopic.clinicalSignificance}. Understanding this concept is crucial for ${pharmTopic.topic}.`,
        references: pharmTopic.relevantDrugs,
        tags: ['pharmacology', 'clinical'],
        estimatedTime: 60,
      });
    });
  }

  // Fill remaining slots with gap-based questions
  while (questions.length < count && content.identifiedGaps) {
    const gap = content.identifiedGaps[questions.length % content.identifiedGaps.length];

    questions.push({
      id: `gap-${questions.length}-${Date.now()}`,
      type: 'short-answer',
      topic: 'Knowledge Gaps',
      difficulty: 'hard',
      question: `Describe the clinical considerations for: ${gap.replace('Missing information about ', '').replace('No coverage of ', '').replace('Limited discussion of ', '')}`,
      correctAnswer: 'This topic requires further study and clinical experience.',
      explanation: `${gap}. This represents an important area for continued learning and professional development.`,
      tags: ['gaps', 'advanced'],
      estimatedTime: 90,
    });
  }

  return questions.slice(0, count);
}
