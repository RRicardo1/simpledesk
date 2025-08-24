import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const Terms = () => {
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
              <Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium">About</Link>
              <Link to="/ai-test" className="text-gray-600 hover:text-gray-900 font-medium">AI Demo</Link>
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Sign In</Link>
              <Link to="/register" className="btn-primary">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <DocumentTextIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600">
              Last updated: August 21, 2025
            </p>
            <div className="mt-6 text-sm text-gray-500">
              <p>These terms are designed to be fair, straightforward, and protect both you and MySimpleDesk.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Table of Contents */}
        <div className="bg-gray-50 rounded-lg p-6 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <a href="#acceptance" className="text-primary-600 hover:text-primary-700">1. Acceptance of Terms</a>
            <a href="#description" className="text-primary-600 hover:text-primary-700">2. Service Description</a>
            <a href="#account" className="text-primary-600 hover:text-primary-700">3. Account Registration</a>
            <a href="#billing" className="text-primary-600 hover:text-primary-700">4. Billing & Payment</a>
            <a href="#usage" className="text-primary-600 hover:text-primary-700">5. Acceptable Use</a>
            <a href="#data" className="text-primary-600 hover:text-primary-700">6. Data & Privacy</a>
            <a href="#termination" className="text-primary-600 hover:text-primary-700">7. Termination</a>
            <a href="#liability" className="text-primary-600 hover:text-primary-700">8. Limitation of Liability</a>
            <a href="#changes" className="text-primary-600 hover:text-primary-700">9. Changes to Terms</a>
            <a href="#contact" className="text-primary-600 hover:text-primary-700">10. Contact Information</a>
          </div>
        </div>

        {/* 1. Acceptance of Terms */}
        <section id="acceptance" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <ShieldCheckIcon className="h-6 w-6 text-primary-600 mr-2" />
            1. Acceptance of Terms
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              Welcome to MySimpleDesk! By accessing or using our customer support platform, you agree to be bound by these Terms of Service ("Terms"). If you don't agree to these Terms, please don't use MySimpleDesk.
            </p>
            <p className="mb-4">
              These Terms apply to all users of MySimpleDesk, including customers, agents, administrators, and visitors to our website.
            </p>
          </div>
        </section>

        {/* 2. Service Description */}
        <section id="description" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <UserGroupIcon className="h-6 w-6 text-primary-600 mr-2" />
            2. Service Description
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              MySimpleDesk provides cloud-based customer support software that includes:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Ticket management and tracking system</li>
              <li>Live chat functionality with AI assistance</li>
              <li>Knowledge base creation and management</li>
              <li>Team collaboration and user management tools</li>
              <li>Customer portal for self-service</li>
              <li>Analytics and reporting features</li>
              <li>Integration capabilities with third-party services</li>
            </ul>
            <p className="mb-4">
              We strive to provide 99.9% uptime, but we cannot guarantee uninterrupted service due to maintenance, updates, or factors beyond our control.
            </p>
          </div>
        </section>

        {/* 3. Account Registration */}
        <section id="account" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Account Registration</h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              To use MySimpleDesk, you must create an account by providing accurate, complete, and current information. You are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Keeping your account information up to date</li>
            </ul>
            <p className="mb-4">
              You must be at least 18 years old to create an account. If you're creating an account on behalf of an organization, you must have authority to bind that organization to these Terms.
            </p>
          </div>
        </section>

        {/* 4. Billing & Payment */}
        <section id="billing" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <CreditCardIcon className="h-6 w-6 text-primary-600 mr-2" />
            4. Billing & Payment
          </h2>
          <div className="prose prose-gray max-w-none">
            <h3 className="text-lg font-semibold mb-3">Free Trial</h3>
            <p className="mb-4">
              We offer a 14-day free trial with full access to all features. No credit card required. At the end of your trial, you must choose a paid plan to continue using the service.
            </p>
            
            <h3 className="text-lg font-semibold mb-3">Subscription Plans</h3>
            <p className="mb-4">Our pricing plans are:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Starter:</strong> $29/month - Up to 3 agents, 1,000 tickets/month</li>
              <li><strong>Growth:</strong> $59/month - Up to 10 agents, 5,000 tickets/month</li>
              <li><strong>Business:</strong> $99/month - Unlimited agents and tickets</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Payment Terms</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>All fees are billed monthly in advance</li>
              <li>Payment is due immediately upon billing</li>
              <li>We accept major credit cards and debit cards</li>
              <li>All prices are in USD and exclude applicable taxes</li>
              <li>Failed payments may result in account suspension</li>
              <li>Refunds are provided on a case-by-case basis within 30 days</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Plan Changes</h3>
            <p className="mb-4">
              You can upgrade or downgrade your plan at any time. Upgrades take effect immediately with prorated billing. Downgrades take effect at the next billing cycle.
            </p>
          </div>
        </section>

        {/* 5. Acceptable Use */}
        <section id="usage" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Acceptable Use Policy</h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">You agree to use MySimpleDesk only for lawful purposes. You may not:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon intellectual property rights</li>
              <li>Transmit harmful, offensive, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt our service or servers</li>
              <li>Use our service to send spam or unsolicited communications</li>
              <li>Upload malware, viruses, or malicious code</li>
              <li>Reverse engineer or attempt to extract our source code</li>
              <li>Resell or redistribute our service without permission</li>
            </ul>
            <p className="mb-4">
              Violation of this policy may result in account suspension or termination.
            </p>
          </div>
        </section>

        {/* 6. Data & Privacy */}
        <section id="data" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Data & Privacy</h2>
          <div className="prose prose-gray max-w-none">
            <h3 className="text-lg font-semibold mb-3">Your Data</h3>
            <p className="mb-4">
              You retain ownership of all data you submit to MySimpleDesk. We will not access, use, or disclose your data except as necessary to provide the service or as required by law.
            </p>

            <h3 className="text-lg font-semibold mb-3">Data Security</h3>
            <p className="mb-4">
              We implement industry-standard security measures to protect your data, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>SSL/TLS encryption for data in transit</li>
              <li>Encryption for sensitive data at rest</li>
              <li>Regular security audits and monitoring</li>
              <li>Access controls and authentication systems</li>
              <li>Employee background checks and training</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Data Processing</h3>
            <p className="mb-4">
              By using MySimpleDesk, you authorize us to process your data to provide the service, including creating backups, analyzing usage for improvements, and providing customer support.
            </p>

            <p className="mb-4">
              For detailed information about how we handle your data, please review our <Link to="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link>.
            </p>
          </div>
        </section>

        {/* 7. Termination */}
        <section id="termination" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Account Termination</h2>
          <div className="prose prose-gray max-w-none">
            <h3 className="text-lg font-semibold mb-3">Termination by You</h3>
            <p className="mb-4">
              You may terminate your account at any time by contacting our support team or through your account settings. Upon termination:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Your access to the service will end immediately</li>
              <li>We will provide a final invoice for any outstanding charges</li>
              <li>You will have 30 days to export your data</li>
              <li>After 30 days, your data may be permanently deleted</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Termination by MySimpleDesk</h3>
            <p className="mb-4">
              We may terminate your account if you:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Breach these Terms of Service</li>
              <li>Fail to pay outstanding fees after 30 days</li>
              <li>Use the service in a way that harms MySimpleDesk or other users</li>
              <li>Engage in fraudulent or illegal activities</li>
            </ul>

            <p className="mb-4">
              We will provide reasonable notice before termination unless immediate action is required for security or legal reasons.
            </p>
          </div>
        </section>

        {/* 8. Limitation of Liability */}
        <section id="liability" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Limitation of Liability</h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              MySimpleDesk is provided "as is" without warranties of any kind. To the maximum extent permitted by law:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>We disclaim all warranties, express or implied</li>
              <li>We are not liable for any indirect, incidental, or consequential damages</li>
              <li>Our total liability will not exceed the amount you paid us in the 12 months preceding the claim</li>
              <li>We are not responsible for third-party integrations or external services</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Some jurisdictions do not allow the exclusion or limitation of certain warranties or liabilities. In such cases, these limitations may not apply to you.
              </p>
            </div>
          </div>
        </section>

        {/* 9. Changes to Terms */}
        <section id="changes" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Changes to These Terms</h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              We may update these Terms from time to time. When we make changes:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>We will notify you via email and in-app notification</li>
              <li>We will update the "Last updated" date at the top of this page</li>
              <li>Changes will take effect 30 days after notification</li>
              <li>Continued use of the service constitutes acceptance of new terms</li>
            </ul>

            <p className="mb-4">
              If you disagree with changes to these Terms, you may terminate your account before they take effect.
            </p>
          </div>
        </section>

        {/* 10. Contact Information */}
        <section id="contact" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Contact Information</h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <ul className="space-y-2 text-gray-700">
                <li><strong>Email:</strong> simpledeskhelp@gmail.com</li>
                <li><strong>Support:</strong> simpledeskhelp@gmail.com</li>
                <li><strong>Website:</strong> <Link to="/" className="text-primary-600 hover:text-primary-700">www.mysimpledesk.com</Link></li>
                <li><strong>Address:</strong> MySimpleDesk LLC, Legal Department</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Additional Legal Information */}
        <div className="border-t border-gray-200 pt-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help Understanding These Terms?</h3>
            <p className="text-blue-800 mb-4">
              We believe in transparency and want you to understand your rights and obligations. If you have questions about any part of these Terms, please don't hesitate to contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:simpledeskhelp@gmail.com" className="btn-primary">Contact Support</a>
              <Link to="/privacy" className="btn-secondary">View Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded text-white font-bold text-sm mr-3">
                  MSD
                </div>
                <span className="text-xl font-bold">MySimpleDesk</span>
              </div>
              <p className="text-gray-300 max-w-md">
                The fastest help desk setup on the planet. Professional customer support software built for small businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/#features" className="hover:text-white">Features</a></li>
                <li><a href="/#pricing" className="hover:text-white">Pricing</a></li>
                <li><Link to="/ai-test" className="hover:text-white">AI Demo</Link></li>
                <li><Link to="/" className="hover:text-white">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><a href="mailto:simpledeskhelp@gmail.com" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MySimpleDesk LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Terms;