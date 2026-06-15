"use client";

import React, { useState, useEffect } from "react";
import MarketingLayout from "@/components/MarketingLayout";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("acceptance");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["acceptance", "subscription", "conduct", "termination"];
      let current = "acceptance";
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // 150px offset to account for the fixed header
          if (rect.top <= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    // Call once to set initial state
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <MarketingLayout title="Terms of Service" subtitle="Please read these terms carefully before using MySiteBook.">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row gap-12">
        
        {/* Sidebar TOC */}
        <div className="md:w-1/4 hidden md:block">
          <div className="sticky top-32 bg-slate-50 rounded-2xl p-6 border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Contents</h4>
            <ul className="space-y-3">
              <li>
                <a href="#acceptance" className={`transition-colors ${activeSection === 'acceptance' ? 'text-primary font-bold' : 'text-gray-500 hover:text-primary font-medium'}`}>
                  1. Acceptance of Terms
                </a>
              </li>
              <li>
                <a href="#subscription" className={`transition-colors ${activeSection === 'subscription' ? 'text-primary font-bold' : 'text-gray-500 hover:text-primary font-medium'}`}>
                  2. Subscription & Payments
                </a>
              </li>
              <li>
                <a href="#conduct" className={`transition-colors ${activeSection === 'conduct' ? 'text-primary font-bold' : 'text-gray-500 hover:text-primary font-medium'}`}>
                  3. User Conduct
                </a>
              </li>
              <li>
                <a href="#termination" className={`transition-colors ${activeSection === 'termination' ? 'text-primary font-bold' : 'text-gray-500 hover:text-primary font-medium'}`}>
                  4. Account Termination
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Content */}
        <div className="md:w-3/4 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-200 prose prose-lg prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-p:text-gray-600 max-w-none">
          
          <h3 id="acceptance" className="scroll-mt-32">1. Acceptance of Terms</h3>
          <p>By accessing or using the MySiteBook application, web interface, or mobile PWA, you agree to be bound by these Terms of Service and all applicable laws and regulations in India.</p>
          
          <h3 id="subscription" className="scroll-mt-32">2. Subscription and Payments</h3>
          <p>MySiteBook is a subscription-based software-as-a-service (SaaS). You are responsible for all charges incurred under your account.</p>
          <ul>
            <li>We offer a free trial period (90 days).</li>
            <li>After the trial, you must provide a valid payment method to continue using the service.</li>
            <li>Failure to pay will result in read-only access to your ledgers.</li>
          </ul>
          
          <h3 id="conduct" className="scroll-mt-32">3. User Conduct</h3>
          <p>You are solely responsible for the content, receipts, and data you upload and manage within the application. You agree not to use the service for any illegal or unauthorized purpose.</p>
          
          <h3 id="termination" className="scroll-mt-32">4. Termination</h3>
          <p>We reserve the right to suspend or terminate your account at any time for violations of these Terms of Service, or for fraudulent use of our systems. You may also cancel your subscription at any time via the Billing dashboard.</p>
          
          <hr className="my-10" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Last Updated: June 15, 2026</p>
        </div>

      </div>
    </MarketingLayout>
  );
}
