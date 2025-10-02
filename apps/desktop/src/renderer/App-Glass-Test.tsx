import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Brain,
  BarChart3,
  Settings,
  User,
  Search,
  Trophy,
  MessageSquare,
  Activity,
  Pill,
} from 'lucide-react';

const queryClient = new QueryClient();

// Test Simple Glassmorphism First
function TestGlassmorphism() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <QueryClientProvider client={queryClient}>
      <div className='min-h-screen relative overflow-hidden'>
        {/* Background with layers */}
        <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'></div>
        <div className='absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-pink-500/20'></div>

        {/* Floating orbs */}
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl'></div>
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl'></div>

        <div className='relative flex h-screen'>
          {/* Test Glassmorphism Sidebar */}
          <div className='w-80 bg-white/10 border-r border-white/20 shadow-xl'>
            <div className='p-6 border-b border-white/10'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='p-4 bg-white/20 rounded-2xl border border-white/30'>
                  <Pill className='h-8 w-8 text-white' />
                </div>
                <div>
                  <h1 className='text-2xl font-bold text-white'>PharmaCare</h1>
                  <p className='text-sm text-purple-200'>AI-Powered Learning</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className='relative'>
                <Search className='absolute left-4 top-3 h-5 w-5 text-white/60' />
                <input
                  type='text'
                  placeholder='Search modules...'
                  className='w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400'
                />
              </div>
            </div>

            {/* Navigation */}
            <div className='p-4 space-y-3'>
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'bg-cyan-500' },
                { id: 'liver', label: 'Liver System', icon: '🫁', color: 'bg-emerald-500' },
                { id: 'ai-tutor', label: 'AI Tutor', icon: Brain, color: 'bg-purple-500' },
              ].map(item => {
                const Icon = typeof item.icon === 'string' ? null : item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full p-4 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20 border border-white/30'
                        : 'bg-white/5 hover:bg-white/15 border border-white/10'
                    }`}
                  >
                    <div className='flex items-center gap-4'>
                      {Icon ? (
                        <div className={`p-2 rounded-xl ${item.color}`}>
                          <Icon className='h-5 w-5 text-white' />
                        </div>
                      ) : (
                        <div className='p-2 rounded-xl bg-white/10'>
                          <span className='text-xl'>{item.icon as string}</span>
                        </div>
                      )}
                      <span className='font-semibold text-white'>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* User Profile */}
            <div className='absolute bottom-6 left-4 right-4'>
              <div className='p-4 bg-white/15 rounded-2xl border border-white/20'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-emerald-500 rounded-xl'>
                    <User className='h-5 w-5 text-white' />
                  </div>
                  <div className='flex-1'>
                    <p className='font-semibold text-white text-sm'>Pharmacy Student</p>
                    <p className='text-white/60 text-xs'>Level 7</p>
                  </div>
                  <Settings className='h-5 w-5 text-white/70' />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1 overflow-auto'>
            {/* Top Bar */}
            <div className='p-6 bg-white/5 border-b border-white/10'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-4xl font-bold text-white mb-2'>
                    {activeTab === 'dashboard' && 'Study Dashboard'}
                    {activeTab === 'ai-tutor' && 'AI Tutor Chat'}
                    {activeTab === 'liver' && 'Liver System'}
                  </h2>
                  <p className='text-white/70'>
                    {activeTab === 'dashboard' && 'Continue your pharmaceutical journey'}
                    {activeTab === 'ai-tutor' && 'Get instant help from your AI pharmacy expert'}
                    {activeTab === 'liver' && 'Master hepatic pharmacology'}
                  </p>
                </div>
                <div className='flex items-center gap-4'>
                  <button
                    className='p-3 bg-white/10 border border-white/20 rounded-2xl'
                    title='View Achievements'
                    aria-label='View achievements and rewards'
                  >
                    <Trophy className='h-5 w-5 text-amber-400' />
                  </button>
                  <button className='px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-white'>
                    <Brain className='h-5 w-5 mr-2 inline' />
                    AI Assistant
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className='p-8'>
              {activeTab === 'ai-tutor' && (
                <div className='space-y-6'>
                  {/* API Key Card */}
                  <div className='bg-white/10 rounded-3xl border border-white/20 p-8'>
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
                          placeholder='Enter your OpenAI API key'
                          className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400'
                        />
                        <p className='text-white/60 text-sm mt-2'>
                          🔒 Your API key is stored locally. Get yours at
                          platform.openai.com/api-keys
                        </p>
                      </div>
                      <button className='px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-semibold text-white'>
                        Save Configuration
                      </button>
                    </div>
                  </div>

                  {/* Chat Interface */}
                  <div className='bg-white/10 rounded-3xl border border-white/20 overflow-hidden'>
                    <div className='p-6 border-b border-white/10'>
                      <h3 className='text-xl font-bold text-white flex items-center gap-3'>
                        <MessageSquare className='h-6 w-6 text-purple-400' />
                        AI Pharmacy Tutor
                      </h3>
                    </div>
                    <div className='h-96 p-6'>
                      <div className='flex gap-3'>
                        <div className='p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl'>
                          <Brain className='h-5 w-5 text-white' />
                        </div>
                        <div className='bg-white/15 rounded-2xl p-4 max-w-md border border-white/20'>
                          <p className='text-white'>
                            👋 Hello! I'm your AI pharmacy tutor. Ask me about drug mechanisms,
                            interactions, side effects, and more!
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='p-6 border-t border-white/10'>
                      <div className='flex gap-3'>
                        <input
                          type='text'
                          placeholder='Ask about drug mechanisms, interactions...'
                          className='flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400'
                        />
                        <button className='px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl font-semibold text-white'>
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
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
                      className='bg-white/10 rounded-3xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-300'
                    >
                      <div className='flex items-center justify-between mb-6'>
                        <div className={`p-4 bg-gradient-to-r ${module.color} rounded-2xl`}>
                          <span className='text-2xl'>{module.icon}</span>
                        </div>
                        <div className='text-right'>
                          <p className='text-3xl font-bold text-white'>{module.progress}%</p>
                          <p className='text-white/60 text-sm'>Complete</p>
                        </div>
                      </div>
                      <h3 className='text-xl font-bold text-white mb-3'>{module.title}</h3>
                      <div className='w-full bg-white/20 rounded-full h-2 mb-4'>
                        <div
                          className={`bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${module.progress}%` }} // eslint-disable-line no-inline-styles
                        />
                      </div>
                      <button className='w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white font-semibold transition-all duration-300'>
                        {module.progress === 0 ? 'Start Learning' : 'Continue'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'liver' && (
                <div className='bg-white/10 rounded-3xl border border-white/20 p-12 text-center'>
                  <Activity className='h-16 w-16 text-emerald-400 mx-auto mb-4' />
                  <h3 className='text-3xl font-bold text-white mb-2'>Liver System Module</h3>
                  <p className='text-white/70 text-lg'>
                    Content coming soon! This will include hepatic pharmacology and drug metabolism.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default TestGlassmorphism;
