import React from 'react';
import { useParams } from 'react-router-dom';

const TicketDetail = () => {
  const { ticketId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Ticket #{ticketId}</h1>
        <div className="flex space-x-3">
          <button className="btn-secondary">Edit</button>
          <button className="btn-primary">Reply</button>
        </div>
      </div>

      <div className="card">
        <div className="text-center py-12 text-gray-500">
          <h3 className="text-lg font-medium text-gray-900">Ticket Detail View</h3>
          <p className="mt-1">This component will show ticket details, comments, and allow replies.</p>
          <p className="mt-1 text-sm">Ticket ID: {ticketId}</p>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;