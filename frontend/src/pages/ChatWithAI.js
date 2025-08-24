import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { 
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  ArrowPathIcon,
  SparklesIcon,
  UserIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

const ChatWithAI = React.memo(() => {
  const queryClient = useQueryClient();
  const [selectedSession, setSelectedSession] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const messagesEndRef = useRef(null);

  console.log('Chat with AI component rendering:', {
    selectedSessionId: selectedSession?.id,
    aiEnabled,
    timestamp: new Date().toISOString()
  });

  // Fetch chat sessions
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError, refetch: refetchSessions } = useQuery(
    'chat-sessions',
    async () => {
      try {
        const response = await axios.get('/chat/sessions', {
          validateStatus: function (status) {
            return status < 500;
          }
        });
        
        if (response.status === 401 || response.status >= 400) {
          console.log('Chat sessions - backend not available, using mock data');
          return [
            {
              id: 'demo-1',
              visitor_name: 'Sarah Johnson',
              visitor_email: 'sarah@example.com',
              status: 'active',
              started_at: new Date().toISOString(),
              needs_human: false,
              last_message: 'Hi, I need help with billing'
            },
            {
              id: 'demo-2', 
              visitor_name: 'Mike Chen',
              visitor_email: 'mike@example.com',
              status: 'active',
              started_at: new Date(Date.now() - 300000).toISOString(),
              needs_human: true,
              last_message: 'Can I speak to a human agent?'
            }
          ];
        }
        
        return response.data.sessions || [];
      } catch (error) {
        console.log('Chat sessions fetch failed:', error.message);
        return [];
      }
    },
    { 
      refetchInterval: false,
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      suspense: false,
      useErrorBoundary: false,
      notifyOnChangeProps: ['data', 'error'],
    }
  );

  // Fetch messages for selected session
  const { data: messages, isLoading: messagesLoading, error: messagesError, refetch: refetchMessages } = useQuery(
    ['chat-messages', selectedSession?.id],
    async () => {
      if (!selectedSession) return [];
      
      // For demo sessions, return mock AI conversation
      if (selectedSession.id.startsWith('demo-')) {
        return selectedSession.id === 'demo-1' ? [
          {
            id: '1',
            sender_type: 'customer',
            sender_name: 'Sarah Johnson',
            message: 'Hi, I need help with billing',
            created_at: new Date(Date.now() - 120000).toISOString()
          },
          {
            id: '2',
            sender_type: 'ai',
            sender_name: 'SimpleDesk AI',
            message: 'Hello! I\'d be happy to help with billing questions. SimpleDesk offers three plans: Starter ($29/month), Growth ($59/month), and Business ($99/month). What specific billing question can I help you with?',
            created_at: new Date(Date.now() - 118000).toISOString(),
            is_ai_response: true,
            ai_confidence: 'high'
          },
          {
            id: '3',
            sender_type: 'customer',
            sender_name: 'Sarah Johnson',
            message: 'I want to upgrade from Starter to Growth plan',
            created_at: new Date(Date.now() - 60000).toISOString()
          },
          {
            id: '4',
            sender_type: 'ai',
            sender_name: 'SimpleDesk AI',
            message: 'Great choice! The Growth plan gives you up to 10 agents and 5,000 tickets/month for $59/month. I can help you upgrade right now. Would you like me to process the upgrade or connect you with our billing team for assistance?',
            created_at: new Date(Date.now() - 58000).toISOString(),
            is_ai_response: true,
            ai_confidence: 'high'
          }
        ] : [
          {
            id: '1',
            sender_type: 'customer',
            sender_name: 'Mike Chen',
            message: 'Hello, I\'m having trouble setting up email integration',
            created_at: new Date(Date.now() - 180000).toISOString()
          },
          {
            id: '2',
            sender_type: 'ai',
            sender_name: 'SimpleDesk AI',
            message: 'I can help you with email setup! For email integration, you\'ll need to configure your email forwarding settings. However, since this involves technical configuration, I think one of our human agents would be better equipped to walk you through the process step by step. Would you like me to connect you with a technical support agent?',
            created_at: new Date(Date.now() - 178000).toISOString(),
            is_ai_response: true,
            ai_confidence: 'medium'
          },
          {
            id: '3',
            sender_type: 'customer',
            sender_name: 'Mike Chen',
            message: 'Yes please, I\'d like to speak with a human agent',
            created_at: new Date(Date.now() - 120000).toISOString()
          },
          {
            id: '4',
            sender_type: 'system',
            sender_name: 'System',
            message: 'Chat transferred to human agent. An agent will be with you shortly.',
            created_at: new Date(Date.now() - 118000).toISOString()
          }
        ];
      }
      
      try {
        const response = await axios.get(`/chat/sessions/${selectedSession.id}/messages`, {
          validateStatus: function (status) {
            return status < 500;
          }
        });
        
        if (response.status === 401 || response.status >= 400) {
          console.log('Chat messages - backend not available, using empty data');
          return [];
        }
        
        return response.data.messages || [];
      } catch (error) {
        console.log('Chat messages fetch failed:', error.message);
        return [];
      }
    },
    { 
      enabled: !!selectedSession,
      refetchInterval: false,
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      suspense: false,
      useErrorBoundary: false,
      notifyOnChangeProps: ['data', 'error'],
    }
  );

  // Send message mutation
  const sendMessageMutation = useMutation(
    async ({ sessionId, message }) => {
      try {
        const response = await axios.post(`/chat/sessions/${sessionId}/messages`, { message }, {
          validateStatus: function (status) {
            return status < 500;
          }
        });
        
        if (response.status === 401 || response.status >= 400) {
          throw new Error('Backend not available');
        }
        
        return response.data;
      } catch (error) {
        console.log('Send message failed:', error.message);
        throw error;
      }
    },
    {
      onSuccess: () => {
        refetchMessages();
        setNewMessage('');
      },
      onError: (error) => {
        console.error('Error sending message:', error);
        alert('Failed to send message - backend connection issue');
      }
    }
  );

  // AI response mutation
  const getAIResponseMutation = useMutation(
    async ({ message, sessionId }) => {
      try {
        const response = await axios.post('/chat/ai-response', {
          message,
          sessionId,
          customerInfo: { plan: 'starter' }
        });
        return response.data;
      } catch (error) {
        console.error('AI response error:', error);
        return {
          response: 'I apologize, but I\'m having trouble processing your request right now. Let me connect you with a human agent who can assist you.',
          shouldEscalate: true,
          confidence: 'low'
        };
      }
    }
  );

  // Transfer to human mutation
  const transferToHumanMutation = useMutation(
    async ({ sessionId, reason }) => {
      try {
        const response = await axios.post(`/chat/sessions/${sessionId}/transfer-to-human`, {
          transferReason: reason
        });
        return response.data;
      } catch (error) {
        console.error('Transfer to human error:', error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        refetchSessions();
        alert('Chat successfully transferred to human agent');
      }
    }
  );

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages && messages.length > 0 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages?.length]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedSession) return;

    sendMessageMutation.mutate({
      sessionId: selectedSession.id,
      message: newMessage.trim()
    });
  };

  const handleAIResponse = async (customerMessage) => {
    if (!aiEnabled || !selectedSession) return;
    
    try {
      const aiResponse = await getAIResponseMutation.mutateAsync({
        message: customerMessage,
        sessionId: selectedSession.id
      });
      
      if (aiResponse.shouldEscalate) {
        setShowAIPanel(true);
      }
      
      // Refresh messages to show AI response
      setTimeout(() => refetchMessages(), 1000);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    }
  };

  const handleTransferToHuman = (reason = 'Customer requested human agent') => {
    if (!selectedSession) return;
    
    transferToHumanMutation.mutate({
      sessionId: selectedSession.id,
      reason
    });
  };

  const getSessionStatusBadge = (session) => {
    if (session.needs_human) {
      return 'bg-orange-100 text-orange-800';
    }
    return session.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getSessionStatusText = (session) => {
    if (session.needs_human) return 'Needs Human';
    return session.status;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSenderIcon = (senderType) => {
    switch (senderType) {
      case 'ai':
        return <SparklesIcon className="h-6 w-6 text-blue-500" />;
      case 'agent':
        return <UserIcon className="h-6 w-6 text-green-500" />;
      case 'system':
        return <ComputerDesktopIcon className="h-6 w-6 text-gray-500" />;
      default:
        return <UserCircleIcon className="h-6 w-6 text-gray-400" />;
    }
  };

  if (sessionsLoading && !sessions) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <ChatBubbleLeftRightIcon className="h-8 w-8 mr-3 text-primary-600" />
              AI-Powered Live Chat
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              AI handles 80% of inquiries, with seamless human handoff when needed
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">AI Support:</label>
              <button
                onClick={() => setAiEnabled(!aiEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  aiEnabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    aiEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {(sessionsError || messagesError) && (
              <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-md">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Demo mode - using sample data</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-full bg-white rounded-lg shadow">
        {/* Sessions Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Customer Chats</h3>
              <p className="text-sm text-gray-500">
                {sessions?.filter(s => s.status === 'active').length || 0} active • 
                {sessions?.filter(s => s.needs_human).length || 0} need human
              </p>
            </div>
            <button
              onClick={refetchSessions}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              title="Refresh sessions"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {sessions?.length > 0 ? (
              sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedSession?.id === session.id ? 'bg-primary-50 border-primary-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <UserCircleIcon className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {session.visitor_name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session.visitor_email || 'No email'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSessionStatusBadge(session)}`}>
                        {getSessionStatusText(session)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(session.started_at)}
                      </p>
                    </div>
                  </div>
                  
                  {session.last_message && (
                    <p className="text-sm text-gray-600 mt-2 truncate">
                      {session.last_message}
                    </p>
                  )}
                  
                  {session.needs_human && (
                    <div className="mt-2 flex items-center text-orange-600">
                      <UserIcon className="h-4 w-4 mr-1" />
                      <span className="text-xs">Escalated to human</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No active chats</h3>
                <p className="mt-1 text-sm text-gray-500">
                  AI will handle new customer conversations automatically.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedSession ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedSession.visitor_name || 'Anonymous'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedSession.visitor_email || 'No email provided'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {aiEnabled && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      <SparklesIcon className="h-3 w-3 mr-1" />
                      AI Active
                    </span>
                  )}
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSessionStatusBadge(selectedSession)}`}>
                    {getSessionStatusText(selectedSession)}
                  </span>
                  {selectedSession.needs_human && (
                    <button
                      onClick={() => handleTransferToHuman('Manual transfer')}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Take Over
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading && !messages ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  </div>
                ) : messages && messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${['agent', 'ai'].includes(message.sender_type) ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
                        {!['agent', 'ai'].includes(message.sender_type) && (
                          <div className="flex-shrink-0">
                            {getSenderIcon(message.sender_type)}
                          </div>
                        )}
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            message.sender_type === 'agent'
                              ? 'bg-green-600 text-white'
                              : message.sender_type === 'ai'
                              ? 'bg-blue-600 text-white'
                              : message.sender_type === 'system'
                              ? 'bg-gray-100 text-gray-700 italic'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p
                              className={`text-xs ${
                                ['agent', 'ai'].includes(message.sender_type) 
                                  ? 'text-gray-200' 
                                  : 'text-gray-500'
                              }`}
                            >
                              {formatTime(message.created_at)}
                            </p>
                            {message.is_ai_response && (
                              <span className="text-xs bg-blue-500 bg-opacity-20 px-2 py-1 rounded text-blue-100">
                                AI
                              </span>
                            )}
                          </div>
                        </div>
                        {['agent', 'ai'].includes(message.sender_type) && (
                          <div className="flex-shrink-0">
                            {getSenderIcon(message.sender_type)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <SparklesIcon className="mx-auto h-12 w-12 text-blue-400 mb-4" />
                    <p className="text-gray-500">AI is ready to assist this customer!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              {selectedSession.status === 'active' && (
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 form-input"
                      disabled={sendMessageMutation.isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => handleAIResponse(newMessage)}
                      disabled={!newMessage.trim() || !aiEnabled}
                      className="btn-secondary disabled:opacity-50 flex items-center"
                      title="Get AI suggestion"
                    >
                      <SparklesIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sendMessageMutation.isLoading}
                      className="btn-primary disabled:opacity-50 flex items-center"
                    >
                      <PaperAirplaneIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleTransferToHuman('Agent requested transfer')}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Transfer to Human
                      </button>
                    </div>
                    {aiEnabled && (
                      <p className="text-xs text-gray-500">
                        AI assistance active • Click sparkle icon for AI suggestions
                      </p>
                    )}
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <SparklesIcon className="h-16 w-16 text-blue-400 mr-4" />
                  <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">AI-Powered Customer Support</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Select a conversation to see AI handling customer inquiries with human escalation when needed.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <SparklesIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">AI Responses</dt>
                <dd className="text-2xl font-semibold text-gray-900">85%</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Human Escalations</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {sessions?.filter(s => s.needs_human).length || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Avg AI Response</dt>
                <dd className="text-2xl font-semibold text-gray-900">2s</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Satisfaction</dt>
                <dd className="text-2xl font-semibold text-gray-900">94%</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ChatWithAI.displayName = 'ChatWithAI';

export default ChatWithAI;