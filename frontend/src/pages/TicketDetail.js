import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const TicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Fetch ticket data
  const { data: ticketData, isLoading, error } = useQuery(
    ['ticket', ticketId],
    () => axios.get(`/tickets/${ticketId}`).then(res => {
      console.log('Ticket data received:', res.data);
      return res.data;
    }),
    { enabled: !!ticketId }
  );

  // Add comment mutation
  const addCommentMutation = useMutation(
    (commentData) => axios.post(`/tickets/${ticketId}/comments`, commentData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ticket', ticketId]);
        setReplyText('');
        setShowReplyForm(false);
      },
      onError: (error) => {
        console.error('Error adding comment:', error);
        alert('Failed to add comment. Please try again.');
      }
    }
  );

  // Update ticket mutation
  const updateTicketMutation = useMutation(
    (updateData) => axios.put(`/tickets/${ticketId}`, updateData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ticket', ticketId]);
      },
      onError: (error) => {
        console.error('Error updating ticket:', error);
        alert('Failed to update ticket. Please try again.');
      }
    }
  );

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    addCommentMutation.mutate({
      body: replyText,
      is_public: isPublic
    });
  };

  const handleStatusChange = (newStatus) => {
    updateTicketMutation.mutate({ status: newStatus });
  };

  const handlePriorityChange = (newPriority) => {
    updateTicketMutation.mutate({ priority: newPriority });
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading ticket: {error.message}</p>
        <button onClick={() => navigate('/tickets')} className="btn-secondary mt-4">
          Back to Tickets
        </button>
      </div>
    );
  }

  const ticket = ticketData?.ticket;
  console.log('Ticket object:', ticket);
  console.log('Comments array:', ticket?.comments);

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Ticket not found</p>
        <button onClick={() => navigate('/tickets')} className="btn-secondary mt-4">
          Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Ticket #{ticket.ticket_number}
          </h1>
          <p className="text-gray-600">{ticket.subject}</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate('/tickets')}
            className="btn-secondary"
          >
            Back to List
          </button>
          <button 
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="btn-primary"
          >
            {showReplyForm ? 'Cancel' : 'Reply'}
          </button>
        </div>
      </div>

      {/* Ticket Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Description */}
          <div className="card">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {ticket.requester_name ? ticket.requester_name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {ticket.requester_name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-600">{ticket.requester_email}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(ticket.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>

          {/* Comments */}
          {ticket.comments && ticket.comments.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Comments</h3>
              {ticket.comments.map((comment) => (
                <div key={comment.id} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {comment.author_name ? comment.author_name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {comment.author_name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-600">{comment.author_email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!comment.is_public && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          Internal
                        </span>
                      )}
                      <p className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{comment.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply Form */}
          {showReplyForm && (
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Reply</h3>
              <form onSubmit={handleSubmitReply} className="space-y-4">
                <div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={6}
                    className="form-input"
                    placeholder="Type your reply here..."
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Public reply</span>
                    </label>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowReplyForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addCommentMutation.isLoading}
                      className="btn-primary disabled:opacity-50"
                    >
                      {addCommentMutation.isLoading ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Properties</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="form-select"
                  disabled={updateTicketMutation.isLoading}
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="solved">Solved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={ticket.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="form-select"
                  disabled={updateTicketMutation.isLoading}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Created:</span>
                <p className="text-sm text-gray-900">
                  {new Date(ticket.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Updated:</span>
                <p className="text-sm text-gray-900">
                  {new Date(ticket.updated_at).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Source:</span>
                <p className="text-sm text-gray-900 capitalize">{ticket.source}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;