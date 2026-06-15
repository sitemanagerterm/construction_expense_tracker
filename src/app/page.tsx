"use client";

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { FaBuilding, FaHardHat, FaCheckCircle, FaChartPie, FaMobileAlt, FaMicrophone, FaCamera, FaFileInvoiceDollar, FaSync, FaHistory, FaArrowRight } from "react-icons/fa";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col min-h-screen bg-brandbg text-brandtext font-sans overflow-x-hidden">
      
      {/* Premium Full-Width Sticky Header */}
      <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo - Fixed natural scaling */}
            <Link href="/" className="flex items-center group shrink-0">
              <img src="/mysitebook-horizontal.png" alt="MySiteBook" className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" />
            </Link>
            
            <nav className="hidden lg:flex space-x-10 items-center">
              <Link href="#how-it-works" className="text-sm font-bold text-brandtext hover:text-accent transition-colors">How it Works</Link>
              <Link href="#features" className="text-sm font-bold text-brandtext hover:text-accent transition-colors">Features</Link>
              <Link href="#pricing" className="text-sm font-bold text-brandtext hover:text-accent transition-colors">Pricing</Link>
            </nav>
            
            <div className="flex items-center space-x-4 sm:space-x-6 shrink-0">
              <LanguageSelector />
              <div className="h-5 w-px bg-gray-200 hidden sm:block"></div>
              <Link href="/login" className="text-sm font-bold text-brandtext hover:text-accent transition-colors hidden sm:block">
                Log in
              </Link>
              <Link href="/register" className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_4px_14px_0_rgba(21,62,117,0.39)] hover:shadow-[0_6px_20px_rgba(21,62,117,0.23)] hover:-translate-y-0.5 transition-all">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        
        {/* SECTION 2: Hero */}
        <section className="relative pt-36 pb-20 overflow-hidden bg-slate-900 text-white">
          {/* Subtle Ambient Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl mix-blend-multiply opacity-70"></div>
            <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl mix-blend-multiply opacity-70"></div>
            <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "url('/construction-bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            {/* Refined Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-white drop-shadow-sm max-w-5xl mx-auto">
              Track Every <span className="text-accent">Rupee.</span><br className="hidden md:block"/>
              Manage Every <span className="text-accent">Project.</span><br className="hidden md:block"/>
              Control Every <span className="text-accent">Site.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 font-light tracking-wide max-w-4xl mx-auto mb-12 leading-snug">
              Expense tracking, material procurement, receipt scanning, and project reporting built exclusively for the modern construction business.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-20 mb-14">
              <Link href="/register" className="w-full sm:w-auto bg-accent text-white px-7 py-3.5 rounded-full font-semibold text-base shadow-[0_8px_25px_rgb(249,115,22,0.3)] hover:shadow-[0_8px_35px_rgb(249,115,22,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center border border-accent/50">
                Start Free Trial <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto bg-white/10 text-white hover:bg-white/20 border border-white/20 px-7 py-3.5 rounded-full font-medium text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center backdrop-blur-sm">
                <svg className="w-4 h-4 mr-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                Watch Demo
              </Link>
            </div>

            {/* Social Proof Elements - B2B Scrolling Logo Marquee */}
            <div className="w-full max-w-5xl mx-auto overflow-hidden mt-10 mb-8 relative">
              <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-8 text-center relative z-20">Trusted on 5,000+ Active Sites By</p>
              
              {/* Fade Edges for Marquee */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none mt-10"></div>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none mt-10"></div>
              
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes marquee-scroll {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                  animation: marquee-scroll 35s linear infinite;
                  width: max-content;
                }
                .animate-marquee:hover {
                  animation-play-state: paused;
                }
              `}} />
              
              {/* Scrolling Container */}
              <div className="flex animate-marquee opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Set 1 */}
                <div className="flex items-center gap-16 md:gap-24 px-8 md:px-12">
                  <div className="flex items-center gap-2"><svg className="w-8 h-8 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h14v-8h3L12 2z"/></svg><span className="font-black text-2xl tracking-tighter text-white">BUILD<span className="text-accent">PRO</span></span></div>
                  <div className="flex items-center gap-2"><svg className="w-8 h-8 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6z"/></svg><span className="font-black text-2xl tracking-tighter text-white">Structura</span></div>
                  <div className="flex items-center gap-2"><svg className="w-8 h-8 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span className="font-black text-2xl tracking-tighter text-white">APEX</span></div>
                  <div className="flex items-center gap-2"><svg className="w-8 h-8 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v20c5.07-.5 9-4.79 9-10s-3.93-9.5-9-10z"/></svg><span className="font-black text-2xl tracking-tighter text-blue-300">GlobalBuild</span></div>
                  <div className="flex items-center gap-2"><svg className="w-8 h-8 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M2 22h20V2z"/></svg><span className="font-black text-2xl tracking-tighter text-orange-400">ELEVATE</span></div>
                  <div className="flex items-center gap-2"><svg className="w-8 h-8 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v18H3zM5 5v14h14V5z"/></svg><span className="font-black text-2xl tracking-tighter text-slate-300">Nirman</span></div>
                </div>
                {/* Set 2 (Duplicated for Seamless Loop) */}
                <div className="flex items-center gap-16 md:gap-24 px-8 md:px-12">
                  <div className="flex items-center gap-2"><svg className="w-8 h-8 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h14v-8h3L12 2z"/></svg><span className="font-black text-2xl tracking-tighter text-white">BUILD<span className="text-accent">PRO</span></span></div>
                  <div className="flex items-center gap-2"><svg className="w-8 h-8 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6z"/></svg><span className="font-black text-2xl tracking-tighter text-white">Structura</span></div>
                  <div className="flex items-center gap-2"><svg className="w-8 h-8 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span className="font-black text-2xl tracking-tighter text-white">APEX</span></div>
                  <div className="flex items-center gap-2"><svg className="w-8 h-8 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v20c5.07-.5 9-4.79 9-10s-3.93-9.5-9-10z"/></svg><span className="font-black text-2xl tracking-tighter text-blue-300">GlobalBuild</span></div>
                  <div className="flex items-center gap-2"><svg className="w-8 h-8 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M2 22h20V2z"/></svg><span className="font-black text-2xl tracking-tighter text-orange-400">ELEVATE</span></div>
                  <div className="flex items-center gap-2"><svg className="w-8 h-8 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v18H3zM5 5v14h14V5z"/></svg><span className="font-black text-2xl tracking-tighter text-slate-300">Nirman</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2.5: Live Site Feed Visualization (Sleek Dashboard UI) */}
        <section className="relative py-24 bg-white overflow-hidden border-t border-gray-100">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brandbg/50 rounded-l-[100px] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              
              {/* Left Column: Copy & Value Prop */}
              <div className="w-full lg:w-5/12">
                <div className="inline-flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full mb-6 border border-green-100">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Live Sync Technology</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-gray-900 leading-[1.1]">
                  The real-time pulse of your projects.
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Stop waiting for end-of-week ledger updates. Watch expenses, invoices, and material deliveries flow into your centralized dashboard instantly from the site.
                </p>
                
                <ul className="space-y-4 mb-8">
                  {[
                    "Instantly verify hardware store bills with AI.",
                    "Catch budget overruns before money is spent.",
                    "Eliminate WhatsApp groups and missing receipts."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 mr-3">
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Right Column: Premium Dashboard Widget Mockup */}
              <div className="w-full lg:w-7/12 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-[2.5rem] transform rotate-2"></div>
                <div className="relative bg-white rounded-3xl shadow-[0_20px_60px_rgba(21,62,117,0.12)] border border-gray-200/60 overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(21,62,117,0.15)]">
                  {/* Widget Header */}
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm">Live Site Activity</h3>
                    </div>
                    <div className="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                      Today
                    </div>
                  </div>
                  
                  {/* Widget Body (Feed) */}
                  <div className="p-6 md:p-8">
                    <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
                      
                      {/* Feed Item 1: Expense */}
                      <div className="relative pl-6 md:pl-8">
                        <div className="absolute -left-[17px] top-1 bg-accent/10 border-2 border-white w-8 h-8 rounded-full flex items-center justify-center text-accent shadow-sm">
                          <span className="font-bold text-sm">₹</span>
                        </div>
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                            <p className="font-bold text-gray-900">Expense Logged <span className="text-gray-400 font-medium text-xs ml-2">Just now</span></p>
                            <span className="text-expense font-black text-lg mt-1 md:mt-0">₹45,500</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">Rajesh Kumar (Site Supervisor) logged an expense for heavy machinery rental.</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-[11px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md">Site A - Phase 2</span>
                            <span className="text-[11px] font-bold bg-accent/10 text-accent px-2 py-1 rounded-md">Machinery</span>
                          </div>
                        </div>
                      </div>

                      {/* Feed Item 2: Invoice */}
                      <div className="relative pl-6 md:pl-8">
                        <div className="absolute -left-[17px] top-1 bg-purple-100 border-2 border-white w-8 h-8 rounded-full flex items-center justify-center text-purple-600 shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                            <p className="font-bold text-gray-900">Invoice Scanned <span className="text-gray-400 font-medium text-xs ml-2">12 mins ago</span></p>
                            <span className="text-expense font-black text-lg mt-1 md:mt-0">₹12,400</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">AI successfully extracted data from an uploaded hardware store bill.</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-[11px] font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-md">Verified</span>
                            <span className="text-[11px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md">Cement & Sand</span>
                          </div>
                        </div>
                      </div>

                      {/* Feed Item 3: Voice Log */}
                      <div className="relative pl-6 md:pl-8">
                        <div className="absolute -left-[17px] top-1 bg-green-100 border-2 border-white w-8 h-8 rounded-full flex items-center justify-center text-green-600 shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                        </div>
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-bold text-gray-900">Voice Log Added <span className="text-gray-400 font-medium text-xs ml-2">45 mins ago</span></p>
                          </div>
                          <p className="text-sm text-gray-700 italic border-l-2 border-gray-200 pl-3 my-2 text-brandtext-secondary">"Paid ₹500 for auto transport to the city site."</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-[11px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg> Logged as ₹500 Transport</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* SECTION 3: Problem vs Solution */}
        <section id="how-it-works" className="py-24 bg-surface border-y border-gray-100 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gray-50 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              
              {/* LEFT: The Problem */}
              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-primary">
                  The old way is <span className="text-expense">costing you money.</span>
                </h2>
                <p className="text-xl text-brandtext-secondary mb-12 font-medium leading-relaxed">
                  Construction sites leak cash when advances aren't tracked and receipts get lost in the mud.
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 mt-1 border border-red-100 group-hover:bg-red-100 transition-colors">
                      <span className="text-expense font-black text-xl">✕</span>
                    </div>
                    <div className="ml-5">
                      <h4 className="text-xl font-bold text-brandtext mb-1">Paper Ledgers & WhatsApp</h4>
                      <p className="text-brandtext-secondary leading-relaxed">Messy, easily manipulated, and nearly impossible to audit at the end of the project.</p>
                    </div>
                  </div>
                  <div className="flex items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 mt-1 border border-red-100 group-hover:bg-red-100 transition-colors">
                      <span className="text-expense font-black text-xl">✕</span>
                    </div>
                    <div className="ml-5">
                      <h4 className="text-xl font-bold text-brandtext mb-1">Lost & Damaged Receipts</h4>
                      <p className="text-brandtext-secondary leading-relaxed">Supervisors forget to hand over hardware store bills, directly destroying your profit margins.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: The Solution */}
              <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden transform transition-transform hover:scale-[1.02] duration-500">
                {/* Dark card inner glow effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0B203E]/40 rounded-full blur-[80px] pointer-events-none"></div>
                
                <h3 className="text-3xl font-black text-white mb-8 relative z-10 flex items-center">
                  <span className="bg-accent w-2 h-8 rounded-full mr-4"></span>
                  The MySiteBook Solution
                </h3>
                
                <div className="space-y-5 relative z-10">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors flex items-start">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 mr-4 border border-accent/30">
                      <FaMicrophone className="text-accent text-xl" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">Voice Logging (AI)</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">Speak in English, Hindi, or Tamil. Our AI instantly translates and logs the structured expense.</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors flex items-start">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 mr-4 border border-accent/30">
                      <FaCamera className="text-accent text-xl" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">Instant Receipt OCR</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">Snap a photo of any muddy bill. We extract the vendor, amount, and date automatically.</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors flex items-start">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0 mr-4 border border-green-500/30">
                      <FaCheckCircle className="text-green-400 text-xl" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">Immutable Audit Trail</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">Every rupee is tracked to a specific user, time, and GPS location. Zero tampering possible.</p>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* SECTION 4: Bento Grid Features */}
        <section id="features" className="py-24 bg-brandbg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Everything you need.</h2>
              <p className="text-xl text-brandtext-secondary">Designed specifically for the reality of the construction site.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="col-span-1 lg:col-span-2 bg-surface rounded-[2rem] p-8 border border-gray-200 shadow-card flex flex-col justify-between overflow-hidden group hover:border-accent hover:shadow-[0_8px_30px_rgb(249,115,22,0.1)] transition-all">
                <div>
                  <div className="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center mb-6 text-accent text-2xl">
                    <FaMicrophone />
                  </div>
                  <h3 className="text-2xl font-black text-brandtext mb-2">Voice Entry</h3>
                  <p className="text-brandtext-secondary font-medium mb-8">Site managers just press a button and speak. Our AI transcribes and logs the expense instantly.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="col-span-1 bg-surface rounded-[2rem] p-8 border border-gray-200 shadow-card hover:border-success hover:shadow-modal transition-all">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-success text-2xl">
                  <FaCamera />
                </div>
                <h3 className="text-2xl font-black text-brandtext mb-2">Receipt OCR</h3>
                <p className="text-brandtext-secondary font-medium">Snap a photo. We extract the amount.</p>
              </div>

              {/* Feature 3 */}
              <div className="col-span-1 bg-surface rounded-[2rem] p-8 border border-gray-200 shadow-card hover:border-warning hover:shadow-modal transition-all">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-warning text-2xl">
                  <FaSync />
                </div>
                <h3 className="text-2xl font-black text-brandtext mb-2">Offline Sync</h3>
                <p className="text-brandtext-secondary font-medium">Works perfectly even with no signal.</p>
              </div>

              {/* Feature 4 */}
              <div className="col-span-1 bg-surface rounded-[2rem] p-8 border border-gray-200 shadow-card hover:border-expense hover:shadow-modal transition-all">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 text-expense text-2xl">
                  <FaFileInvoiceDollar />
                </div>
                <h3 className="text-2xl font-black text-brandtext mb-2">Expense Track</h3>
                <p className="text-brandtext-secondary font-medium">Categorize every single rupee spent.</p>
              </div>

              {/* Feature 5 */}
              <div className="col-span-1 bg-surface rounded-[2rem] p-8 border border-gray-200 shadow-card hover:border-success hover:shadow-modal transition-all">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-success text-2xl">
                  <FaChartPie />
                </div>
                <h3 className="text-2xl font-black text-brandtext mb-2">Income Track</h3>
                <p className="text-brandtext-secondary font-medium">Log advances from the Principal.</p>
              </div>

              {/* Feature 6 */}
              <div className="col-span-1 lg:col-span-2 bg-surface rounded-[2rem] p-8 border border-gray-200 shadow-card hover:border-primary hover:shadow-modal transition-all">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 text-primary-600 text-2xl">
                  <FaHistory />
                </div>
                <h3 className="text-2xl font-black text-brandtext mb-2">Immutable Audit History</h3>
                <p className="text-brandtext-secondary font-medium">Every edit is logged. See exactly who changed what, when, and why. Total accountability.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: Language Support */}
        <section className="py-16 md:py-20 relative overflow-hidden bg-slate-900 border-y border-slate-800">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-slate-900 pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="text-center lg:text-left">
                <p className="text-accent font-bold uppercase tracking-widest text-sm mb-2">Available Now</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4">Built for Indian Contractors.</h2>
                <p className="text-gray-400 text-lg max-w-lg mx-auto lg:mx-0">Manage your sites, expenses, and ledgers in the language you are most comfortable with.</p>
              </div>
              
              <div className="flex flex-wrap justify-center lg:justify-end gap-4 md:gap-6">
                <span className="px-8 py-3 rounded-full bg-white/5 backdrop-blur-sm text-xl font-bold border border-white/10 shadow-lg text-white flex items-center group cursor-default hover:bg-accent/20 hover:border-accent/40 transition-all">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent mr-3"></span>
                  English
                </span>
                <span className="px-8 py-3 rounded-full bg-white/5 backdrop-blur-sm text-xl font-bold border border-white/10 shadow-lg text-white flex items-center group cursor-default hover:bg-accent/20 hover:border-accent/40 transition-all">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 mr-3"></span>
                  தமிழ்
                </span>
                <span className="px-8 py-3 rounded-full bg-white/5 backdrop-blur-sm text-xl font-bold border border-white/10 shadow-lg text-white flex items-center group cursor-default hover:bg-accent/20 hover:border-accent/40 transition-all">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 mr-3"></span>
                  हिन्दी
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: Pricing */}
        <section id="pricing" className="py-24 lg:py-32 bg-brandbg relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6">Simple, transparent pricing.</h2>
              <p className="text-xl text-brandtext-secondary font-medium">Stop paying per-user. Get full access for your entire team with one flat rate after your massive 90-day trial.</p>
            </div>
            
            <div className="max-w-5xl mx-auto bg-surface rounded-[3rem] shadow-modal border border-gray-200 overflow-hidden flex flex-col md:flex-row transform transition-all hover:-translate-y-1 hover:shadow-2xl">
              
              {/* Pricing Left Side */}
              <div className="p-10 md:p-16 md:w-1/2 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/40 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
                
                <div className="relative z-10">
                  <div className="inline-block bg-accent/20 text-accent font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider mb-6 border border-accent/30">
                    Unlimited Plan
                  </div>
                  <h3 className="text-4xl font-black mb-4">Everything you need.</h3>
                  <p className="text-gray-400 mb-8">Full access to Admin, Owner, and Staff PWA portals. No limits on data.</p>
                  
                  <div className="mb-8">
                    <span className="text-gray-500 line-through text-2xl mr-2">₹1,999</span>
                    <div className="flex items-baseline">
                      <span className="text-6xl font-black tracking-tighter">₹999</span>
                      <span className="text-gray-400 ml-2 font-medium">/ month</span>
                    </div>
                    <p className="text-accent font-bold mt-3 text-sm flex items-center">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      ₹0 for your first 90 days!
                    </p>
                  </div>
                </div>
              </div>

              {/* Features Right Side */}
              <div className="p-10 md:p-14 md:w-1/2 bg-surface">
                <p className="font-bold text-brandtext uppercase tracking-wider mb-6">What's Included:</p>
                <ul className="space-y-4 mb-10">
                  {['Unlimited Construction Sites', 'Unlimited Expense Logging', 'Real-time Material Tracking', 'Staff PWA Portals', 'Immutable Audit Logs', 'Priority Support'].map((feature, i) => (
                    <li key={i} className="flex items-center text-brandtext-secondary font-medium">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4 shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link href="/register" className="block w-full bg-accent text-white text-center py-4 rounded-xl font-black text-xl hover:bg-accent-600 shadow-[0_8px_20px_rgb(242,101,34,0.3)] transition-all transform hover:-translate-y-1">
                  Start 90-Day Free Trial
                </Link>
                <p className="text-center text-xs text-brandtext-secondary mt-4 font-medium">No credit card required for trial.</p>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 9: Final CTA */}
        <section className="py-32 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-900 pointer-events-none">
            {/* Subtle geometric dot grid background */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
          </div>
          
          <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight drop-shadow-lg">Ready to take total control?</h2>
            <p className="text-xl md:text-2xl text-blue-100/90 mb-12 max-w-3xl mx-auto font-light tracking-wide leading-snug">Join top Indian contractors who have eliminated ledger leaks, tracked every material, and stopped profit drain.</p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link href="/register" className="w-full sm:w-auto inline-flex items-center justify-center bg-accent text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 hover:bg-accent-600 transition-all shadow-[0_10px_40px_rgb(242,101,34,0.4)] border border-accent/50">
                Start Free Trial
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center bg-white/10 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm">
                See How It Works
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Premium Full-Scale Footer */}
      <footer className="bg-surface pt-24 pb-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
            <div className="lg:col-span-2">
              <img src="/mysitebook-horizontal.png" alt="MySiteBook" className="h-12 w-auto mb-6" />
              <p className="text-brandtext-secondary font-medium max-w-sm mb-8 leading-relaxed">
                The #1 construction ledger for Indian contractors. Track every rupee, manage every project, and control every site from a single ecosystem.
              </p>
              {/* Socials */}
              <div className="flex space-x-4">
                <Link href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-brandtext hover:bg-accent hover:text-white cursor-pointer transition-colors">
                  <span className="sr-only">X</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-brandtext hover:bg-accent hover:text-white cursor-pointer transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-brandtext hover:bg-accent hover:text-white cursor-pointer transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                  </svg>
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-brandtext font-black mb-6 uppercase tracking-wider text-sm">Product</h4>
              <ul className="space-y-4">
                <li><Link href="#features" className="text-brandtext-secondary hover:text-accent font-medium transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="text-brandtext-secondary hover:text-accent font-medium transition-colors">How it Works</Link></li>
                <li><Link href="#pricing" className="text-brandtext-secondary hover:text-accent font-medium transition-colors">Pricing</Link></li>

              </ul>
            </div>

            <div>
              <h4 className="text-brandtext font-black mb-6 uppercase tracking-wider text-sm">Resources</h4>
              <ul className="space-y-4">
                <li><Link href="/help" className="text-brandtext-secondary hover:text-accent font-medium transition-colors">Help Center</Link></li>
                <li><Link href="/tutorials" className="text-brandtext-secondary hover:text-accent font-medium transition-colors">Video Tutorials</Link></li>
                <li><Link href="/blog" className="text-brandtext-secondary hover:text-accent font-medium transition-colors">Contractor Blog</Link></li>
                <li><Link href="/case-studies" className="text-brandtext-secondary hover:text-accent font-medium transition-colors">Case Studies</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-brandtext font-black mb-6 uppercase tracking-wider text-sm">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-brandtext-secondary hover:text-accent font-medium transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-brandtext-secondary hover:text-accent font-medium transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="text-brandtext-secondary hover:text-accent font-medium transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-brandtext-secondary hover:text-accent font-medium transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <p className="text-brandtext-secondary font-medium text-sm mb-4 md:mb-0">© {new Date().getFullYear()} MySiteBook Technologies. All rights reserved.</p>
            <div className="flex items-center space-x-2 text-brandtext-secondary text-sm font-medium">
              <span>Made with</span>
              <span className="text-expense">❤</span>
              <span>in India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
