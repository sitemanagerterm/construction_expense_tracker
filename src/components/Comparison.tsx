"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Star, ShieldCheck, Zap, Activity, FileText, BarChart3, HardHat, Wallet, Smartphone, Database } from 'lucide-react';
import Link from 'next/link';

export default function Comparison() {
  const checklistFeatures = [
    { title: "Built Specifically for Construction", icon: <HardHat className="w-5 h-5" />, msb: true, pen: false, excel: false, generic: false },
    { title: "Real-Time Profit Tracking", icon: <BarChart3 className="w-5 h-5" />, msb: true, pen: false, excel: false, generic: true },
    { title: "Expense Management", icon: <Wallet className="w-5 h-5" />, msb: true, pen: false, excel: false, generic: true },
    { title: "Digital Bill Storage", icon: <FileText className="w-5 h-5" />, msb: true, pen: false, excel: false, generic: false },

    { title: "Site Supervisor Mobile App", icon: <Smartphone className="w-5 h-5" />, msb: true, pen: false, excel: true, generic: false },
    { title: "Payment Collection Tracking", icon: <Activity className="w-5 h-5" />, msb: true, pen: false, excel: true, generic: true },
    { title: "Cloud Backup", icon: <Zap className="w-5 h-5" />, msb: true, pen: false, excel: false, generic: true },
  ];

  return (
    <section className="pt-4 pb-8 lg:pt-8 lg:pb-12 bg-[#F8FAFC] relative overflow-hidden" id="comparison">
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-gradient-to-b from-[#DCFCE7]/40 to-transparent blur-3xl -z-10 pointer-events-none rounded-full opacity-50"></div>

      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] text-[#111827] px-4 py-2 rounded-full text-[13px] font-bold mb-6 shadow-sm uppercase tracking-wider">
            <Star className="w-4 h-4 text-[#F4B400]" fill="currentColor" /> WHY CONTRACTORS SWITCH
          </div>
          <h2 className="text-[#111827] text-4xl md:text-[52px] font-bold leading-[1.1] tracking-tight mb-6">
            Built for Construction.<br/>Not Generic Accounting.
          </h2>
          <p className="text-[#6B7280] text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
            Stop managing projects with notebooks, WhatsApp chats, and spreadsheets. MySiteBook brings expenses, payments, materials, bills, and profits together in one powerful platform.
          </p>
        </div>


        <div className="mt-16 bg-white rounded-[32px] border border-[#E5E7EB] shadow-sm overflow-hidden relative">
          
          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-[768px]">
              {/* Header Row */}
              <div className="grid grid-cols-[40%_20%_20%_20%] bg-white border-b border-[#E5E7EB] sticky top-0 z-20">
            <div className="p-6 md:p-8 font-semibold text-[#111827] text-lg">
              What You Actually Need to Run a Profitable Construction Business
            </div>
            
            {/* MSB Header */}
            <div className="p-6 md:p-8 bg-[#DCFCE7]/40 flex flex-col items-center justify-center relative">
              <div className="absolute top-0 left-0 w-[2px] h-full bg-[#22C55E] z-10"></div>
              <div className="absolute top-0 right-0 w-[2px] h-full bg-[#22C55E] z-10"></div>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#22C55E] z-10"></div>
              {/* Recommended Label */}
              <div className="bg-[#22C55E] text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap mb-2">
                Recommended
              </div>
              <span className="text-[22px] font-bold text-[#111827]">MySiteBook</span>
            </div>
            
            <div className="p-6 md:p-8 font-semibold text-[#6B7280] text-center flex items-center justify-center">Excel / Paper</div>
            <div className="p-6 md:p-8 font-semibold text-[#6B7280] text-center flex items-center justify-center">Tally / generic apps</div>
          </div>

          {/* Checklist Rows */}
          <div className="relative">
            {checklistFeatures.map((feature, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`grid grid-cols-[40%_20%_20%_20%] group transition-colors duration-300 hover:bg-[#F8FAFC] ${idx !== checklistFeatures.length - 1 ? 'border-b border-[#E5E7EB]' : ''}`}
              >
                <div className="p-5 md:p-6 font-medium text-[#111827] flex items-center gap-3">
                  <div className="text-[#6B7280] group-hover:text-[#0B1F4D] transition-colors">{feature.icon}</div>
                  <span className="text-[16px]">{feature.title}</span>
                </div>
                
                {/* MSB Column */}
                <div className="p-5 md:p-6 flex justify-center items-center bg-[#DCFCE7]/40 relative">
                  {/* Vertical Accent Line for active col */}
                  <div className="absolute top-0 left-0 w-[2px] h-full bg-[#22C55E] z-10"></div>
                  <div className="absolute top-0 right-0 w-[2px] h-full bg-[#22C55E] z-10"></div>
                  {idx === checklistFeatures.length - 1 && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#22C55E] z-10"></div>}
                  
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 rounded-full bg-[#22C55E] flex items-center justify-center shadow-[0_4px_12px_rgb(34,197,94,0.3)]"
                  >
                    <Check className="w-6 h-6 text-white" strokeWidth={3} />
                  </motion.div>
                </div>
                
                {/* Excel/Paper */}
                <div className="p-5 md:p-6 flex justify-center items-center">
                  {feature.excel ? (
                    <div className="w-8 h-8 rounded-full bg-[#F59E0B]/10 flex items-center justify-center">
                      <span className="text-[#F59E0B] font-bold text-lg leading-none mt-[-2px]">⚠</span>
                    </div>
                  ) : (
                    <X className="w-6 h-6 text-[#9CA3AF]" />
                  )}
                </div>
                
                {/* Generic */}
                <div className="p-5 md:p-6 flex justify-center items-center">
                  {feature.generic ? (
                    <Check className="w-6 h-6 text-[#9CA3AF]" strokeWidth={3} />
                  ) : (
                    <X className="w-6 h-6 text-[#9CA3AF]" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
