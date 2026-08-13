"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { 
  Play, CheckCircle2, Shield, BarChart3, FileText, 
  Layers, CreditCard, ChevronDown, ArrowRight, Lock,
  Gift, XCircle, Users, Building2, Receipt, IndianRupee,
  Phone, Mail, MapPin, Globe, HardHat, Wallet, Home, FolderOpen, Settings, Check,
  ChevronRight, Menu, X, ShieldCheck, Zap, Activity
} from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaWhatsapp, FaPhoneAlt, FaRegEnvelope, FaHardHat } from "react-icons/fa";
import FeaturesGrid from "@/components/FeaturesGrid";
import FeaturesList from "@/components/FeaturesList";
import HowItWorks from "@/components/HowItWorks";
import PainPoints from "@/components/PainPoints";
import Comparison from "@/components/Comparison";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import RecentSignups from "@/components/RecentSignups";
import { getPublicPlatformSettings } from '@/app/actions/public';

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [settings, setSettings] = useState<{ supportPhone?: string | null, supportEmail?: string | null }>({});

  useEffect(() => {
    getPublicPlatformSettings().then(res => {
      if (res.success && res.settings) {
        setSettings(res.settings);
      }
    });
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const heroSlides = [
    {
      badge: "BUILT FOR INDIAN CONTRACTORS",
      title1: "Complete Control of",
      title2: "Your Project Finances",
      desc: "Track project value, credits, expenses and know your profit or loss in real time.",
      image: "/dashboard-mockup.png"
    },
    {
      badge: "MATERIAL MANAGEMENT",
      title1: "Real-Time Tracking of",
      title2: "All Your Materials",
      desc: "Monitor purchases of cement, steel, sand, bricks, and track exactly what's left on site.",
      image: "/dashboard-mockup.png"
    },
    {
      badge: "PROFITABILITY TRACKING",
      title1: "Know Your Margins",
      title2: "Before Project Ends",
      desc: "Don't wait until completion. Instantly see your profit or loss based on current expenses.",
      image: "/dashboard-mockup.png"
    }
  ];

  return (
    <div className="min-h-screen bg-primary text-brandtext-inverse font-sans overflow-x-hidden">
      
      {/* 1. Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-primary/95 backdrop-blur border-b border-gray-800">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <img src="/mysitebook-horizontal-dark.png" alt="MySiteBook" className="h-14 sm:h-16 w-auto drop-shadow-md" />
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm font-medium text-white hover:text-accent transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-sm font-medium text-white hover:text-accent transition-colors">How It Works</Link>
              <Link href="#pricing" className="text-sm font-medium text-white hover:text-accent transition-colors">Pricing</Link>
              <div className="flex items-center space-x-1 cursor-pointer group">
                <Link href="/resources" className="text-sm font-medium text-white group-hover:text-accent transition-colors">Resources</Link>
              </div>
              <Link href="#about" className="text-sm font-medium text-white hover:text-accent transition-colors">About Us</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login" className="hidden md:flex items-center justify-center border border-accent text-accent hover:bg-accent/10 px-6 h-10 rounded-lg text-sm font-medium transition-all">
                <Lock className="w-4 h-4 mr-2" /> Log In
              </Link>
              <Link href="/register" className="bg-accent hover:bg-accent-600 text-primary px-4 sm:px-6 h-10 rounded-lg text-[13px] sm:text-sm font-bold transition-all transform hover:scale-105 flex items-center justify-center border border-transparent whitespace-nowrap">
                Start Free Trial
              </Link>
              <button 
                className="md:hidden text-white p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-primary border-t border-gray-800">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <Link href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-white hover:text-accent hover:bg-white/5 rounded-md">Features</Link>
              <Link href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-white hover:text-accent hover:bg-white/5 rounded-md">How It Works</Link>
              <Link href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-white hover:text-accent hover:bg-white/5 rounded-md">Pricing</Link>
              <Link href="/resources" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-white hover:text-accent hover:bg-white/5 rounded-md">Resources</Link>
              <Link href="#about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-white hover:text-accent hover:bg-white/5 rounded-md">About Us</Link>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-accent hover:bg-white/5 rounded-md flex items-center">
                  <Lock className="w-4 h-4 mr-2" /> Log In
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-20">
        
        {/* 2. Hero Section */}
        <section 
          className="relative pt-12 pb-20 lg:pt-0 lg:pb-0 overflow-hidden bg-primary min-h-[calc(100vh-80px)] flex flex-col justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentSlide}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-2xl w-full order-2 lg:order-1"
                >

                  <div className="inline-flex items-center space-x-2 border border-gray-600 rounded-full px-3 py-1.5 mb-4 lg:mt-0">
                    <FaHardHat className="text-[#F9B233] w-4 h-4" />
                    <span className="text-[clamp(0.625rem,1vw,0.75rem)] font-semibold text-accent uppercase tracking-wider">{heroSlides[currentSlide].badge}</span>
                  </div>
                  
                  <h1 className="text-[clamp(2.25rem,3.8vw,4rem)] font-bold text-white leading-[1.1] mb-4 tracking-tight">
                    {heroSlides[currentSlide].title1}<br className="hidden sm:block" />
                    <span className="sm:hidden"> </span><span className="sm:whitespace-nowrap text-accent">{heroSlides[currentSlide].title2}</span>
                  </h1>
                  
                  <p className="text-[clamp(1rem,1.5vw,1.125rem)] text-gray-300 mb-6 max-w-lg">
                    {heroSlides[currentSlide].desc}
                  </p>
                
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
                  <div className="relative w-full sm:w-auto">
                    <div className="absolute inset-0 bg-accent rounded-lg blur opacity-40 animate-pulse"></div>
                    <Link href="/register" className="relative flex justify-center items-center bg-accent hover:bg-accent-600 text-primary px-[clamp(1.5rem,2.5vw,2rem)] py-[clamp(0.75rem,1.2vw,0.875rem)] rounded-lg text-[clamp(0.875rem,1.5vw,1rem)] font-bold transition-all w-full sm:w-auto overflow-hidden group">
                      <span className="relative z-10 flex items-center">Start 3 Months Free Trial <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" /></span>
                      <div className="absolute inset-0 h-full w-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                    </Link>
                  </div>
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
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full flex items-center justify-center lg:justify-end mt-8 lg:mt-0 mb-8 lg:mb-0 order-1 lg:order-2"
                >
                  <img src={heroSlides[currentSlide].image} alt="MySiteBook UI Display" className="w-full lg:w-[130%] lg:max-w-none h-auto max-h-[50vh] lg:max-h-[70vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] lg:translate-x-12" />
                </motion.div>
              </AnimatePresence>
              
            </div>
          </div>
          
          {/* Slider Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-500 ${currentSlide === index ? 'bg-accent w-8' : 'bg-white/30 hover:bg-white/50 w-2'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* 3. Dark Stats Banner */}
        <section className="hidden bg-slate-50 pt-8 pb-4 relative z-20">
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

        {/* 4. Pain Points */}
        <PainPoints />

        {/* 5. Features Grid (Bento) */}
        <FeaturesGrid />

        {/* 5.5 Features List (Textual) */}
        <FeaturesList />

        {/* 6. How it Works */}
        <HowItWorks />

        {/* 7. Comparison Table */}
        <Comparison />

        {/* 7. Dark Testimonial Banner */}
        <section className="bg-white pt-12 pb-12 relative z-20">
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

        {/* 8. Pricing Section */}
        <Pricing />

        {/* 9. FAQ Section */}
        <FAQ />

      </main>

      {/* 7. Footer */}
      <footer className="bg-[#0A1121] text-gray-300 pt-12 pb-6 border-t border-gray-800">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-8 lg:gap-4">
            <div className="w-full lg:w-[28%] xl:w-[30%] pr-0 lg:pr-8">
              <img src="/mysitebook-horizontal-dark.png" alt="MySiteBook" className="h-14 sm:h-16 w-auto mb-6 drop-shadow-md" />
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
            
            <div className="w-full lg:w-[14%]">
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wider">PRODUCT</h4>
              <ul className="space-y-3 text-[13px] font-medium text-gray-300">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div className="w-full lg:w-[14%]">
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wider">RESOURCES</h4>
              <ul className="space-y-3 text-[13px] font-medium text-gray-300">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/tutorials" className="hover:text-white transition-colors">Video Tutorials</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/#faq" className="hover:text-white transition-colors">FAQs</Link></li>
              </ul>
            </div>
            
            <div className="w-full lg:w-[14%]">
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wider">COMPANY</h4>
              <ul className="space-y-3 text-[13px] font-medium text-gray-300">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>
            
            <div className="w-full lg:w-[26%] xl:w-[25%]">
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wider">Get in Touch</h4>
              <ul className="space-y-4 text-sm font-semibold text-white">
                <li className="flex items-center gap-3">
                  <FaWhatsapp className="w-5 h-5 text-[#25D366] shrink-0" />
                  {settings.supportPhone || '+91 12345 67890'}
                </li>
                <li className="flex items-center gap-3">
                  <FaPhoneAlt className="w-4 h-4 text-white shrink-0 ml-0.5" />
                  <span className="ml-0.5">{settings.supportPhone || '+91 12345 67890'}</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaRegEnvelope className="w-5 h-5 text-white shrink-0" />
                  <span className="whitespace-nowrap">{settings.supportEmail || 'support@mysitebook.com'}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-5 border-t border-gray-700/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[13px] font-medium text-gray-400">© 2026 MySiteBook. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <p className="text-[13px] font-medium text-gray-400 flex items-center gap-1.5">Made with <span className="text-red-500">❤️</span> in India</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
