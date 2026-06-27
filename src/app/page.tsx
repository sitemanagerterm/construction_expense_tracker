"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  Play, CheckCircle2, Shield, BarChart3, FileText, 
  Layers, CreditCard, ChevronDown, ArrowRight, Lock,
  Gift, XCircle, Users, Building2, Receipt, IndianRupee,
  Phone, Mail, MapPin, Globe, HardHat, Wallet, Home, FolderOpen, Settings, Check
} from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaWhatsapp, FaPhoneAlt, FaRegEnvelope, FaHardHat } from "react-icons/fa";

// Shared Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-primary text-brandtext-inverse font-sans overflow-x-hidden">
      
      {/* 1. Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-primary/95 backdrop-blur border-b border-gray-800">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <img src="/mysitebook-horizontal.png" alt="MySiteBook" className="h-12 w-auto" />
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm font-medium text-white hover:text-accent transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-sm font-medium text-white hover:text-accent transition-colors">How It Works</Link>
              <Link href="#pricing" className="text-sm font-medium text-white hover:text-accent transition-colors">Pricing</Link>
              <div className="flex items-center space-x-1 cursor-pointer group">
                <span className="text-sm font-medium text-white group-hover:text-accent transition-colors">Resources</span>
                <ChevronDown className="w-4 h-4 text-white group-hover:text-accent transition-colors" />
              </div>
              <Link href="#about" className="text-sm font-medium text-white hover:text-accent transition-colors">About Us</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login" className="hidden md:flex items-center justify-center border border-accent text-accent hover:bg-accent/10 px-6 py-2 rounded-lg text-sm font-medium transition-all">
                <Lock className="w-4 h-4 mr-2" /> Log In
              </Link>
              <Link href="/register" className="bg-accent hover:bg-accent-600 text-primary px-6 py-2 rounded-lg text-sm font-bold transition-all transform hover:scale-105">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        
        {/* 2. Hero Section */}
        <section className="relative pt-4 pb-12 lg:pt-8 lg:pb-16 overflow-hidden bg-primary min-h-[calc(100vh-80px)] flex items-center">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              <motion.div 
                initial="hidden" animate="visible" variants={staggerContainer}
                className="max-w-2xl w-full"
              >

                <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 border border-gray-600 rounded-full px-3 py-1.5 mb-4 lg:mt-0">
                  <FaHardHat className="text-[#F9B233] w-4 h-4" />
                  <span className="text-[clamp(0.625rem,1vw,0.75rem)] font-semibold text-accent uppercase tracking-wider">BUILT FOR INDIAN CONTRACTORS</span>
                </motion.div>
                
                <motion.h1 variants={fadeInUp} className="text-[clamp(2.25rem,3.8vw,4rem)] font-bold text-white leading-[1.1] mb-4 tracking-tight">
                  Complete Control of<br className="hidden sm:block" />
                  <span className="sm:hidden"> </span><span className="sm:whitespace-nowrap">Your <span className="text-accent">Project Finances</span></span>
                </motion.h1>
                
                <motion.p variants={fadeInUp} className="text-[clamp(1rem,1.5vw,1.125rem)] text-gray-300 mb-6 max-w-lg">
                  Track project value, credits, expenses and<br className="hidden sm:block" /><span className="sm:hidden"> </span>know your profit or loss in real time.
                </motion.p>
                
                {/* 4 Feature Icons */}
                <motion.div variants={fadeInUp} className="mb-6 max-w-[24rem]">
                  <div className="grid grid-cols-2 gap-6 md:flex md:items-center md:justify-between w-full md:gap-0">
                    
                    <div className="flex flex-col items-center md:items-start lg:items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[clamp(1.25rem,2vw,1.5rem)] h-[clamp(1.25rem,2vw,1.5rem)] text-white">
                        <rect x="2" y="4" width="20" height="14" rx="2" />
                        <path d="M8 22h8" />
                        <path d="M12 18v4" />
                        <path d="M6 14l4-4 3 3 5-5" />
                        <path d="M14 8h4v4" />
                      </svg>
                      <span className="text-[clamp(0.7rem,1.2vw,0.8125rem)] font-normal text-white text-center md:text-left lg:text-center leading-snug">Know Profit<br/>Instantly</span>
                    </div>

                    <div className="hidden md:block w-[1px] h-10 bg-gray-700/60" />

                    <div className="flex flex-col items-center md:items-start lg:items-center gap-2">
                      <FileText className="w-[clamp(1.25rem,2vw,1.5rem)] h-[clamp(1.25rem,2vw,1.5rem)] text-white" strokeWidth={1.5} />
                      <span className="text-[clamp(0.7rem,1.2vw,0.8125rem)] font-normal text-white text-center md:text-left lg:text-center leading-snug">Track Every<br/>Expense</span>
                    </div>

                    <div className="hidden md:block w-[1px] h-10 bg-gray-700/60" />

                    <div className="flex flex-col items-center md:items-start lg:items-center gap-2">
                      <Layers className="w-[clamp(1.25rem,2vw,1.5rem)] h-[clamp(1.25rem,2vw,1.5rem)] text-white" strokeWidth={1.5} />
                      <span className="text-[clamp(0.7rem,1.2vw,0.8125rem)] font-normal text-white text-center md:text-left lg:text-center leading-snug">Monitor<br/>Materials</span>
                    </div>

                    <div className="hidden md:block w-[1px] h-10 bg-gray-700/60" />

                    <div className="flex flex-col items-center md:items-start lg:items-center gap-2">
                      <Wallet className="w-[clamp(1.25rem,2vw,1.5rem)] h-[clamp(1.25rem,2vw,1.5rem)] text-white" strokeWidth={1.5} />
                      <span className="text-[clamp(0.7rem,1.2vw,0.8125rem)] font-normal text-white text-center md:text-left lg:text-center leading-snug">Manage<br/>Payments</span>
                    </div>

                  </div>
                </motion.div>
                
                {/* CTA Buttons */}
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                  <Link href="/register" className="flex justify-center items-center bg-accent hover:bg-accent-600 text-primary px-[clamp(1.5rem,2.5vw,2rem)] py-[clamp(0.75rem,1.2vw,0.875rem)] rounded-lg text-[clamp(0.875rem,1.5vw,1rem)] font-bold transition-all w-full sm:w-auto">
                    Start 3 Months Free Trial <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Link>
                  <button className="flex justify-center items-center border border-gray-600 hover:bg-white/10 text-white px-[clamp(1.5rem,2.5vw,2rem)] py-[clamp(0.75rem,1.2vw,0.875rem)] rounded-lg text-[clamp(0.875rem,1.5vw,1rem)] font-medium transition-all w-full sm:w-auto">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Watch Demo
                  </button>
                </motion.div>
                
                {/* Trust Badges */}
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:flex-wrap items-center sm:items-start gap-4 sm:gap-6 text-[clamp(0.6875rem,1.2vw,0.75rem)] text-gray-300 font-medium pb-8 lg:pb-0">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-white" />
                    <span>1 Project FREE Forever</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-white" />
                    <span>No Credit Card Required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-white" />
                    <span>Cancel Anytime</span>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Image-Based Mockup */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full max-w-[1000px] mx-auto flex items-center justify-center lg:justify-end mt-12 lg:mt-0 lg:-mr-12 xl:-mr-24"
              >
                <img src="/dashboard-mockup.png" alt="MySiteBook Dashboard Mockup" className="w-full h-auto drop-shadow-2xl scale-[1.05] sm:scale-[1.1] md:scale-[1.15] lg:scale-[1.3] origin-center lg:origin-right hover:scale-[1.07] sm:hover:scale-[1.12] md:hover:scale-[1.17] lg:hover:scale-[1.32] transition-transform duration-700" />
              </motion.div>
              
            </div>
          </div>
        </section>

        {/* 3. Dark Stats Banner */}
        <section className="bg-gray-50 pt-8 pb-4 relative z-20">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
            <div className="bg-[#050C1B] rounded-[1.25rem] py-6 md:py-7 px-4 md:px-10 shadow-2xl border border-gray-800/60">
              <div className="grid grid-cols-2 gap-y-8 gap-x-4 md:flex md:flex-row md:items-center md:justify-between w-full">
                
                {/* Item 1 */}
                <div className="flex items-center gap-3 md:gap-4 justify-center md:justify-start">
                  <Users className="w-7 h-7 md:w-[38px] md:h-[38px] text-accent" strokeWidth={1.5} />
                  <div className="flex flex-col text-left">
                    <span className="text-xl md:text-[1.75rem] font-bold text-accent leading-none tracking-tight">5,000+</span>
                    <span className="text-[9px] md:text-xs text-gray-200 font-normal tracking-wide mt-1 md:mt-1.5">Contractors Trust Us</span>
                  </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-gray-700/60" />

                {/* Item 2 */}
                <div className="flex items-center gap-3 md:gap-4 justify-center md:justify-start">
                  <Building2 className="w-7 h-7 md:w-[38px] md:h-[38px] text-accent" strokeWidth={1.5} />
                  <div className="flex flex-col text-left">
                    <span className="text-xl md:text-[1.75rem] font-bold text-accent leading-none tracking-tight">25,000+</span>
                    <span className="text-[9px] md:text-xs text-gray-200 font-normal tracking-wide mt-1 md:mt-1.5">Projects Managed</span>
                  </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-gray-700/60" />

                {/* Item 3 */}
                <div className="flex items-center gap-3 md:gap-4 justify-center md:justify-start">
                  <FileText className="w-7 h-7 md:w-[38px] md:h-[38px] text-accent" strokeWidth={1.5} />
                  <div className="flex flex-col text-left">
                    <span className="text-xl md:text-[1.75rem] font-bold text-accent leading-none tracking-tight">10L+</span>
                    <span className="text-[9px] md:text-xs text-gray-200 font-normal tracking-wide mt-1 md:mt-1.5">Bills Stored</span>
                  </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-gray-700/60" />

                {/* Item 4 */}
                <div className="flex items-center gap-3 md:gap-4 justify-center md:justify-start">
                  <div className="w-7 h-7 md:w-[38px] md:h-[38px] rounded-full border-[1.5px] border-accent text-accent flex items-center justify-center text-base md:text-xl font-medium">₹</div>
                  <div className="flex flex-col text-left">
                    <span className="text-xl md:text-[1.75rem] font-bold text-accent leading-none tracking-tight">₹500Cr+</span>
                    <span className="text-[9px] md:text-xs text-gray-200 font-normal tracking-wide mt-1 md:mt-1.5">Expenses Tracked</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 4. Light 3-Column Features Section */}
        <section className="pt-6 pb-20 md:pt-10 md:pb-24 bg-gray-50 text-brandtext">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Column 1: Track Every Rupee */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Track Every Rupee</h3>
                  <p className="text-xs text-gray-500 font-medium">Never lose money again</p>
                </div>
                
                <div className="relative flex-1 flex flex-col justify-start max-w-[280px] mx-auto w-full pt-2">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-4 bottom-14 w-px border-l border-dashed border-gray-300 z-0"></div>
                  
                  <div className="space-y-4 relative z-10 w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="w-4 border-t border-dashed border-gray-300 relative"><div className="absolute -right-[2px] -top-[3px] border-solid border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[4px] border-l-gray-300"></div></div>
                      <div className="flex-1 flex flex-col justify-center pb-1">
                        <div className="text-[10px] font-semibold text-gray-500">Project Value</div>
                        <div className="text-base font-bold text-gray-800 leading-tight">₹15,00,000</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-[#F0FDF4] flex items-center justify-center shrink-0">
                         <CreditCard className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="w-4 border-t border-dashed border-gray-300 relative"><div className="absolute -right-[2px] -top-[3px] border-solid border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[4px] border-l-gray-300"></div></div>
                      <div className="flex-1 flex flex-col justify-center pb-1">
                        <div className="text-[10px] font-semibold text-gray-500">Credits Received</div>
                        <div className="text-base font-bold text-gray-800 leading-tight">₹10,00,000</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
                        <Receipt className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="w-4 border-t border-dashed border-gray-300 relative"><div className="absolute -right-[2px] -top-[3px] border-solid border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[4px] border-l-gray-300"></div></div>
                      <div className="flex-1 flex flex-col justify-center pb-1">
                        <div className="text-[10px] font-semibold text-gray-500">Total Expenses</div>
                        <div className="text-base font-bold text-gray-800 leading-tight">₹8,20,000</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-[#F0FDF4] p-2 -mx-2 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0 shadow-sm">
                        <span className="text-green-600 font-bold text-lg">₹</span>
                      </div>
                      <div className="w-4 border-t border-dashed border-green-300 relative"><div className="absolute -right-[2px] -top-[3px] border-solid border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[4px] border-l-green-300"></div></div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="text-[10px] font-semibold text-gray-800">Current Profit</div>
                        <div className="text-base font-bold text-green-600 leading-tight">₹1,80,000</div>
                        <div className="text-[9px] font-medium text-gray-500">12% of Project Value</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Material Tracking */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Material Tracking</h3>
                  <p className="text-xs text-gray-500 font-medium">Know what you buy, use and have</p>
                </div>
                
                <div className="flex-1 space-y-1 mb-6 flex flex-col justify-center px-4">
                  {[
                    { n: "Cement", q: "250 Bags", icon: "🏢" },
                    { n: "Steel", q: "4.2 Ton", icon: "🏗️" },
                    { n: "Sand", q: "18 Loads", icon: "🏜️" },
                    { n: "Bricks", q: "12,500 Nos", icon: "🧱" },
                    { n: "Jalli", q: "12 Loads", icon: "🪨" },
                  ].map((mat, i) => (
                     <div key={i} className="flex justify-between items-center py-2.5">
                       <div className="flex items-center gap-4">
                         <div className="w-6 h-6 flex items-center justify-center text-lg">{mat.icon}</div>
                         <span className="font-bold text-xs text-gray-800">{mat.n}</span>
                       </div>
                       <span className="font-bold text-xs text-gray-700">{mat.q}</span>
                     </div>
                  ))}
                </div>
                
                <button className="w-full py-2.5 border border-[#D97706]/30 text-[#D97706] bg-[#D97706]/5 rounded-lg text-xs font-bold hover:bg-[#D97706]/10 transition-colors mt-auto">
                  View All Materials
                </button>
              </div>

              {/* Column 3: Expense Breakdown */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Expense Breakdown</h3>
                  <p className="text-xs text-gray-500 font-medium">Where your money is going</p>
                </div>
                
                <div className="flex-1 flex flex-col xl:flex-row items-center justify-center gap-6 w-full mt-2 mb-6">
                  {/* Chart */}
                  <div className="relative w-36 h-36 shrink-0 rounded-full flex items-center justify-center shadow-sm"
                       style={{ background: 'conic-gradient(#3B82F6 0% 60%, #22C55E 60% 85%, #F59E0B 85% 95%, #A855F7 95% 100%)' }}>
                    <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                      <span className="font-bold text-sm text-gray-800">₹8,20,000</span>
                      <span className="text-[7px] text-gray-500 font-bold uppercase mt-0.5">Total Expenses</span>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex-1 space-y-4 w-full px-2 xl:px-0">
                    <div className="flex justify-between items-center w-full">
                      <span className="flex items-center gap-2 font-semibold text-gray-700 text-xs"><div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div> Materials</span>
                      <div className="text-right flex flex-col leading-tight"><span className="font-bold text-gray-800 text-xs">60%</span><span className="text-[9px] text-gray-400 font-medium">₹4,92,000</span></div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <span className="flex items-center gap-2 font-semibold text-gray-700 text-xs"><div className="w-2 h-2 rounded-full bg-[#22C55E]"></div> Labour</span>
                      <div className="text-right flex flex-col leading-tight"><span className="font-bold text-gray-800 text-xs">25%</span><span className="text-[9px] text-gray-400 font-medium">₹2,05,000</span></div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <span className="flex items-center gap-2 font-semibold text-gray-700 text-xs"><div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div> Transport</span>
                      <div className="text-right flex flex-col leading-tight"><span className="font-bold text-gray-800 text-xs">10%</span><span className="text-[9px] text-gray-400 font-medium">₹82,000</span></div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <span className="flex items-center gap-2 font-semibold text-gray-700 text-xs"><div className="w-2 h-2 rounded-full bg-[#A855F7]"></div> Other Expenses</span>
                      <div className="text-right flex flex-col leading-tight"><span className="font-bold text-gray-800 text-xs">5%</span><span className="text-[9px] text-gray-400 font-medium">₹41,000</span></div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full py-2.5 border border-[#D97706]/30 text-[#D97706] bg-[#D97706]/5 rounded-lg text-xs font-bold hover:bg-[#D97706]/10 transition-colors mt-auto">
                  View All Expenses
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* 5. Dark Testimonial Banner */}
        <section className="bg-gray-50 pt-2 pb-2 relative -mt-8 md:-mt-12 z-20">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
            <div className="bg-[#0A1629] bg-[url('/banner-bg.png')] bg-cover bg-center bg-blend-overlay rounded-[12px] pr-6 pl-6 lg:pr-12 lg:pl-0 flex flex-col md:flex-row items-center relative shadow-lg">
               
               {/* Left: Contractor Image (Absolute to pop out of top and bottom) */}
               <div className="hidden md:block w-48 md:w-56 lg:w-[280px] h-[220px] md:h-[260px] lg:h-[320px] absolute bottom-0 left-0 lg:left-2 z-30">
                 <img 
                   src="/contractor-photo.png" 
                   alt="Civil Contractor" 
                   className="w-full h-full object-contain object-bottom drop-shadow-2xl"
                 />
               </div>
               {/* Spacer to push content to the right because the image is absolute */}
               <div className="hidden md:block w-48 md:w-56 lg:w-[320px] shrink-0"></div>
               
               {/* Middle: Quote */}
               <div className="py-8 md:py-10 md:pl-2 md:pr-4 flex items-start gap-3 max-w-3xl">
                 <div className="text-4xl lg:text-5xl font-serif text-[#F59E0B] leading-none pt-1 font-bold shrink-0">“</div>
                 <div>
                   <p className="text-sm lg:text-[15px] text-white font-medium leading-relaxed mb-3 relative inline-block pr-8 lg:pr-12">
                     MySiteBook has changed the way we manage<br className="hidden lg:block"/> our projects. Now I know my profit in real time,<br className="hidden lg:block"/> not after the project is over.
                     {/* Faint closing quote behind text */}
                     <span className="absolute right-0 -bottom-14 text-6xl lg:text-8xl font-serif text-white/5 leading-none pointer-events-none">”</span>
                   </p>
                   <div className="text-[11px] lg:text-xs text-gray-300">
                     - <span className="text-white font-semibold">Rajesh Kumar</span>, Civil Contractor, Coimbatore
                   </div>
                 </div>
               </div>
               
               {/* Divider */}
               <div className="hidden md:block w-px h-20 bg-gray-700/60 mx-4 lg:mx-8"></div>
               
               {/* Right: Stars */}
               <div className="py-6 md:py-8 shrink-0 text-center md:text-left flex flex-col items-center md:items-start border-t md:border-t-0 border-gray-700/50 w-full md:w-auto">
                 <div className="flex gap-1 mb-2.5">
                   {[1,2,3,4,5].map(i => <svg key={i} className="w-4 h-4 text-[#F59E0B] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                 </div>
                 <div className="text-xs font-semibold text-white mb-0.5">Trusted by contractors</div>
                 <div className="text-[11px] text-gray-400">across India</div>
               </div>
            </div>
          </div>
        </section>

        {/* 6. Pricing Section */}
        <section className="bg-gray-50 pb-8 pt-4" id="pricing">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Simple Pricing. Maximum Value.</h2>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-[20px] shadow-sm w-full flex flex-col lg:flex-row items-stretch relative overflow-hidden">
               
               {/* Col 1: Price and Features */}
               <div className="w-full lg:w-[40%] flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-100 py-6 lg:py-8 px-6 lg:px-10">
                 <div className="text-sm text-gray-800 font-bold mb-1">Only</div>
                 <div className="flex items-end gap-1 mb-5 inline-flex relative w-fit">
                   <div className="text-5xl md:text-6xl font-black text-gray-800 leading-none">₹999</div>
                   <div className="text-xs text-gray-600 font-semibold mb-1.5">/month</div>
                   {/* Orange underline */}
                   <div className="absolute -bottom-2 left-1 w-12 h-1 bg-[#F59E0B] rounded-full"></div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                   <div className="flex items-center gap-2.5 text-[11px] md:text-xs font-bold text-gray-700 whitespace-nowrap"><Check strokeWidth={3} className="w-4 h-4 text-gray-900 shrink-0" /> Unlimited Projects</div>
                   <div className="flex items-center gap-2.5 text-[11px] md:text-xs font-bold text-gray-700 whitespace-nowrap"><Check strokeWidth={3} className="w-4 h-4 text-gray-900 shrink-0" /> Material Tracking</div>
                   
                   <div className="flex items-center gap-2.5 text-[11px] md:text-xs font-bold text-gray-700 whitespace-nowrap"><Check strokeWidth={3} className="w-4 h-4 text-gray-900 shrink-0" /> Unlimited Expense Entries</div>
                   <div className="flex items-center gap-2.5 text-[11px] md:text-xs font-bold text-gray-700 whitespace-nowrap"><Check strokeWidth={3} className="w-4 h-4 text-gray-900 shrink-0" /> Bill Storage</div>
                   
                   <div className="flex items-center gap-2.5 text-[11px] md:text-xs font-bold text-gray-700 whitespace-nowrap"><Check strokeWidth={3} className="w-4 h-4 text-gray-900 shrink-0" /> Profit & Loss Reports</div>
                   <div className="flex items-center gap-2.5 text-[11px] md:text-xs font-bold text-gray-700 whitespace-nowrap"><Check strokeWidth={3} className="w-4 h-4 text-gray-900 shrink-0" /> Priority Support</div>
                 </div>
               </div>
               
               {/* Col 2: Offers */}
               <div className="w-full lg:w-[32%] flex items-center justify-center gap-4 md:gap-8 border-b lg:border-b-0 lg:border-r border-gray-100 py-6 lg:py-8 px-6 lg:px-8">
                 <div className="text-center flex flex-col items-center">
                   <div className="w-16 h-16 bg-[#e6f4ea] rounded-full flex items-center justify-center mb-3">
                     <svg className="w-8 h-8 text-[#137333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                       <path d="M1.5 10.5L12 2l10.5 8.5" />
                       <path d="M4 8.5V22h16V8.5" />
                       <circle cx="12" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
                       <rect x="6" y="14" width="5" height="5" />
                       <path d="M8.5 14v5M6 16.5h5" />
                       <path d="M14 22v-8h4v8" />
                     </svg>
                   </div>
                   <div className="font-bold text-gray-800 text-sm leading-tight">1 Project<br/>FREE Forever</div>
                 </div>
                 
                 <div className="text-3xl font-black text-gray-900 shrink-0">+</div>
                 
                 <div className="text-center flex flex-col items-center">
                   <div className="w-16 h-16 bg-[#fef0db] rounded-full flex items-center justify-center mb-3">
                     <Gift strokeWidth={2.5} className="w-8 h-8 text-[#d97706]" />
                   </div>
                   <div className="font-bold text-gray-800 text-sm leading-tight">3 Months<br/>FREE Trial</div>
                 </div>
               </div>
               
               {/* Col 3: CTA Button */}
               <div className="w-full lg:w-[28%] flex flex-col justify-center items-center lg:items-start py-6 lg:py-8 px-6 lg:px-10">
                 <Link href="/register" className="w-full text-center bg-[#F4B63A] hover:bg-[#F59E0B] text-gray-900 px-4 md:px-8 py-3.5 rounded-lg text-sm font-bold transition-all mb-5">
                   Start 3 Months Free Trial
                 </Link>
                 <div className="space-y-3 self-center lg:self-start ml-2">
                   <div className="flex items-center gap-2.5 text-[11.5px] font-bold text-gray-800"><Check strokeWidth={3} className="w-3.5 h-3.5 text-gray-900" /> No Credit Card Required</div>
                   <div className="flex items-center gap-2.5 text-[11.5px] font-bold text-gray-800"><Check strokeWidth={3} className="w-3.5 h-3.5 text-gray-900" /> Cancel Anytime</div>
                 </div>
               </div>
               
            </div>
          </div>
        </section>

      </main>

      {/* 7. Footer */}
      <footer className="bg-[#0A1121] text-gray-300 pt-12 pb-6 border-t border-gray-800">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
            <div className="col-span-1 md:col-span-2 pr-0 lg:pr-12">
              <img src="/mysitebook-horizontal.png" alt="MySiteBook" className="h-12 w-auto mb-4" />
              <p className="text-[14px] text-gray-300 mb-5 font-medium leading-relaxed">
                The all-in-one finance management<br/>solution for construction contractors.
              </p>
              <div className="flex gap-3.5">
                <a href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-800 transition-colors"><FaFacebook className="w-[15px] h-[15px] text-white" /></a>
                <a href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-800 transition-colors"><FaInstagram className="w-[15px] h-[15px] text-white" /></a>
                <a href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-800 transition-colors"><FaYoutube className="w-[15px] h-[15px] text-white" /></a>
                <a href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-800 transition-colors"><FaLinkedin className="w-[15px] h-[15px] text-white" /></a>
              </div>
            </div>
            
            <div className="col-span-1">
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wider">PRODUCT</h4>
              <ul className="space-y-3 text-[13px] font-medium text-gray-300">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wider">RESOURCES</h4>
              <ul className="space-y-3 text-[13px] font-medium text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Video Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wider">COMPANY</h4>
              <ul className="space-y-3 text-[13px] font-medium text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wider">Get in Touch</h4>
              <ul className="space-y-4 text-sm font-semibold text-white">
                <li className="flex items-center gap-3">
                  <FaWhatsapp className="w-5 h-5 text-[#25D366] shrink-0" />
                  +91 12345 67890
                </li>
                <li className="flex items-center gap-3">
                  <FaPhoneAlt className="w-4 h-4 text-white shrink-0 ml-0.5" />
                  <span className="ml-0.5">+91 12345 67890</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaRegEnvelope className="w-5 h-5 text-white shrink-0" />
                  support@mysitebook.com
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-5 border-t border-gray-700/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[13px] font-medium text-gray-400">© 2024 MySiteBook Technologies Pvt. Ltd. All rights reserved.</p>
            <p className="text-[13px] font-medium text-gray-400 flex items-center gap-1.5">Made with <span className="text-red-500">❤️</span> in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
