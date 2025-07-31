import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { UserIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'agent'
  });

  // Fetch users
  const { data: users, isLoading, error } = useQuery(
    'users',
    () => axios.get('/users').then(res => res.data.users)
  );

  // Invite user mutation
  const inviteUserMutation = useMutation(
    (userData) => axios.post('/users/invite', userData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        setInviteData({ email: '', firstName: '', lastName: '', role: 'agent' });
        setShowInviteForm(false);
        alert('User invited successfully!');
      },
      onError: (error) => {
        console.error('Error inviting user:', error);
        const errorMessage = error.response?.data?.error || 'Failed to invite user';
        alert(`Failed to invite user: ${errorMessage}`);
      }
    }
  );

  // Update user mutation
  const updateUserMutation = useMutation(
    ({ userId, userData }) => axios.put(`/users/${userId}`, userData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        alert('User updated successfully!');
      },
      onError: (error) => {
        console.error('Error updating user:', error);
        alert('Failed to update user');
      }
    }
  );

  // Deactivate user mutation
  const deactivateUserMutation = useMutation(
    (userId) => axios.put(`/users/${userId}`, { status: 'inactive' }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        alert('User deactivated successfully!');
      },
      onError: (error) => {
        console.error('Error deactivating user:', error);
        alert('Failed to deactivate user');
      }
    }
  );

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteData.email || !inviteData.firstName || !inviteData.lastName) {
      alert('Please fill in all required fields');
      return;
    }
    inviteUserMutation.mutate(inviteData);
  };

  const handleRoleChange = (userId, newRole) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      updateUserMutation.mutate({ userId, userData: { role: newRole } });
    }
  };

  const handleDeactivateUser = (userId, userName) => {
    if (window.confirm(`Are you sure you want to deactivate ${userName}?`)) {
      deactivateUserMutation.mutate(userId);
    }
  };


  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      invited: 'bg-yellow-100 text-yellow-800'
    };
    return badges[status] || badges.active;
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
        <p className="text-red-600">Error loading users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your team members and their permissions
          </p>
        </div>
        <button 
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="btn-primary"
        >
          {showInviteForm ? 'Cancel' : 'Invite Member'}
        </button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Invite New Team Member</h3>
          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="form-input"
                  value={inviteData.firstName}
                  onChange={(e) => setInviteData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="form-input"
                  value={inviteData.lastName}
                  onChange={(e) => setInviteData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={inviteData.email}
                onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                className="form-select"
                value={inviteData.role}
                onChange={(e) => setInviteData(prev => ({ ...prev, role: e.target.value }))}
              >
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={inviteUserMutation.isLoading}
                className="btn-primary disabled:opacity-50"
              >
                {inviteUserMutation.isLoading ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="text-sm rounded-md border-gray-300"
                      disabled={updateUserMutation.isLoading}
                    >
                      <option value="agent">Agent</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {user.status === 'active' && (
                        <button
                          onClick={() => handleDeactivateUser(user.id, `${user.first_name} ${user.last_name}`)}
                          className="text-red-600 hover:text-red-900"
                          disabled={deactivateUserMutation.isLoading}
                        >
                          Deactivate
                        </button>
                      )}
                      {user.status === 'inactive' && (
                        <button
                          onClick={() => updateUserMutation.mutate({ userId: user.id, userData: { status: 'active' } })}
                          className="text-green-600 hover:text-green-900"
                          disabled={updateUserMutation.isLoading}
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {users?.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No team members</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by inviting your first team member.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowInviteForm(true)}
                className="btn-primary"
              >
                Invite Team Member
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      {users?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">Total Members</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{users.length}</dd>
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
                  <dt className="text-sm font-medium text-gray-500">Active Members</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {users.filter(u => u.status === 'active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EnvelopeIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">Admins</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {users.filter(u => u.role === 'admin').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;