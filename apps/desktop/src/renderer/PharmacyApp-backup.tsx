import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StudyDashboard } from './components/StudyDashboard';
import { SignUpButton } from './components/SignUpButton';
import { useQuizStore } from './stores/quizStore';
import { QuizInterface } from './components/QuizInterface';
import { Button } from './components/ui/Button';
import { 
  Book, 
  Brain, 
  BarChart3, 
  Settings, 
  Pill,
  Sparkles,
  Palette,
  XCircle
} from 'lucide-react';

const queryClient = new QueryClient();

// Settings Context for visual customization
interface VisualSettings {
  orbOpacities: {
    purple: number;
    cyan: number;
    pink: number;
    indigo: number;
    emerald: number;
    violet: number;
  };
  backgroundOpacity: number;
  sidebarOpacity: number;
}

const defaultSettings: VisualSettings = {
  orbOpacities: {
    purple: 20,
    cyan: 20,
    pink: 10,
    indigo: 15,
    emerald: 15,
    violet: 15,
  },
  backgroundOpacity: 20,
  sidebarOpacity: 10,
};

const SettingsContext = createContext<{
  settings: VisualSettings;
  updateSettings: (newSettings: Partial<VisualSettings>) => void;
}>({ settings: defaultSettings, updateSettings: () => {} });

export const useSettings = () => useContext(SettingsContext);

function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<VisualSettings>(defaultSettings);

  const updateSettings = (newSettings: Partial<VisualSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Visual Settings Panel Component
function VisualSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSettings } = useSettings();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:rotate-1 group relative overflow-hidden z-50"
        title="Open Visual Settings"
      >
        <Palette className="h-6 w-6 text-white" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Palette className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Visual Settings</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <XCircle className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Orb Opacity Controls */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Orb Opacities</label>
            {Object.entries(settings.orbOpacities).map(([color, opacity]) => (
              <div key={color} className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-700 capitalize">{color}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={opacity}
                    onChange={(e) => updateSettings({
                      orbOpacities: { ...settings.orbOpacities, [color]: parseInt(e.target.value) }
                    })}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-600 w-8">{opacity}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Background & Sidebar Opacity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Background</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={settings.backgroundOpacity}
                  onChange={(e) => updateSettings({ backgroundOpacity: parseInt(e.target.value) })}
                  className="w-24"
                />
                <span className="text-sm text-gray-600 w-8">{settings.backgroundOpacity}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Sidebar</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={settings.sidebarOpacity}
                  onChange={(e) => updateSettings({ sidebarOpacity: parseInt(e.target.value) })}
                  className="w-24"
                />
                <span className="text-sm text-gray-600 w-8">{settings.sidebarOpacity}%</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => updateSettings(defaultSettings)}
            variant="outline"
            className="w-full"
          >
            Reset to Default
          </Button>
        </div>
      </div>
    </div>
  );
}

// Visual Settings Context
interface VisualSettings {
  orbOpacities: {
    purple: number;
    cyan: number;
    pink: number;
    indigo: number;
    emerald: number;
    violet: number;
  };
  backgroundOpacity: number;
  sidebarOpacity: number;
}

const defaultSettings: VisualSettings = {
  orbOpacities: {
    purple: 20,
    cyan: 20,
    pink: 10,
    indigo: 15,
    emerald: 15,
    violet: 15,
  },
  backgroundOpacity: 20,
  sidebarOpacity: 10,
};

const SettingsContext = createContext<{
  settings: VisualSettings;
  updateSettings: (newSettings: Partial<VisualSettings>) => void;
}>({ settings: defaultSettings, updateSettings: () => {} });

export const useSettings = () => useContext(SettingsContext);

function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<VisualSettings>(defaultSettings);

  const updateSettings = (newSettings: Partial<VisualSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Quiz Orb Modal Component
function QuizOrbModal() {
  const { 
    isQuizVisible, 
    currentSession, 
    hideQuiz 
  } = useQuizStore();

  if (!isQuizVisible || !currentSession) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Quiz Orb */}
      <div className="relative">
        {/* Floating orbs behind the quiz */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-400/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-cyan-400/30 rounded-full blur-xl animate-pulse delay-300"></div>
        <div className="absolute top-10 -right-16 w-32 h-32 bg-pink-400/30 rounded-full blur-xl animate-pulse delay-700"></div>
        
        {/* Quiz Container */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <QuizInterface />
        </div>
      </div>
    </div>
  );
}

// Sidebar Navigation Component
function Sidebar() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: Book },
    { path: '/upload', label: 'Upload Content', icon: Upload },
  ];

  const handleLogin = () => {
    // Simple mock login for now
    const name = prompt('Enter your name to create a free account:');
    if (name) {
      setUserName(name);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
  };

  return (
    <div className="w-80 bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl border border-white/30">
            <Pill className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">PharmStudy</h1>
            <p className="text-sm text-gray-300">AI-Powered Learning</p>
          </div>
        </div>

        {/* User Authentication */}
        {isLoggedIn ? (
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <User className="h-5 w-5 text-cyan-400" />
              <span className="text-white font-medium">{userName}</span>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              size="sm" 
              className="w-full text-white border-white/30 hover:bg-white/10"
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Button 
              onClick={handleLogin}
              variant="outline" 
              className="w-full text-white border-white/30 hover:bg-white/10"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up Free
            </Button>
            <Button 
              onClick={handleLogin}
              variant="outline" 
              className="w-full text-white border-white/30 hover:bg-white/10"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 p-6">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sign Up for Premium */}
      <div className="p-6 border-t border-white/20">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-white/20">
          <h3 className="text-white font-semibold mb-2">Upgrade to Premium</h3>
          <p className="text-gray-300 text-sm mb-4">
            Unlock advanced AI features, unlimited uploads, and personalized learning paths.
          </p>
          <SignUpButton />
        </div>
      </div>
    </div>
  );
}

function PharmacyApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Simple background orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl"></div>
        
        <BrowserRouter>
          <div className="flex h-screen relative z-10">
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<StudyDashboard />} />
                <Route path="/upload" element={<ContentProcessor />} />
              </Routes>
            </div>
          </div>
          
          {/* Quiz Orb Modal */}
          <QuizOrbModal />
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default PharmacyApp;