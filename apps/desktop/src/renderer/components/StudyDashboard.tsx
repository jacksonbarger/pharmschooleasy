import React from 'react'
import { Plus, BookOpen, Activity, Zap, Target, Award } from 'lucide-react'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { useQuizStore } from '../stores/quizStore'

interface Module {
  id: string
  name: string
  displayName: string
  organSystem: string
  progress: number
  totalTopics: number
  completedTopics: number
  lastStudied?: string
  coverageScore: number
}

const sampleModules: Module[] = [
  {
    id: 'liver-section',
    name: 'liver-section',
    displayName: 'Liver & Hepatic System',
    organSystem: 'hepatic',
    progress: 75,
    totalTopics: 32,
    completedTopics: 24,
    lastStudied: '2025-10-01',
    coverageScore: 75
  },
  {
    id: 'cardiovascular',
    name: 'cardiovascular',
    displayName: 'Cardiovascular System',
    organSystem: 'cardiovascular',
    progress: 45,
    totalTopics: 28,
    completedTopics: 13,
    lastStudied: '2025-09-28',
    coverageScore: 85
  },
  {
    id: 'renal',
    name: 'renal',
    displayName: 'Renal & Urinary System',
    organSystem: 'renal',
    progress: 0,
    totalTopics: 0,
    completedTopics: 0,
    coverageScore: 0
  }
]

