import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayIcon, BoltIcon } from '@heroicons/react/24/outline';

const SetupDemoSimple = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded text-white font-bold text-sm mr-3">
                  MSD
                </div>
                <span className="text-2xl font-bold text-gray-900">MySimpleDesk</span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">← Back to Home</Link>
              <Link to="/register" className="btn-primary">Start Your Setup</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <BoltIcon className="h-12 w-12 text-white mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              5-Minute Setup Demo
            </h1>
          </div>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
            Watch how MySimpleDesk gets you from zero to helping customers in under 5 minutes.
          </p>
          
          {/* Demo Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!isPlaying ? (
              <button
                onClick={() => setIsPlaying(true)}
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <PlayIcon className="mr-2 h-6 w-6" />
                Start Demo
              </button>
            ) : (
              <button
                onClick={() => setIsPlaying(false)}
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
              >
                Reset Demo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Simple Demo Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {isPlaying ? "Demo is Running!" : "Click Start Demo Above"}
          </h2>
          <p className="text-lg text-gray-600">
            This is a simplified demo page to test functionality.
          </p>
          
          {isPlaying && (
            <div className="mt-8 p-8 bg-green-50 border-2 border-green-500 rounded-lg">
              <h3 className="text-2xl font-bold text-green-900 mb-4">
                🎉 Demo Started Successfully!
              </h3>
              <p className="text-green-700">
                The interactive demo is working. The full version has 5 animated steps.
              </p>
              <div className="mt-4">
                <Link to="/register" className="btn-primary">
                  Start Your Real Setup Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupDemoSimple;