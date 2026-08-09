"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { getActiveSubscriptionPlans } from '@/app/actions/public';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  isActive: boolean;
}

export default function Pricing() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await getActiveSubscriptionPlans();
      if (res.success && res.plans) {
        setPlans(res.plans);
      }
      setLoading(false);
    };
    fetchPlans();
  }, []);

  const freeFeatures = [
    'Maximum 2 Projects',
    'Expense & Credit Entry',
    'Dashboard',
    'PDF Report (Watermark உடன்)',
    'Month-wise Filters',
    'Dark/Light Mode',
    'Tamil / English / Hindi',
    'Currency Change'
  ];

  const freeLimitations = [
    'Staff Management',
    'Site-wise Staff Allocation',
    'Audit Logs',
    'Role & Permissions',
    'Advanced Reports',
    'Unlimited Projects',
    'Priority Support'
  ];

  const proFeatures = [
    'Unlimited Projects',
    'Staff Management',
    'Site-wise Staff Allocation',
    'Role & Permission',
    'Audit Logs',
    'Advanced Reports',
    'Full PDF Export',
    'Priority Support'
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
            <div className="inline-block bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">Launch Offer</div>
            <h3 className="text-white text-2xl font-bold mb-2">30 Days FREE Trial on the Pro Plan.</h3>
            <p className="text-gray-300 font-medium">Credit Card தேவையில்லை. 30 நாள் முடிந்ததும் Free Plan-க்கு automatically downgrade ஆகிவிடும்.</p>
          </div>
          <Link href="/register" className="shrink-0 bg-accent hover:bg-accent-600 text-[#0B1F4D] font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg whitespace-nowrap">
            Start Free Trial
          </Link>
        </motion.div>

        {/* Pricing Cards */}
        {loading ? (
           <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
           </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 ${plans.length > 1 ? 'lg:grid-cols-4 max-w-7xl' : 'max-w-5xl'} gap-8 mx-auto`}>
            
            {/* Free Plan */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-200 flex flex-col h-full"
            >
              <div className="text-gray-500 font-bold tracking-wider uppercase mb-2">Free Plan</div>
              <div className="flex items-end gap-2 mb-8 flex-wrap">
                <span className="text-5xl font-black text-gray-900 leading-none">₹0</span>
                <span className="text-gray-500 font-medium text-sm mb-1 whitespace-nowrap">30 days only</span>
              </div>
              
              <ul className="space-y-4 mb-6">
                {freeFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#22C55E] shrink-0" strokeWidth={3} />
                    <span className="text-gray-700 font-medium text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 mb-10">
                <p className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Limitations</p>
                <ul className="space-y-3">
                  {freeLimitations.map((limit, idx) => (
                    <li key={idx} className="flex items-center gap-3 opacity-60">
                      <X className="w-5 h-5 text-red-500 shrink-0" strokeWidth={3} />
                      <span className="text-gray-500 font-medium text-sm line-through decoration-gray-300">{limit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link href="/register" className="mt-auto w-full block text-center py-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                Get Started for Free
              </Link>
            </motion.div>

            {/* Dynamic Paid Plans */}
            {plans.map((plan, index) => {
              const isPopular = index === 1 || (plans.length === 1 && index === 0);
              
              return (
                <motion.div 
                  key={plan.id}
                  whileHover={{ y: -8 }}
                  className={`bg-white rounded-[2rem] p-8 shadow-2xl relative flex flex-col h-full ${isPopular ? 'border-2 border-accent' : 'border border-gray-200'}`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-8 bg-accent text-[#0B1F4D] text-[11px] font-black px-4 py-1.5 rounded-b-lg uppercase tracking-widest shadow-md">
                      Most Popular
                    </div>
                  )}
                  
                  <div className={`${isPopular ? 'text-accent' : 'text-gray-800'} font-bold tracking-wider uppercase mb-2`}>{plan.name}</div>
                  <div className="flex items-end gap-1 mb-8 flex-wrap">
                    <span className="text-4xl font-black text-gray-900 leading-none">₹{plan.price}</span>
                    <span className="text-gray-500 font-medium text-sm mb-1 whitespace-nowrap">/ {plan.durationMonths === 1 ? 'Month' : plan.durationMonths === 12 ? 'Year' : `${plan.durationMonths} Months`}</span>
                  </div>
                  
                  <ul className="space-y-4 mb-10">
                    {proFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full ${isPopular ? 'bg-accent/20' : 'bg-gray-100'} flex items-center justify-center shrink-0`}>
                          <Check className={`w-3.5 h-3.5 ${isPopular ? 'text-[#F4B400]' : 'text-gray-500'} shrink-0`} strokeWidth={3} />
                        </div>
                        <span className="text-gray-900 font-semibold text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/register" className={`mt-auto w-full block text-center py-4 rounded-xl font-bold transition-all hover:shadow-lg ${isPopular ? 'text-[#0B1F4D] bg-accent hover:bg-accent-600' : 'text-white bg-[#0B1F4D] hover:bg-[#0A1629]'}`}>
                    Start 30-Day Free Trial
                  </Link>
                </motion.div>
              );
            })}

          </div>
        )}
      </div>
    </section>
  );
}
