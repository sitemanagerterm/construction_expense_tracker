import React from "react";
import MarketingLayout from "@/components/MarketingLayout";

export default function PrivacyPage() {
  return (
    <MarketingLayout title="Privacy Policy" subtitle="Your Data Matters. MySiteBook respects your privacy.">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-200 prose prose-lg max-w-none text-gray-700">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-8">Last Updated: July 26, 2026</p>
          
          <p className="font-medium text-xl">Welcome to MySiteBook. Your privacy is important to us.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Information We Collect</h2>
          <p>We may collect:</p>
          <ul className="space-y-2 mt-2">
            <li>Name</li>
            <li>Email Address</li>
            <li>Mobile Number</li>
            <li>Company Name</li>
            <li>Project Information</li>
            <li>Expense Records</li>
            <li>Payment Information (processed securely through third-party payment providers)</li>
            <li>Device and Browser Information</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="space-y-2 mt-2">
            <li>Provide our services</li>
            <li>Manage your account</li>
            <li>Process subscription payments</li>
            <li>Improve our platform</li>
            <li>Respond to customer support requests</li>
            <li>Send important service updates</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Data Security</h2>
          <p>We implement industry-standard security measures to protect your information. However, no internet transmission is 100% secure.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Third-Party Services</h2>
          <p>We may use trusted third-party services including payment gateways and analytics providers to improve our services.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Data Sharing</h2>
          <p>We do not sell or rent your personal information to third parties.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Cookies</h2>
          <p>Our website may use cookies to improve user experience and website performance.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Changes</h2>
          <p>We may update this Privacy Policy from time to time.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Contact</h2>
          <p>
            <strong>Email:</strong> support@mysitebook.com<br />
            <strong>Website:</strong> <a href="https://mysitebook.com" className="text-primary-600 hover:underline">https://mysitebook.com</a>
          </p>
        </div>
      </div>
    </MarketingLayout>
  );
}
