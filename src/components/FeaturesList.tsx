"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, CreditCard, IndianRupee, LineChart, Package, FileText, Layers, Users, PieChart } from 'lucide-react';

export default function FeaturesList() {
  const features = [
    {
      title: "Project Value Tracking",
      description: "Set the total project value and monitor progress from day one.",
      icon: <Calculator className="w-6 h-6 text-accent" />
    },
    {
      title: "Credit Tracking",
      description: "Track every payment received from clients and identify outstanding amounts instantly.",
      icon: <CreditCard className="w-6 h-6 text-accent" />
    },
    {
      title: "Expense Management",
      description: "Record all project expenses including labour, materials, transport, equipment, and miscellaneous costs.",
      icon: <IndianRupee className="w-6 h-6 text-accent" />
    },
    {
      title: "Profit & Loss Dashboard",
      description: "Know your project's financial health in real time without waiting until completion.",
      icon: <LineChart className="w-6 h-6 text-accent" />
    },
    {
      title: "Material Tracking",
      description: "Monitor purchases of cement, steel, sand, bricks, and other construction materials.",
      icon: <Package className="w-6 h-6 text-accent" />
    },
    {
      title: "Bill Storage",
      description: "Store receipts and invoices securely for future reference.",
      icon: <FileText className="w-6 h-6 text-accent" />
    },
    {
      title: "Multi-Project Management",
      description: "Manage multiple construction projects from a single dashboard.",
      icon: <Layers className="w-6 h-6 text-accent" />
    },
    {
      title: "Team Access",
      description: "Allow site engineers and supervisors to log expenses from anywhere.",
      icon: <Users className="w-6 h-6 text-accent" />
    },
    {
      title: "Reports & Analytics",
      description: "Generate detailed financial reports and project summaries.",
      icon: <PieChart className="w-6 h-6 text-accent" />
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#111827] text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4">
            Everything You Need To Control Project Finances
          </h2>
          <p className="text-gray-600 text-lg md:text-xl font-medium">
            MySiteBook is designed specifically for contractors who want complete visibility over their project finances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5 }}
              className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0B1F4D] flex items-center justify-center shrink-0 shadow-inner">
                {feature.icon}
              </div>
              <div>
                <h4 className="text-gray-900 font-bold text-lg mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
