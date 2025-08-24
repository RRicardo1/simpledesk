import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

// Component to track renders
const RenderTracker = ({ name, children }) => {
  const [renderCount, setRenderCount] = useState(0);
  const [lastRender, setLastRender] = useState(new Date());
  
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    setLastRender(new Date());
    console.log(`🔄 ${name} rendered at:`, new Date().toISOString());
  });

  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
      <h3>{name} (Renders: {renderCount})</h3>
      <p>Last render: {lastRender.toLocaleTimeString()}</p>
      {children}
    </div>
  );
};

// Simple chat component
const SimpleChatTest = () => {
  const [messages, setMessages] = useState(['Welcome to chat!']);
  const [inputValue, setInputValue] = useState('');
  
  console.log('🗨️ SimpleChatTest rendering');

  const addMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, inputValue]);
      setInputValue('');
    }
  };

  return (
    <RenderTracker name="Chat Component">
      <h2>💬 Simple Chat Test</h2>
      <div style={{ height: '200px', overflow: 'auto', border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: '5px 0', padding: '5px', backgroundColor: '#f0f0f0' }}>
            {msg}
          </div>
        ))}
      </div>
      <input 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type a message..."
        style={{ width: '70%', padding: '5px' }}
      />
      <button onClick={addMessage} style={{ padding: '5px 10px', marginLeft: '5px' }}>
        Send
      </button>
      <p><strong>Current time:</strong> {new Date().toLocaleString()}</p>
    </RenderTracker>
  );
};

// Knowledge base component
const SimpleKnowledgeBase = () => {
  const navigate = useNavigate();
  const [articles] = useState([
    { id: 1, title: 'How to get started', views: 100 },
    { id: 2, title: 'Troubleshooting guide', views: 85 },
    { id: 3, title: 'FAQ', views: 200 }
  ]);

  console.log('📚 SimpleKnowledgeBase rendering');

  const handleButtonClick = (action, id) => {
    console.log(`📚 Button clicked: ${action} for article ${id}`);
    alert(`${action} button clicked for article ${id}!\nThis proves the button works.`);
    
    // Test navigation
    if (action === 'View') {
      navigate(`/kb/${id}`);
    } else if (action === 'Edit') {
      navigate(`/kb/${id}/edit`);
    } else if (action === 'New') {
      navigate('/kb/new');
    }
  };

  return (
    <RenderTracker name="Knowledge Base Component">
      <h2>📚 Knowledge Base Test</h2>
      <button 
        onClick={() => handleButtonClick('New')}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007acc', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
      >
        ➕ Create New Article
      </button>
      
      <div>
        {articles.map(article => (
          <div key={article.id} style={{ 
            border: '1px solid #ddd', 
            padding: '10px', 
            margin: '10px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4>{article.title}</h4>
              <small>{article.views} views</small>
            </div>
            <div>
              <button 
                onClick={() => handleButtonClick('View', article.id)}
                style={{ 
                  padding: '5px 10px', 
                  backgroundColor: '#28a745', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '3px',
                  margin: '0 5px',
                  cursor: 'pointer'
                }}
              >
                👁️ View
              </button>
              <button 
                onClick={() => handleButtonClick('Edit', article.id)}
                style={{ 
                  padding: '5px 10px', 
                  backgroundColor: '#ffc107', 
                  color: 'black', 
                  border: 'none', 
                  borderRadius: '3px',
                  margin: '0 5px',
                  cursor: 'pointer'
                }}
              >
                ✏️ Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </RenderTracker>
  );
};

// Location tracker
const LocationTracker = () => {
  const location = useLocation();
  const [locationHistory, setLocationHistory] = useState([]);

  useEffect(() => {
    const newEntry = {
      pathname: location.pathname,
      timestamp: new Date().toLocaleTimeString()
    };
    setLocationHistory(prev => [...prev.slice(-4), newEntry]);
    console.log('📍 Location changed to:', location.pathname);
  }, [location]);

  return (
    <div style={{ backgroundColor: '#e7f3ff', padding: '10px', margin: '10px 0' }}>
      <h4>📍 Location Tracker</h4>
      <p><strong>Current:</strong> {location.pathname}</p>
      <h5>Recent history:</h5>
      {locationHistory.map((entry, idx) => (
        <div key={idx}>{entry.timestamp}: {entry.pathname}</div>
      ))}
    </div>
  );
};

// Main app component
const LiveDebug = () => {
  const [appRenderCount, setAppRenderCount] = useState(0);

  useEffect(() => {
    setAppRenderCount(prev => prev + 1);
    console.log('🚀 LiveDebug App render #', appRenderCount + 1);
  });

  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <RenderTracker name="Main App">
          <h1>🔍 Live Debug App (Render #{appRenderCount})</h1>
          
          <nav style={{ marginBottom: '20px' }}>
            <Link to="/" style={{ margin: '0 10px', padding: '5px 10px', backgroundColor: '#007acc', color: 'white', textDecoration: 'none', borderRadius: '3px' }}>
              🏠 Home
            </Link>
            <Link to="/chat" style={{ margin: '0 10px', padding: '5px 10px', backgroundColor: '#007acc', color: 'white', textDecoration: 'none', borderRadius: '3px' }}>
              💬 Chat
            </Link>
            <Link to="/kb" style={{ margin: '0 10px', padding: '5px 10px', backgroundColor: '#007acc', color: 'white', textDecoration: 'none', borderRadius: '3px' }}>
              📚 Knowledge Base
            </Link>
          </nav>

          <LocationTracker />
          
          <Routes>
            <Route path="/" element={
              <RenderTracker name="Home Page">
                <h2>🏠 Home Page</h2>
                <p>Welcome! Click the navigation links above.</p>
                <p>Current time: {new Date().toLocaleString()}</p>
              </RenderTracker>
            } />
            
            <Route path="/chat" element={<SimpleChatTest />} />
            <Route path="/kb" element={<SimpleKnowledgeBase />} />
            <Route path="/kb/new" element={
              <RenderTracker name="New Article Page">
                <h2>➕ New Article</h2>
                <p>This is the new article creation page.</p>
                <Link to="/kb">← Back to Knowledge Base</Link>
              </RenderTracker>
            } />
            <Route path="/kb/:id" element={
              <RenderTracker name="View Article Page">
                <h2>👁️ View Article</h2>
                <p>This is the article view page.</p>
                <Link to="/kb">← Back to Knowledge Base</Link>
              </RenderTracker>
            } />
            <Route path="/kb/:id/edit" element={
              <RenderTracker name="Edit Article Page">
                <h2>✏️ Edit Article</h2>
                <p>This is the article edit page.</p>
                <Link to="/kb">← Back to Knowledge Base</Link>
              </RenderTracker>
            } />
          </Routes>
          
          <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
            <p>Watch the browser console for detailed logs.</p>
            <p>Check render counts above - they should only increase when you interact.</p>
          </div>
        </RenderTracker>
      </div>
    </Router>
  );
};

export default LiveDebug;