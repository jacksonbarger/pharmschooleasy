import { useState } from 'react'
import { 
  Brain, 
  BarChart3, 
  Settings, 
  User, 
  Bell, 
  Search,
  ChevronRight,
  Play,
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react'
import { Button } from './ui/Button'
import { Card, CardContent } from './ui/Card'
import { AITutoringInterface } from './AITutoringInterface'

// This is a PREVIEW component - not replacing your current design
export function GlassmorphismSidebarPreview() {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'blue' },
    { id: 'liver', label: 'Liver System', icon: '🫁', color: 'green', progress: 75 },
    { id: 'cardio', label: 'Cardiovascular', icon: '❤️', color: 'red', progress: 45 },
    { id: 'renal', label: 'Renal System', icon: '🫘', color: 'yellow', progress: 0 },
    { id: 'ai-tools', label: 'AI Tools', icon: Brain, color: 'purple' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'indigo' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'gray' }
  ]

  const moduleCards = [
    {
      id: 'liver',
      title: 'Liver & Hepatic System',
      emoji: '🫁',
      progress: 75,
      topics: 32,
      completed: 24,
      lastStudied: 'Today',
      color: 'from-emerald-400 to-green-500'
    },
    {
      id: 'cardio', 
      title: 'Cardiovascular System',
      emoji: '❤️',
      progress: 45,
      topics: 28,
      completed: 13,
      lastStudied: '2 days ago',
      color: 'from-red-400 to-pink-500'
    },
    {
      id: 'renal',
      title: 'Renal & Urinary System', 
      emoji: '🫘',
      progress: 0,
      topics: 25,
      completed: 0,
      lastStudied: 'Not started',
      color: 'from-blue-400 to-cyan-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative flex h-screen">
        {/* Professional Sidebar with Glassmorphism */}
        <div className="w-80 bg-white/10 backdrop-blur-2xl border-r border-white/20 shadow-2xl">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                <span className="text-2xl">🧪</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Pharmacy Hub</h1>
                <p className="text-sm text-purple-200">AI-Powered Learning</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-white/60" />
              <input 
                type="text" 
                placeholder="Search modules..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation Items */}
          <div className="p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = typeof item.icon === 'string' ? null : item.icon
              const isActive = activeTab === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-white/20 backdrop-blur-xl shadow-lg border border-white/30' 
                      : 'hover:bg-white/10 backdrop-blur-xl'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon ? (
                      <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-white/70'}`} />
                    ) : (
                      <span className="text-xl">{item.icon as string}</span>
                    )}
                    <span className={`font-medium ${isActive ? 'text-white' : 'text-white/70'}`}>
                      {item.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.progress !== undefined && (
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="progress-bar h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                            style={{ '--progress-width': `${item.progress}%` } as React.CSSProperties}
                          />
                        </div>
                        <span className="text-xs text-white/60 font-medium">{item.progress}%</span>
                      </div>
                    )}
                    <ChevronRight className={`h-4 w-4 text-white/40 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                  </div>
                </button>
              )
            })}
          </div>

          {/* User Profile Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-white/60">Pharmacy Student</p>
              </div>
              <Bell className="h-5 w-5 text-white/60 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Main Content Area with Glassmorphism Cards */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'ai-tools' && (
            <AITutoringInterface />
          )}
          
          {activeTab !== 'ai-tools' && (
            <>
              {/* Top Bar */}
              <div className="p-6 bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-white">Study Dashboard</h2>
                <p className="text-white/70 mt-1">Continue your pharmaceutical journey</p>
              </div>
              <div className="flex items-center gap-4">
                <Button className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white">
                  <Trophy className="h-5 w-5 mr-2" />
                  Achievements
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Assistant
                </Button>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Progress', value: '65%', icon: Target, color: 'from-blue-500 to-purple-500' },
                { label: 'Study Streak', value: '12 days', icon: Zap, color: 'from-orange-500 to-red-500' },
                { label: 'Time Today', value: '2.5 hrs', icon: Clock, color: 'from-green-500 to-emerald-500' },
                { label: 'Quiz Score', value: '94%', icon: Trophy, color: 'from-yellow-500 to-orange-500' }
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white/70 mb-1">{stat.label}</p>
                          <p className="text-3xl font-black text-white">{stat.value}</p>
                        </div>
                        <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-2xl shadow-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Module Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Study Modules</h3>
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                  View All
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {moduleCards.map((module) => (
                  <Card key={module.id} className="group bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${module.color}`} />
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl p-2 bg-white/10 rounded-2xl backdrop-blur-xl">
                            {module.emoji}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-lg">{module.title}</h4>
                            <p className="text-white/60 text-sm">Last: {module.lastStudied}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-white">{module.progress}%</p>
                          <p className="text-xs text-white/60">{module.completed}/{module.topics}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-xl">
                        <div 
                          className={`progress-bar h-full bg-gradient-to-r ${module.color} rounded-full`}
                          style={{ '--progress-width': `${module.progress}%` } as React.CSSProperties}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <Button className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white">
                          <Play className="h-4 w-4 mr-2" />
                          {module.progress === 0 ? 'Start' : 'Continue'}
                        </Button>
                        <Button className={`px-4 bg-gradient-to-r ${module.color} hover:shadow-lg`}>
                          <Brain className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white/10 backdrop-blur-2xl border border-white/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'Completed quiz', module: 'Liver Metabolism', time: '2 hours ago', score: '95%' },
                    { action: 'Studied topic', module: 'Drug Interactions', time: '1 day ago', score: null },
                    { action: 'Started module', module: 'Cardiovascular', time: '3 days ago', score: null }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl backdrop-blur-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
                        <div>
                          <p className="text-white font-medium">{activity.action}</p>
                          <p className="text-white/60 text-sm">{activity.module} • {activity.time}</p>
                        </div>
                      </div>
                      {activity.score && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                          {activity.score}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}