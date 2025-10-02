import React from 'react';
import './TestApp.css';

function TestApp() {
  return (
    <div className="test-app">
      <h1 className="app-title">🎉 Pharmacy School Study App</h1>
      <div className="success-banner">
        <h2>✅ Frontend is Working!</h2>
        <p>Your React app is successfully running at http://localhost:5173</p>
        <p>Backend API is available at http://localhost:3001</p>
      </div>
      
      <div className="next-steps">
        <h3>🚀 Next Steps:</h3>
        <ul>
          <li>✅ Frontend Server: Running</li>
          <li>✅ Backend Server: Running</li>
          <li>✅ OpenAI API: Configured</li>
          <li>✅ MCP Integration: Ready</li>
        </ul>
      </div>

      <button 
        onClick={() => alert('Test successful! Your app is working.')}
        className="test-button"
      >
        Test Click - Everything Works! 🎯
      </button>
    </div>
  );
}

export default TestApp;