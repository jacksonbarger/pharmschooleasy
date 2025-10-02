import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StudyDashboard } from './components/StudyDashboard';
import { useQuizStore } from './stores/quizStore';
import { QuizInterface } from './components/QuizInterface';

const queryClient = new QueryClient();

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

function PharmacyApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Simple background orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl"></div>
        
        <BrowserRouter>
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<StudyDashboard />} />
              <Route path="/study" element={<StudyDashboard />} />
              <Route path="/analytics" element={<StudyDashboard />} />
              <Route path="/ai-generator" element={<StudyDashboard />} />
            </Routes>
          </div>
          
          {/* Quiz Orb Modal */}
          <QuizOrbModal />
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default PharmacyApp;