"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, MessageSquare, TrendingDown, FileText, IndianRupee, MapPin, 
  ShieldCheck, Check, ArrowRight, Building2, BarChart3, Wallet, Smartphone 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const problems = [
  {
    icon: <BookOpen className="w-6 h-6 text-[#EF4444]" />,
    title: "Writing everything in paper diaries",
    description: "Manual entry leads to lost records, unreadable notes, and costly calculation errors."
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-[#EF4444]" />,
    title: "Searching WhatsApp for old details",
    description: "Critical project photos, updates, and vendor messages get buried instantly."
  },
  {
    icon: <TrendingDown className="w-6 h-6 text-[#EF4444]" />,
    title: "Not knowing if project is in Profit or Loss",
    description: "Flying blind without real-time financial health tracking until the very end."
  },
  {
    icon: <FileText className="w-6 h-6 text-[#EF4444]" />,
    title: "Losing bills before payment collection",
    description: "Missing physical receipts means you pay out of pocket and lose margins."
  },
  {
    icon: <IndianRupee className="w-6 h-6 text-[#EF4444]" />,
    title: "Cash flow confusion",
    description: "Unclear cash flow and delayed payments cause severe operational panic."
  },
  {
    icon: <MapPin className="w-6 h-6 text-[#EF4444]" />,
    title: "Managing multiple construction sites",
    description: "Impossible to physically track labor, materials, and progress across all sites."
  }
];

const checklist = [
  "Track Expenses",
  "Live Profit Tracking",
  "Store Bills Digitally",
  "Payment Collection Tracking",
  "Manage Multiple Sites",
  "Works From Mobile"
];

const stats = [
  { icon: <Building2 className="w-5 h-5 text-[#6B7280]" />, text: "Unlimited Projects" },
  { icon: <BarChart3 className="w-5 h-5 text-[#6B7280]" />, text: "Real-Time Profit Tracking" },
  { icon: <Wallet className="w-5 h-5 text-[#6B7280]" />, text: "Expense Management" },
  { icon: <Smartphone className="w-5 h-5 text-[#6B7280]" />, text: "Mobile Access Anywhere" }
];

export default function PainPoints() {
  return (
    <section className="bg-[#F8FAFC] pt-10 pb-10 lg:pt-12 lg:pb-16 relative overflow-hidden">
      
      {/* Background ambient blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl opacity-50" />
        <div className="absolute top-[40%] -left-[10%] w-[30%] h-[50%] rounded-full bg-red-50/50 blur-3xl opacity-50" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Top Section */}
        <div className="max-w-4xl mx-auto mb-16 relative z-10 text-center flex flex-col items-center">
          <h2 className="text-[#111827] text-4xl md:text-[52px] lg:text-[60px] font-bold leading-[1.1] tracking-tight mb-6">
            Still Managing Your Construction Projects Like This?
          </h2>
          <p className="text-[#6B7280] text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
            Small daily mistakes silently <span className="font-bold bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent drop-shadow-sm">reduce your project profits</span>. 
            MySiteBook helps you <span className="relative whitespace-nowrap font-bold text-[#0B1F4D]">
              track every rupee
              <svg className="absolute w-full h-2.5 -bottom-1 left-0 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M2 7 Q 50 10 98 4" fill="none" stroke="#F4B400" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span> in one place.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative z-10">
          
          {/* Center Connection Arrow (Desktop only) */}
          <div className="hidden xl:block absolute left-[55%] top-[30%] z-0 pointer-events-none opacity-40">
            <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
              <path d="M0 40 Q 60 0, 110 40" stroke="#0B1F4D" strokeWidth="2" strokeDasharray="6 6" fill="transparent"/>
              <polygon points="105,35 115,40 105,45" fill="#0B1F4D" />
            </svg>
          </div>

          {/* Left Column - Problem Masonry (60%) */}
          <div className="w-full lg:w-[60%] relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pb-12 md:pb-0 h-full">
              {problems.map((problem, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className={`bg-white rounded-[20px] md:rounded-[24px] p-6 lg:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100/50 bg-gradient-to-b from-white to-slate-50/50 ${idx % 2 !== 0 ? 'md:translate-y-12' : ''}`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-6 shadow-sm border border-red-100/50">
                    {problem.icon}
                  </div>
                  <h3 className="text-[#111827] text-[18px] font-bold leading-snug mb-3">
                    {problem.title}
                  </h3>
                  <p className="text-[#6B7280] text-[14px] md:text-[15px] leading-relaxed">
                    {problem.description}
                  </p>
                </motion.div>
              ))}
            </div>
            {/* Spacer for the translated column to prevent layout issues */}
            <div className="h-12 hidden md:block lg:hidden"></div>
          </div>

          {/* Right Column - MySiteBook Solution (40%) */}
          <div className="w-full lg:w-[40%] mt-8 md:mt-16 lg:mt-0 relative z-20">
            <div className="bg-gradient-to-br from-[#0B1F4D] to-black rounded-[24px] p-8 lg:p-10 h-full shadow-[0_20px_50px_rgb(11,31,77,0.3)] border border-white/10 flex flex-col relative overflow-hidden min-h-[600px] lg:min-h-[auto]">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] px-3 py-1.5 rounded-full text-xs font-bold mb-8 w-max">
                <ShieldCheck className="w-4 h-4" /> 100% Secure & Simple
              </div>

              {/* Logo */}
              <Image src="/mysitebook-logo-light.png" alt="MySiteBook" width={200} height={64} className="h-12 md:h-14 w-auto mb-8 object-contain object-left" style={{ objectPosition: 'left' }} />

              {/* Headline */}
              <h3 className="text-white text-3xl md:text-4xl font-bold leading-[1.2] mb-8">
                Everything You Need to Run Profitable Projects
              </h3>

              {/* Checklist */}
              <div className="space-y-4 mb-10 relative z-10">
                {checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#22C55E]/20 flex items-center justify-center shrink-0 border border-[#22C55E]/30">
                      <Check className="w-3.5 h-3.5 text-[#22C55E] stroke-[3]" />
                    </div>
                    <span className="text-white font-medium text-[15px] md:text-[16px]">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="mt-8 relative z-30">
                <Link href="/register" className="inline-flex items-center justify-center bg-[#F4B400] hover:bg-[#F4B400]/90 text-black px-6 py-4 rounded-xl text-[18px] font-medium transition-all duration-300 w-full sm:w-auto shadow-[0_8px_20px_rgb(244,180,0,0.3)] hover:shadow-[0_8px_25px_rgb(244,180,0,0.4)] hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F4B400] focus-visible:outline-none">
                  Start Tracking Your Profit <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
              
              {/* Spacer to prevent CTA from overlapping the bottom images. Hidden on large screens so heights match! */}
              <div className="h-[200px] lg:hidden w-full shrink-0 mt-auto"></div>

              {/* Background Visuals Collage */}
              <div className="absolute bottom-0 -right-4 w-full h-[300px] lg:h-[350px] pointer-events-none z-10 flex items-end justify-end">
                <Image src="/dashboard-mockup.png" alt="Dashboard" width={800} height={600} className="absolute top-0 -right-10 w-[100%] sm:w-[80%] lg:w-[110%] rotate-[-5deg] opacity-30 blur-[1px] mix-blend-screen h-auto" />
                <Image src="/contractor_thumbsup_trans.png" alt="Contractor" width={600} height={800} className="absolute bottom-0 right-0 w-[65%] sm:w-[45%] lg:w-[55%] xl:w-[50%] object-contain object-bottom drop-shadow-2xl brightness-110 h-auto" />
              </div>
              
              {/* Subtle overlay gradient to ensure text readability over visuals */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F4D] via-[#0B1F4D]/80 to-transparent pointer-events-none z-0 h-[60%] top-auto" />
              
            </div>
          </div>
          
        </div>

        {/* Bottom Statistics Strip */}
        <div className="mt-16 md:mt-24 relative z-10">
          
          {/* Subtle colorful glow behind the stats to make the glassmorphism pop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[150%] bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-green-400/10 blur-3xl pointer-events-none rounded-full" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 flex items-center gap-4 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group"
              >
                <div className="w-12 h-12 rounded-[14px] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#F8FAFC]">
                  {stat.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-[#111827] font-bold text-[15px] leading-tight mb-1">{stat.text}</span>
                  <span className="text-slate-500 text-[12px] font-medium leading-tight">Included in all plans</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
