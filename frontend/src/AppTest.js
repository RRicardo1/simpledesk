import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function AppTest() {
  console.log('AppTest loading at:', new Date().toISOString());
  
  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>🧪 App Test - Minimal Version</h1>
        <nav style={{ margin: '20px 0' }}>
          <a href="/" style={{ margin: '10px', padding: '10px', backgroundColor: '#007acc', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Home</a>
          <a href="/chat" style={{ margin: '10px', padding: '10px', backgroundColor: '#007acc', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Chat</a>
          <a href="/knowledge-base" style={{ margin: '10px', padding: '10px', backgroundColor: '#007acc', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Knowledge Base</a>
        </nav>
        
        <Routes>
          <Route 
            path="/" 
            element={
              <div>
                <h2>✅ Home Route Working</h2>
                <p>Time: {new Date().toLocaleString()}</p>
                <p>React Router is functioning.</p>
              </div>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <div>
                <h2>✅ Chat Route Working</h2>
                <p>Time: {new Date().toLocaleString()}</p>
                <p>Chat page loaded successfully without refresh!</p>
              </div>
            } 
          />
          <Route 
            path="/knowledge-base" 
            element={
              <div>
                <h2>✅ Knowledge Base Route Working</h2>
                <p>Time: {new Date().toLocaleString()}</p>
                <div style={{ margin: '20px 0' }}>
                  <h3>Test Buttons:</h3>
                  <button 
                    onClick={() => alert('New Article button works!')} 
                    style={{ margin: '5px', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    ➕ New Article
                  </button>
                  <button 
                    onClick={() => alert('View button works!')} 
                    style={{ margin: '5px', padding: '10px', backgroundColor: '#007acc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    👁️ View Article
                  </button>
                  <button 
                    onClick={() => alert('Edit button works!')} 
                    style={{ margin: '5px', padding: '10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    ✏️ Edit Article
                  </button>
                </div>
                <p>If buttons show alerts, they are working properly!</p>
              </div>
            } 
          />
          <Route 
            path="*" 
            element={
              <div>
                <h2>❌ 404 - Route Not Found</h2>
                <p>Current path: {window.location.pathname}</p>
                <p>Go back to <a href="/">Home</a></p>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default AppTest;