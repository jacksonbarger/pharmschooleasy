import React, { useState, useEffect } from 'react';
import { useQuizStore } from '../stores/quizStore';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader } from './ui/Card';
import {
  Brain,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Trophy,
  BookOpen,
} from 'lucide-react';

export function QuizInterface() {
  const {
    currentSession,
    currentQuestionIndex,
    isLoading,
    error,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    completeQuiz,
    pauseQuiz,
    resumeQuiz,
  } = useQuizStore();

  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const currentQuestion = currentSession?.questions[currentQuestionIndex];
  const currentAttempt = currentSession?.attempts.find(a => a.questionId === currentQuestion?.id);
  const isAnswered = !!currentAttempt;
  const isLastQuestion = currentQuestionIndex === (currentSession?.questions.length || 0) - 1;

  // Timer effect
  useEffect(() => {
    if (currentQuestion && !isAnswered && currentSession?.status === 'in-progress') {
      setTimeLeft(currentQuestion.estimatedTime);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit(); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestion, isAnswered, currentSession?.status]);

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer('');
    setShowExplanation(false);
  }, [currentQuestionIndex]);

  const handleSubmit = () => {
    if (selectedAnswer && currentQuestion) {
      submitAnswer(selectedAnswer);
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      completeQuiz();
    } else {
      nextQuestion();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentSession) {
    return <QuizSelector />;
  }

  if (isLoading) {
    return (
      <Card className='max-w-4xl mx-auto'>
        <CardContent className='p-12 text-center space-y-6'>
          <div className='relative'>
            <Brain className='h-16 w-16 mx-auto text-purple-600 animate-pulse' />
            <div className='absolute inset-0 animate-ping'>
              <Brain className='h-16 w-16 mx-auto text-purple-600 opacity-30' />
            </div>
          </div>
          <div className='space-y-2'>
            <h3 className='text-2xl font-bold'>AI is Generating Your Quiz...</h3>
            <p className='text-gray-600 dark:text-gray-400'>
              Creating personalized questions based on your study content
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      {/* Quiz Header */}
      <Card className='bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0'>
        <CardContent className='p-8'>
          <div className='flex items-center justify-between'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-black flex items-center gap-3'>
                <Brain className='h-8 w-8' />
                {currentSession.topic} Quiz
              </h2>
              <p className='text-purple-100 text-lg font-medium'>
                Question {currentQuestionIndex + 1} of {currentSession.totalQuestions}
              </p>
            </div>

            <div className='flex items-center gap-6'>
              {/* Timer */}
              {!isAnswered && currentSession.status === 'in-progress' && (
                <div className='flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-2'>
                  <Clock className='h-5 w-5' />
                  <span className='text-lg font-bold'>{formatTime(timeLeft)}</span>
                </div>
              )}

              {/* Score */}
              <div className='flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-2'>
                <Target className='h-5 w-5' />
                <span className='text-lg font-bold'>
                  {currentSession.score}/{currentSession.attempts.length}
                </span>
              </div>

              {/* Pause/Resume */}
              <Button
                onClick={currentSession.status === 'paused' ? resumeQuiz : pauseQuiz}
                className='bg-white/10 backdrop-blur-xl hover:bg-white/20 border-0'
              >
                {currentSession.status === 'paused' ? (
                  <Play className='h-5 w-5' />
                ) : (
                  <Pause className='h-5 w-5' />
                )}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className='mt-6'>
            <div className='w-full bg-white/20 rounded-2xl h-3 overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl transition-all duration-300 ease-out'
                style={{
                  width: `${((currentQuestionIndex + 1) / currentSession.totalQuestions) * 100}%`
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      {currentQuestion && (
        <Card className='relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20' />

          <CardHeader className='relative pb-6'>
            <div className='flex items-start justify-between'>
              <div className='space-y-2'>
                <div className='flex items-center gap-3'>
                  <div
                    className={`p-2 rounded-xl ${
                      currentQuestion.type === 'multiple-choice'
                        ? 'bg-blue-100 text-blue-600'
                        : currentQuestion.type === 'true-false'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-purple-100 text-purple-600'
                    }`}
                  >
                    {currentQuestion.type === 'multiple-choice'
                      ? '📝'
                      : currentQuestion.type === 'true-false'
                        ? '✓'
                        : '📄'}
                  </div>
                  <div>
                    <p className='text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide'>
                      {currentQuestion.type.replace('-', ' ')} • {currentQuestion.difficulty}
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-500'>
                      Estimated time: {Math.floor(currentQuestion.estimatedTime / 60)}:
                      {(currentQuestion.estimatedTime % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
              </div>

              {isAnswered && (
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${
                    currentAttempt?.isCorrect
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}
                >
                  {currentAttempt?.isCorrect ? (
                    <CheckCircle className='h-5 w-5' />
                  ) : (
                    <XCircle className='h-5 w-5' />
                  )}
                  <span className='font-bold'>
                    {currentAttempt?.isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className='relative space-y-8'>
            {/* Question Text */}
            <div className='space-y-4'>
              <h3 className='text-2xl font-black text-gray-900 dark:text-white leading-tight'>
                {currentQuestion.question}
              </h3>

              {currentQuestion.tags.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {currentQuestion.tags.map((tag, index) => (
                    <span
                      key={index}
                      className='px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Answer Options */}
            <QuestionAnswerArea
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onAnswerChange={setSelectedAnswer}
              disabled={isAnswered || currentSession.status === 'paused'}
              showCorrect={isAnswered}
            />

            {/* Explanation */}
            {showExplanation && isAnswered && (
              <div className='p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-700'>
                <div className='flex items-start gap-3'>
                  <BookOpen className='h-6 w-6 text-blue-600 mt-1 flex-shrink-0' />
                  <div className='space-y-2'>
                    <h4 className='text-lg font-bold text-gray-900 dark:text-white'>Explanation</h4>
                    <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                      {currentQuestion.explanation}
                    </p>
                    {currentQuestion.references && currentQuestion.references.length > 0 && (
                      <div className='mt-3'>
                        <p className='text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2'>
                          Related Drugs:
                        </p>
                        <div className='flex flex-wrap gap-2'>
                          {currentQuestion.references.map((ref, index) => (
                            <span
                              key={index}
                              className='px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium'
                            >
                              {ref}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex justify-between pt-6'>
              <Button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                variant='outline'
                className='flex items-center gap-2'
              >
                <SkipBack className='h-5 w-5' />
                Previous
              </Button>

              <div className='flex gap-3'>
                {!isAnswered && currentSession.status === 'in-progress' && (
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedAnswer}
                    className='bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center gap-2'
                  >
                    <CheckCircle className='h-5 w-5' />
                    Submit Answer
                  </Button>
                )}

                {isAnswered && (
                  <Button
                    onClick={handleNext}
                    className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-2'
                  >
                    {isLastQuestion ? (
                      <>
                        <Trophy className='h-5 w-5' />
                        Complete Quiz
                      </>
                    ) : (
                      <>
                        Next Question
                        <SkipForward className='h-5 w-5' />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className='border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'>
          <CardContent className='p-6'>
            <div className='flex items-center gap-3 text-red-800 dark:text-red-300'>
              <XCircle className='h-6 w-6' />
              <p className='font-medium'>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Question Answer Area Component
interface QuestionAnswerAreaProps {
  question: any;
  selectedAnswer: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
  disabled: boolean;
  showCorrect: boolean;
}

function QuestionAnswerArea({
  question,
  selectedAnswer,
  onAnswerChange,
  disabled,
  showCorrect,
}: QuestionAnswerAreaProps) {
  if (question.type === 'multiple-choice') {
    return (
      <div className='space-y-3'>
        {question.options?.map((option: string, index: number) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === question.correctAnswer;

          return (
            <label
              key={index}
              className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                disabled
                  ? 'cursor-not-allowed opacity-75'
                  : isSelected
                    ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
              } ${
                showCorrect && isCorrect
                  ? 'border-green-400 bg-green-50 dark:bg-green-900/30'
                  : showCorrect && isSelected && !isCorrect
                    ? 'border-red-400 bg-red-50 dark:bg-red-900/30'
                    : ''
              }`}
            >
              <div className='flex items-center gap-4'>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } ${
                    showCorrect && isCorrect
                      ? 'border-green-500 bg-green-500'
                      : showCorrect && isSelected && !isCorrect
                        ? 'border-red-500 bg-red-500'
                        : ''
                  }`}
                >
                  {(isSelected || (showCorrect && isCorrect)) && (
                    <div className='w-3 h-3 bg-white rounded-full' />
                  )}
                </div>
                <span className='text-lg font-medium text-gray-900 dark:text-white'>{option}</span>
                {showCorrect && isCorrect && (
                  <CheckCircle className='h-5 w-5 text-green-600 ml-auto' />
                )}
                {showCorrect && isSelected && !isCorrect && (
                  <XCircle className='h-5 w-5 text-red-600 ml-auto' />
                )}
              </div>
              <input
                type='radio'
                name='quiz-answer'
                value={option}
                checked={isSelected}
                onChange={e => onAnswerChange(e.target.value)}
                disabled={disabled}
                className='sr-only'
              />
            </label>
          );
        })}
      </div>
    );
  }

  if (question.type === 'true-false') {
    return (
      <div className='grid grid-cols-2 gap-4'>
        {['True', 'False'].map(option => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === question.correctAnswer;

          return (
            <label
              key={option}
              className={`block p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 text-center ${
                disabled
                  ? 'cursor-not-allowed opacity-75'
                  : isSelected
                    ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
              } ${
                showCorrect && isCorrect
                  ? 'border-green-400 bg-green-50 dark:bg-green-900/30'
                  : showCorrect && isSelected && !isCorrect
                    ? 'border-red-400 bg-red-50 dark:bg-red-900/30'
                    : ''
              }`}
            >
              <div className='space-y-3'>
                <div
                  className={`w-8 h-8 rounded-full border-2 mx-auto flex items-center justify-center ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } ${
                    showCorrect && isCorrect
                      ? 'border-green-500 bg-green-500'
                      : showCorrect && isSelected && !isCorrect
                        ? 'border-red-500 bg-red-500'
                        : ''
                  }`}
                >
                  {(isSelected || (showCorrect && isCorrect)) && (
                    <div className='w-4 h-4 bg-white rounded-full' />
                  )}
                </div>
                <span className='text-xl font-bold text-gray-900 dark:text-white'>{option}</span>
                {showCorrect && isCorrect && (
                  <CheckCircle className='h-6 w-6 text-green-600 mx-auto' />
                )}
                {showCorrect && isSelected && !isCorrect && (
                  <XCircle className='h-6 w-6 text-red-600 mx-auto' />
                )}
              </div>
              <input
                type='radio'
                name='quiz-answer'
                value={option}
                checked={isSelected}
                onChange={e => onAnswerChange(e.target.value)}
                disabled={disabled}
                className='sr-only'
              />
            </label>
          );
        })}
      </div>
    );
  }

  if (question.type === 'short-answer') {
    return (
      <div className='space-y-4'>
        <textarea
          value={selectedAnswer as string}
          onChange={e => onAnswerChange(e.target.value)}
          disabled={disabled}
          placeholder='Type your answer here...'
          className='w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-purple-400 focus:outline-none resize-none h-32 text-lg'
        />
        {showCorrect && (
          <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl'>
            <p className='text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2'>
              Sample Answer:
            </p>
            <p className='text-gray-700 dark:text-gray-300'>{question.correctAnswer}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// Quiz Selector Component (placeholder)
function QuizSelector() {
  return (
    <Card className='max-w-2xl mx-auto'>
      <CardContent className='p-8 text-center space-y-6'>
        <Brain className='h-16 w-16 mx-auto text-purple-600' />
        <div className='space-y-2'>
          <h3 className='text-2xl font-bold'>Ready to Start a Quiz?</h3>
          <p className='text-gray-600 dark:text-gray-400'>
            Select a module to begin your AI-powered quiz session
          </p>
        </div>
        <Button className='bg-gradient-to-r from-purple-600 to-pink-600'>
          Choose Study Module
        </Button>
      </CardContent>
    </Card>
  );
}
