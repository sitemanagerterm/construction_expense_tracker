"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FolderPlus, Wallet, IndianRupee, TrendingUp } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: "Step 1",
      title: "Create a Project",
      description: "Enter project details including project name, client details, and total project value.",
      icon: <FolderPlus className="w-8 h-8 text-white" />
    },
    {
      step: "Step 2",
      title: "Track Credits",
      description: "Record all payments received from your client.",
      icon: <Wallet className="w-8 h-8 text-white" />
    },
    {
      step: "Step 3",
      title: "Log Expenses",
      description: "Add expenses as they happen. Labour, materials, transport, rentals, and more.",
      icon: <IndianRupee className="w-8 h-8 text-white" />
    },
    {
      step: "Step 4",
      title: "Monitor Profit",
      description: "MySiteBook automatically calculates project profitability and financial performance.",
      icon: <TrendingUp className="w-8 h-8 text-white" />
    }
  ];

  return (
    <section className="py-12 lg:py-16 bg-white relative overflow-hidden" id="how-it-works">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-900 px-4 py-2 rounded-full text-[13px] font-bold mb-6 shadow-sm uppercase tracking-wider">
            <span className="text-accent text-lg leading-none">🚀</span> HOW IT WORKS
          </div>
          <h2 className="text-gray-900 text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-6">
            Four Simple Steps
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
            Get up and running in minutes. No training required.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -10 }}
              className="bg-[#F8FAFC] rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative flex flex-col items-center text-center group"
            >
              {/* Connector Line (visible on desktop between items) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 -right-4 w-8 border-t-2 border-dashed border-gray-300 z-0"></div>
              )}
              
              <div className="w-16 h-16 rounded-2xl bg-[#0B1F4D] flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10">
                {item.icon}
              </div>
              
              <div className="text-accent font-bold text-sm tracking-widest uppercase mb-3">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {item.title}
              </h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
