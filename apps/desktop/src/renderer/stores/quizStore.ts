import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { openAIService } from '../services/openai';

// Personalized question generation using uploaded content
async function generatePersonalizedQuestions(
  userId: string, 
  topic: string, 
  difficulty: string, 
  count: number
): Promise<QuizQuestion[]> {
  const apiEndpoint = process.env.VITE_API_ENDPOINT || 'http://localhost:3001';
  
  const response = await fetch(`${apiEndpoint}/api/questions/personalized`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      topic,
      difficulty,
      count
    })
  });

  if (!response.ok) {
    throw new Error(`Personalized questions failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.questions || [];
}

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
  isQuizVisible: boolean;

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
  showQuiz: () => void;
  hideQuiz: () => void;
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
      isQuizVisible: false,
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
          isQuizVisible: true,
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
          isQuizVisible: false,
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

      // AI Quiz Generation with Personalized Content Support
      generateQuestions: async (content, topic, difficulty, count) => {
        set({ isLoading: true, error: null });

        try {
          // Try personalized questions first if user has uploaded content
          const userId = localStorage.getItem('userId') || 'anonymous';
          
          if (userId !== 'anonymous') {
            try {
              const personalizedQuestions = await generatePersonalizedQuestions(userId, topic, difficulty, count);
              if (personalizedQuestions.length > 0) {
                set({ isLoading: false });
                return personalizedQuestions;
              }
            } catch (personalizedError) {
              console.warn('Personalized questions failed, falling back to general:', personalizedError);
            }
          }

          // Fallback to general AI questions
          const questions = await aiQuestionGenerator(content, topic, difficulty, count);

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

      // Show/Hide Quiz
      showQuiz: () => set({ isQuizVisible: true }),
      hideQuiz: () => set({ isQuizVisible: false, currentSession: null, currentQuestionIndex: 0 }),

      // Reset quiz state
      reset: () => {
        set({
          currentSession: null,
          currentQuestionIndex: 0,
          isLoading: false,
          error: null,
          isQuizVisible: false,
        });
      },
    }),
    {
      name: 'pharmacy-quiz-store',
    }
  )
);

// AI-Powered Pharmacy Question Generator
// Creates doctorate-level content that's supportive and confidence-building
async function aiQuestionGenerator(
  content: any,
  topic: string,
  difficulty: string,
  count: number
): Promise<QuizQuestion[]> {
  try {
    const prompt = createPharmacyQuestionPrompt(content, topic, difficulty, count);
    const aiResponse = await openAIService.chat(prompt);
    const questions = parseAIQuestions(aiResponse, topic, difficulty);
    return questions.slice(0, count);
  } catch (error) {
    console.error('AI question generation failed:', error);
    // Fallback to mock questions if AI fails
    return createFallbackQuestions(content, topic, difficulty, count);
  }
}

// Creates sophisticated prompts for doctorate-level pharmacy questions
function createPharmacyQuestionPrompt(content: any, topic: string, difficulty: string, count: number): string {
  const difficultyInstructions = {
    easy: 'Create foundational questions that build confidence. Focus on core concepts, definitions, and basic mechanisms. Use encouraging language in explanations.',
    medium: 'Create intermediate questions that challenge understanding. Include clinical correlations and drug interactions. Provide supportive explanations that guide learning.',
    hard: 'Create advanced doctorate-level questions that test deep understanding. Include complex clinical scenarios, multiple drug interactions, and advanced mechanisms. Provide comprehensive explanations that break down complex concepts kindly.'
  };

  const contentSummary = summarizeContent(content);
  
  return `You are an expert pharmacy professor creating ${difficulty} level quiz questions for pharmacy doctorate students on "${topic}". 

Your mission is to create questions that are:
- Academically rigorous at the doctorate level
- Supportive and confidence-building in tone
- Clinically relevant and evidence-based
- Kind but thorough in explanations

${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]}

Content to base questions on:
${contentSummary}

Create exactly ${count} questions in this JSON format:
[
  {
    "type": "multiple-choice" | "true-false" | "short-answer",
    "question": "Clear, precise question text",
    "options": ["option1", "option2", "option3", "option4"] (for multiple-choice only),
    "correctAnswer": "correct answer",
    "explanation": "Supportive, educational explanation that builds confidence while teaching the concept thoroughly",
    "references": ["relevant drugs or concepts"],
    "tags": ["relevant topic tags"],
    "estimatedTime": time_in_seconds
  }
]

Ensure questions test true understanding, not just memorization. Make explanations encouraging and educational.`;
}

// Summarizes content for AI prompt
function summarizeContent(content: any): string {
  let summary = '';
  
  if (content.slides) {
    summary += 'Key Topics:\n';
    content.slides.forEach((slide: any, index: number) => {
      if (slide.title) summary += `- ${slide.title}\n`;
      if (slide.keyPoints) {
        slide.keyPoints.forEach((point: string) => {
          summary += `  • ${point}\n`;
        });
      }
    });
  }
  
  if (content.pharmacologyTopics) {
    summary += '\nPharmacology Focus:\n';
    content.pharmacologyTopics.forEach((topic: any) => {
      summary += `- ${topic.topic}: ${topic.description}\n`;
      if (topic.relevantDrugs) {
        summary += `  Drugs: ${topic.relevantDrugs.join(', ')}\n`;
      }
    });
  }
  
  if (content.identifiedGaps) {
    summary += '\nKnowledge Gaps to Address:\n';
    content.identifiedGaps.forEach((gap: string) => {
      summary += `- ${gap}\n`;
    });
  }
  
  return summary || 'General pharmacy concepts and clinical applications';
}

// Parses AI response into structured questions
function parseAIQuestions(aiResponse: string, topic: string, difficulty: string): QuizQuestion[] {
  try {
    // Extract JSON from AI response (handle potential markdown formatting)
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON found in AI response');
    
    const questionsData = JSON.parse(jsonMatch[0]);
    
    return questionsData.map((q: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      type: q.type || 'multiple-choice',
      topic: topic,
      difficulty: difficulty as any,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || 'Great job! This concept is important for pharmacy practice.',
      references: q.references || [],
      tags: q.tags || [topic.toLowerCase()],
      estimatedTime: q.estimatedTime || (q.type === 'short-answer' ? 90 : 45)
    }));
  } catch (error) {
    console.error('Failed to parse AI questions:', error);
    throw error;
  }
}

// Fallback questions if AI fails
function createFallbackQuestions(content: any, topic: string, difficulty: string, count: number): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  
  // Create basic questions from available content
  if (content.slides && content.slides.length > 0) {
    content.slides.slice(0, count).forEach((slide: any, index: number) => {
      questions.push({
        id: `fallback-${Date.now()}-${index}`,
        type: 'multiple-choice',
        topic: slide.title || topic,
        difficulty: difficulty as any,
        question: `What is a key concept related to ${slide.title || topic}?`,
        options: [
          slide.keyPoints?.[0] || 'Important clinical consideration',
          'Decreased efficacy',
          'Increased toxicity',
          'No clinical significance'
        ],
        correctAnswer: slide.keyPoints?.[0] || 'Important clinical consideration',
        explanation: `This is a fundamental concept in ${topic}. Understanding this helps build a strong foundation for clinical practice.`,
        references: slide.drugReferences || [],
        tags: [topic.toLowerCase(), 'foundation'],
        estimatedTime: 45
      });
    });
  }
  
  return questions.slice(0, count);
}
