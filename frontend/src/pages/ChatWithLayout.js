import React from 'react';
import Layout from '../components/Layout';

const ChatWithLayout = () => {
  console.log('ChatWithLayout rendering at:', new Date().toISOString());
  
  return (
    <Layout>
      <div style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          Chat With Layout Test
        </h1>
        <p style={{ color: '#666', marginBottom: '16px' }}>
          This tests if Layout component is causing the refresh.
        </p>
        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p>Static content with Layout wrapper.</p>
          <p>Timestamp: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </Layout>
  );
};

export default ChatWithLayout;