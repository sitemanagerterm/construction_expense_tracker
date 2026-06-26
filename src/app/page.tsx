"use client";

import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { 
  FaPlay, 
  FaLock,
  FaCheckCircle,
  FaBuilding,
  FaHardHat,
  FaChartPie,
  FaFileInvoiceDollar,
  FaSync,
  FaHistory,
  FaUserFriends,
  FaMobileAlt,
  FaChevronDown
} from "react-icons/fa";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    if (faqOpen === index) setFaqOpen(null);
    else setFaqOpen(index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-[#111827]">
      
      {/* 1. HEADER */}
      <header className="fixed top-0 w-full z-50 bg-[#0A192F] border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <img src="/mysitebook-logo-transparent.png" alt="MySiteBook" className="h-10 w-auto object-contain" />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8 items-center text-white/90">
              <Link href="#features" className="text-sm font-semibold hover:text-white transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-sm font-semibold hover:text-white transition-colors">How It Works</Link>
              <Link href="#pricing" className="text-sm font-semibold hover:text-white transition-colors">Pricing</Link>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-semibold hover:text-white transition-colors">
                  <span>Resources</span>
                  <FaChevronDown className="w-3 h-3 opacity-70" />
                </button>
                {/* Simple dropdown hover (CSS only for now) */}
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 hidden group-hover:block border border-gray-100">
                  <Link href="/blog" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Blog</Link>
                  <Link href="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Help Center</Link>
                </div>
              </div>
              <Link href="/about" className="text-sm font-semibold hover:text-white transition-colors">About Us</Link>
            </nav>
            
            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4 shrink-0">
              <Link href="/login" className="flex items-center text-sm font-semibold text-[#F97316] border border-[#F97316] px-5 py-2 rounded-full hover:bg-[#F97316]/10 transition-all">
                <FaLock className="mr-2 w-3 h-3" /> Log In
              </Link>
              <Link href="/register" className="bg-[#F9B233] text-[#0A192F] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#FFC145] transition-all shadow-lg">
                Start Free Trial
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0A192F] border-t border-white/10 pb-4">
            <div className="px-4 space-y-2 pt-2">
              <Link href="#features" className="block text-white/90 font-semibold py-2">Features</Link>
              <Link href="#how-it-works" className="block text-white/90 font-semibold py-2">How It Works</Link>
              <Link href="#pricing" className="block text-white/90 font-semibold py-2">Pricing</Link>
              <Link href="/login" className="block text-[#F97316] font-semibold py-2">Log In</Link>
              <Link href="/register" className="block text-[#F9B233] font-semibold py-2">Start Free Trial</Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow pt-20">
        
        {/* 2. HERO SECTION */}
        <section className="relative bg-[#0A192F] text-white pt-16 pb-32 lg:pt-24 lg:pb-40 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#F9B233]/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/4"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 border border-white/20 bg-white/5 px-4 py-1.5 rounded-full mb-6">
                <FaHardHat className="text-[#F9B233] w-4 h-4" />
                <span className="text-xs font-bold text-[#F9B233] uppercase tracking-wider">Built For Indian Contractors</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] text-white">
                Complete Control of <br />
                Your <span className="text-[#F9B233]">Project Finances</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-white/80 font-light tracking-wide mb-10 leading-relaxed">
                Track project value, credits, expenses and know your profit or loss in real time.
              </p>

              {/* 4 Icons Row */}
              <div className="grid grid-cols-4 gap-4 mb-10 border-b border-white/10 pb-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl mb-3">
                    <FaChartPie className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wide">Know Profit<br/>Instantly</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl mb-3">
                    <FaFileInvoiceDollar className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wide">Track Every<br/>Expense</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl mb-3">
                    <FaBuilding className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wide">Monitor<br/>Materials</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl mb-3">
                    <FaSync className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wide">Manage<br/>Payments</span>
                </div>
              </div>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <Link href="/register" className="w-full sm:w-auto bg-[#F9B233] text-[#0A192F] px-8 py-3.5 rounded-full font-extrabold text-base hover:bg-[#FFC145] transition-all shadow-lg flex items-center justify-center">
                  Start 3 Months Free Trial &rarr;
                </Link>
                <Link href="#how-it-works" className="w-full sm:w-auto bg-transparent border border-white/30 text-white hover:bg-white/5 px-8 py-3.5 rounded-full font-semibold text-base transition-all flex items-center justify-center">
                  <FaPlay className="mr-2 w-3 h-3" /> Watch Demo
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/70 font-medium">
                <span className="flex items-center"><FaCheckCircle className="text-white/50 mr-2" /> 1 Project FREE Forever</span>
                <span className="flex items-center"><FaCheckCircle className="text-white/50 mr-2" /> No Credit Card Required</span>
                <span className="flex items-center"><FaCheckCircle className="text-white/50 mr-2" /> Cancel Anytime</span>
              </div>
            </div>

            {/* Right Content (Mockups) */}
            <div className="relative mt-12 lg:mt-0 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg lg:max-w-xl">
                {/* Laptop Mockup Placeholder */}
                <div className="bg-[#0f284e] border-4 border-gray-800 rounded-t-2xl shadow-2xl overflow-hidden aspect-[16/10] relative flex items-center justify-center">
                  <img src="/dashboard-mockup.png" alt="Dashboard" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] to-transparent opacity-40"></div>
                </div>
                {/* Laptop Base */}
                <div className="w-full h-4 bg-gray-400 rounded-b-xl"></div>
                <div className="w-[120%] -ml-[10%] h-3 bg-gray-300 rounded-b-full shadow-xl"></div>

                {/* Mobile Mockup Placeholder Overlay */}
                <div className="absolute -bottom-10 -left-6 w-32 md:w-40 bg-white border-4 border-gray-900 rounded-[2rem] shadow-2xl aspect-[9/19] overflow-hidden z-20">
                  <div className="w-full h-full bg-gray-100 flex flex-col">
                    <div className="bg-primary text-white p-3 text-xs font-bold text-center">MySiteBook</div>
                    <div className="p-3">
                      <div className="text-[10px] text-gray-500 font-bold uppercase">Current Profit</div>
                      <div className="text-sm font-black text-green-600">₹1,80,000</div>
                      <div className="mt-3 space-y-2">
                        <div className="bg-white rounded shadow-sm p-2 text-[10px] flex justify-between"><span className="text-gray-500">Value</span><span className="font-bold text-gray-900">₹15,00,000</span></div>
                        <div className="bg-white rounded shadow-sm p-2 text-[10px] flex justify-between"><span className="text-gray-500">Credits</span><span className="font-bold text-gray-900">₹10,00,000</span></div>
                        <div className="bg-white rounded shadow-sm p-2 text-[10px] flex justify-between"><span className="text-gray-500">Expenses</span><span className="font-bold text-gray-900">₹8,20,000</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. STATS BAR */}
        <section className="bg-[#051020] text-white py-10 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
              <div className="flex items-center justify-center space-x-4 px-4">
                <FaUserFriends className="w-10 h-10 text-[#F9B233]" />
                <div>
                  <div className="text-2xl font-black">5,000+</div>
                  <div className="text-xs text-white/60 uppercase tracking-widest font-semibold">Contractors Trust Us</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4 px-4">
                <FaBuilding className="w-10 h-10 text-[#F9B233]" />
                <div>
                  <div className="text-2xl font-black">25,000+</div>
                  <div className="text-xs text-white/60 uppercase tracking-widest font-semibold">Projects Managed</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4 px-4">
                <FaFileInvoiceDollar className="w-10 h-10 text-[#F9B233]" />
                <div>
                  <div className="text-2xl font-black">10L+</div>
                  <div className="text-xs text-white/60 uppercase tracking-widest font-semibold">Bills Stored</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4 px-4">
                <div className="w-10 h-10 rounded-full border-2 border-[#F9B233] flex items-center justify-center text-[#F9B233] font-bold text-xl">₹</div>
                <div>
                  <div className="text-2xl font-black">₹500Cr+</div>
                  <div className="text-xs text-white/60 uppercase tracking-widest font-semibold">Expenses Tracked</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. VISUAL CARDS SECTION (From Image) */}
        <section className="bg-[#F8FAFC] py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Card 1: Track Every Rupee */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900">Track Every Rupee</h3>
                  <p className="text-sm text-gray-500 font-medium">Never lose money again</p>
                </div>
                
                <div className="relative pl-8 space-y-8 flex-grow">
                  {/* Vertical Line */}
                  <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gray-200"></div>
                  
                  {/* Item 1 */}
                  <div className="relative">
                    <div className="absolute -left-[35px] top-1 w-10 h-10 bg-blue-50 border-4 border-white rounded-full flex items-center justify-center z-10 text-blue-500 shadow-sm"><FaBuilding className="w-4 h-4"/></div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Project Value</p>
                      <p className="text-2xl font-black text-gray-900">₹15,00,000</p>
                    </div>
                  </div>
                  
                  {/* Item 2 */}
                  <div className="relative">
                    <div className="absolute -left-[35px] top-1 w-10 h-10 bg-green-50 border-4 border-white rounded-full flex items-center justify-center z-10 text-green-500 shadow-sm"><FaCheckCircle className="w-4 h-4"/></div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Credits Received</p>
                      <p className="text-2xl font-black text-gray-900">₹10,00,000</p>
                    </div>
                  </div>
                  
                  {/* Item 3 */}
                  <div className="relative">
                    <div className="absolute -left-[35px] top-1 w-10 h-10 bg-red-50 border-4 border-white rounded-full flex items-center justify-center z-10 text-red-500 shadow-sm"><FaFileInvoiceDollar className="w-4 h-4"/></div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Total Expenses</p>
                      <p className="text-2xl font-black text-gray-900">₹8,20,000</p>
                    </div>
                  </div>
                  
                  {/* Item 4 */}
                  <div className="relative pt-4 border-t border-gray-100">
                    <div className="absolute -left-[35px] top-5 w-10 h-10 bg-green-500 border-4 border-white rounded-full flex items-center justify-center z-10 text-white shadow-sm font-bold">₹</div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Current Profit</p>
                      <p className="text-3xl font-black text-green-600">₹1,80,000</p>
                      <p className="text-xs font-medium text-gray-500 mt-1">12% of Project Value</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Material Tracking */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900">Material Tracking</h3>
                  <p className="text-sm text-gray-500 font-medium">Know what you buy, use and have</p>
                </div>
                
                <div className="space-y-6 flex-grow">
                  <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    <div className="flex items-center"><div className="w-8 h-8 bg-[#D2B48C] rounded flex items-center justify-center mr-3 text-white font-bold text-xs">C</div> <span className="font-bold text-gray-800 text-sm">Cement</span></div>
                    <span className="font-bold text-gray-600 text-sm">250 Bags</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    <div className="flex items-center"><div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center mr-3 text-white font-bold text-xs">S</div> <span className="font-bold text-gray-800 text-sm">Steel</span></div>
                    <span className="font-bold text-gray-600 text-sm">4.2 Ton</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    <div className="flex items-center"><div className="w-8 h-8 bg-yellow-600 rounded flex items-center justify-center mr-3 text-white font-bold text-xs">S</div> <span className="font-bold text-gray-800 text-sm">Sand</span></div>
                    <span className="font-bold text-gray-600 text-sm">18 Loads</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    <div className="flex items-center"><div className="w-8 h-8 bg-red-700 rounded flex items-center justify-center mr-3 text-white font-bold text-xs">B</div> <span className="font-bold text-gray-800 text-sm">Bricks</span></div>
                    <span className="font-bold text-gray-600 text-sm">12,500 Nos</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    <div className="flex items-center"><div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center mr-3 text-white font-bold text-xs">J</div> <span className="font-bold text-gray-800 text-sm">Jalli</span></div>
                    <span className="font-bold text-gray-600 text-sm">12 Loads</span>
                  </div>
                </div>
                
                <button className="mt-6 w-full py-3 rounded-xl font-bold text-[#F9B233] bg-[#F9B233]/10 hover:bg-[#F9B233]/20 transition-colors text-sm">
                  View All Materials
                </button>
              </div>

              {/* Card 3: Expense Breakdown */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900">Expense Breakdown</h3>
                  <p className="text-sm text-gray-500 font-medium">Where your money is going</p>
                </div>
                
                <div className="flex-grow flex flex-col items-center justify-center pb-6">
                  {/* CSS Donut Chart representation */}
                  <div className="relative w-40 h-40 rounded-full flex items-center justify-center" 
                       style={{ background: 'conic-gradient(#153E75 0% 60%, #16A34A 60% 85%, #F59E0B 85% 95%, #E5E7EB 95% 100%)' }}>
                    <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                      <span className="text-xl font-black text-gray-900">₹8,20,000</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase">Total Expenses</span>
                    </div>
                  </div>
                  
                  {/* Chart Legend */}
                  <div className="w-full mt-8 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#153E75] mr-2"></span><span className="text-sm font-bold text-gray-700">Materials</span></div>
                      <div className="text-right"><span className="text-sm font-black text-gray-900">60%</span><div className="text-[10px] text-gray-400 font-medium">₹4,92,000</div></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#16A34A] mr-2"></span><span className="text-sm font-bold text-gray-700">Labour</span></div>
                      <div className="text-right"><span className="text-sm font-black text-gray-900">25%</span><div className="text-[10px] text-gray-400 font-medium">₹2,05,000</div></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#F59E0B] mr-2"></span><span className="text-sm font-bold text-gray-700">Transport</span></div>
                      <div className="text-right"><span className="text-sm font-black text-gray-900">10%</span><div className="text-[10px] text-gray-400 font-medium">₹82,000</div></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-gray-300 mr-2"></span><span className="text-sm font-bold text-gray-700">Other</span></div>
                      <div className="text-right"><span className="text-sm font-black text-gray-900">5%</span><div className="text-[10px] text-gray-400 font-medium">₹41,000</div></div>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 rounded-xl font-bold text-[#F9B233] bg-[#F9B233]/10 hover:bg-[#F9B233]/20 transition-colors text-sm">
                  View All Expenses
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* 5. TESTIMONIAL SECTION */}
        <section className="bg-white py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-10 relative z-20">
          <div className="bg-[#0A192F] rounded-[2rem] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-10">
            {/* Image Placeholder */}
            <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 bg-blue-900 rounded-full border-4 border-[#F9B233] overflow-hidden flex items-center justify-center">
               <div className="text-center text-white/50 text-xs px-4">Contractor Image Placeholder</div>
            </div>
            
            {/* Quote */}
            <div className="flex-grow text-center md:text-left relative">
              <div className="absolute -top-6 -left-6 text-6xl text-white/10 font-serif">"</div>
              <p className="text-xl md:text-2xl text-white font-medium italic mb-6 leading-relaxed relative z-10">
                "MySiteBook has changed the way we manage our projects. Now I know my profit in real time, not after the project is over."
              </p>
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div>
                  <p className="text-white font-bold text-lg">- Rajesh Kumar</p>
                  <p className="text-white/60 text-sm">Civil Contractor, Coimbatore</p>
                </div>
                <div className="text-center md:text-right">
                  <div className="flex justify-center md:justify-end text-[#F9B233] mb-1">
                    ★ ★ ★ ★ ★
                  </div>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Trusted by contractors across India</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. HOW IT WORKS (From User Copy) */}
        <section id="how-it-works" className="py-24 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-black text-accent uppercase tracking-widest mb-2">How It Works</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Four Simple Steps</h3>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center px-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl font-black mb-6">1</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Create a Project</h4>
                <p className="text-gray-600 font-medium">Enter project details including project name, client details, and total project value.</p>
              </div>
              <div className="text-center px-4">
                <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl font-black mb-6">2</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Track Credits</h4>
                <p className="text-gray-600 font-medium">Record all payments received from your client securely.</p>
              </div>
              <div className="text-center px-4">
                <div className="w-16 h-16 mx-auto bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl font-black mb-6">3</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Log Expenses</h4>
                <p className="text-gray-600 font-medium">Add expenses as they happen. Labour, materials, transport, rentals, and more.</p>
              </div>
              <div className="text-center px-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black mb-6">4</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Monitor Profit</h4>
                <p className="text-gray-600 font-medium">MySiteBook automatically calculates project profitability and financial performance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. DETAILED FEATURES (From User Copy) */}
        <section id="features" className="py-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-sm font-black text-accent uppercase tracking-widest mb-2">Features</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Everything You Need To Control Project Finances</h3>
              <p className="text-lg text-gray-600 font-medium">MySiteBook is designed specifically for contractors who want complete visibility over their project finances.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Project Value Tracking', desc: 'Set the total project value and monitor progress from day one.' },
                { title: 'Credit Tracking', desc: 'Track every payment received from clients and identify outstanding amounts instantly.' },
                { title: 'Expense Management', desc: 'Record all project expenses including labour, materials, transport, equipment, and miscellaneous costs.' },
                { title: 'Profit & Loss Dashboard', desc: "Know your project's financial health in real time without waiting until completion." },
                { title: 'Material Tracking', desc: 'Monitor purchases of cement, steel, sand, bricks, and other construction materials.' },
                { title: 'Bill Storage', desc: 'Store receipts and invoices securely for future reference.' },
                { title: 'Multi-Project Management', desc: 'Manage multiple construction projects from a single dashboard.' },
                { title: 'Team Access', desc: 'Allow site engineers and supervisors to log expenses from anywhere.' },
                { title: 'Reports & Analytics', desc: 'Generate detailed financial reports and project summaries.' }
              ].map((f, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    <FaCheckCircle />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h4>
                  <p className="text-gray-600 font-medium leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. PRICING SECTION (From Image & User Copy) */}
        <section id="pricing" className="py-24 bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Simple Pricing. Maximum Value.</h2>
            <p className="text-xl text-gray-600 font-medium mb-16">Start with a special launch offer. Upgrade only when you need more power.</p>
            
            <div className="bg-[#F8FAFC] rounded-[3rem] p-8 md:p-12 border border-gray-200 shadow-xl flex flex-col md:flex-row items-center gap-10">
              
              {/* Left: Price */}
              <div className="w-full md:w-1/3 text-left">
                <span className="bg-primary text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block">PRO PLAN</span>
                <div className="mb-6">
                  <span className="text-sm font-bold text-gray-500 uppercase">Only</span><br/>
                  <span className="text-6xl font-black text-gray-900">₹999</span>
                  <span className="text-gray-500 font-semibold ml-2">/month</span>
                </div>
                
                <ul className="space-y-3 text-sm font-semibold text-gray-700">
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2"/> Unlimited Projects</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2"/> Unlimited Expense Entries</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2"/> Profit & Loss Reports</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2"/> Material Tracking</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2"/> Bill Storage</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2"/> Priority Support</li>
                </ul>
              </div>

              {/* Middle: Badges */}
              <div className="w-full md:w-1/3 flex flex-col gap-6 justify-center items-center border-y md:border-y-0 md:border-x border-gray-200 py-8 md:py-0 md:px-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mb-3">
                    <FaBuilding />
                  </div>
                  <span className="font-bold text-gray-900 text-lg">1 Project<br/>FREE Forever</span>
                </div>
                <div className="text-2xl font-black text-gray-300">+</div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-2xl mb-3">
                    <FaPlay />
                  </div>
                  <span className="font-bold text-gray-900 text-lg">3 Months<br/>FREE Trial</span>
                </div>
              </div>

              {/* Right: CTA */}
              <div className="w-full md:w-1/3 flex flex-col justify-center text-left md:pl-8">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6">
                  <p className="text-sm font-bold text-yellow-800 text-center">Special Launch Offer</p>
                  <p className="text-xs text-yellow-700 text-center mt-1 font-medium">Get 90 Days FREE Trial on the Pro Plan.</p>
                </div>
                
                <Link href="/register" className="w-full bg-[#F9B233] text-[#0A192F] py-4 rounded-full font-black text-lg hover:bg-[#FFC145] transition-all shadow-lg text-center mb-6">
                  Start 3 Months Free Trial
                </Link>
                
                <ul className="space-y-3 text-sm font-semibold text-gray-600">
                  <li className="flex items-center"><FaCheckCircle className="text-gray-400 mr-2"/> No Credit Card Required</li>
                  <li className="flex items-center"><FaCheckCircle className="text-gray-400 mr-2"/> Cancel Anytime</li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* 9. FAQS (From User Copy) */}
        <section className="py-24 bg-[#F8FAFC]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-black text-accent uppercase tracking-widest mb-2">FAQs</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Frequently Asked Questions</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { q: 'Is MySiteBook suitable for small contractors?', a: 'Yes. It is designed for both individual contractors and growing construction companies.' },
                { q: 'Do I need accounting knowledge?', a: 'No. MySiteBook is designed to be simple and easy to use.' },
                { q: 'Can I use it on mobile?', a: 'Yes. It works on mobile, tablet, and desktop devices.' },
                { q: 'How is profit calculated?', a: 'Profit is calculated using Project Value minus Total Expenses.' },
                { q: 'Is there a free plan?', a: 'Yes. One project is free forever.' },
                { q: 'Can I cancel anytime?', a: 'Yes. There are no long-term contracts.' }
              ].map((faq, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all">
                  <button 
                    onClick={() => toggleFaq(i)} 
                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                  >
                    <span className="font-bold text-gray-900">{faq.q}</span>
                    <FaChevronDown className={`text-gray-400 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} />
                  </button>
                  {faqOpen === i && (
                    <div className="px-6 pb-5 pt-0">
                      <p className="text-gray-600 font-medium">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* 10. FOOTER (From Image & Copy) */}
      <footer className="bg-[#0A192F] text-white pt-20 pb-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            {/* Branding */}
            <div className="lg:col-span-2">
              <img src="/mysitebook-logo-transparent.png" alt="MySiteBook" className="h-12 w-auto mb-6 brightness-0 invert" />
              <p className="text-white/60 font-medium max-w-sm mb-8 leading-relaxed text-sm">
                The all-in-one finance management solution for construction contractors. Track every rupee, know every profit.
              </p>
              {/* Socials Placeholder */}
              <div className="flex space-x-4">
                {['f', 'ig', 'yt', 'in'].map((s, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white cursor-pointer transition-colors">
                    <span className="text-xs uppercase font-bold">{s}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Links Columns */}
            <div>
              <h4 className="font-bold mb-6 text-sm tracking-wider uppercase text-white/90">Product</h4>
              <ul className="space-y-4 text-sm font-medium text-white/60">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/updates" className="hover:text-white transition-colors">Updates</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-sm tracking-wider uppercase text-white/90">Resources</h4>
              <ul className="space-y-4 text-sm font-medium text-white/60">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/tutorials" className="hover:text-white transition-colors">Video Tutorials</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-sm tracking-wider uppercase text-white/90">Company</h4>
              <ul className="space-y-4 text-sm font-medium text-white/60">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>

          </div>
          
          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 font-medium text-xs">
              © {new Date().getFullYear()} MySiteBook Technologies Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-white/60 text-xs font-medium">
              <span className="flex items-center"><FaMobileAlt className="mr-2" /> +91 12345 67890</span>
              <span className="hidden md:inline">|</span>
              <span className="flex items-center">support@mysitebook.com</span>
              <span className="hidden md:inline">|</span>
              <span className="flex items-center">Made with <span className="text-red-500 mx-1">❤</span> in India</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
