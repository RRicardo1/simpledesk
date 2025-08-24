import React from 'react';
import { Link } from 'react-router-dom';
import {
  BoltIcon,
  HeartIcon,
  UserGroupIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const About = () => {
  return (
    <div className="bg-white">
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
              <a href="/#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
              <a href="/#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
              <Link to="/about" className="text-primary-600 hover:text-primary-700 font-medium">About</Link>
              <Link to="/ai-test" className="text-gray-600 hover:text-gray-900 font-medium">AI Demo</Link>
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Sign In</Link>
              <Link to="/register" className="btn-primary">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About MySimpleDesk
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            We believe customer support shouldn't take weeks to set up. That's why we built 
            the fastest help desk platform on the planet - so you can focus on what matters most: 
            helping your customers.
          </p>
        </div>
      </div>

      {/* Our Mission */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              To eliminate the complexity nightmare that prevents small businesses from providing 
              excellent customer support. We're on a mission to democratize professional help desk 
              software, making it accessible, affordable, and lightning-fast to deploy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BoltIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Speed First</h3>
              <p className="text-gray-600">
                5-minute setup guaranteed. While competitors take weeks to configure, 
                you'll be helping customers today.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Small Business Focus</h3>
              <p className="text-gray-600">
                Built specifically for teams of 1-15 people. No enterprise bloat, 
                just the features you actually need.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">50% Cost Savings</h3>
              <p className="text-gray-600">
                All-inclusive pricing with no per-agent fees. Same powerful features 
                at half the cost of traditional platforms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  MySimpleDesk was born out of frustration. As small business owners ourselves, 
                  we experienced firsthand the pain of trying to set up professional customer 
                  support systems.
                </p>
                <p>
                  Traditional help desk platforms required weeks of configuration, expensive 
                  consultants, and complex integrations. Meanwhile, our customers were waiting 
                  for support, and our reputation was on the line.
                </p>
                <p>
                  We knew there had to be a better way. So we built MySimpleDesk with one 
                  simple principle: <strong>Customer support should help customers, not create 
                  headaches for business owners.</strong>
                </p>
                <p>
                  Today, thousands of small businesses use MySimpleDesk to provide world-class 
                  customer support without the complexity or cost of traditional solutions.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center mb-6">
                <SparklesIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">Why Choose MySimpleDesk?</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">5-Minute Setup:</span>
                    <span className="text-gray-600 ml-1">Get helping customers faster than ordering coffee</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">Built-in AI Assistant:</span>
                    <span className="text-gray-600 ml-1">$0/month AI that works offline and knows your business</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">Modern Technology:</span>
                    <span className="text-gray-600 ml-1">React/Node.js stack built for speed and reliability</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">Fair Pricing:</span>
                    <span className="text-gray-600 ml-1">No per-agent fees, no surprise costs, no vendor lock-in</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Making Customer Support Simple Since 2024
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold text-primary-100 mb-2">5 min</div>
              <div className="text-sm text-primary-200">Average Setup Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-100 mb-2">50%</div>
              <div className="text-sm text-primary-200">Cost Savings vs Competitors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-100 mb-2">1000+</div>
              <div className="text-sm text-primary-200">Happy Businesses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-100 mb-2">24/7</div>
              <div className="text-sm text-primary-200">AI Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do, from product development to customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <ClockIcon className="h-8 w-8 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Respect Your Time</h3>
              <p className="text-gray-600">
                Your time is valuable. We won't waste it with complex setups, hidden features, 
                or confusing interfaces. Simple, fast, effective.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <UserGroupIcon className="h-8 w-8 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Small Business First</h3>
              <p className="text-gray-600">
                We're small business owners too. We understand your challenges and build 
                solutions that work for real businesses, not just enterprise budgets.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <HeartIcon className="h-8 w-8 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Actually Care</h3>
              <p className="text-gray-600">
                We genuinely want you to succeed. Every feature, every update, every support 
                interaction is designed to make your business better.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <BoltIcon className="h-8 w-8 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Speed Obsessed</h3>
              <p className="text-gray-600">
                Fast setup, fast responses, fast results. We're obsessed with eliminating 
                friction so you can focus on what matters most.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <CheckCircleIcon className="h-8 w-8 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">No BS Pricing</h3>
              <p className="text-gray-600">
                Transparent, fair pricing with no hidden fees, no per-agent charges, 
                and no vendor lock-in. What you see is what you pay.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <ChartBarIcon className="h-8 w-8 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Continuous Improvement</h3>
              <p className="text-gray-600">
                We're never done. Every day we're improving, adding features, and making 
                MySimpleDesk better based on your feedback.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Skip the Setup Nightmare?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of small businesses who chose speed and simplicity over complexity.
            Get helping customers in 5 minutes, not 5 weeks.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary btn-lg">
              Start Free Trial - 5 Minutes Setup
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/ai-test" className="btn-secondary btn-lg bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
              Try Our AI Assistant
            </Link>
          </div>
          
          <p className="text-sm text-gray-400 mt-6">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded text-white font-bold text-sm mr-3">
                  MSD
                </div>
                <span className="text-xl font-bold text-gray-900">MySimpleDesk</span>
              </div>
              <p className="text-gray-600 max-w-md">
                The fastest help desk setup on the planet. Skip the complex setup nightmare 
                and start helping customers in 5 minutes.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="/#features" className="text-gray-600 hover:text-gray-900">Features</a></li>
                <li><a href="/#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a></li>
                <li><Link to="/ai-test" className="text-gray-600 hover:text-gray-900">AI Demo</Link></li>
                <li><Link to="/" className="text-gray-600 hover:text-gray-900">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link to="/" className="text-gray-600 hover:text-gray-900">Blog</Link></li>
                <li><Link to="/register" className="text-gray-600 hover:text-gray-900">Careers</Link></li>
                <li><a href="mailto:simpledeskhelp@gmail.com" className="text-gray-600 hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2025 MySimpleDesk. All rights reserved. Built for small businesses who value their time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;