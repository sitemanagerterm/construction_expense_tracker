"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Camera, IndianRupee, 
  Smartphone, BarChart3, Wallet, CheckCircle2, 
  TrendingUp, Cloud, Zap
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

export default function FeaturesGrid() {
  const [profitCount, setProfitCount] = useState(0);
  const targetProfit = 180000;

  // Simulate a counter for the profit metric
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 5000;
      if (current >= targetProfit) {
        setProfitCount(targetProfit);
        clearInterval(interval);
      } else {
        setProfitCount(current);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const chartData = [
    { name: 'Mon', revenue: 45000, expense: 30000 },
    { name: 'Tue', revenue: 52000, expense: 28000 },
    { name: 'Wed', revenue: 38000, expense: 42000 },
    { name: 'Thu', revenue: 65000, expense: 35000 },
    { name: 'Fri', revenue: 80000, expense: 40000 },
  ];

  return (
    <section className="pt-10 pb-16 lg:pt-16 lg:pb-24 bg-[#F8FAFC] relative overflow-hidden" id="features">
      
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] text-[#111827] px-4 py-2 rounded-full text-[13px] font-bold mb-6 shadow-sm uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-[#0B1F4D]" /> BUILT FOR CONTRACTORS
          </div>
          <h2 className="text-[#111827] text-4xl md:text-[52px] font-bold leading-[1.1] tracking-tight mb-6">
            Everything You Need to Run Profitable Projects
          </h2>
          <p className="text-[#6B7280] text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
            Track expenses, manage materials, monitor payments, and know your project profit in real time—all from one simple platform.
          </p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[240px] md:auto-rows-[280px]">
          
          {/* Card 1: Hero Profit (Spans 2 columns, 2 rows) */}
          <motion.div 
            whileHover={{ y: -4, scale: 0.99 }}
            className="md:col-span-2 row-span-2 bg-gradient-to-br from-[#0B1F4D] to-black rounded-[32px] p-8 lg:p-10 shadow-[0_20px_50px_rgb(11,31,77,0.15)] border border-white/10 relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-[#22C55E] to-[#F4B400] blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 rounded-[32px] -z-10"></div>
            
            <div className="flex flex-col gap-2 relative z-10 max-w-[80%]">
              <div className="inline-flex items-center gap-1.5 text-[#F4B400] font-bold text-sm bg-[#F4B400]/10 border border-[#F4B400]/20 px-3 py-1.5 rounded-full w-max mb-2">
                <BarChart3 className="w-4 h-4" /> Live Analytics
              </div>
              <h3 className="text-[28px] md:text-[36px] font-bold text-white leading-tight">Always Know Your Exact Profit</h3>
              <p className="text-white/60 text-[16px] leading-relaxed mt-2">
                Real-time financial health without waiting for the accountant.
              </p>
            </div>

            {/* Mockup UI */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-8 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex justify-between items-center mb-6">
                <div className="text-[14px] font-bold text-white/60 uppercase tracking-wider">Current Profit</div>
                <div className="flex items-center gap-1 text-[#22C55E] text-sm font-bold bg-[#22C55E]/20 px-2.5 py-1 rounded">
                  <TrendingUp className="w-4 h-4" /> +14.5%
                </div>
              </div>
              
              <div className="text-5xl md:text-[64px] font-bold text-white mb-8 tracking-tight drop-shadow-[0_0_15px_rgba(244,180,0,0.3)]">
                ₹{profitCount.toLocaleString('en-IN')}
              </div>
              
              {/* Mini Chart */}
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <Bar dataKey="revenue" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={16} />
                    <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Expense Tall Card (Spans 1 column, 2 rows) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="row-span-2 bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-[#E5E7EB] relative overflow-hidden flex flex-col group hover:shadow-xl transition-shadow duration-500"
          >
             <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl -z-10 group-hover:bg-blue-200/50 transition-colors"></div>

            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 text-[#3B82F6] font-bold text-sm bg-[#3B82F6]/10 px-3 py-1.5 rounded-full mb-4">
                <Camera className="w-4 h-4" /> Expense Tracking
              </div>
              <h3 className="text-[24px] font-bold text-[#111827] leading-tight mb-2">Capture Every Expense</h3>
              <p className="text-[#6B7280] text-[15px] leading-relaxed">
                Upload bills instantly from the site.
              </p>
            </div>

            {/* Mockup UI - Receipt Scanner */}
            <div className="flex-1 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] p-4 flex flex-col relative overflow-hidden group-hover:border-[#3B82F6]/30 transition-colors">
               <div className="w-full h-32 bg-white rounded-xl border-2 border-dashed border-[#CBD5E1] flex items-center justify-center mb-6 relative overflow-hidden">
                  <Camera className="w-8 h-8 text-[#9CA3AF] group-hover:scale-110 transition-transform" />
                  <motion.div 
                    initial={{ top: "-10%" }}
                    animate={{ top: "110%" }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute left-0 w-full h-1 bg-[#3B82F6] shadow-[0_0_15px_rgb(59,130,246)]"
                  />
               </div>

               <div className="space-y-3">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#E5E7EB]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                          <IndianRupee className="w-4 h-4 text-[#6B7280]" />
                        </div>
                        <div className="h-2 w-16 bg-[#E5E7EB] rounded-full"></div>
                      </div>
                      <div className="h-2 w-10 bg-[#E5E7EB] rounded-full"></div>
                   </div>
                 ))}
               </div>
            </div>
          </motion.div>

          {/* Card 3: Payments (Spans 1 column, 1 row) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white rounded-[32px] p-6 shadow-sm border border-[#E5E7EB] relative flex flex-col justify-between group hover:shadow-xl transition-shadow duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/50 rounded-full blur-2xl -z-10"></div>
            
            <div>
              <div className="inline-flex items-center gap-1.5 text-[#8B5CF6] font-bold text-sm bg-[#8B5CF6]/10 px-3 py-1.5 rounded-full mb-3">
                <Wallet className="w-4 h-4" /> Payments
              </div>
              <h3 className="text-[20px] font-bold text-[#111827] leading-tight">Track Receivables</h3>
            </div>

            <div className="bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] p-4 mt-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
               <div className="flex justify-between items-center">
                 <div>
                   <div className="text-[13px] font-bold text-[#111827]">Client Advance</div>
                   <div className="text-[11px] text-[#6B7280]">Just now</div>
                 </div>
                 <div className="text-right">
                   <div className="text-[15px] font-bold text-[#22C55E]">+₹1,00,000</div>
                   <div className="text-[10px] font-bold text-[#166534] bg-[#DCFCE7] px-1.5 py-0.5 rounded inline-block mt-1">Cleared</div>
                 </div>
               </div>
            </div>
          </motion.div>

          {/* Card 4: Cloud Sync (Spans 1 column, 1 row) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-[#0B1F4D] rounded-[32px] p-6 shadow-sm border border-[#0B1F4D] relative flex flex-col justify-between group hover:shadow-xl transition-shadow duration-500 overflow-hidden"
          >
            <div className="absolute -bottom-10 -right-10 text-white/5 group-hover:text-white/10 transition-colors">
              <Cloud className="w-48 h-48" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-white font-bold text-sm bg-white/10 px-3 py-1.5 rounded-full mb-3 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-[#F4B400]" /> Secure
              </div>
              <h3 className="text-[20px] font-bold text-white leading-tight max-w-[80%] relative z-10">Instant Cloud Sync</h3>
            </div>

            <div className="flex items-center gap-3 mt-4 relative z-10">
               <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Smartphone className="w-6 h-6 text-white" />
               </div>
               <div>
                 <div className="text-white font-bold text-[14px]">Mobile App</div>
                 <div className="text-white/60 text-[12px]">Access anywhere</div>
               </div>
               <CheckCircle2 className="w-5 h-5 text-[#22C55E] ml-auto" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
