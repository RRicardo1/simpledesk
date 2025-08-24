import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  EyeSlashIcon,
  LockClosedIcon,
  ServerIcon
} from '@heroicons/react/24/outline';

const Privacy = () => {
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
            <EyeSlashIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">
              Last updated: August 21, 2025
            </p>
            <div className="mt-6 text-sm text-gray-500">
              <p>Your privacy is important to us. This policy explains how we collect, use, and protect your information.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Quick Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Privacy at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="flex items-start">
              <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>We only collect data necessary to provide our service</span>
            </div>
            <div className="flex items-start">
              <LockClosedIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>All data is encrypted and securely stored</span>
            </div>
            <div className="flex items-start">
              <EyeSlashIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>We never sell or share your personal data</span>
            </div>
            <div className="flex items-start">
              <ServerIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>You own and control your data</span>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-50 rounded-lg p-6 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <a href="#information" className="text-primary-600 hover:text-primary-700">1. Information We Collect</a>
            <a href="#use" className="text-primary-600 hover:text-primary-700">2. How We Use Information</a>
            <a href="#sharing" className="text-primary-600 hover:text-primary-700">3. Information Sharing</a>
            <a href="#security" className="text-primary-600 hover:text-primary-700">4. Data Security</a>
            <a href="#retention" className="text-primary-600 hover:text-primary-700">5. Data Retention</a>
            <a href="#rights" className="text-primary-600 hover:text-primary-700">6. Your Rights</a>
            <a href="#cookies" className="text-primary-600 hover:text-primary-700">7. Cookies & Tracking</a>
            <a href="#international" className="text-primary-600 hover:text-primary-700">8. International Transfers</a>
            <a href="#children" className="text-primary-600 hover:text-primary-700">9. Children's Privacy</a>
            <a href="#changes" className="text-primary-600 hover:text-primary-700">10. Policy Changes</a>
            <a href="#contact" className="text-primary-600 hover:text-primary-700">11. Contact Us</a>
          </div>
        </div>

        {/* 1. Information We Collect */}
        <section id="information" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Information We Collect</h2>
          <div className="prose prose-gray max-w-none">
            <h3 className="text-lg font-semibold mb-3">Account Information</h3>
            <p className="mb-4">When you create an account, we collect:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Name and email address</li>
              <li>Organization name and details</li>
              <li>Password (encrypted)</li>
              <li>Phone number (optional)</li>
              <li>Profile picture (optional)</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Service Usage Data</h3>
            <p className="mb-4">As you use MySimpleDesk, we collect:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Support tickets and conversations</li>
              <li>Knowledge base articles you create</li>
              <li>Chat messages and interactions</li>
              <li>User settings and preferences</li>
              <li>File uploads and attachments</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Technical Information</h3>
            <p className="mb-4">We automatically collect:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Device information and operating system</li>
              <li>Log files and usage analytics</li>
              <li>Performance and error data</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
            <p className="mb-4">
              We use Stripe for payment processing. We store your billing address and payment method details (last 4 digits of card). Stripe handles all sensitive payment information according to PCI DSS standards.
            </p>
          </div>
        </section>

        {/* 2. How We Use Information */}
        <section id="use" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2. How We Use Your Information</h2>
          <div className="prose prose-gray max-w-none">
            <h3 className="text-lg font-semibold mb-3">Service Provision</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide and maintain MySimpleDesk services</li>
              <li>Process and respond to support requests</li>
              <li>Facilitate communication between you and your customers</li>
              <li>Manage your account and billing</li>
              <li>Send service-related notifications</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Service Improvement</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Analyze usage patterns to improve features</li>
              <li>Debug and resolve technical issues</li>
              <li>Develop new features and functionality</li>
              <li>Optimize performance and user experience</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Communication</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Send account and billing notifications</li>
              <li>Provide customer support</li>
              <li>Share product updates and new features</li>
              <li>Send security alerts and service announcements</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Legal and Security</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Comply with legal obligations</li>
              <li>Protect against fraud and abuse</li>
              <li>Enforce our Terms of Service</li>
              <li>Respond to legal requests</li>
            </ul>
          </div>
        </section>

        {/* 3. Information Sharing */}
        <section id="sharing" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Information Sharing</h2>
          <div className="prose prose-gray max-w-none">
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <p className="text-green-800 font-medium">
                <strong>We never sell your personal data.</strong> We only share information in the limited circumstances described below.
              </p>
            </div>

            <h3 className="text-lg font-semibold mb-3">Service Providers</h3>
            <p className="mb-4">We share information with trusted third parties who help us provide our service:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Stripe:</strong> Payment processing and billing</li>
              <li><strong>Cloud hosting providers:</strong> Secure data storage and infrastructure</li>
              <li><strong>Email service providers:</strong> Transactional emails and notifications</li>
              <li><strong>Analytics providers:</strong> Usage analytics and error monitoring</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Legal Requirements</h3>
            <p className="mb-4">We may disclose information if required by law or in response to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Valid legal process (subpoenas, court orders)</li>
              <li>Government requests for national security</li>
              <li>Investigations of potential violations of our terms</li>
              <li>Protection of rights, property, or safety</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Business Transfers</h3>
            <p className="mb-4">
              If MySimpleDesk is involved in a merger, acquisition, or sale, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control.
            </p>
          </div>
        </section>

        {/* 4. Data Security */}
        <section id="security" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <LockClosedIcon className="h-6 w-6 text-primary-600 mr-2" />
            4. Data Security
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">We implement comprehensive security measures to protect your data:</p>

            <h3 className="text-lg font-semibold mb-3">Encryption</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>All data transmitted is encrypted using TLS 1.3</li>
              <li>Sensitive data at rest is encrypted using AES-256</li>
              <li>Database connections are encrypted and authenticated</li>
              <li>Passwords are hashed using bcrypt with salt</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Access Controls</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Multi-factor authentication for administrative access</li>
              <li>Role-based access controls for team members</li>
              <li>Regular access reviews and deprovisioning</li>
              <li>Secure authentication tokens with expiration</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Infrastructure Security</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Servers hosted in SOC 2 compliant data centers</li>
              <li>Regular security patches and updates</li>
              <li>Network monitoring and intrusion detection</li>
              <li>Automated backups with encryption</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Monitoring & Response</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>24/7 security monitoring and alerting</li>
              <li>Regular vulnerability assessments</li>
              <li>Incident response procedures</li>
              <li>Employee security training and background checks</li>
            </ul>
          </div>
        </section>

        {/* 5. Data Retention */}
        <section id="retention" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Data Retention</h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">We retain your information for different periods depending on the type of data:</p>

            <h3 className="text-lg font-semibold mb-3">Active Accounts</h3>
            <p className="mb-4">
              While your account is active, we retain all your data to provide the service. You can delete individual items (tickets, messages, articles) at any time through your account.
            </p>

            <h3 className="text-lg font-semibold mb-3">Canceled Accounts</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>30 days:</strong> Full data access for export</li>
              <li><strong>90 days:</strong> Limited data retention for reactivation</li>
              <li><strong>After 90 days:</strong> Complete data deletion</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Legal Requirements</h3>
            <p className="mb-4">
              We may retain certain data longer if required by law, such as tax records (7 years) or data subject to legal holds.
            </p>

            <h3 className="text-lg font-semibold mb-3">Anonymized Data</h3>
            <p className="mb-4">
              We may retain anonymized usage statistics and analytics data indefinitely to improve our service, but this data cannot be linked back to you.
            </p>
          </div>
        </section>

        {/* 6. Your Rights */}
        <section id="rights" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Your Privacy Rights</h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">You have several rights regarding your personal data:</p>

            <h3 className="text-lg font-semibold mb-3">Access and Portability</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>View all data we have about you</li>
              <li>Export your data in machine-readable formats</li>
              <li>Receive copies of your data for transfer to other services</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Correction and Update</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Update your account information at any time</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Modify your communication preferences</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Deletion and Restriction</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Delete specific data items (tickets, articles, files)</li>
              <li>Request complete account and data deletion</li>
              <li>Restrict processing for specific purposes</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Objection and Withdrawal</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Object to data processing for marketing purposes</li>
              <li>Withdraw consent for optional data collection</li>
              <li>Opt out of non-essential communications</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-blue-800 text-sm">
                <strong>How to Exercise Your Rights:</strong> Contact us at privacy@mysimpledesk.com or through your account settings. We will respond within 30 days.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Cookies & Tracking */}
        <section id="cookies" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Cookies & Tracking Technologies</h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">We use cookies and similar technologies to improve your experience:</p>

            <h3 className="text-lg font-semibold mb-3">Essential Cookies</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Authentication and session management</li>
              <li>Security and fraud prevention</li>
              <li>Load balancing and performance</li>
              <li>User preferences and settings</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Analytics Cookies</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Usage patterns and feature adoption</li>
              <li>Performance monitoring and error tracking</li>
              <li>A/B testing for service improvements</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">Managing Cookies</h3>
            <p className="mb-4">
              You can control cookies through your browser settings. However, disabling essential cookies may affect service functionality.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> We do not use cookies for advertising or tracking across other websites.
              </p>
            </div>
          </div>
        </section>

        {/* 8. International Transfers */}
        <section id="international" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">8. International Data Transfers</h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              MySimpleDesk operates globally, and your data may be processed in countries other than where you reside. We ensure adequate protection through:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
              <li>Adequacy decisions for countries with sufficient protection</li>
              <li>Binding Corporate Rules for intra-group transfers</li>
              <li>Your explicit consent where required</li>
            </ul>

            <p className="mb-4">
              We primarily store and process data in data centers located in the United States and European Union, all operated by providers with appropriate security certifications.
            </p>
          </div>
        </section>

        {/* 9. Children's Privacy */}
        <section id="children" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Children's Privacy</h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              MySimpleDesk is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16.
            </p>
            <p className="mb-4">
              If we become aware that we have collected personal information from a child under 16, we will take steps to delete such information promptly.
            </p>
            <p className="mb-4">
              If you believe we may have collected information from a child under 16, please contact us at privacy@mysimpledesk.com.
            </p>
          </div>
        </section>

        {/* 10. Changes to This Policy */}
        <section id="changes" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Changes to This Privacy Policy</h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              We may update this Privacy Policy from time to time. When we make significant changes:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>We will notify you by email and through in-app notifications</li>
              <li>We will update the "Last updated" date at the top of this policy</li>
              <li>We will provide a summary of key changes</li>
              <li>For material changes, we will provide 30 days' notice</li>
            </ul>

            <p className="mb-4">
              Your continued use of MySimpleDesk after changes take effect constitutes acceptance of the updated policy.
            </p>
          </div>
        </section>

        {/* 11. Contact Us */}
        <section id="contact" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Contact Us</h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <ul className="space-y-2 text-gray-700">
                <li><strong>Privacy Team:</strong> privacy@mysimpledesk.com</li>
                <li><strong>General Support:</strong> simpledeskhelp@gmail.com</li>
                <li><strong>Data Protection Officer:</strong> dpo@mysimpledesk.com</li>
                <li><strong>Website:</strong> <Link to="/" className="text-primary-600 hover:text-primary-700">www.mysimpledesk.com</Link></li>
                <li><strong>Mailing Address:</strong> MySimpleDesk LLC, Privacy Department</li>
              </ul>
            </div>

            <p className="mt-4">
              We are committed to resolving any privacy concerns promptly and transparently. We will respond to your inquiry within 30 days.
            </p>
          </div>
        </section>

        {/* GDPR & CCPA Information */}
        <div className="border-t border-gray-200 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">🇪🇺 GDPR Rights (EU Residents)</h3>
              <p className="text-blue-800 text-sm mb-4">
                Under the General Data Protection Regulation, you have enhanced rights including data portability, the right to be forgotten, and the right to object to processing.
              </p>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Exercise Your GDPR Rights →
              </Link>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">🇺🇸 CCPA Rights (CA Residents)</h3>
              <p className="text-purple-800 text-sm mb-4">
                Under the California Consumer Privacy Act, you have rights to know, delete, and opt-out of the sale of personal information (which we don't sell).
              </p>
              <Link to="/login" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                Exercise Your CCPA Rights →
              </Link>
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
                We respect your privacy and are committed to protecting your personal data with industry-leading security measures.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Privacy</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="/login" className="hover:text-white">Data Rights</Link></li>
                <li><Link to="/login" className="hover:text-white">Cookie Settings</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><a href="mailto:simpledeskhelp@gmail.com" className="hover:text-white">Contact Support</a></li>
                <li><Link to="/#features" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/ai-test" className="hover:text-white">AI Assistant</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MySimpleDesk LLC. Your privacy is our priority.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;