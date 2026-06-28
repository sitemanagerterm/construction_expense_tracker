import React from "react";
import MarketingLayout from "@/components/MarketingLayout";
import { PlayCircle } from "lucide-react";

export default function TutorialsPage() {
  return (
    <MarketingLayout title="Video Tutorials" subtitle="Learn how to master MySiteBook.">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        
        <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-sm border border-gray-200 flex flex-col items-center justify-center min-h-[40vh]">
          <PlayCircle className="w-16 h-16 text-primary/20 mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Tutorials Coming Soon</h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            We are recording a comprehensive video series to show you exactly how to track expenses, manage materials, and control your project finances.
          </p>
        </div>

      </div>
    </MarketingLayout>
  );
}
