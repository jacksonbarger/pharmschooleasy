import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './minimal.css';

function PharmacyApp() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }} />
      
      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
        <div 
          className="orb absolute w-64 h-64 rounded-full opacity-20"
          style={{
            top: '10%',
            left: '10%',
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)'
          }}
        />
        <div 
          className="orb absolute w-48 h-48 rounded-full opacity-20"
          style={{
            top: '60%',
            right: '15%',
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)'
          }}
        />
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div className="w-80 glass-container p-6 m-4 flex flex-col space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              🧪 Pharmacy School Study App
            </h1>
            <p className="text-gray-300 text-sm">Advanced AI-Powered Learning</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full text-left nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
            >
              📊 Study Dashboard
            </button>
            <button
              onClick={() => setCurrentView('quiz')}
              className={`w-full text-left nav-link ${currentView === 'quiz' ? 'active' : ''}`}
            >
              🧠 AI Quiz
            </button>
            <button
              onClick={() => setCurrentView('drugs')}
              className={`w-full text-left nav-link ${currentView === 'drugs' ? 'active' : ''}`}
            >
              💊 Drug Database
            </button>
            <button
              onClick={() => setCurrentView('tutor')}
              className={`w-full text-left nav-link ${currentView === 'tutor' ? 'active' : ''}`}
            >
              ✨ AI Tutor
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="glass-container p-8 h-full overflow-auto">
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'quiz' && <Quiz />}
            {currentView === 'drugs' && <Drugs />}
            {currentView === 'tutor' && <Tutor />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Study Dashboard</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Quiz Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Questions:</span>
              <span className="font-semibold">247</span>
            </div>
            <div className="flex justify-between">
              <span>Accuracy Rate:</span>
              <span className="font-semibold text-blue-600">76.5%</span>
            </div>
          </div>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📚 Study Progress</h3>
          <p className="text-gray-600">Track your learning progress across different pharmacy topics.</p>
        </div>
      </div>
    </div>
  );
}

function Quiz() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateQuiz = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:3001/api/ai/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'cardiovascular' })
      });
      const data = await response.json();
      alert('✅ Quiz generated successfully!\n\nTopic: ' + data.data.topic + '\nDifficulty: ' + data.data.difficulty);
    } catch (error) {
      alert('❌ Error: Make sure backend server is running on localhost:3001');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">🧠 AI Quiz</h2>
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Questions</h3>
        <p className="text-gray-600 mb-6">
          AI-powered quiz generation with MCP integration. Creates doctorate-level questions
          tailored to pharmacy school curriculum.
        </p>
        <button 
          onClick={generateQuiz}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover-shadow-xl transition-all disabled:opacity-50"
        >
          {isGenerating ? '🔄 Generating AI Question...' : '🧠 Generate Quiz Question'}
        </button>
      </div>
    </div>
  );
}

function Drugs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const searchDrugs = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch('http://localhost:3001/api/ai/check-drug-safety', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drugName: searchTerm })
      });
      const data = await response.json();
      alert(`✅ Drug information found!\n\nDrug: ${searchTerm}\nSafety Status: ${data.safetyStatus || 'Analyzed'}`);
      setSearchTerm('');
    } catch (error) {
      alert('❌ Error: Make sure backend server is running on localhost:3001');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchDrugs();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">💊 Drug Database</h2>
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Search Medications</h3>
        <p className="text-gray-600 mb-4">
          Search our comprehensive MCP-powered database with Top 200 medications, 
          drug interactions, and safety information.
        </p>
        <div className="flex space-x-3 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter drug name (e.g., lisinopril, metformin, aspirin)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
          />
          <button 
            onClick={searchDrugs}
            disabled={isSearching || !searchTerm.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover-shadow-xl transition-all disabled:opacity-50"
          >
            {isSearching ? '🔍 Searching...' : '💊 Search Database'}
          </button>
        </div>
        
        {/* Quick Search Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {['lisinopril', 'metformin', 'aspirin', 'ibuprofen'].map(drug => (
            <button
              key={drug}
              onClick={() => setSearchTerm(drug)}
              className="p-2 text-sm border border-gray-300 rounded-lg hover:bg-cyan-50 hover:border-cyan-500 transition-all"
            >
              {drug}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Tutor() {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setIsTyping(true);
    try {
      const response = await fetch('http://localhost:3001/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, mode: 'explain' })
      });
      const data = await response.json();
      alert('✅ AI Tutor Response Received!\n\n' + data.response.substring(0, 200) + '...');
      setMessage('');
    } catch (error) {
      alert('❌ Error: Make sure backend server is running on localhost:3001');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">✨ AI Tutor</h2>
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Chat with AI Tutor</h3>
        <p className="text-gray-600 mb-4">
          Get doctorate-level explanations broken down kindly, calmly, and efficiently 
          with our GPT-4o powered pharmacy tutor.
        </p>
        <div className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about pharmacy... (Press Enter to send, Shift+Enter for new line)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            rows={3}
          />
          <button 
            onClick={sendMessage}
            disabled={isTyping || !message.trim()}
            className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover-shadow-xl transition-all disabled:opacity-50"
          >
            {isTyping ? '⏳ AI is thinking...' : '✨ Ask AI Tutor'}
          </button>
        </div>
        
        {/* Quick Topics */}
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Quick Start Topics:</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              'How do ACE inhibitors work?',
              'Explain drug metabolism',
              'What are contraindications?',
              'Pharmacokinetics basics'
            ].map(topic => (
              <button
                key={topic}
                onClick={() => setMessage(topic)}
                className="p-2 text-sm text-left border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-500 transition-all"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PharmacyApp />
  </React.StrictMode>
);