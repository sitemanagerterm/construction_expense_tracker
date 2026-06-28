import React from "react";
import MarketingLayout from "@/components/MarketingLayout";
import { BookOpen } from "lucide-react";

export default function BlogPage() {
  return (
    <MarketingLayout title="Construction Blog" subtitle="Insights, tips, and industry news.">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        
        <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-sm border border-gray-200 flex flex-col items-center justify-center min-h-[40vh]">
          <BookOpen className="w-16 h-16 text-primary/20 mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Blog is Coming Soon</h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            We are working hard to bring you the best articles on construction finance, project management, and industry trends. Check back shortly!
          </p>
        </div>

      </div>
    </MarketingLayout>
  );
}
