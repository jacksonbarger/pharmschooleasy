import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { 
  Brain, 
  BarChart3, 
  Settings, 
  User, 
  Search,
  Trophy,
  MessageSquare,
  Activity,
  Pill
} from 'lucide-react'
import { SecureApiKeyConfig } from './components/SecureApiKeyConfig'
import { AdminLogin } from './components/AdminLogin'
import { ProgressBar } from './components/ui/ProgressBar'

const queryClient = new QueryClient()

// Test Simple Glassmorphism First
function TestGlassmorphism() {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen relative overflow-hidden">
        {/* PREMIUM Modern Color Palette - Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        
        {/* Layer 1: Neon Cyber Colors */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-violet-500 to-fuchsia-500 opacity-60"></div>
        
        {/* Layer 2: Warm Tropical Gradient */}
        <div className="absolute inset-0 bg-gradient-to-bl from-orange-400 via-pink-500 to-rose-600 opacity-40"></div>
        
        {/* Layer 3: Cool Ocean Depths */}
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-500 via-teal-400 to-emerald-500 opacity-50"></div>
        
        {/* Premium Floating Orbs - Modern Tech Colors */}
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-600 rounded-full blur-3xl opacity-70 animate-pulse"></div>
        
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 rounded-full blur-3xl opacity-80 animate-pulse delay-1000"></div>
        
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-rose-400 via-pink-500 to-fuchsia-600 rounded-full blur-3xl opacity-60 animate-pulse delay-500"></div>
        
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-500 rounded-full blur-3xl opacity-75 animate-pulse delay-700"></div>
        
        <div className="absolute top-1/3 right-1/3 w-56 h-56 bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 rounded-full blur-3xl opacity-65 animate-pulse delay-300"></div>
        
        {/* Dynamic Moving Elements - Premium Palette */}
        <div className="absolute top-16 right-24 w-32 h-32 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 rounded-full blur-2xl opacity-50 animate-bounce"></div>
        
        <div className="absolute bottom-20 left-16 w-40 h-40 bg-gradient-to-r from-lime-300 via-green-400 to-emerald-500 rounded-full blur-2xl opacity-45 animate-pulse"></div>
        
        <div className="absolute top-1/4 right-1/2 w-24 h-24 bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-500 rounded-full blur-xl opacity-60 animate-bounce delay-500"></div>
        
        <div className="absolute bottom-1/3 right-20 w-28 h-28 bg-gradient-to-r from-teal-300 via-cyan-400 to-sky-500 rounded-full blur-xl opacity-55 animate-pulse delay-200"></div>
        
        <div className="relative flex h-screen">
          {/* TRUE Glassmorphism Sidebar */}
          <div className="w-80 glass-strong border-r border-white/30 shadow-2xl">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                                    <div className="relative p-4 glass rounded-2xl">
                    <Pill className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    PharmaCare
                  </h1>
                  <p className="text-sm text-purple-200">AI-Powered Learning</p>
                </div>
              </div>
              
              {/* Glassmorphism Search Bar */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-3 h-5 w-5 text-white/60" />
                  <input 
                    type="text" 
                    placeholder="Search modules, drugs, conditions..."
                    className="w-full pl-12 pr-4 py-3 glass rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:glass-strong transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="p-4 space-y-3">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'bg-cyan-500' },
                { id: 'liver', label: 'Liver System', icon: '🫁', color: 'bg-emerald-500' },
                { id: 'ai-tutor', label: 'AI Tutor', icon: Brain, color: 'bg-purple-500' },
              ].map((item) => {
                const Icon = typeof item.icon === 'string' ? null : item.icon
                const isActive = activeTab === item.id
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full p-4 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'glass border-white/40 scale-105' 
                        : 'glass-dark hover:glass border-white/20 hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {Icon ? (
                        <div className={`p-2 rounded-xl ${item.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-xl bg-white/10">
                          <span className="text-xl">{item.icon as string}</span>
                        </div>
                      )}
                      <span className="font-semibold text-white">{item.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* User Profile */}
            <div className="absolute bottom-6 left-4 right-4">
              <div className="p-4 glass rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-xl">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">Pharmacy Student</p>
                    <p className="text-white/60 text-xs">Level 7</p>
                  </div>
                  <Settings className="h-5 w-5 text-white/70" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {/* Glassmorphism Top Bar */}
            <div className="sticky top-0 z-20 p-6 glass-dark border-b border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">
                    {activeTab === 'dashboard' && 'Study Dashboard'}
                    {activeTab === 'ai-tutor' && 'AI Tutor Chat'}
                    {activeTab === 'liver' && 'Liver System'}
                  </h2>
                  <p className="text-white/70">
                    {activeTab === 'dashboard' && 'Continue your pharmaceutical journey'}
                    {activeTab === 'ai-tutor' && 'Get instant help from your AI pharmacy expert'}
                    {activeTab === 'liver' && 'Master hepatic pharmacology'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    className="p-3 bg-white/10 border border-white/20 rounded-2xl"
                    title="View Achievements"
                    aria-label="View achievements and rewards"
                  >
                    <Trophy className="h-5 w-5 text-amber-400" />
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-white">
                    <Brain className="h-5 w-5 mr-2 inline" />
                    AI Assistant
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {activeTab === 'ai-tutor' && (
                <div className="space-y-6">
                  {/* Admin Login */}
                  <AdminLogin 
                    onAuthChange={(authenticated: boolean) => {
                      console.log('Admin authenticated:', authenticated);
                    }}
                  />
                  
                  {/* Secure API Key Configuration */}
                  <SecureApiKeyConfig 
                    onKeyConfigured={(configured: boolean) => {
                      // Handle key configuration status if needed
                      console.log('API key configured:', configured);
                    }}
                  />
                  
                  {/* Chat Interface */}
                  <div className="glass-cyan rounded-3xl overflow-hidden">
                    <div className="glass-dark p-6 border-b border-white/10">
                      <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <MessageSquare className="h-6 w-6 text-cyan-300" />
                        AI Pharmacy Tutor
                      </h3>
                    </div>
                    <div className="h-96 p-6 space-y-4">
                      {/* AI Message */}
                      <div className="flex gap-3">
                        <div className="glass-purple p-2 rounded-xl">
                          <Brain className="h-5 w-5 text-white" />
                        </div>
                        <div className="glass-dark rounded-2xl p-4 max-w-md">
                          <p className="text-white">
                            👋 Hello! I'm your AI pharmacy tutor. Ask me about drug mechanisms, 
                            interactions, side effects, and more!
                          </p>
                        </div>
                      </div>
                      
                      {/* Sample Suggestions */}
                      <div className="space-y-2">
                        <p className="text-white/70 text-sm">💡 Try asking:</p>
                        <div className="flex flex-wrap gap-2">
                          <button className="glass-rose px-3 py-2 rounded-xl text-white text-sm hover:scale-105 transition-all duration-300">
                            "Explain ACE inhibitors"
                          </button>
                          <button className="glass-emerald px-3 py-2 rounded-xl text-white text-sm hover:scale-105 transition-all duration-300">
                            "Drug interactions with warfarin"
                          </button>
                          <button className="glass-purple px-3 py-2 rounded-xl text-white text-sm hover:scale-105 transition-all duration-300">
                            "Side effects of statins"
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="glass-dark p-6 border-t border-white/10">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Ask about drug mechanisms, interactions..."
                          className="flex-1 px-4 py-3 glass rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                        <button className="glass-cyan px-6 py-3 rounded-2xl font-semibold text-white hover:scale-105 transition-all duration-300">
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  {/* Study Progress Overview */}
                  <div className="glass-purple p-8 rounded-3xl">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
                      Today's Progress
                    </h3>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="glass-dark p-6 rounded-2xl text-center">
                        <div className="text-4xl font-bold text-cyan-300 mb-2">47</div>
                        <div className="text-white/70">Cards Studied</div>
                      </div>
                      <div className="glass-dark p-6 rounded-2xl text-center">
                        <div className="text-4xl font-bold text-emerald-300 mb-2">89%</div>
                        <div className="text-white/70">Success Rate</div>
                      </div>
                      <div className="glass-dark p-6 rounded-2xl text-center">
                        <div className="text-4xl font-bold text-purple-300 mb-2">12</div>
                        <div className="text-white/70">Day Streak</div>
                      </div>
                    </div>
                  </div>

                  {/* Study Modules */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {[
                      { title: 'Liver System', progress: 75, glassClass: 'glass-emerald', icon: '🫁', status: 'Advanced' },
                      { title: 'Cardiovascular', progress: 60, glassClass: 'glass-rose', icon: '❤️', status: 'Intermediate' },
                      { title: 'Renal System', progress: 0, glassClass: 'glass-cyan', icon: '🫘', status: 'Not Started' }
                    ].map((module, index) => (
                      <div key={index} className={`${module.glassClass} rounded-3xl p-8 hover:scale-105 transition-all duration-300`}>
                        <div className="flex items-center justify-between mb-6">
                          <div className="text-4xl">{module.icon}</div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-white">{module.progress}%</p>
                            <p className="text-white/70 text-sm">{module.status}</p>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{module.title}</h3>
                        <div className="mb-6">
                          <ProgressBar 
                            percentage={module.progress}
                            height="md"
                            colorClass="from-white to-white/80"
                            showTransition={true}
                          />
                        </div>
                        <button className="w-full py-3 glass-dark hover:glass-strong rounded-2xl text-white font-semibold transition-all duration-300">
                          {module.progress === 0 ? '🚀 Start Learning' : '📖 Continue'}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="glass-cyan p-8 rounded-3xl">
                      <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        🧠 AI-Powered Study
                      </h4>
                      <p className="text-white/70 mb-6">Get personalized explanations and practice questions</p>
                      <button className="w-full glass-purple p-4 rounded-2xl text-white font-semibold hover:scale-105 transition-all duration-300">
                        Start AI Session
                      </button>
                    </div>
                    <div className="glass-rose p-8 rounded-3xl">
                      <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        📊 Performance Analytics
                      </h4>
                      <p className="text-white/70 mb-6">View detailed progress reports and insights</p>
                      <button className="w-full glass-emerald p-4 rounded-2xl text-white font-semibold hover:scale-105 transition-all duration-300">
                        View Analytics
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'liver' && (
                <div className="glass-strong rounded-3xl p-12 text-center">
                  <Activity className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-white mb-2">Liver System Module</h3>
                  <p className="text-white/70 text-lg">
                    Content coming soon! This will include hepatic pharmacology and drug metabolism.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default TestGlassmorphism