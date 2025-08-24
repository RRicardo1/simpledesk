import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('🚀 Starting SimpleDesk app at:', new Date().toISOString());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);