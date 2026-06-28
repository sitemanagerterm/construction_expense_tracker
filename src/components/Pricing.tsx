"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Pricing() {
  const freeFeatures = [
    '1 Project',
    'Expense Tracking',
    'Credit Tracking',
    'Profit Dashboard',
    'Basic Reports'
  ];

  const proFeatures = [
    'Unlimited Projects',
    'Unlimited Expenses',
    'Unlimited Credits',
    'Material Tracking',
    'Advanced Reports',
    'Priority Support',
    'Team Access',
    'Future Premium Features'
  ];

  return (
    <section className="py-12 lg:py-16 bg-[#F8FAFC] relative overflow-hidden" id="pricing">
      {/* Background accents */}
      <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-gradient-to-l from-[#0B1F4D]/5 to-transparent blur-3xl -z-10 rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-[#22C55E]/5 to-transparent blur-3xl -z-10 rounded-full pointer-events-none"></div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] text-[#111827] px-4 py-2 rounded-full text-[13px] font-bold mb-6 shadow-sm uppercase tracking-wider">
            <span className="text-[#F4B400] text-lg leading-none">⭐</span> SIMPLE PRICING. MAXIMUM VALUE.
          </div>
          <h2 className="text-[#111827] text-4xl md:text-[52px] font-bold leading-[1.1] tracking-tight mb-6">
            Transparent pricing for contractors
          </h2>
        </div>

        {/* Launch Offer Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-[#0B1F4D] to-[#0A1629] rounded-2xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center justify-between shadow-2xl border border-gray-800"
        >
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <div className="inline-block bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">Special Launch Offer</div>
            <h3 className="text-white text-2xl font-bold mb-2">Get 90 Days FREE Trial on the Pro Plan.</h3>
            <p className="text-gray-300 font-medium">No Credit Card Required.</p>
          </div>
          <Link href="/register" className="shrink-0 bg-accent hover:bg-accent-600 text-[#0B1F4D] font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg">
            Start Free Trial
          </Link>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Free Plan */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-lg border border-gray-200 flex flex-col"
          >
            <div className="text-gray-500 font-bold tracking-wider uppercase mb-2">Free Plan</div>
            <div className="flex items-end gap-2 mb-8">
              <span className="text-5xl font-black text-gray-900">₹0</span>
              <span className="text-gray-500 font-medium mb-1">Forever</span>
            </div>
            
            <ul className="space-y-4 mb-10 flex-grow">
              {freeFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={3} />
                  <span className="text-gray-600 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/register" className="w-full block text-center py-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
              Get Started for Free
            </Link>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-2xl border-2 border-accent relative flex flex-col"
          >
            <div className="absolute top-0 right-8 bg-accent text-[#0B1F4D] text-[11px] font-black px-4 py-1.5 rounded-b-lg uppercase tracking-widest shadow-md">
              Most Popular
            </div>
            
            <div className="text-accent font-bold tracking-wider uppercase mb-2">Pro Plan</div>
            <div className="flex items-end gap-2 mb-8">
              <span className="text-5xl font-black text-gray-900">₹999</span>
              <span className="text-gray-500 font-medium mb-1">/ Month</span>
            </div>
            
            <ul className="space-y-4 mb-10 flex-grow">
              {proFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-accent shrink-0" strokeWidth={3} />
                  </div>
                  <span className="text-gray-900 font-semibold">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/register" className="w-full block text-center py-4 rounded-xl font-bold text-[#0B1F4D] bg-accent hover:bg-accent-600 transition-all hover:shadow-lg">
              Start 90-Day Free Trial
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
