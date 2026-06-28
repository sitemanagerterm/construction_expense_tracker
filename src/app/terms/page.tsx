import React from "react";
import MarketingLayout from "@/components/MarketingLayout";

export default function TermsPage() {
  return (
    <MarketingLayout title="Terms & Conditions" subtitle="Please read these terms carefully before using MySiteBook.">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-200 prose prose-lg max-w-none text-gray-700">
          <ul className="space-y-6 list-none pl-0">
            <li className="flex items-start gap-4">
              <span className="text-accent text-2xl">✓</span>
              <p className="m-0 font-medium">By accessing MySiteBook, you agree to use the platform responsibly.</p>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-accent text-2xl">✓</span>
              <p className="m-0 font-medium">Users are responsible for maintaining account security.</p>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-accent text-2xl">✓</span>
              <p className="m-0 font-medium">Subscription fees are billed according to the selected plan.</p>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-accent text-2xl">✓</span>
              <p className="m-0 font-medium">Free plans may have feature limitations.</p>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-accent text-2xl">✓</span>
              <p className="m-0 font-medium">MySiteBook reserves the right to improve, modify, or discontinue features when necessary.</p>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-accent text-2xl">✓</span>
              <p className="m-0 font-medium">Users retain ownership of their project data.</p>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-accent text-2xl">✓</span>
              <p className="m-0 font-medium">We are not liable for losses resulting from incorrect data entered by users.</p>
            </li>
          </ul>
          
          <hr className="my-10 border-gray-200" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider m-0">Last Updated: June 2026</p>
        </div>
      </div>
    </MarketingLayout>
  );
}
