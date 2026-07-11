"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Lock, Menu, X } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaWhatsapp, FaPhoneAlt, FaRegEnvelope, FaHardHat } from "react-icons/fa";

export default function MarketingLayout({
  children,
  title,
  subtitle
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-primary text-brandtext-inverse font-sans overflow-x-hidden">
      
      {/* 1. Navbar (From page.tsx) */}
      <nav className="fixed top-0 w-full z-50 bg-primary/95 backdrop-blur border-b border-gray-800">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-lg p-1">
              <Image src="/mysitebook-logo-light.png" alt="MySiteBook" width={300} height={100} className="w-[130px] sm:w-[150px] lg:w-[170px] h-auto drop-shadow-md" priority />
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-sm font-medium text-white hover:text-accent transition-colors">Features</Link>
              <Link href="/#how-it-works" className="text-sm font-medium text-white hover:text-accent transition-colors">How It Works</Link>
              <Link href="/#pricing" className="text-sm font-medium text-white hover:text-accent transition-colors">Pricing</Link>
              <div className="flex items-center space-x-1 cursor-pointer group">
                <Link href="/resources" className="text-sm font-medium text-white group-hover:text-accent transition-colors">Resources</Link>
              </div>
              <Link href="/about" className="text-sm font-medium text-white hover:text-accent transition-colors">About Us</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login" className="hidden md:flex items-center justify-center border border-accent text-accent hover:bg-accent/10 px-6 h-10 rounded-lg text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none">
                <Lock className="w-4 h-4 mr-2" /> Log In
              </Link>
              <Link href="/register" className="bg-accent hover:bg-accent-600 text-primary px-4 sm:px-6 h-10 rounded-lg text-[13px] sm:text-sm font-bold transition-all transform hover:scale-105 flex items-center justify-center border border-transparent whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:outline-none">
                Start Free Trial
              </Link>
              <button 
                className="md:hidden text-white p-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-lg"
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
              <Link href="/#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-white hover:text-accent hover:bg-white/5 rounded-md">Features</Link>
              <Link href="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-white hover:text-accent hover:bg-white/5 rounded-md">How It Works</Link>
              <Link href="/#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-white hover:text-accent hover:bg-white/5 rounded-md">Pricing</Link>
              <Link href="/resources" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-white hover:text-accent hover:bg-white/5 rounded-md">Resources</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-white hover:text-accent hover:bg-white/5 rounded-md">About Us</Link>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-accent hover:bg-white/5 rounded-md flex items-center">
                  <Lock className="w-4 h-4 mr-2" /> Log In
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-primary text-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl mix-blend-multiply opacity-70"></div>
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl mix-blend-multiply opacity-70"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] text-white drop-shadow-sm">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-slate-300 font-light tracking-wide max-w-2xl mx-auto leading-snug">
              {subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-grow bg-white text-gray-900">
        {children}
      </main>

      {/* 7. Footer (From page.tsx) */}
      <footer className="bg-[#0A1121] text-gray-300 pt-12 pb-6 border-t border-gray-800">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
            <div className="col-span-1 md:col-span-2 pr-0 lg:pr-12">
              <Image src="/mysitebook-logo-light.png" alt="MySiteBook" width={300} height={100} className="w-[130px] sm:w-[150px] lg:w-[170px] h-auto mb-6 drop-shadow-md" />
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
                <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wider">RESOURCES</h4>
              <ul className="space-y-3 text-[13px] font-medium text-gray-300">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/tutorials" className="hover:text-white transition-colors">Video Tutorials</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/#faq" className="hover:text-white transition-colors">FAQs</Link></li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wider">COMPANY</h4>
              <ul className="space-y-3 text-[13px] font-medium text-gray-300">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
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
            <p className="text-[13px] font-medium text-gray-400">© 2026 MySiteBook. All rights reserved.</p>
            <p className="text-[13px] font-medium text-gray-400 flex items-center gap-1.5">Made with <span className="text-red-500">❤️</span> in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
