import React from "react";
import MarketingLayout from "@/components/MarketingLayout";

export default function TermsPage() {
  return (
    <MarketingLayout title="Terms & Conditions" subtitle="The rules and guidelines for using MySiteBook.">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-200 prose prose-lg max-w-none text-gray-700">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-8">Last Updated: July 26, 2026</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Terms of Service</h2>
          <p>By using MySiteBook, you agree to these Terms.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Service</h2>
          <p>MySiteBook provides a cloud-based construction expense management platform.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">User Account</h2>
          <p>Users are responsible for maintaining the confidentiality of their login credentials.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Subscription</h2>
          <p>Paid subscriptions renew according to the selected billing cycle unless cancelled.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Acceptable Use</h2>
          <p>Users must not:</p>
          <ul className="space-y-2 mt-2">
            <li>Attempt to hack the platform.</li>
            <li>Upload malicious software.</li>
            <li>Misuse or copy the service.</li>
            <li>Use the platform for illegal activities.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Intellectual Property</h2>
          <p>All software, branding, design, logos and content belong to MySiteBook.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Limitation of Liability</h2>
          <p>MySiteBook shall not be liable for indirect or consequential losses arising from the use of the platform.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Service Availability</h2>
          <p>We strive for maximum uptime but cannot guarantee uninterrupted service at all times.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate these Terms.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Governing Law</h2>
          <p>These Terms shall be governed by the laws of India.</p>
        </div>
      </div>
    </MarketingLayout>
  );
}
