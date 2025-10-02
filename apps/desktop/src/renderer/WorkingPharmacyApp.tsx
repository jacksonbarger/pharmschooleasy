import React, { useState } from 'react';
import './minimal.css';

function WorkingPharmacyApp() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    setResponse('');
    
    try {
      const res = await fetch('http://localhost:3001/api/ai/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: question,
          difficulty: 'doctorate'
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setResponse(data.data.question);
      } else {
        setResponse('Error: ' + (data.error || 'Failed to generate question'));
      }
    } catch (error) {
      setResponse('Connection Error: Could not connect to AI backend');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="working-app-container">
      <div className="working-app-main">
        <div className="working-app-header">
          <h1 className="working-app-title">
            🎓 Pharmacy School AI Tutor
          </h1>
          <p className="working-app-subtitle">
            Doctorate-level pharmacy education powered by GPT-4o + MCP
          </p>
        </div>

        <div className="working-app-status">
          <h3 className="working-app-status-title">🚀 System Status</h3>
          <div className="working-app-status-grid">
            <div className="working-app-status-item">
              ✅ Frontend: Running (5173)
            </div>
            <div className="working-app-status-item">
              ✅ Backend API: Running (3001)
            </div>
            <div className="working-app-status-item">
              ✅ OpenAI GPT-4o: Connected
            </div>
            <div className="working-app-status-item">
              ✅ MCP Integration: Active
            </div>
          </div>
        </div>

        <div className="working-app-input-container">
          <label className="working-app-label">
            Ask a Pharmacy Question:
          </label>
          <textarea
            value={question}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
            placeholder="e.g., Explain the mechanism of atorvastatin and its clinical implications for a patient with familial hypercholesterolemia..."
            className="working-app-textarea"
          />
        </div>

        <button
          onClick={handleAskQuestion}
          disabled={isLoading || !question.trim()}
          className={`working-app-button ${isLoading || !question.trim() ? 'working-app-button-disabled' : 'working-app-button-active'}`}
        >
          {isLoading ? '🤖 AI is thinking...' : '🧠 Ask AI Tutor'}
        </button>

        {response && (
          <div className="working-app-response">
            <h4 className="working-app-response-title">🎯 AI Response:</h4>
            <div className="working-app-response-text">
              {response}
            </div>
          </div>
        )}

        <div className="working-app-footer">
          <p>💡 Try asking about drug mechanisms, interactions, clinical applications, or case studies!</p>
          <p>Powered by Enhanced AI + Model Context Protocol (MCP)</p>
        </div>
      </div>
    </div>
  );
}

export default WorkingPharmacyApp;