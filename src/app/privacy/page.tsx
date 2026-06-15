"use client";

import React, { useState, useEffect } from "react";
import MarketingLayout from "@/components/MarketingLayout";

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("info");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["info", "use", "security", "sharing"];
      let current = "info";
      
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
    <MarketingLayout title="Privacy Policy" subtitle="How we protect your business data and ensure compliance.">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row gap-12">
        
        {/* Sidebar TOC */}
        <div className="md:w-1/4 hidden md:block">
          <div className="sticky top-32 bg-slate-50 rounded-2xl p-6 border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Contents</h4>
            <ul className="space-y-3">
              <li>
                <a href="#info" className={`transition-colors ${activeSection === 'info' ? 'text-primary font-bold' : 'text-gray-500 hover:text-primary font-medium'}`}>
                  1. Information We Collect
                </a>
              </li>
              <li>
                <a href="#use" className={`transition-colors ${activeSection === 'use' ? 'text-primary font-bold' : 'text-gray-500 hover:text-primary font-medium'}`}>
                  2. How We Use Information
                </a>
              </li>
              <li>
                <a href="#security" className={`transition-colors ${activeSection === 'security' ? 'text-primary font-bold' : 'text-gray-500 hover:text-primary font-medium'}`}>
                  3. Data Security
                </a>
              </li>
              <li>
                <a href="#sharing" className={`transition-colors ${activeSection === 'sharing' ? 'text-primary font-bold' : 'text-gray-500 hover:text-primary font-medium'}`}>
                  4. Data Sharing
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Content */}
        <div className="md:w-3/4 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-200 prose prose-lg prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-p:text-gray-600 max-w-none">
          <h2>Your Data is Yours.</h2>
          <p>At MySiteBook, we take your privacy and the security of your financial data extremely seriously. We use enterprise-grade encryption to ensure your ledgers are protected and only accessible by authorized members of your organization.</p>
          
          <h3 id="info" className="scroll-mt-32">1. Information We Collect</h3>
          <p>We collect information you provide directly to us when you create an account, such as:</p>
          <ul>
            <li>Your name, mobile number, and company details.</li>
            <li>The financial data, expenses, and material lists you input.</li>
            <li>Photos of receipts uploaded via our OCR or manual entry system.</li>
          </ul>
          
          <h3 id="use" className="scroll-mt-32">2. How We Use Information</h3>
          <p>We use the information we collect to provide, maintain, and improve our services, including:</p>
          <ul>
            <li>Processing transactions and generating your ledgers.</li>
            <li>Providing customer support and technical notices.</li>
            <li>Improving our AI categorization and Voice transcription algorithms (anonymized data only).</li>
          </ul>
          
          <h3 id="security" className="scroll-mt-32">3. Data Security</h3>
          <p>We implement industry-standard security measures, including SSL encryption and secure database hosting, to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
          
          <h3 id="sharing" className="scroll-mt-32">4. Data Sharing</h3>
          <p>We do not sell your personal or financial data to third parties. We only share information with trusted third-party service providers (like payment processors) necessary to provide our services.</p>
          
          <hr className="my-10" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Last Updated: June 15, 2026</p>
        </div>

      </div>
    </MarketingLayout>
  );
}
