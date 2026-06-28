import React from "react";
import MarketingLayout from "@/components/MarketingLayout";

export default function PrivacyPage() {
  return (
    <MarketingLayout title="Privacy Policy" subtitle="Your Data Matters. MySiteBook respects your privacy.">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-200 prose prose-lg max-w-none text-gray-700">
          <ul className="space-y-6 list-none pl-0">
            <li className="flex items-start gap-4">
              <span className="text-accent text-2xl">✓</span>
              <p className="m-0 font-medium">We collect only the information necessary to provide our services.</p>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-accent text-2xl">✓</span>
              <p className="m-0 font-medium">We do not sell customer data.</p>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-accent text-2xl">✓</span>
              <p className="m-0 font-medium">Your information is protected using secure industry-standard technologies.</p>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-accent text-2xl">✓</span>
              <p className="m-0 font-medium">We may use anonymized analytics to improve the platform.</p>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-accent text-2xl">✓</span>
              <p className="m-0 font-medium">By using MySiteBook, you agree to this Privacy Policy.</p>
            </li>
          </ul>
          
          <hr className="my-10 border-gray-200" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider m-0">Last Updated: June 2026</p>
        </div>
      </div>
    </MarketingLayout>
  );
}
