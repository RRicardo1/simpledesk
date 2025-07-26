import React from 'react';

const UserManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your team members and their permissions
          </p>
        </div>
        <button className="btn-primary">
          Invite Member
        </button>
      </div>

      <div className="card">
        <div className="text-center py-12 text-gray-500">
          <h3 className="text-lg font-medium text-gray-900">User Management</h3>
          <p className="mt-1">This component will show team members, their roles, and allow user management.</p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;