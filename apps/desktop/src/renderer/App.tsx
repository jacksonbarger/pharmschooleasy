import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Brain,
  BarChart3,
  Settings,
  User,
  Search,
  Pill,
  Home as HomeIcon,
  BookOpen,
} from 'lucide-react';
import { SecureApiKeyConfig } from './components/SecureApiKeyConfig';
import { AdminLogin } from './components/AdminLogin';

// Route components
import { Home } from './routes/Home';
import { Study } from './routes/Study';
import { DrugDetail } from './routes/DrugDetail';
import { Analytics } from './routes/Analytics';

const queryClient = new QueryClient();

// AI Tutor Route Component
function AITutor() {
  return (
    <div className='space-y-6'>
      {/* Admin Login */}
      <AdminLogin
        onAuthChange={(authenticated: boolean) => {
          console.log('Admin authenticated:', authenticated);
        }}
      />

      {/* Secure API Key Configuration */}
      <SecureApiKeyConfig
        onKeyConfigured={(configured: boolean) => {
          console.log('API key configured:', configured);
        }}
      />

      {/* Chat Interface */}
      <div className='glass-cyan rounded-3xl overflow-hidden'>
        <div className='glass-dark p-6 border-b border-white/10'>
          <h3 className='text-xl font-bold text-white flex items-center gap-3'>
            <Brain className='h-6 w-6 text-cyan-300' />
            AI Pharmacy Tutor
          </h3>
        </div>
        <div className='h-96 p-6 space-y-4'>
          {/* AI Message */}
          <div className='flex gap-3'>
            <div className='glass-purple p-2 rounded-xl'>
              <Brain className='h-5 w-5 text-white' />
            </div>
            <div className='glass-dark rounded-2xl p-4 max-w-md'>
              <p className='text-white'>
                👋 Hello! I'm your AI pharmacy tutor. Ask me about drug mechanisms, interactions,
                side effects, and more!
              </p>
            </div>
          </div>

          {/* Sample Suggestions */}
          <div className='space-y-2'>
            <p className='text-white/70 text-sm'>💡 Try asking:</p>
            <div className='flex flex-wrap gap-2'>
              <button className='glass-rose px-3 py-2 rounded-xl text-white text-sm hover:scale-105 transition-all duration-300'>
                "Explain ACE inhibitors"
              </button>
              <button className='glass-emerald px-3 py-2 rounded-xl text-white text-sm hover:scale-105 transition-all duration-300'>
                "Drug interactions with warfarin"
              </button>
              <button className='glass-purple px-3 py-2 rounded-xl text-white text-sm hover:scale-105 transition-all duration-300'>
                "Side effects of statins"
              </button>
            </div>
          </div>
        </div>
        <div className='glass-dark p-6 border-t border-white/10'>
          <div className='flex gap-3'>
            <input
              type='text'
              placeholder='Ask about drug mechanisms, interactions...'
              className='flex-1 px-4 py-3 glass rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400'
            />
            <button className='glass-cyan px-6 py-3 rounded-2xl font-semibold text-white hover:scale-105 transition-all duration-300'>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Layout Component
function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { id: 'home', label: 'Dashboard', icon: HomeIcon, path: '/', color: 'bg-cyan-500' },
    { id: 'study', label: 'Study', icon: BookOpen, path: '/study', color: 'bg-emerald-500' },
    {
      id: 'drugs',
      label: 'Drug Database',
      icon: Pill,
      path: '/drug/lisinopril',
      color: 'bg-purple-500',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      color: 'bg-rose-500',
    },
    { id: 'ai-tutor', label: 'AI Tutor', icon: Brain, path: '/ai-tutor', color: 'bg-purple-500' },
  ];

  const currentPath = location.pathname;

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Background layers */}
      <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'></div>
      <div className='absolute inset-0 bg-gradient-to-tr from-cyan-400 via-violet-500 to-fuchsia-500 opacity-60'></div>
      <div className='absolute inset-0 bg-gradient-to-bl from-orange-400 via-pink-500 to-rose-600 opacity-40'></div>
      <div className='absolute inset-0 bg-gradient-to-tl from-blue-500 via-teal-400 to-emerald-500 opacity-50'></div>

      {/* Floating orbs */}
      <div className='absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-600 rounded-full blur-3xl opacity-70 animate-pulse'></div>
      <div className='absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 rounded-full blur-3xl opacity-80 animate-pulse delay-1000'></div>
      <div className='absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-rose-400 via-pink-500 to-fuchsia-600 rounded-full blur-3xl opacity-60 animate-pulse delay-500'></div>
      <div className='absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-500 rounded-full blur-3xl opacity-75 animate-pulse delay-700'></div>
      <div className='absolute top-1/3 right-1/3 w-56 h-56 bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 rounded-full blur-3xl opacity-65 animate-pulse delay-300'></div>

      <div className='relative flex h-screen'>
        {/* Sidebar */}
        <div className='w-80 glass-strong border-r border-white/30 shadow-2xl'>
          <div className='p-6 border-b border-white/10'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='relative group'>
                <div className='absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-all duration-300'></div>
                <div className='relative p-4 glass rounded-2xl'>
                  <Pill className='h-8 w-8 text-white' />
                </div>
              </div>
              <div>
                <h1 className='text-2xl font-bold text-white'>PharmaCare</h1>
                <p className='text-sm text-purple-200'>AI-Powered Learning</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className='relative group'>
              <div className='absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300'></div>
              <div className='relative'>
                <Search className='absolute left-4 top-3 h-5 w-5 text-white/60' />
                <input
                  type='text'
                  placeholder='Search modules, drugs, conditions...'
                  className='w-full pl-12 pr-4 py-3 glass rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:glass-strong transition-all duration-300'
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className='p-4 space-y-3'>
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.path ||
                (item.path.includes('/drug/') && currentPath.includes('/drug/'));

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full p-4 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'glass border-white/40 scale-105'
                      : 'glass-dark hover:glass border-white/20 hover:scale-102'
                  }`}
                >
                  <div className='flex items-center gap-4'>
                    <div className={`p-2 rounded-xl ${item.color}`}>
                      <Icon className='h-5 w-5 text-white' />
                    </div>
                    <span className='font-semibold text-white'>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* User Profile */}
          <div className='absolute bottom-6 left-4 right-4'>
            <div className='p-4 glass rounded-2xl'>
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
          <div className='sticky top-0 z-20 p-6 glass-dark border-b border-white/20'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-4xl font-bold text-white mb-2'>
                  {currentPath === '/' && 'Study Dashboard'}
                  {currentPath === '/study' && 'Study Session'}
                  {currentPath === '/analytics' && 'Analytics Dashboard'}
                  {currentPath === '/ai-tutor' && 'AI Tutor Chat'}
                  {currentPath.includes('/drug/') && 'Drug Information'}
                </h2>
                <p className='text-white/70'>
                  {currentPath === '/' && 'Continue your pharmaceutical journey'}
                  {currentPath === '/study' && 'Master your flashcards with spaced repetition'}
                  {currentPath === '/analytics' && 'Track your learning progress and insights'}
                  {currentPath === '/ai-tutor' && 'Get instant help from your AI pharmacy expert'}
                  {currentPath.includes('/drug/') &&
                    'Comprehensive drug information and study tools'}
                </p>
              </div>
              <div className='flex items-center gap-4'>
                <button className='px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-white'>
                  <Brain className='h-5 w-5 mr-2 inline' />
                  AI Assistant
                </button>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className='p-8'>{children}</div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function PharmacyApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/study' element={<Study />} />
            <Route path='/drug/:drugId' element={<DrugDetail />} />
            <Route path='/analytics' element={<Analytics />} />
            <Route path='/ai-tutor' element={<AITutor />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default PharmacyApp;
