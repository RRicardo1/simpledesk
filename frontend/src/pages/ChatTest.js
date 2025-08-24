import React, { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const ChatTest = () => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  console.log('ChatTest component rendering at:', new Date().toISOString());

  const mockSessions = [
    { id: 1, visitor_name: 'John Doe', visitor_email: 'john@test.com', status: 'active', started_at: new Date() },
    { id: 2, visitor_name: 'Jane Smith', visitor_email: 'jane@test.com', status: 'active', started_at: new Date() }
  ];

  const mockMessages = [
    { id: 1, message: 'Hello, I need help', sender_type: 'visitor', created_at: new Date() },
    { id: 2, message: 'Hi! How can I assist you?', sender_type: 'agent', created_at: new Date() }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log('Send message:', newMessage);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Chat - Test Version</h1>
            <p className="mt-1 text-sm text-gray-500">
              Test version with no API calls or React Query
            </p>
          </div>
        </div>
      </div>

      <div className="flex h-full bg-white rounded-lg shadow">
        {/* Sessions Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Active Chats</h3>
              <p className="text-sm text-gray-500">
                {mockSessions.length} active conversations
              </p>
            </div>
            <button
              onClick={() => console.log('Refresh clicked')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              title="Refresh sessions"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {mockSessions.map((session) => (
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
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {session.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTime(session.started_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mockMessages.map((message) => (
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
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 form-input"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="btn-primary disabled:opacity-50 flex items-center"
                  >
                    Send
                  </button>
                </div>
              </form>
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
    </div>
  );
};

export default ChatTest;