import React from "react";
import MarketingLayout from "@/components/MarketingLayout";
import { Check, Clock } from "lucide-react";

export default function UpdatesPage() {
  const currentFeatures = [
    "Project Management",
    "Credit Tracking",
    "Expense Tracking",
    "Profit Dashboard"
  ];

  const upcomingFeatures = [
    "Bill Storage",
    "Receipt OCR",
    "Voice Expense Entry",
    "Pending Payment Tracking",
    "Material Consumption Reports",
    "Mobile Applications"
  ];

  return (
    <MarketingLayout title="Product Updates" subtitle="See what's new and what's coming next to MySiteBook.">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Version 1.0 */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-200 mb-12">
          <div className="inline-flex items-center gap-2 bg-[#DCFCE7] text-[#22C55E] px-4 py-1.5 rounded-full text-[13px] font-bold mb-6 uppercase tracking-wider">
            Version 1.0 (Current)
          </div>
          <ul className="space-y-4">
            {currentFeatures.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0B1F4D] flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-accent" strokeWidth={2.5} />
                </div>
                <span className="text-gray-900 font-medium text-lg">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Coming Soon */}
        <div className="bg-[#F8FAFC] rounded-[2rem] p-8 md:p-12 shadow-inner border border-gray-100">
          <div className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-[13px] font-bold mb-6 uppercase tracking-wider">
            <Clock className="w-4 h-4" /> Coming Soon
          </div>
          <ul className="space-y-4 text-gray-500">
            {upcomingFeatures.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-4 opacity-75">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
                <span className="font-medium text-lg">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </MarketingLayout>
  );
}
