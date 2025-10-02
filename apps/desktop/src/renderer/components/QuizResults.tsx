import { useState } from 'react'
import { useQuizStore } from '../stores/quizStore'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { ProgressBar } from './ui/ProgressBar'
import { Trophy, Target, Clock, RotateCcw, TrendingUp, BookOpen, Star, Award } from 'lucide-react'

export function QuizResults() {
  const { currentSession, completedSessions, performance } = useQuizStore()
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false)

  // Get the most recent completed session if currentSession is null
  const session = currentSession || completedSessions[completedSessions.length - 1]
  
  if (!session || session.status !== 'completed') {
    return null
  }

  const scorePercentage = Math.round((session.score / session.totalQuestions) * 100)
  const modulePerformance = performance[session.moduleId]
  
  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'from-green-500 to-emerald-500'
    if (percentage >= 80) return 'from-blue-500 to-purple-500'
    if (percentage >= 70) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { emoji: '🎉', message: 'Outstanding Performance!', description: 'You have mastered this topic!' }
    if (percentage >= 80) return { emoji: '🌟', message: 'Excellent Work!', description: 'Great understanding with minor areas to review.' }
    if (percentage >= 70) return { emoji: '👍', message: 'Good Progress!', description: 'Solid foundation with room for improvement.' }
    return { emoji: '📚', message: 'Keep Studying!', description: 'Focus on reviewing the core concepts.' }
  }

  const performanceMsg = getPerformanceMessage(scorePercentage)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Main Results Card */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
        
        <CardContent className="relative p-12 text-center space-y-8">
          <div className="space-y-4">
            <div className="relative inline-block">
              <div className="absolute inset-0 animate-ping">
                <Trophy className="h-20 w-20 mx-auto text-yellow-300 opacity-75" />
              </div>
              <Trophy className="h-20 w-20 mx-auto text-yellow-300" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-5xl font-black">Quiz Complete!</h2>
              <p className="text-2xl text-purple-100 font-medium">{session.topic}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Score */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 space-y-3">
              <Target className="h-10 w-10 mx-auto text-yellow-300" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Final Score</p>
                <p className="text-4xl font-black">{scorePercentage}%</p>
                <p className="text-sm text-purple-200">{session.score} of {session.totalQuestions} correct</p>
              </div>
            </div>

            {/* Time */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 space-y-3">
              <Clock className="h-10 w-10 mx-auto text-blue-300" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Time Taken</p>
                <p className="text-4xl font-black">
                  {session.completedAt && session.startedAt ? 
                    Math.round((new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()) / 60000) : 0}m
                </p>
                <p className="text-sm text-purple-200">Total duration</p>
              </div>
            </div>

            {/* Improvement */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 space-y-3">
              <TrendingUp className="h-10 w-10 mx-auto text-green-300" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Progress</p>
                <p className="text-4xl font-black">
                  {modulePerformance ? Math.round(modulePerformance.averageScore) : scorePercentage}%
                </p>
                <p className="text-sm text-purple-200">Average score</p>
              </div>
            </div>
          </div>

          {/* Performance Message */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-2xl mx-auto">
            <div className="space-y-3">
              <div className="text-4xl">{performanceMsg.emoji}</div>
              <h3 className="text-2xl font-black">{performanceMsg.message}</h3>
              <p className="text-lg text-purple-100">{performanceMsg.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Question Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-purple-600" />
              Question Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {session.questions.map((question, index) => {
              const attempt = session.attempts.find(a => a.questionId === question.id)
              
              return (
                <div key={question.id} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    attempt?.isCorrect 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-gray-900 dark:text-white line-clamp-2">
                      {question.question}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`px-2 py-1 rounded-lg font-medium ${
                        question.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {question.difficulty}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {question.type.replace('-', ' ')}
                      </span>
                      {attempt && (
                        <span className="text-gray-600 dark:text-gray-400">
                          {attempt.timeSpent}s
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className={`p-2 rounded-xl ${
                    attempt?.isCorrect 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {attempt?.isCorrect ? '✓' : '✗'}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Star className="h-6 w-6 text-purple-600" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Accuracy by Difficulty */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 dark:text-white">Accuracy by Difficulty</h4>
              {['easy', 'medium', 'hard'].map(difficulty => {
                const difficultyQuestions = session.questions.filter(q => q.difficulty === difficulty)
                const correctAnswers = difficultyQuestions.filter(q => {
                  const attempt = session.attempts.find(a => a.questionId === q.id)
                  return attempt?.isCorrect
                }).length
                
                const accuracy = difficultyQuestions.length > 0 ? Math.round((correctAnswers / difficultyQuestions.length) * 100) : 0
                
                return (
                  <div key={difficulty} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize font-medium">{difficulty}</span>
                      <span className="font-bold">{accuracy}%</span>
                    </div>
                    <ProgressBar 
                      percentage={accuracy}
                      height="md"
                      colorClass={getScoreColor(accuracy)}
                      showTransition={true}
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {correctAnswers}/{difficultyQuestions.length} correct
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Topic Mastery */}
            {modulePerformance && (
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 dark:text-white">Topic Mastery</h4>
                <div className="space-y-3">
                  {Object.entries(modulePerformance.masteryLevel).map(([topic, mastery]) => (
                    <div key={topic} className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                          {topic}
                        </p>
                        <ProgressBar 
                          percentage={mastery}
                          height="sm"
                          colorClass={getScoreColor(mastery)}
                          showTransition={true}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {Math.round(mastery)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl">
              <div className="flex items-start gap-3">
                <Award className="h-6 w-6 text-purple-600 mt-1" />
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 dark:text-white">Recommendations</h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {scorePercentage >= 90 && (
                      <li>• Excellent mastery! Consider advancing to more complex topics.</li>
                    )}
                    {scorePercentage >= 80 && scorePercentage < 90 && (
                      <li>• Strong understanding. Review missed questions for deeper insights.</li>
                    )}
                    {scorePercentage >= 70 && scorePercentage < 80 && (
                      <li>• Good progress. Focus on areas where you struggled most.</li>
                    )}
                    {scorePercentage < 70 && (
                      <li>• Review core concepts and take practice quizzes to improve.</li>
                    )}
                    <li>• Practice with {session.difficulty === 'easy' ? 'medium' : session.difficulty === 'medium' ? 'hard' : 'adaptive'} difficulty next time.</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              Take Another Quiz
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-5 w-5" />
              {showDetailedAnalysis ? 'Hide' : 'Show'} Detailed Analysis
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {/* Navigate back to dashboard */}}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-5 w-5" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}