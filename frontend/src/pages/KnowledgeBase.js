import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BookOpenIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const KnowledgeBase = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Mock data for testing since backend is not available
  const mockArticles = [
    {
      id: 1,
      title: 'Getting Started with SimpleDesk',
      body: 'This article explains how to get started with SimpleDesk and set up your first ticket...',
      category: 'Getting Started',
      status: 'published',
      view_count: 125,
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'How to Create Tickets',
      body: 'Learn how to create and manage support tickets effectively...',
      category: 'Features',
      status: 'published',
      view_count: 89,
      updated_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Troubleshooting Common Issues',
      body: 'Common problems and their solutions...',
      category: 'Troubleshooting',
      status: 'draft',
      view_count: 42,
      updated_at: new Date().toISOString(),
    }
  ];

  // Fetch articles (disabled for testing, using mock data)
  const { data: articles, isLoading, error } = useQuery(
    ['kb-articles', searchTerm, statusFilter, categoryFilter],
    () => {
      // Use mock data instead of API call
      console.log('Using mock articles data');
      return Promise.resolve(mockArticles);
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  // Delete article mutation
  const deleteArticleMutation = useMutation(
    (articleId) => axios.delete(`/kb/${articleId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('kb-articles');
        alert('Article deleted successfully!');
      },
      onError: (error) => {
        console.error('Error deleting article:', error);
        alert('Failed to delete article');
      }
    }
  );

  const handleDeleteArticle = (articleId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteArticleMutation.mutate(articleId);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800'
    };
    return badges[status] || badges.draft;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Getting Started': 'bg-blue-100 text-blue-800',
      'Features': 'bg-purple-100 text-purple-800',
      'Troubleshooting': 'bg-orange-100 text-orange-800',
      'Billing': 'bg-green-100 text-green-800',
      'API': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
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
        <p className="text-red-600">Error loading articles: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage help articles for your customers
          </p>
        </div>
        <button 
          onClick={() => navigate('/knowledge-base/new')}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Article
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="form-input pl-10"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Getting Started">Getting Started</option>
              <option value="Features">Features</option>
              <option value="Troubleshooting">Troubleshooting</option>
              <option value="Billing">Billing</option>
              <option value="API">API</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Total Articles</dt>
                <dd className="text-2xl font-semibold text-gray-900">{articles?.length || 0}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <EyeIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Published</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {articles?.filter(a => a.status === 'published').length || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PencilIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Drafts</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {articles?.filter(a => a.status === 'draft').length || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpenIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Total Views</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {articles?.reduce((sum, article) => sum + (article.view_count || 0), 0) || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles?.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <Link 
                        to={`/knowledge-base/${article.id}`}
                        className="text-sm font-medium text-primary-600 hover:text-primary-900"
                      >
                        {article.title}
                      </Link>
                      <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                        {article.body.substring(0, 100)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {article.category && (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(article.status)}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {article.view_count || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(article.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/knowledge-base/${article.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </Link>
                      <Link
                        to={`/knowledge-base/${article.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteArticle(article.id, article.title)}
                        className="text-red-600 hover:text-red-900"
                        disabled={deleteArticleMutation.isLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {articles?.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No articles yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first help article.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/knowledge-base/new')}
                className="btn-primary flex items-center mx-auto"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Article
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;