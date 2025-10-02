import React from 'react';

// Simple test component without any complex dependencies
function SimpleApp() {
  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">
        🏥 Pharmacy School Study App
      </h1>
      <div className="space-y-4">
        <p className="text-lg">Welcome to your pharmacy study companion!</p>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Quick Test</h2>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => alert('React is working!')}
          >
            Test Click
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-100 p-4 rounded">
            <h3 className="font-bold">📚 Study</h3>
            <p>Interactive flashcards</p>
          </div>
          <div className="bg-purple-100 p-4 rounded">
            <h3 className="font-bold">📊 Analytics</h3>
            <p>Track your progress</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            <h3 className="font-bold">🤖 AI Tutor</h3>
            <p>Smart learning assistant</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleApp;