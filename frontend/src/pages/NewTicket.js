import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const NewTicket = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'normal',
    requester_email: '',
    requester_name: '',
    tags: []
  });

  const createTicketMutation = useMutation(
    (ticketData) => axios.post('/tickets', ticketData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('tickets');
        navigate(`/tickets/${response.data.ticket.id}`);
      },
      onError: (error) => {
        console.error('Error creating ticket:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
        alert(`Failed to create ticket: ${errorMessage}`);
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    createTicketMutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a new support ticket for a customer
          </p>
        </div>
        <button
          onClick={() => navigate('/tickets')}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Requester Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="requester_name" className="block text-sm font-medium text-gray-700 mb-1">
                Requester Name *
              </label>
              <input
                type="text"
                id="requester_name"
                name="requester_name"
                required
                className="form-input"
                value={formData.requester_name}
                onChange={handleChange}
                placeholder="Customer's full name"
              />
            </div>
            
            <div>
              <label htmlFor="requester_email" className="block text-sm font-medium text-gray-700 mb-1">
                Requester Email *
              </label>
              <input
                type="email"
                id="requester_email"
                name="requester_email"
                required
                className="form-input"
                value={formData.requester_email}
                onChange={handleChange}
                placeholder="customer@example.com"
              />
            </div>
          </div>

          {/* Ticket Details */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              className="form-input"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief description of the issue"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              className="form-input"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the issue or request..."
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              className="form-select"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/tickets')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createTicketMutation.isLoading}
              className="btn-primary disabled:opacity-50"
            >
              {createTicketMutation.isLoading ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicket;