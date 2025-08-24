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
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Chat = React.memo(() => {
  const queryClient = useQueryClient();
  const [selectedSession, setSelectedSession] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Debug logging to track re-renders
  console.log('Chat component rendering:', {
    selectedSessionId: selectedSession?.id,
    newMessageLength: newMessage?.length,
    timestamp: new Date().toISOString()
  });

  // Fetch chat sessions with no automatic behavior and prevent auth redirects
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError, refetch: refetchSessions } = useQuery(
    'chat-sessions',
    async () => {
      try {
        const response = await axios.get('/chat/sessions', {
          validateStatus: function (status) {
            return status < 500; // Accept any status code less than 500 as success
          }
        });
        
        if (response.status === 401 || response.status >= 400) {
          console.log('Chat sessions - backend not available, using empty data');
          return [];
        }
        
        return response.data.sessions || [];
      } catch (error) {
        console.log('Chat sessions fetch failed:', error.message);
        return []; // Return empty array instead of throwing
      }
    },
    { 
      refetchInterval: false, // Never automatically refetch
      retry: 0, // Never retry
      refetchOnWindowFocus: false, // Never refetch on focus
      refetchOnMount: true, // Only fetch on mount
      refetchOnReconnect: false, // Don't refetch on reconnect
      staleTime: Infinity, // Never consider stale
      cacheTime: Infinity, // Keep in cache forever
      suspense: false, // Don't use suspense
      useErrorBoundary: false, // Handle errors locally
      notifyOnChangeProps: ['data', 'error'], // Only notify on these changes
    }
  );

  // Fetch messages for selected session with no automatic behavior and prevent auth redirects
  const { data: messages, isLoading: messagesLoading, error: messagesError, refetch: refetchMessages } = useQuery(
    ['chat-messages', selectedSession?.id],
    async () => {
      if (!selectedSession) return [];
      try {
        const response = await axios.get(`/chat/sessions/${selectedSession.id}/messages`, {
          validateStatus: function (status) {
            return status < 500; // Accept any status code less than 500 as success
          }
        });
        
        if (response.status === 401 || response.status >= 400) {
          console.log('Chat messages - backend not available, using empty data');
          return [];
        }
        
        return response.data.messages || [];
      } catch (error) {
        console.log('Chat messages fetch failed:', error.message);
        return []; // Return empty array instead of throwing
      }
    },
    { 
      enabled: !!selectedSession,
      refetchInterval: false, // Never automatically refetch
      retry: 0, // Never retry
      refetchOnWindowFocus: false, // Never refetch on focus
      refetchOnMount: true, // Only fetch when session changes
      refetchOnReconnect: false, // Don't refetch on reconnect
      staleTime: Infinity, // Never consider stale
      cacheTime: Infinity, // Keep in cache forever
      suspense: false, // Don't use suspense
      useErrorBoundary: false, // Handle errors locally
      notifyOnChangeProps: ['data', 'error'], // Only notify on these changes
    }
  );

  // Send message mutation with auth redirect prevention
  const sendMessageMutation = useMutation(
    async ({ sessionId, message }) => {
      try {
        const response = await axios.post(`/chat/sessions/${sessionId}/messages`, { message }, {
          validateStatus: function (status) {
            return status < 500; // Accept any status code less than 500 as success
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

  // Close session mutation with auth redirect prevention
  const closeSessionMutation = useMutation(
    async (sessionId) => {
      try {
        const response = await axios.put(`/chat/sessions/${sessionId}`, { status: 'closed' }, {
          validateStatus: function (status) {
            return status < 500; // Accept any status code less than 500 as success
          }
        });
        
        if (response.status === 401 || response.status >= 400) {
          throw new Error('Backend not available');
        }
        
        return response.data;
      } catch (error) {
        console.log('Close session failed:', error.message);
        throw error;
      }
    },
    {
      onSuccess: () => {
        refetchSessions();
        setSelectedSession(null);
        alert('Chat session closed successfully');
      },
      onError: (error) => {
        console.error('Error closing session:', error);
        alert('Failed to close session - backend connection issue');
      }
    }
  );

  // Scroll to bottom when new messages arrive (with stability check)
  useEffect(() => {
    if (messages && messages.length > 0 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages?.length]); // Only depend on message count, not the entire messages array

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedSession) return;

    sendMessageMutation.mutate({
      sessionId: selectedSession.id,
      message: newMessage.trim()
    });
  };

  const handleCloseSession = (session) => {
    if (window.confirm(`Are you sure you want to close the chat with ${session.visitor_name}?`)) {
      closeSessionMutation.mutate(session.id);
    }
  };

  const handleRefreshSessions = () => {
    refetchSessions();
  };

  const handleRefreshMessages = () => {
    if (selectedSession) {
      refetchMessages();
    }
  };

  const getSessionStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      transferred: 'bg-blue-100 text-blue-800'
    };
    return badges[status] || badges.active;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Show loading only on initial mount, not on refetches
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
            <h1 className="text-2xl font-bold text-gray-900">Live Chat</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage real-time conversations with your customers
            </p>
          </div>
          {(sessionsError || messagesError) && (
            <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-md">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Backend connection issue - using manual refresh</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex h-full bg-white rounded-lg shadow">
        {/* Sessions Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Active Chats</h3>
              <p className="text-sm text-gray-500">
                {sessions?.filter(s => s.status === 'active').length || 0} active conversations
              </p>
            </div>
            <button
              onClick={handleRefreshSessions}
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
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSessionStatusBadge(session.status)}`}>
                        {session.status}
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
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No active chats</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Conversations will appear here when customers start chatting.
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
                  <button
                    onClick={handleRefreshMessages}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                    title="Refresh messages"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                  </button>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSessionStatusBadge(selectedSession.status)}`}>
                    {selectedSession.status}
                  </span>
                  {selectedSession.status === 'active' && (
                    <button
                      onClick={() => handleCloseSession(selectedSession)}
                      className="text-red-600 hover:text-red-800"
                      disabled={closeSessionMutation.isLoading}
                    >
                      <XMarkIcon className="h-5 w-5" />
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
                      className={`flex ${message.sender_type === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_type === 'agent'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender_type === 'agent' ? 'text-primary-100' : 'text-gray-500'
                          }`}
                        >
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
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
                      type="submit"
                      disabled={!newMessage.trim() || sendMessageMutation.isLoading}
                      className="btn-primary disabled:opacity-50 flex items-center"
                    >
                      <PaperAirplaneIcon className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Select a conversation</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Choose a chat session from the sidebar to start messaging.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Active Chats</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {sessions?.filter(s => s.status === 'active').length || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Closed Today</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {sessions?.filter(s => s.status === 'closed' && 
                    new Date(s.ended_at).toDateString() === new Date().toDateString()).length || 0}
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
                <dt className="text-sm font-medium text-gray-500">Avg Response</dt>
                <dd className="text-2xl font-semibold text-gray-900">2m</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserCircleIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Total Sessions</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {sessions?.length || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Chat.displayName = 'Chat';

export default Chat;