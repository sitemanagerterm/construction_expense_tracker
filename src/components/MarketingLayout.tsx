"use client";

import React from 'react';
import Link from 'next/link';
import { FaBuilding, FaHardHat, FaCheckCircle, FaChartPie, FaMobileAlt, FaMicrophone, FaCamera, FaFileInvoiceDollar, FaSync, FaHistory, FaArrowRight } from "react-icons/fa";

export default function MarketingLayout({
  children,
  title,
  subtitle
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-brandbg text-brandtext font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <Link href="/" className="flex items-center group shrink-0">
              <img src="/mysitebook-horizontal.png" alt="MySiteBook" className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" />
            </Link>
            
            <nav className="hidden lg:flex space-x-10 items-center">
              <Link href="/#how-it-works" className="text-sm font-bold text-brandtext hover:text-accent transition-colors">How it Works</Link>
              <Link href="/#features" className="text-sm font-bold text-brandtext hover:text-accent transition-colors">Features</Link>
              <Link href="/#pricing" className="text-sm font-bold text-brandtext hover:text-accent transition-colors">Pricing</Link>
            </nav>
            
            <div className="flex items-center space-x-4 sm:space-x-6 shrink-0">
              <Link href="/login" className="text-sm font-bold text-brandtext hover:text-accent transition-colors hidden sm:block">
                Log in
              </Link>
              <Link href="/register" className="hidden md:block bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_4px_14px_0_rgba(21,62,117,0.39)] hover:shadow-[0_6px_20px_rgba(21,62,117,0.23)] hover:-translate-y-0.5 transition-all">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-slate-900 text-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl mix-blend-multiply opacity-70"></div>
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl mix-blend-multiply opacity-70"></div>
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
      <main className="flex-grow bg-white">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface pt-24 pb-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
            <div className="lg:col-span-2">
              <img src="/mysitebook-horizontal.png" alt="MySiteBook" className="h-12 w-auto mb-6" />
              <p className="text-brandtext-secondary font-medium max-w-sm mb-8 leading-relaxed">
                The #1 construction ledger for Indian contractors. Track every rupee, manage every project, and control every site from a single ecosystem.
              </p>
            </div>
            
            <div>
              <h4 className="text-brandtext font-black mb-6 uppercase tracking-wider text-sm">Product</h4>
              <ul className="space-y-4">
                <li><Link href="/#features" className="text-brandtext-secondary hover:text-accent font-medium transition-colors">Features</Link></li>
                <li><Link href="/#how-it-works" className="text-brandtext-secondary hover:text-accent font-medium transition-colors">How it Works</Link></li>
                <li><Link href="/#pricing" className="text-brandtext-secondary hover:text-accent font-medium transition-colors">Pricing</Link></li>
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
