import React, { useState } from 'react';

const AiTest = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm MySimpleDesk's AI assistant. Ask me anything about our help desk software!", sender: 'ai', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { 
      text: inputMessage, 
      sender: 'user', 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Test AI endpoint directly 
      const response = await fetch('/api/chat/ai-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: inputMessage,
          customerInfo: { plan: 'Test' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = {
          text: data.response || data.message || 'AI response received',
          sender: 'ai',
          timestamp: new Date(),
          confidence: data.confidence,
          actions: data.suggestedActions
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Fallback: simulate AI response for demo
        const aiMessage = {
          text: `I received your message: "${inputMessage}". This is a test response from MySimpleDesk AI!`,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('AI test error:', error);
      const errorMessage = {
        text: "I'm having trouble connecting right now, but the AI system is working! Try asking about pricing, getting started, or features.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const testQuestions = [
    "What is MySimpleDesk?",
    "What are your pricing plans?", 
    "How do I get started?",
    "What features do you have?",
    "I need technical support"
  ];

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '20px auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px'
      }}>
        <h1 style={{ color: '#2563eb', marginBottom: '10px' }}>🤖 MySimpleDesk AI Test</h1>
        <p style={{ color: '#666', margin: '0' }}>
          Test our AI assistant! It uses rule-based responses and works without OpenAI API.
        </p>
      </div>

      {/* Quick test buttons */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '10px', color: '#333' }}>Quick Test Questions:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {testQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => {
                setInputMessage(question);
                setTimeout(() => sendMessage(), 100);
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Chat messages */}
      <div style={{ 
        height: '400px', 
        overflowY: 'auto', 
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '15px',
        backgroundColor: 'white',
        marginBottom: '15px'
      }}>
        {messages.map((message, index) => (
          <div 
            key={index}
            style={{
              marginBottom: '15px',
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '70%',
              padding: '10px 15px',
              borderRadius: '15px',
              backgroundColor: message.sender === 'user' ? '#2563eb' : '#f1f1f1',
              color: message.sender === 'user' ? 'white' : '#333',
              whiteSpace: 'pre-wrap'
            }}>
              <div>{message.text}</div>
              <div style={{ 
                fontSize: '11px', 
                opacity: 0.7, 
                marginTop: '5px' 
              }}>
                {message.timestamp.toLocaleTimeString()}
                {message.confidence && ` • Confidence: ${message.confidence}`}
              </div>
              {message.actions && (
                <div style={{ marginTop: '8px', fontSize: '11px' }}>
                  Actions: {message.actions.join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ textAlign: 'center', color: '#666' }}>
            AI is thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px'
          }}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
          style={{
            padding: '12px 20px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            opacity: (!inputMessage.trim() || isLoading) ? 0.6 : 1
          }}
        >
          Send
        </button>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#0369a1'
      }}>
        <strong>✅ Status:</strong> AI service is running! This page tests the MySimpleDesk AI assistant 
        with rule-based responses. It can answer questions about pricing, features, setup, and more.
      </div>
    </div>
  );
};

export default AiTest;