export function StudyDashboard() {
  const modules = sampleModules
  const { generateQuestions, startQuiz } = useQuizStore()

  const handleStartQuiz = async (module: Module, difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
    try {
      // Load the content for this module
      const content = await loadModuleContent(module.id)
      
      // Generate questions using AI
      const questions = await generateQuestions(content, module.displayName, difficulty, 10)
      
      if (questions.length > 0) {
        // Start the quiz
        startQuiz(module.id, module.displayName, difficulty, questions)
        
        // Navigate to quiz interface (you'll implement this navigation)
        console.log('Starting quiz for', module.displayName, 'with', questions.length, 'questions')
      }
    } catch (error) {
      console.error('Failed to start quiz:', error)
    }
  }

  const loadModuleContent = async (moduleId: string) => {
    // Load the actual content for each module
    if (moduleId === 'liver-section') {
      // Import the liver content directly
      const { liverContent } = await import('../content/liverContent')
      return liverContent
    }
    
    // Return mock content for other modules
    const moduleName = moduleId.charAt(0).toUpperCase() + moduleId.slice(1).replace('-', ' ')
    return {
      slides: [
        {
          slideNumber: 1,
          title: moduleName,
          keyPoints: [`Key concepts about ${moduleName}`, "Important clinical considerations"],
          drugReferences: ["Related medications"],
          clinicalPearls: ["Clinical insights and best practices"]
        }
      ],
      pharmacologyTopics: [
        {
          topic: `${moduleName} Pharmacology`,
          description: `Pharmacological aspects of ${moduleName}`,
          relevantDrugs: ["Example drug 1", "Example drug 2"],
          clinicalSignificance: "Clinical importance of this topic"
        }
      ],
      identifiedGaps: [`Further study needed in ${moduleName}`]
    }
  }

  return (
    <div className="space-y-6">
      {/* Modern Header with Enhanced Design */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 mb-12 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10"></div>
        </div>
        <div className="relative flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Activity className="h-8 w-8 text-purple-300" />
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Study Dashboard
                </h1>
                <p className="text-purple-200 text-xl font-medium mt-1">
                  Master pharmacy through systematic organ-based learning
                </p>
              </div>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
            <Plus className="h-6 w-6 mr-3" />
            Create Module
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid with Modern Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
        <Card className="group relative overflow-hidden border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transform hover:-translate-y-2 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-500"></div>
          <CardContent className="relative p-8">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Modules</p>
                </div>
                <p className="text-4xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{modules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group relative overflow-hidden border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl shadow-orange-500/10 hover:shadow-orange-500/20 transform hover:-translate-y-2 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10 group-hover:from-orange-500/20 group-hover:to-pink-500/20 transition-all duration-500"></div>
          <CardContent className="relative p-8">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-500/10 rounded-2xl group-hover:bg-orange-500/20 transition-colors">
                    <Zap className="h-6 w-6 text-orange-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Active Studies</p>
                </div>
                <p className="text-4xl font-black text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">
                  {modules.filter(m => m.progress > 0 && m.progress < 100).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group relative overflow-hidden border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl shadow-green-500/10 hover:shadow-green-500/20 transform hover:-translate-y-2 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all duration-500"></div>
          <CardContent className="relative p-8">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500/10 rounded-2xl group-hover:bg-green-500/20 transition-colors">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Completed</p>
                </div>
                <p className="text-4xl font-black text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">
                  {modules.filter(m => m.progress === 100).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group relative overflow-hidden border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transform hover:-translate-y-2 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-500"></div>
          <CardContent className="relative p-8">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition-colors">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Avg. Coverage</p>
                </div>
                <p className="text-4xl font-black text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                  {Math.round(modules.reduce((acc, m) => acc + m.coverageScore, 0) / modules.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.id} className="hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 group">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <span className="text-2xl">
                  {module.organSystem === 'hepatic' ? '�' : 
                   module.organSystem === 'cardiovascular' ? '🫀' : 
                   module.organSystem === 'renal' ? '💧' : '🧠'}
                </span>
                {module.displayName}
              </CardTitle>
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize text-gray-600 dark:text-gray-400 font-medium">
                  {module.organSystem.charAt(0).toUpperCase() + module.organSystem.slice(1)} System
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  module.coverageScore >= 80 ? 'bg-green-100 text-green-800' :
                  module.coverageScore >= 60 ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {module.coverageScore}% coverage
                </span>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{module.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 overflow-hidden">
                    <div 
                      className={`progress-bar ${
                        module.progress > 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        module.progress > 50 ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                        'bg-gradient-to-r from-orange-500 to-red-500'
                      }`}
                      style={{ '--progress-width': `${module.progress}%` } as React.CSSProperties}
                    ></div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{module.completedTopics}/{module.totalTopics} topics</span>
                  {module.lastStudied && (
                    <span>Last: {module.lastStudied}</span>
                  )}
                </div>
                
                {/* Beautiful Action Buttons */}
                                {/* Modern Action Buttons */}
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      {module.progress === 0 ? 'Start Learning' : 'Continue Study'}
                    </Button>
                    <Button 
                      onClick={() => handleStartQuiz(module)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      AI Quiz
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      size="sm"
                      onClick={() => handleStartQuiz(module, 'easy')}
                      variant="outline" 
                      className="text-xs border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-900/20 text-green-700 dark:text-green-300"
                    >
                      Easy
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleStartQuiz(module, 'medium')}
                      variant="outline" 
                      className="text-xs border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50 dark:border-yellow-700 dark:hover:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
                    >
                      Medium
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleStartQuiz(module, 'hard')}
                      variant="outline" 
                      className="text-xs border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20 text-red-700 dark:text-red-300"
                    >
                      Hard
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Ultra-Modern Create New Module Card */}
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/20 hover:from-purple-100 hover:via-pink-100 hover:to-purple-100 dark:hover:from-purple-800/30 dark:hover:via-pink-800/30 dark:hover:to-purple-800/30 transition-all duration-500 cursor-pointer transform hover:-translate-y-3 hover:rotate-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
          <div className="absolute inset-0 border-4 border-dashed border-purple-300/50 rounded-3xl group-hover:border-purple-400/70 transition-all duration-500"></div>
          <CardContent className="relative p-12 flex flex-col items-center justify-center h-full min-h-[400px] text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-3xl group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                <Plus className="h-16 w-16 text-white" />
              </div>
            </div>
            <div className="space-y-4 mb-8">
              <h3 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Create New Module
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
                Build your next study section for
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-2xl text-sm font-bold">Pancreas</span>
                <span className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-2xl text-sm font-bold">Kidneys</span>
                <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-2xl text-sm font-bold">Heart</span>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
              Start Building
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}