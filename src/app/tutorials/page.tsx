import React from "react";
import MarketingLayout from "@/components/MarketingLayout";
import { FaPlayCircle, FaClock } from "react-icons/fa";

export default function TutorialsPage() {
  const videos = [
    { title: "Setting Up Your First Construction Site", duration: "4:12", category: "Getting Started", color: "from-blue-500 to-indigo-600" },
    { title: "Inviting Supervisors & Assigning Roles", duration: "3:45", category: "Team Management", color: "from-green-400 to-emerald-600" },
    { title: "Logging Materials via Mobile PWA", duration: "2:30", category: "Expense Tracking", color: "from-orange-400 to-red-500" },
    { title: "Voice AI: Speaking Your Expenses", duration: "5:00", category: "Advanced Features", color: "from-purple-500 to-pink-600" },
    { title: "Generating & Exporting Weekly P&L", duration: "6:15", category: "Reporting", color: "from-teal-400 to-cyan-600" },
    { title: "Tracking Advances & Supplier Payments", duration: "4:50", category: "Expense Tracking", color: "from-amber-400 to-orange-600" },
  ];

  return (
    <MarketingLayout title="Video Tutorials" subtitle="Master MySiteBook with our step-by-step video guides.">
      
      {/* Category Filters */}
      <div className="bg-slate-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {["All Tutorials", "Getting Started", "Expense Tracking", "Team Management", "Reporting", "Advanced"].map((cat, i) => (
              <button key={i} className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((vid, i) => (
            <div key={i} className="group cursor-pointer">
              {/* Thumbnail */}
              <div className={`relative aspect-video rounded-3xl overflow-hidden mb-5 bg-gradient-to-br ${vid.color} shadow-md group-hover:shadow-xl transition-all transform group-hover:-translate-y-1`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg border border-white/30">
                    <FaPlayCircle className="text-4xl" />
                  </div>
                </div>
                {/* Badges */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center">
                  <FaClock className="mr-1.5" /> {vid.duration}
                </div>
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                  {vid.category}
                </div>
              </div>
              
              {/* Meta */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors leading-tight">{vid.title}</h3>
              <p className="text-gray-500 font-medium text-sm">Learn how to easily navigate and master this feature in just a few minutes.</p>
            </div>
          ))}
        </div>

      </div>
    </MarketingLayout>
  );
}
