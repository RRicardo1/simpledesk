import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  BoltIcon,
  PlayIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const SetupDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const setupSteps = useMemo(() => [
    {
      title: "Create Your Account",
      description: "Enter your company details and create your admin account",
      duration: 60,
      icon: UserGroupIcon,
      details: "Company name, your name, email, and password - that's it!"
    },
    {
      title: "Choose Your Team Size",
      description: "Select how many agents you'll start with",
      duration: 30,
      icon: UserGroupIcon,
      details: "Start with 1-3 agents, you can always add more later"
    },
    {
      title: "Connect Your Email",
      description: "Automatically import your existing support inbox",
      duration: 45,
      icon: ChatBubbleLeftRightIcon,
      details: "Gmail, Outlook, or any IMAP email works instantly"
    },
    {
      title: "Customize Your Brand",
      description: "Add your logo and company colors",
      duration: 60,
      icon: CogIcon,
      details: "Upload logo, set colors, and customize your customer portal"
    },
    {
      title: "Launch Your Helpdesk",
      description: "You're ready to start helping customers!",
      duration: 45,
      icon: RocketLaunchIcon,
      details: "Dashboard is live, AI assistant is active, customers can submit tickets"
    }
  ], []);

  const totalDuration = setupSteps.reduce((sum, step) => sum + step.duration, 0);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          
          // Calculate which step we should be on
          let elapsedForSteps = 0;
          for (let i = 0; i < setupSteps.length; i++) {
            elapsedForSteps += setupSteps[i].duration;
            if (newTime <= elapsedForSteps) {
              setCurrentStep(i);
              break;
            }
          }
          
          // Stop when demo is complete
          if (newTime >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          
          return newTime;
        });
      }, 50); // Update every 50ms for smooth animation
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, setupSteps, totalDuration]);

  const startDemo = () => {
    setCurrentStep(0);
    setTimeElapsed(0);
    setIsPlaying(true);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setTimeElapsed(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (timeElapsed / totalDuration) * 100;

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
            No complex configuration, no weeks of setup, no technical expertise required.
          </p>
          
          {/* Demo Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!isPlaying ? (
              <button
                onClick={startDemo}
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <PlayIcon className="mr-2 h-6 w-6" />
                Start Demo
              </button>
            ) : (
              <button
                onClick={resetDemo}
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
              >
                Reset Demo
              </button>
            )}
            <div className="text-white text-lg font-semibold flex items-center">
              <ClockIcon className="mr-2 h-5 w-5" />
              {formatTime(timeElapsed)} / {formatTime(totalDuration)}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-white rounded-full h-4 shadow-inner overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-100 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Setup Progress</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
        </div>
      </div>

      {/* Demo Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {setupSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isCurrentStep = currentStep === index;
            const isCompleted = currentStep > index;

            return (
              <div
                key={index}
                className={`flex items-start p-6 rounded-lg border-2 transition-all duration-500 ${
                  isCurrentStep 
                    ? 'border-primary-500 bg-primary-50 scale-105 shadow-lg' 
                    : isCompleted 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white'
                }`}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-6 ${
                  isCurrentStep 
                    ? 'bg-primary-500 animate-pulse' 
                    : isCompleted 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                }`}>
                  {isCompleted ? (
                    <CheckCircleIcon className="h-6 w-6 text-white" />
                  ) : (
                    <StepIcon className={`h-6 w-6 ${isCurrentStep ? 'text-white' : 'text-gray-600'}`} />
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-xl font-bold ${
                      isCurrentStep ? 'text-primary-900' : isCompleted ? 'text-green-900' : 'text-gray-900'
                    }`}>
                      Step {index + 1}: {step.title}
                    </h3>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                      isCurrentStep 
                        ? 'bg-primary-200 text-primary-800' 
                        : isCompleted 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.duration}s
                    </span>
                  </div>
                  
                  <p className={`text-lg mb-2 ${
                    isCurrentStep ? 'text-primary-700' : isCompleted ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {step.description}
                  </p>
                  
                  <p className={`text-sm ${
                    isCurrentStep ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.details}
                  </p>

                  {isCurrentStep && isPlaying && (
                    <div className="mt-4">
                      <div className="bg-primary-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary-500 h-full transition-all duration-100"
                          style={{ 
                            width: `${((timeElapsed - setupSteps.slice(0, index).reduce((sum, s) => sum + s.duration, 0)) / step.duration) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo Complete */}
        {timeElapsed >= totalDuration && (
          <div className="mt-12 text-center p-8 bg-green-50 border-2 border-green-500 rounded-lg">
            <RocketLaunchIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-green-900 mb-4">
              🎉 Setup Complete in {formatTime(totalDuration)}!
            </h2>
            <p className="text-lg text-green-700 mb-6">
              Your MySimpleDesk is now ready to help customers. That's it - no complex configuration, 
              no technical expertise needed, no weeks of setup time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary btn-lg">
                Start Your Real Setup Now
              </Link>
              <button onClick={resetDemo} className="btn-secondary btn-lg">
                Watch Demo Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Why MySimpleDesk Setup Is Different
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <BoltIcon className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">5 minutes vs 2+ weeks with traditional platforms</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CogIcon className="h-8 w-8 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Zero Configuration</h3>
              <p className="text-gray-600">Pre-configured best practices, no technical setup needed</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Use</h3>
              <p className="text-gray-600">Start helping customers immediately after setup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupDemo;