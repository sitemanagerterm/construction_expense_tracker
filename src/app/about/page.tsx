import React from "react";
import MarketingLayout from "@/components/MarketingLayout";

export default function AboutPage() {
  return (
    <MarketingLayout title="About Us" subtitle="Built By People Who Understand Construction">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="prose prose-lg prose-slate mx-auto text-gray-700 bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-xl leading-relaxed mb-6 font-medium">
            MySiteBook is a cloud-based Construction Expense Management Software designed specifically for contractors, builders and construction businesses.
          </p>
          <p className="text-lg leading-relaxed mb-8">
            Our mission is to simplify project expense tracking, credit management, staff management and financial reporting through an easy-to-use digital platform.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">With MySiteBook, contractors can:</h2>
          <ul className="space-y-3 mb-10 text-lg">
            <li className="flex items-start gap-3">
              <span className="text-accent text-xl mt-1">✓</span>
              <span>Track project expenses</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent text-xl mt-1">✓</span>
              <span>Monitor credits and balances</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent text-xl mt-1">✓</span>
              <span>Manage site staff</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent text-xl mt-1">✓</span>
              <span>Control user permissions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent text-xl mt-1">✓</span>
              <span>Generate PDF reports</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent text-xl mt-1">✓</span>
              <span>View audit logs</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent text-xl mt-1">✓</span>
              <span>Access data anytime, anywhere</span>
            </li>
          </ul>

          <div className="bg-primary-900 text-white rounded-2xl p-8 shadow-xl mt-12 text-center">
            <p className="text-2xl font-medium leading-relaxed m-0 text-white">
              We believe construction businesses deserve a simple, affordable and professional software solution.
            </p>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
