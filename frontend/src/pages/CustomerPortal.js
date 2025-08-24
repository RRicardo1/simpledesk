import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import {
  TicketIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const CustomerPortal = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'normal'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Mock customer data - in real app this would come from auth
  const customer = {
    name: 'John Smith',
    email: 'john@company.com',
    organization: 'Demo Company'
  };

  const queryClient = useQueryClient();

  // Fetch customer tickets
  const { data: tickets, isLoading: ticketsLoading } = useQuery(
    'customer-tickets',
    async () => {
      // Mock data for demo - would use real API in production
      return [
        {
          id: '1',
          subject: 'Login issue with new account',
          status: 'open',
          priority: 'high',
          created_at: '2025-01-12T10:30:00Z',
          updated_at: '2025-01-12T15:45:00Z',
          comment_count: 3
        },
        {
          id: '2', 
          subject: 'Feature request: Dark mode',
          status: 'pending',
          priority: 'normal',
          created_at: '2025-01-10T09:15:00Z',
          updated_at: '2025-01-11T14:20:00Z',
          comment_count: 1
        },
        {
          id: '3',
          subject: 'Billing question about invoice',
          status: 'solved',
          priority: 'normal',
          created_at: '2025-01-08T11:00:00Z',
          updated_at: '2025-01-09T10:30:00Z',
          comment_count: 5
        }
      ];
    },
    {
      refetchOnWindowFocus: false
    }
  );

  // Fetch knowledge base articles
  const { data: kbArticles, isLoading: kbLoading } = useQuery(
    ['kb-articles', searchQuery],
    async () => {
      // Mock data for demo
      return [
        {
          id: '1',
          title: 'How to reset your password',
          category: 'Account',
          body: 'Follow these simple steps to reset your password and regain access to your account...',
          view_count: 156,
          helpful_count: 23
        },
        {
          id: '2',
          title: 'Getting started with MySimpleDesk',
          category: 'Getting Started',
          body: 'Welcome to MySimpleDesk! This guide will help you get up and running quickly...',
          view_count: 89,
          helpful_count: 18
        },
        {
          id: '3',
          title: 'Understanding billing and invoices',
          category: 'Billing',
          body: 'Learn about our billing process, how to view invoices, and manage your subscription...',
          view_count: 67,
          helpful_count: 12
        }
      ].filter(article => 
        !searchQuery || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
    },
    {
      refetchOnWindowFocus: false
    }
  );

  // Create ticket mutation
  const createTicketMutation = useMutation(
    async (ticketData) => {
      // Would call real API in production
      console.log('Creating ticket:', ticketData);
      return { id: Date.now().toString(), ...ticketData };
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('customer-tickets');
        setShowNewTicketModal(false);
        setNewTicket({ subject: '', description: '', priority: 'normal' });
      }
    }
  );

  const handleCreateTicket = (e) => {
    e.preventDefault();
    createTicketMutation.mutate({
      ...newTicket,
      status: 'open',
      created_at: new Date().toISOString()
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800', 
      solved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || badges.open;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'bg-gray-100 text-gray-800',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return badges[priority] || badges.normal;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img 
                  src="/logo.svg" 
                  alt="MySimpleDesk" 
                  className="h-8 w-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center justify-center w-8 h-8 bg-primary-600 rounded text-white font-bold text-sm">
                  SD
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Customer Portal</h1>
                <p className="text-sm text-gray-500">{customer.organization}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                <p className="text-sm text-gray-500">{customer.email}</p>
              </div>
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => setShowNewTicketModal(true)}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PlusIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Submit Ticket</h3>
                <p className="text-sm text-gray-500">Get help with an issue</p>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-gray-400 ml-auto" />
            </div>
          </div>

          <div className="card hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => setActiveTab('knowledge-base')}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Browse Help</h3>
                <p className="text-sm text-gray-500">Find answers quickly</p>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-gray-400 ml-auto" />
            </div>
          </div>

          <div className="card hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => setActiveTab('chat')}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Live Chat</h3>
                <p className="text-sm text-gray-500">Chat with our team</p>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-gray-400 ml-auto" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tickets'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TicketIcon className="h-5 w-5 inline mr-2" />
              My Tickets ({tickets?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('knowledge-base')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'knowledge-base'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpenIcon className="h-5 w-5 inline mr-2" />
              Knowledge Base
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'chat'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-2" />
              Live Chat
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Your Support Tickets</h2>
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="btn-primary"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                New Ticket
              </button>
            </div>

            {ticketsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : tickets?.length === 0 ? (
              <div className="text-center py-12">
                <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Submit your first support ticket to get help.
                </p>
                <button
                  onClick={() => setShowNewTicketModal(true)}
                  className="mt-6 btn-primary"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Ticket
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets?.map((ticket) => (
                  <div key={ticket.id} className="card hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          #{ticket.id} - {ticket.subject}
                        </h3>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(ticket.status)}`}>
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(ticket.priority)}`}>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </span>
                          <span className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            Created {formatDate(ticket.created_at)}
                          </span>
                          <span>
                            {ticket.comment_count} {ticket.comment_count === 1 ? 'reply' : 'replies'}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500">
                          Last updated: {formatDate(ticket.updated_at)}
                        </p>
                      </div>

                      <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'knowledge-base' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Knowledge Base</h2>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="form-input pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {kbLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : kbArticles?.length === 0 ? (
              <div className="text-center py-12">
                <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search terms.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kbArticles?.map((article) => (
                  <div key={article.id} className="card hover:shadow-md transition-shadow cursor-pointer">
                    <div className="mb-3">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {article.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {article.body}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{article.view_count} views</span>
                      <span className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500" />
                        {article.helpful_count} helpful
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="card max-w-4xl mx-auto">
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="mx-auto h-16 w-16 text-primary-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Live Chat Support</h3>
              <p className="text-gray-600 mb-6">
                Connect with our support team for immediate assistance
              </p>
              <button className="btn-primary">
                Start Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateTicket}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Create Support Ticket</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Describe your issue and we'll get back to you soon.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Subject</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Priority</label>
                      <select
                        className="form-input"
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        className="form-input"
                        rows={4}
                        value={newTicket.description}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Provide details about your issue..."
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={createTicketMutation.isLoading}
                    className="btn-primary sm:ml-3"
                  >
                    Submit Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewTicketModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPortal;