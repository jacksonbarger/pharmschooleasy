import React, { useState } from 'react';

// Simple working version of your app to test step by step
export default function SimplePharmacyApp() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
      
      {/* Floating orbs for visual effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="orb absolute w-64 h-64 bg-cyan-400 opacity-20 rounded-full"
          style={{
            top: '10%',
            left: '10%',
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)'
          }}
        />
        <div 
          className="orb absolute w-48 h-48 bg-purple-400 opacity-20 rounded-full"
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
              onClick={() => setCurrentView('content')}
              className={`w-full text-left nav-link ${currentView === 'content' ? 'active' : ''}`}
            >
              📚 Content Processor
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="glass-container p-8 h-full overflow-auto">
            {currentView === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white mb-6">Study Dashboard</h2>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Quiz Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Questions:</span>
                        <span className="font-semibold">247</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Correct Answers:</span>
                        <span className="font-semibold text-green-600">189</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accuracy Rate:</span>
                        <span className="font-semibold text-blue-600">76.5%</span>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Study Progress</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Cardiovascular</span>
                          <span>85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Infectious Disease</span>
                          <span>72%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '72%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Liver Section</span>
                          <span>91%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '91%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Completed Cardiovascular Quiz - Score: 8/10</span>
                      <span className="text-sm text-gray-500 ml-auto">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Studied Liver Section content</span>
                      <span className="text-sm text-gray-500 ml-auto">5 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Generated AI practice questions</span>
                      <span className="text-sm text-gray-500 ml-auto">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'quiz' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white mb-6">AI-Powered Quiz</h2>
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Practice Questions</h3>
                  <p className="text-gray-600 mb-6">
                    Use our advanced AI to create personalized quiz questions based on your study materials and performance.
                  </p>
                  <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                    🧠 Generate AI Questions
                  </button>
                </div>
              </div>
            )}

            {currentView === 'drugs' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white mb-6">Drug Database</h2>
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Top 200 Medications</h3>
                  <p className="text-gray-600 mb-6">
                    Comprehensive database with drug interactions, mechanisms, and clinical information.
                  </p>
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                    💊 Search Medications
                  </button>
                </div>
              </div>
            )}

            {currentView === 'content' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white mb-6">Content Processor</h2>
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">AI Content Analysis</h3>
                  <p className="text-gray-600 mb-6">
                    Upload PowerPoints, PDFs, or text content for AI-powered analysis and quiz generation.
                  </p>
                  <button className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                    📚 Process Content
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}