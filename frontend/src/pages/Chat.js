import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { 
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Chat = () => {
  const queryClient = useQueryClient();
  const [selectedSession, setSelectedSession] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch chat sessions
  const { data: sessions, isLoading: sessionsLoading } = useQuery(
    'chat-sessions',
    () => axios.get('/chat/sessions').then(res => res.data.sessions),
    { refetchInterval: 5000 } // Refresh every 5 seconds
  );

  // Fetch messages for selected session
  const { data: messages, isLoading: messagesLoading } = useQuery(
    ['chat-messages', selectedSession?.id],
    () => selectedSession ? axios.get(`/chat/sessions/${selectedSession.id}/messages`).then(res => res.data.messages) : [],
    { 
      enabled: !!selectedSession,
      refetchInterval: 2000 // Refresh every 2 seconds
    }
  );

  // Send message mutation
  const sendMessageMutation = useMutation(
    ({ sessionId, message }) => axios.post(`/chat/sessions/${sessionId}/messages`, { message }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['chat-messages', selectedSession?.id]);
        setNewMessage('');
      },
      onError: (error) => {
        console.error('Error sending message:', error);
        alert('Failed to send message');
      }
    }
  );

  // Close session mutation
  const closeSessionMutation = useMutation(
    (sessionId) => axios.put(`/chat/sessions/${sessionId}`, { status: 'closed' }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('chat-sessions');
        setSelectedSession(null);
        alert('Chat session closed successfully');
      },
      onError: (error) => {
        console.error('Error closing session:', error);
        alert('Failed to close session');
      }
    }
  );

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  if (sessionsLoading) {
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
        <h1 className="text-2xl font-bold text-gray-900">Live Chat</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage real-time conversations with your customers
        </p>
      </div>

      <div className="flex h-full bg-white rounded-lg shadow">
        {/* Sessions Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Active Chats</h3>
            <p className="text-sm text-gray-500">
              {sessions?.filter(s => s.status === 'active').length || 0} active conversations
            </p>
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
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  </div>
                ) : messages?.length > 0 ? (
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
};

export default Chat;