import React from 'react';

const ChatBasic = () => {
  console.log('ChatBasic rendering at:', new Date().toISOString());
  
  return React.createElement('div', { style: { padding: '32px' } }, [
    React.createElement('h1', { key: 'h1', style: { fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' } }, 'Ultra Basic Chat Test'),
    React.createElement('p', { key: 'p1', style: { color: '#666', marginBottom: '16px' } }, 'This is the most basic possible React component with zero dependencies and no JSX.'),
    React.createElement('div', { key: 'div', style: { backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } }, [
      React.createElement('p', { key: 'p2' }, 'Static content - no state, no effects, no API calls, no context.'),
      React.createElement('p', { key: 'p3' }, `Timestamp: ${new Date().toLocaleString()}`)
    ])
  ]);
};

export default ChatBasic;