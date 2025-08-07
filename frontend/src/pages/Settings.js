import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CogIcon, 
  EnvelopeIcon, 
  CreditCardIcon, 
  PuzzlePieceIcon 
} from '@heroicons/react/24/outline';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const navigate = useNavigate();

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'email', name: 'Email Settings', icon: EnvelopeIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon, href: '/billing' },
    { id: 'integrations', name: 'Integrations', icon: PuzzlePieceIcon },
  ];

  const handleTabClick = (tab) => {
    if (tab.href) {
      navigate(tab.href);
    } else {
      setActiveTab(tab.id);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
            <p className="text-gray-600">Organization-wide settings and preferences.</p>
          </div>
        );
      case 'email':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Email Settings</h3>
            <p className="text-gray-600">Configure email notifications and templates.</p>
          </div>
        );
      case 'integrations':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Integrations</h3>
            <p className="text-gray-600">Connect with third-party services and tools.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your organization settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {tab.name}
                  {tab.href && (
                    <span className="ml-auto text-xs text-gray-400">→</span>
                  )}
                </button>
              ))}
            </nav>
            
            {/* Quick access to billing */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Access</h4>
              <Link
                to="/billing"
                className="inline-flex items-center text-sm text-blue-700 hover:text-blue-900"
              >
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Billing & Subscriptions
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;