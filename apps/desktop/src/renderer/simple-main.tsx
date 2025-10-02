import React from 'react';
import ReactDOM from 'react-dom/client';

// Simple app to test if React is working
function SimplePharmacyApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>🎓 Pharmacy School Study App</h1>
      <p>Testing React rendering...</p>
      
      <div style={{ 
        background: '#f0f9ff', 
        border: '2px solid #0ea5e9',
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>✅ System Status Check</h3>
        <p>If you see this, React is working correctly!</p>
      </div>
      
      <button 
        onClick={() => alert('React event handling works!')}
        style={{
          background: '#0ea5e9',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Test Button
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SimplePharmacyApp />
  </React.StrictMode>
);