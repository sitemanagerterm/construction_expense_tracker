import React from "react";
import MarketingLayout from "@/components/MarketingLayout";
import { BookOpen, Calculator, FileSpreadsheet, Lightbulb, HardHat, MonitorPlay } from "lucide-react";

export default function ResourcesPage() {
  const resources = [
    { name: "Construction Cost Control Guide", icon: <BookOpen className="w-8 h-8 text-accent" /> },
    { name: "Project Profit Calculator", icon: <Calculator className="w-8 h-8 text-accent" /> },
    { name: "Material Tracking Template", icon: <FileSpreadsheet className="w-8 h-8 text-accent" /> },
    { name: "Contractor Finance Tips", icon: <Lightbulb className="w-8 h-8 text-accent" /> },
    { name: "Site Management Best Practices", icon: <HardHat className="w-8 h-8 text-accent" /> },
    { name: "Expense Tracking Tutorials", icon: <MonitorPlay className="w-8 h-8 text-accent" /> },
  ];

  return (
    <MarketingLayout title="Learn To Build More Profitable Projects" subtitle="Explore guides, tutorials, templates, and best practices designed for contractors.">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Available Resources</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-[#0B1F4D] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {resource.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{resource.name}</h3>
            </div>
          ))}
        </div>

      </div>
    </MarketingLayout>
  );
}
