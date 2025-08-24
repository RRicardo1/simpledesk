import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IsolatedTest from './pages/IsolatedTest';

// Minimal App without any contexts or providers
function AppMinimal() {
  console.log('🔬 AppMinimal rendering at:', new Date().toISOString());

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/chat" element={<IsolatedTest />} />
          <Route path="/" element={<IsolatedTest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppMinimal;