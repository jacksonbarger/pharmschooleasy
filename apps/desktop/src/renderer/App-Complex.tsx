import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Brain,
  BarChart3,
  Settings,
  User,
  Search,
  ChevronRight,
  Play,
  Trophy,
  Target,
  TrendingUp,
  Zap,
  MessageSquare,
  BookOpen,
  Pill,
  Heart,
  Activity,
} from 'lucide-react';

const queryClient = new QueryClient();

// Stunning Glassmorphism Pharmacy App
function GlassmorphismPharmacyApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      color: 'from-cyan-400 to-blue-500',
      progress: 85,
    },
    {
      id: 'liver',
      label: 'Liver System',
      icon: '🫁',
      color: 'from-emerald-400 to-teal-500',
      progress: 75,
    },
    {
      id: 'cardio',
      label: 'Cardiovascular',
      icon: Heart,
      color: 'from-rose-400 to-pink-500',
      progress: 60,
    },
    {
      id: 'renal',
      label: 'Renal System',
      icon: '🫘',
      color: 'from-amber-400 to-orange-500',
      progress: 0,
    },
    { id: 'ai-tutor', label: 'AI Tutor', icon: Brain, color: 'from-violet-400 to-purple-500' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'from-indigo-400 to-blue-500' },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      {/* Main Container with Animated Gradient Background */}
      <div className='min-h-screen relative overflow-hidden'>
        {/* Animated Background Layers */}
        <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'></div>
        <div className='absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-pink-500/10'></div>

        {/* Floating Orbs for Depth */}
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-500'></div>

        <div className='relative flex h-screen'>
          {/* Professional Glassmorphism Sidebar */}
          <div className='w-80 bg-white/5 backdrop-blur-2xl border-r border-white/10 shadow-2xl'>
            {/* Header Section */}
            <div className='p-6 border-b border-white/10'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='relative group'>
                  <div className='absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-all duration-300'></div>
                  <div className='relative p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20'>
                    <Pill className='h-8 w-8 text-white' />
                  </div>
                </div>
                <div>
                  <h1 className='text-2xl font-black text-white bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent'>
                    PharmaCare
                  </h1>
                  <p className='text-sm text-purple-200 font-medium'>AI-Powered Learning</p>
                </div>
              </div>

              {/* Glass Search Bar */}
              <div className='relative group'>
                <div className='absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300'></div>
                <div className='relative flex items-center'>
                  <Search className='absolute left-4 top-3 h-5 w-5 text-white/60' />
                  <input
                    type='text'
                    placeholder='Search modules, drugs, conditions...'
                    className='w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300'
                  />
                </div>
              </div>
            </div>

            {/* Navigation Items with Glass Effects */}
            <div className='p-4 space-y-3'>
              {sidebarItems.map(item => {
                const Icon = typeof item.icon === 'string' ? null : item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-500 ${
                      isActive
                        ? 'bg-white/15 backdrop-blur-xl shadow-lg border border-white/30 scale-105'
                        : 'hover:bg-white/10 backdrop-blur-xl border border-white/5'
                    }`}
                  >
                    {/* Gradient Background on Hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-all duration-300`}
                    ></div>

                    <div className='relative p-4 flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        {Icon ? (
                          <div
                            className={`p-2 rounded-xl bg-gradient-to-r ${item.color} shadow-lg`}
                          >
                            <Icon className='h-5 w-5 text-white' />
                          </div>
                        ) : (
                          <div className='p-2 rounded-xl bg-white/10 backdrop-blur-xl'>
                            <span className='text-xl'>{item.icon as string}</span>
                          </div>
                        )}
                        <span
                          className={`font-semibold ${isActive ? 'text-white' : 'text-white/80'}`}
                        >
                          {item.label}
                        </span>
                      </div>

                      <div className='flex items-center gap-3'>
                        {item.progress !== undefined && (
                          <div className='flex items-center gap-2'>
                            <div className='w-16 h-2 bg-white/20 rounded-full overflow-hidden'>
                              <div
                                className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <span className='text-xs text-white/70 font-medium min-w-[3ch]'>
                              {item.progress}%
                            </span>
                          </div>
                        )}
                        <ChevronRight
                          className={`h-5 w-5 text-white/40 transition-transform duration-300 ${isActive ? 'rotate-90 text-white/80' : 'group-hover:translate-x-1'}`}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* User Profile Glass Card */}
            <div className='absolute bottom-6 left-4 right-4'>
              <div className='p-4 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-xl'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl'>
                    <User className='h-5 w-5 text-white' />
                  </div>
                  <div className='flex-1'>
                    <p className='font-semibold text-white text-sm'>Pharmacy Student</p>
                    <p className='text-white/60 text-xs'>Level 7 • 2,340 XP</p>
                  </div>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className='p-2 hover:bg-white/10 rounded-xl transition-all duration-200'
                  >
                    <Settings className='h-4 w-4 text-white/70' />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area with Glass Cards */}
          <div className='flex-1 overflow-auto'>
            {/* Top Navigation Bar */}
            <div className='sticky top-0 z-20 p-6 bg-white/5 backdrop-blur-2xl border-b border-white/10'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-4xl font-black text-white mb-2'>
                    {activeTab === 'dashboard' && 'Study Dashboard'}
                    {activeTab === 'ai-tutor' && 'AI Tutor Chat'}
                    {activeTab === 'liver' && 'Liver & Hepatic System'}
                    {activeTab === 'cardio' && 'Cardiovascular System'}
                    {activeTab === 'renal' && 'Renal System'}
                    {activeTab === 'analytics' && 'Learning Analytics'}
                  </h2>
                  <p className='text-white/70'>
                    {activeTab === 'dashboard' && 'Continue your pharmaceutical journey'}
                    {activeTab === 'ai-tutor' && 'Get instant help from your AI pharmacy expert'}
                    {activeTab === 'liver' && 'Master hepatic pharmacology and drug metabolism'}
                    {activeTab === 'cardio' && 'Learn cardiovascular drugs and mechanisms'}
                    {activeTab === 'renal' && 'Understand kidney function and nephrotoxicity'}
                    {activeTab === 'analytics' && 'Track your progress and performance insights'}
                  </p>
                </div>
                <div className='flex items-center gap-4'>
                  <button className='p-3 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 rounded-2xl transition-all duration-300 group'>
                    <Trophy className='h-5 w-5 text-amber-400 group-hover:scale-110 transition-transform duration-200' />
                  </button>
                  <button className='px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl font-semibold text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105'>
                    <Brain className='h-5 w-5 mr-2 inline' />
                    AI Assistant
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className='p-8'>
              {activeTab === 'ai-tutor' && (
                <div className='space-y-6'>
                  {/* API Key Configuration Card */}
                  {showSettings && (
                    <div className='bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 mb-6'>
                      <h3 className='text-2xl font-bold text-white mb-4 flex items-center gap-3'>
                        <Settings className='h-6 w-6' />
                        OpenAI Configuration
                      </h3>
                      <div className='space-y-4'>
                        <div>
                          <label className='block text-white/80 font-medium mb-2'>
                            OpenAI API Key
                          </label>
                          <input
                            type='password'
                            placeholder='sk-proj-your-openai-api-key-here'
                            className='w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50'
                          />
                          <p className='text-white/60 text-sm mt-2'>
                            🔒 Your API key is stored locally and never shared. Get yours at{' '}
                            <a
                              href='https://platform.openai.com/api-keys'
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-cyan-400 hover:text-cyan-300 underline'
                            >
                              platform.openai.com/api-keys
                            </a>
                          </p>
                        </div>
                        <button className='px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105'>
                          Save Configuration
                        </button>
                      </div>
                    </div>
                  )}

                  {/* AI Chat Interface */}
                  <div className='bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden'>
                    <div className='p-6 border-b border-white/10'>
                      <h3 className='text-xl font-bold text-white flex items-center gap-3'>
                        <MessageSquare className='h-6 w-6 text-purple-400' />
                        AI Pharmacy Tutor
                      </h3>
                    </div>
                    <div className='h-96 p-6 overflow-y-auto'>
                      <div className='space-y-4'>
                        <div className='flex gap-3'>
                          <div className='p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl'>
                            <Brain className='h-5 w-5 text-white' />
                          </div>
                          <div className='bg-white/10 backdrop-blur-xl rounded-2xl p-4 max-w-md border border-white/20'>
                            <p className='text-white'>
                              👋 Hello! I'm your AI pharmacy tutor. I can help you with drug
                              mechanisms, clinical applications, side effects, interactions, and
                              more. What would you like to learn about today?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='p-6 border-t border-white/10'>
                      <div className='flex gap-3'>
                        <input
                          type='text'
                          placeholder='Ask about drug mechanisms, interactions, side effects...'
                          className='flex-1 px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50'
                        />
                        <button className='px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105'>
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                  {/* Study Progress Cards */}
                  {[
                    {
                      title: 'Liver System',
                      progress: 75,
                      color: 'from-emerald-400 to-teal-500',
                      icon: '🫁',
                    },
                    {
                      title: 'Cardiovascular',
                      progress: 60,
                      color: 'from-rose-400 to-pink-500',
                      icon: '❤️',
                    },
                    {
                      title: 'Renal System',
                      progress: 0,
                      color: 'from-amber-400 to-orange-500',
                      icon: '🫘',
                    },
                  ].map((module, index) => (
                    <div
                      key={index}
                      className='group relative overflow-hidden bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105'
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-5 group-hover:opacity-10 transition-all duration-300`}
                      ></div>
                      <div className='relative p-8'>
                        <div className='flex items-center justify-between mb-6'>
                          <div
                            className={`p-4 bg-gradient-to-r ${module.color} rounded-2xl shadow-lg`}
                          >
                            <span className='text-2xl'>{module.icon}</span>
                          </div>
                          <div className='text-right'>
                            <p className='text-3xl font-black text-white'>{module.progress}%</p>
                            <p className='text-white/60 text-sm'>Complete</p>
                          </div>
                        </div>
                        <h3 className='text-xl font-bold text-white mb-3'>{module.title}</h3>
                        <div className='w-full h-3 bg-white/20 rounded-full overflow-hidden mb-4'>
                          <div
                            className={`h-full bg-gradient-to-r ${module.color} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                        <button className='w-full py-3 bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20 rounded-2xl text-white font-semibold transition-all duration-300 hover:scale-105'>
                          {module.progress === 0 ? 'Start Learning' : 'Continue'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Other content areas would go here */}
              {activeTab !== 'dashboard' && activeTab !== 'ai-tutor' && (
                <div className='bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-12 text-center'>
                  <div className='mb-6'>
                    <Activity className='h-16 w-16 text-purple-400 mx-auto mb-4' />
                    <h3 className='text-3xl font-bold text-white mb-2'>Coming Soon</h3>
                    <p className='text-white/70 text-lg'>
                      This module is under development. Check back soon for comprehensive{' '}
                      {activeTab} content!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default GlassmorphismPharmacyApp;
