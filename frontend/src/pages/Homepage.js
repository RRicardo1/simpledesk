import React from 'react';
import { Link } from 'react-router-dom';
import {
  BoltIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayIcon,
  TicketIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const Homepage = () => {
  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded text-white font-bold text-sm mr-3">
                MSD
              </div>
              <span className="text-2xl font-bold text-gray-900">MySimpleDesk</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
              <Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium">About</Link>
              <Link to="/ai-test" className="text-gray-600 hover:text-gray-900 font-medium">AI Demo</Link>
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Sign In</Link>
              <Link to="/register" className="btn-primary">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-full mb-6">
              ⏱️ Setup in 5 minutes or less
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Skip the 2-week
              <span className="block text-primary-600">complex setup nightmare</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              While your competitors spend weeks configuring complex systems, you'll be helping customers in 5 minutes. 
              The fastest helpdesk setup on the planet - guaranteed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                Get set up in 5 minutes
              </Link>
              <Link 
                to="/demo"
                className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center"
              >
                <PlayIcon className="mr-2 h-5 w-5" />
                Watch 5-min setup
              </Link>
            </div>

            <div className="text-sm text-gray-500">
              ⚡ 5-minute setup guaranteed • No credit card required • 14-day free trial
            </div>
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute top-20 left-10 bg-white rounded-lg shadow-lg p-4 hidden lg:block">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <BoltIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">4.2 min</div>
              <div className="text-xs text-gray-500">Average setup time</div>
            </div>
          </div>
        </div>

        <div className="absolute top-32 right-10 bg-white rounded-lg shadow-lg p-4 hidden lg:block">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <CheckCircleIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">VS 2 weeks</div>
              <div className="text-xs text-gray-500">Traditional platforms</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI-powered resolution platform section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
              <SparklesIcon className="h-4 w-4 mr-2" />
              AI-powered resolution platform
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              A fully connected team of AI and human agents,
              <span className="block">built for true resolutions</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether AI handles it instantly or copilot assists a human, every issue is resolved. 
              Start resolving requests automatically with MySimpleDesk AI from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="bg-primary-100 rounded-lg p-3 mr-4">
                    <SparklesIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">AI agents</h3>
                    <p className="text-gray-600">Resolve 80%+ of requests instantly</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Instant, personalized resolutions</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Learn from your knowledge base</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Seamless handoff to humans</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 rounded-lg p-3 mr-4">
                    <UserGroupIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Human agents</h3>
                    <p className="text-gray-600">Enhanced with AI copilot</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">20% productivity increase</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Proactive assistance</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">Complex issue expertise</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proven Results section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Proven Results From Day One
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join businesses that chose speed over complexity and are already helping customers faster than ever.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">5 min</div>
              <div className="text-sm font-semibold text-green-800">Average Setup Time</div>
              <div className="text-xs text-green-600 mt-1">vs 2+ weeks traditional</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">80%</div>
              <div className="text-sm font-semibold text-blue-800">Issues Resolved by AI</div>
              <div className="text-xs text-blue-600 mt-1">Instant customer satisfaction</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">50%</div>
              <div className="text-sm font-semibold text-purple-800">Lower Costs</div>
              <div className="text-xs text-purple-600 mt-1">No per-agent fees</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-sm font-semibold text-orange-800">AI Support Active</div>
              <div className="text-xs text-orange-600 mt-1">Never miss a customer</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="bg-white py-24" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete service across every channel
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From email and messaging to live chat — connect with customers however they want to reach you. 
              Make customers happy via email, live chat, social media, and instant messaging.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Messaging & Live Chat */}
            <div className="text-center">
              <div className="bg-primary-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <ChatBubbleLeftRightIcon className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Messaging & live chat</h3>
              <p className="text-gray-600 mb-6">
                Meet customers where they are with messaging across web, mobile, and social channels. 
                Connect conversations across channels for a seamless experience.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">WhatsApp, Instagram, and web messaging</span>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Real-time visitor monitoring</span>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Proactive messaging</span>
                </div>
              </div>
            </div>

            {/* Ticketing System */}
            <div className="text-center">
              <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <TicketIcon className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ticketing system</h3>
              <p className="text-gray-600 mb-6">
                Organize, prioritize, and track all customer support requests in one place. 
                Convert any customer conversation into a ticket with context and history.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Automatic ticket routing</span>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">SLA tracking and alerts</span>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Custom fields and workflows</span>
                </div>
              </div>
            </div>

            {/* Knowledge Base */}
            <div className="text-center">
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <BookOpenIcon className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Knowledge base</h3>
              <p className="text-gray-600 mb-6">
                Create a searchable library of articles, FAQs, and resources. 
                Help customers find answers instantly and reduce support volume.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">AI-powered search</span>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Multi-language support</span>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Community forums</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why MySimpleDesk Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Speed, Not Complexity
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              While your competitors struggle with complex setups, you'll be serving customers. 
              Same power, 10x faster implementation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
              <div className="text-3xl font-bold text-green-600 mb-2">5 min</div>
              <div className="text-gray-600 text-sm font-semibold">Setup time</div>
              <div className="text-xs text-gray-400 mt-1">vs traditional 2 weeks</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
              <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-gray-600 text-sm font-semibold">Configuration needed</div>
              <div className="text-xs text-gray-400 mt-1">Pre-configured best practices</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-purple-500">
              <div className="text-3xl font-bold text-purple-600 mb-2">50%</div>
              <div className="text-gray-600 text-sm font-semibold">Lower cost</div>
              <div className="text-xs text-gray-400 mt-1">No per-agent fees</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-orange-500">
              <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-gray-600 text-sm font-semibold">Customer success</div>
              <div className="text-xs text-gray-400 mt-1">Or your money back</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white py-24" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start free and scale as you grow. No hidden fees, no setup costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="card border-2 border-gray-200 hover:border-primary-300 transition-colors">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600">/month per agent</span>
                </div>
                <p className="text-gray-600 mb-6">Perfect for small teams getting started</p>
                
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm">Up to 3 agents</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm">1,000 tickets/month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm">AI chat support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm">Email integration</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm">Knowledge base</span>
                  </li>
                </ul>
                
                <Link to="/register?plan=starter" className="btn-secondary w-full block text-center">Start Free Trial</Link>
              </div>
            </div>

            {/* Growth Plan */}
            <div className="card border-2 border-primary-500 relative hover:border-primary-600 transition-colors">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-primary-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Growth</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$59</span>
                  <span className="text-gray-600">/month per agent</span>
                </div>
                <p className="text-gray-600 mb-6">Ideal for growing businesses</p>
                
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm">Up to 10 agents</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm">5,000 tickets/month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm">Advanced AI automation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm">Custom workflows</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm">Advanced reporting</span>
                  </li>
                </ul>
                
                <Link to="/register?plan=growth" className="btn-primary w-full block text-center">Start Free Trial</Link>
              </div>
            </div>

            {/* Business Plan */}
            <div className="card border-2 border-gray-200 hover:border-primary-300 transition-colors">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Business</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-600">/month per agent</span>
                </div>
                <p className="text-gray-600 mb-6">For teams that need it all</p>
                
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm">Unlimited agents</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm">Unlimited tickets</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm">Custom integrations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm">White-label options</span>
                  </li>
                </ul>
                
                <Link to="/register?plan=business" className="btn-secondary w-full block text-center">Start Free Trial</Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">All plans include 14-day free trial • No credit card required</p>
            <p className="text-sm text-gray-500">
              Save 50% compared to traditional platforms
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why waste weeks on setup when you could be helping customers today?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the businesses who chose speed over complexity. Set up your helpdesk in 5 minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary btn-lg">
              Get Set Up in 5 Minutes
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/demo"
              className="btn-secondary btn-lg bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            >
              Watch Speed Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded text-white font-bold text-sm mr-3">
                  MSD
                </div>
                <span className="text-xl font-bold text-gray-900">MySimpleDesk</span>
              </div>
              <p className="text-gray-600 max-w-md">
                The complete AI-powered customer service platform that helps businesses 
                deliver exceptional support experiences at 50% the cost of traditional solutions.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 hover:text-gray-900">Features</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a></li>
                <li><Link to="/register" className="text-gray-600 hover:text-gray-900">Integrations</Link></li>
                <li><Link to="/register" className="text-gray-600 hover:text-gray-900">Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link to="/about" className="text-gray-600 hover:text-gray-900">Blog</Link></li>
                <li><Link to="/ai-test" className="text-gray-600 hover:text-gray-900">AI Support</Link></li>
                <li><a href="mailto:simpledeskhelp@gmail.com" className="text-gray-600 hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
                <li><Link to="/login" className="text-gray-600 hover:text-gray-900">Security</Link></li>
                <li><Link to="/login" className="text-gray-600 hover:text-gray-900">Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p className="mb-2">&copy; 2025 MySimpleDesk. All rights reserved.</p>
            <p className="text-sm">
              By using MySimpleDesk, you agree to our{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-700">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;