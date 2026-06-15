import React from "react";
import MarketingLayout from "@/components/MarketingLayout";
import { FaBullseye, FaHeart, FaRocket } from "react-icons/fa";

export default function AboutPage() {
  return (
    <MarketingLayout title="Our Mission" subtitle="We are digitizing the Indian construction industry, one site at a time.">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
          <div className="text-center px-6">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-primary text-3xl mx-auto mb-6">
              <FaBullseye />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Total Clarity</h3>
            <p className="text-gray-600 font-medium leading-relaxed">We believe every contractor deserves real-time, zero-error visibility into where every single rupee is spent.</p>
          </div>
          <div className="text-center px-6">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-accent text-3xl mx-auto mb-6">
              <FaRocket />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Built for the Field</h3>
            <p className="text-gray-600 font-medium leading-relaxed">Software shouldn't just be for the AC office. We build tools specifically for site supervisors standing in the sun.</p>
          </div>
          <div className="text-center px-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 text-3xl mx-auto mb-6">
              <FaHeart />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Contractor First</h3>
            <p className="text-gray-600 font-medium leading-relaxed">We don't charge per-user because we want you to invite every employee. Your success is our success.</p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-20 text-white relative overflow-hidden mb-32 shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('/construction-bg.png')] bg-cover opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Born from frustration.</h2>
            <p className="text-xl text-slate-300 font-light leading-relaxed mb-6">
              MySiteBook was founded when we saw how much time and money construction business owners were losing simply because they didn't have real-time visibility into their site expenses.
            </p>
            <p className="text-xl text-slate-300 font-light leading-relaxed mb-8">
              Traditional accounting software is built for accountants. It is completely useless for a site supervisor trying to log a cement purchase while managing 50 laborers. 
            </p>
            <p className="text-xl text-slate-300 font-light leading-relaxed">
              We built MySiteBook to be mobile-first, incredibly easy to use via Voice AI, and capable of working completely offline.
            </p>
          </div>
        </div>

        {/* Team Grid */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Meet the Team</h2>
          <p className="text-xl text-gray-600 font-medium">Built by engineers and construction veterans who understand the daily grind.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[1,2,3,4].map((i) => (
            <div key={i} className="text-center">
              <div className="w-48 h-48 mx-auto bg-gray-200 rounded-full mb-6 border-4 border-white shadow-lg overflow-hidden">
                <div className="w-full h-full bg-slate-300"></div>
              </div>
              <h4 className="text-xl font-bold text-gray-900">Team Member</h4>
              <p className="text-primary font-medium">Co-Founder & Role</p>
            </div>
          ))}
        </div>

      </div>
    </MarketingLayout>
  );
}
