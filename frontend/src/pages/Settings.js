import React from 'react';

const Settings = () => {
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
              <button type="button" className="bg-primary-50 text-primary-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left">
                General
              </button>
              <button type="button" className="text-gray-900 hover:bg-gray-50 group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left">
                Email Settings
              </button>
              <button type="button" className="text-gray-900 hover:bg-gray-50 group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left">
                Billing
              </button>
              <button type="button" className="text-gray-900 hover:bg-gray-50 group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left">
                Integrations
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="text-center py-12 text-gray-500">
              <h3 className="text-lg font-medium text-gray-900">Settings Panel</h3>
              <p className="mt-1">This component will show organization settings, billing info, and integrations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;