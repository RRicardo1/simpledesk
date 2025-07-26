import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  TicketIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery(
    'dashboard-stats',
    () => axios.get('/tickets/stats/overview').then(res => res.data.stats)
  );

  // Fetch recent tickets
  const { data: tickets, isLoading: ticketsLoading } = useQuery(
    'recent-tickets',
    () => axios.get('/tickets?limit=10').then(res => res.data.tickets)
  );

  // Fetch organization stats
  const { data: orgStats, isLoading: orgStatsLoading } = useQuery(
    'org-stats',
    () => axios.get('/organizations/stats').then(res => res.data)
  );

  const StatCard = ({ title, value, icon: Icon, color, link, change }) => (
    <div className="card">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value || '0'}
              </div>
              {change && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  change.positive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {change.value}
                </div>
              )}
            </dd>
          </dl>
        </div>
        {link && (
          <div className="flex-shrink-0">
            <Link to={link} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    const badges = {
      open: 'status-badge status-open',
      pending: 'status-badge status-pending',
      solved: 'status-badge status-solved',
      closed: 'status-badge status-closed'
    };
    return badges[status] || badges.open;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'status-badge priority-low',
      normal: 'status-badge priority-normal',
      high: 'status-badge priority-high',
      urgent: 'status-badge priority-urgent'
    };
    return badges[priority] || badges.normal;
  };

  if (statsLoading || ticketsLoading || orgStatsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your support desk.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tickets"
          value={stats?.total_tickets}
          icon={TicketIcon}
          color="text-blue-600"
          link="/tickets"
        />
        <StatCard
          title="Open Tickets"
          value={stats?.open_tickets}
          icon={ClockIcon}
          color="text-orange-600"
          link="/tickets?status=open"
        />
        <StatCard
          title="Solved Today"
          value={stats?.tickets_today}
          icon={CheckCircleIcon}
          color="text-green-600"
        />
        <StatCard
          title="Urgent Tickets"
          value={stats?.urgent_tickets}
          icon={ExclamationTriangleIcon}
          color="text-red-600"
          link="/tickets?priority=urgent"
        />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Team Members"
          value={orgStats?.basicStats?.active_users}
          icon={UserGroupIcon}
          color="text-purple-600"
          link="/users"
        />
        <StatCard
          title="This Week"
          value={stats?.tickets_this_week}
          icon={TicketIcon}
          color="text-indigo-600"
        />
        <StatCard
          title="Avg Resolution"
          value={stats?.avg_resolution_hours ? `${Math.round(stats.avg_resolution_hours)}h` : 'N/A'}
          icon={ClockIcon}
          color="text-teal-600"
        />
      </div>

      {/* Recent Tickets and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tickets */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Tickets</h3>
            <Link to="/tickets" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {tickets?.length > 0 ? (
              tickets.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/tickets/${ticket.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-primary-600 truncate block"
                    >
                      #{ticket.ticket_number} {ticket.subject}
                    </Link>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={getStatusBadge(ticket.status)}>
                        {ticket.status}
                      </span>
                      <span className={getPriorityBadge(ticket.priority)}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 ml-4">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tickets will appear here when customers contact you.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/tickets?assignee_id=unassigned"
              className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Unassigned Tickets</p>
                <p className="text-sm text-gray-500">{stats?.unassigned_tickets || 0} tickets need assignment</p>
              </div>
            </Link>
            
            <Link
              to="/tickets?priority=high"
              className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">High Priority</p>
                <p className="text-sm text-gray-500">{stats?.high_priority_tickets || 0} tickets need attention</p>
              </div>
            </Link>

            <Link
              to="/chat"
              className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Live Chat</p>
                <p className="text-sm text-gray-500">Manage active chat sessions</p>
              </div>
            </Link>

            <Link
              to="/users"
              className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <UserGroupIcon className="h-5 w-5 text-purple-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Team Management</p>
                <p className="text-sm text-gray-500">Manage users and permissions</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      {orgStats?.ticketTrends?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">30-Day Trend</h3>
          <div className="text-sm text-gray-500">
            <p>Recent activity shows {orgStats.ticketTrends.length} days of data.</p>
            <p className="mt-1">
              Total tickets created: {orgStats.ticketTrends.reduce((sum, day) => sum + parseInt(day.tickets_created), 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;