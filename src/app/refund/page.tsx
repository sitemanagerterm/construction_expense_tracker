import React from "react";
import MarketingLayout from "@/components/MarketingLayout";
import { getPublicPlatformSettings } from "@/app/actions/public";

export default async function RefundPage() {
  const { settings } = await getPublicPlatformSettings();
  const supportEmail = settings?.supportEmail || "support@mysitebook.com";
  return (
    <MarketingLayout title="Refund Policy" subtitle="Our commitment to clear and transparent billing.">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-200 prose prose-lg max-w-none text-gray-700">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-8">Last Updated: July 26, 2026</p>
          
          <p className="font-medium text-xl mb-8">Welcome to MySiteBook. We are committed to providing a reliable construction expense management platform for contractors and businesses.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">1. Subscription Payments</h2>
          <p>MySiteBook offers subscription-based plans. By purchasing a subscription, you agree to the applicable pricing and billing terms displayed at the time of purchase.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">2. Free Trial</h2>
          <p>New users may receive a 30-day free trial (subject to eligibility and promotional availability).</p>
          <p>No charges will be applied during the free trial period unless otherwise stated.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">3. Refund Eligibility</h2>
          <p>Since MySiteBook is a digital software service (SaaS), subscription fees are generally non-refundable after payment.</p>
          <p>However, a refund may be considered in the following situations:</p>
          <ul className="space-y-2 mt-2">
            <li>Duplicate payment made by mistake.</li>
            <li>Incorrect amount charged due to a technical error.</li>
            <li>Payment deducted but subscription was not activated due to a system issue.</li>
          </ul>
          <p className="mt-4">Approved refunds will be processed to the original payment method within 7–10 business days.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">4. Non-Refundable Situations</h2>
          <p>Refunds will not be provided for:</p>
          <ul className="space-y-2 mt-2">
            <li>Partial use of a subscription.</li>
            <li>Change of mind after purchase.</li>
            <li>Failure to use the service.</li>
            <li>Subscription cancellation after the billing cycle has started.</li>
            <li>Violation of our Terms of Service.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">5. Subscription Cancellation</h2>
          <p>You may cancel your subscription at any time.</p>
          <p>After cancellation:</p>
          <ul className="space-y-2 mt-2">
            <li>Your subscription will remain active until the end of the current billing period.</li>
            <li>No further recurring charges will be made.</li>
            <li>No partial or prorated refund will be issued for the remaining subscription period.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">6. Technical Issues</h2>
          <p>If you experience any payment or service-related issues, please contact our support team before requesting a refund. We will make every reasonable effort to resolve the issue.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">7. Contact Us</h2>
          <p>For refund-related questions, please contact:</p>
          <p>
            For questions or disputes regarding payments and refunds, please contact us at:<br /><br />
            <strong>MySiteBook Support</strong><br />
            <strong>Email:</strong> {supportEmail}<br />
            <strong>Website:</strong> <a href="https://mysitebook.com" className="text-primary hover:underline">https://mysitebook.com</a>
          </p>
        </div>
      </div>
    </MarketingLayout>
  );
}
