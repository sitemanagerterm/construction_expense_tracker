"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, XCircle } from 'lucide-react';
import { getPublicPlatformSettings } from "@/app/actions/public";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [supportEmail, setSupportEmail] = useState("support@mysitebook.com");

  useEffect(() => {
    getPublicPlatformSettings().then(res => {
      if (res.success && res.settings?.supportEmail) {
        setSupportEmail(res.settings.supportEmail);
      }
    });
  }, []);

  const faqs = [
    { question: "1. What is MySiteBook?", answer: "MySiteBook is a construction expense management software designed for contractors, builders, and construction businesses to track project expenses, credits, balances, staff activities, and reports in one place." },
    { question: "2. Is MySiteBook free to use?", answer: "New users receive a 30-day free trial. After 30 days, you must subscribe to a paid plan to continue using the platform." },
    { question: "3. What features are included in the Free Trial?", answer: "During the 30-day trial, you can manage up to 2 projects and explore features like Expense Tracking, Credit Tracking, PDF Reports, and Dashboard Access." },
    { question: "4. What happens after the free trial ends?", answer: "After your 30-day trial ends, your account access will be restricted. You must subscribe to the Pro plan to restore access and continue managing your projects." },
    { question: "5. Can I manage multiple projects?", answer: "Yes. Pro users can create and manage unlimited projects. During the 30-day trial, you can manage up to 2 projects." },
    { question: "6. Can I add my staff members?", answer: "Yes. MySiteBook allows you to add staff members and assign them to specific projects." },
    { question: "7. Can I control what my staff can access?", answer: "Yes. Owners can assign roles and permissions, controlling which sections each staff member can view or edit." },
    { question: "8. What are Audit Logs?", answer: "Audit Logs help you track all important activities, including who added, edited, or deleted records and when those changes were made." },
    { question: "9. Can I generate PDF reports?", answer: "Yes. You can generate and download project reports in PDF format anytime." },
    { question: "10. Does MySiteBook support mobile devices?", answer: "Yes. MySiteBook is fully mobile-friendly and works on smartphones, tablets, laptops, and desktops." },
    { question: "11. Which languages are supported?", answer: "Currently supported languages: English, Tamil, Hindi. More languages may be added in future updates." },
    { question: "12. Can I change the currency symbol?", answer: "Yes. You can select your preferred currency symbol from the settings." },
    { question: "13. Is my data secure?", answer: "Yes. We use secure cloud infrastructure and industry-standard security practices to protect your data." },
    { question: "14. Do I need to install any software?", answer: "No. MySiteBook is a web-based application and works directly from your browser." },
    { question: "15. Can I use MySiteBook for multiple construction sites?", answer: "Yes. You can manage multiple projects and assign different staff members to different sites." },
    { question: "16. How much does MySiteBook cost?", answer: "Pro Plan starts at: ₹299/month (Just ₹10 per day). Includes: Unlimited Projects, Staff Management, Role Permissions, Audit Logs, Advanced Reports." },
    { question: "17. Do you offer refunds?", answer: "Please refer to our Refund Policy page for complete details regarding payment disputes and refund eligibility." },
    { question: "18. How can I contact support?", answer: `You can contact us at: 📧 ${supportEmail}. We typically respond within 24–48 business hours.` }
  ];

  return (
    <section className="py-12 lg:py-20 bg-white relative" id="faq">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-900 px-4 py-2 rounded-full text-[13px] font-bold mb-6 shadow-sm uppercase tracking-wider">
            <span className="text-accent text-lg leading-none">❓</span> FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-gray-900 text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-6">
            Got questions? We've got answers.
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div 
                key={index}
                initial={false}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-[#0B1F4D] border-[#0B1F4D] shadow-lg' : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="w-full px-6 py-5 flex items-center justify-between text-left rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
                >
                  <span className={`font-semibold text-base md:text-lg pr-8 ${isOpen ? 'text-white' : 'text-gray-900'}`}>
                    {faq.question}
                  </span>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : 'text-gray-500'}`} 
                    />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 text-gray-300 text-base md:text-lg leading-relaxed border-t border-white/10 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Conversion FAQ */}
        <div className="bg-slate-50 border border-gray-200 rounded-[2rem] p-8 md:p-12 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">
              Why pay for MySiteBook when Excel is free?
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-500 font-bold mb-2">
                  <XCircle className="w-5 h-5 text-gray-400" />
                  Excel helps you:
                </div>
                <div className="text-gray-600 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  Store data.
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#0B1F4D] font-bold mb-2">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  MySiteBook helps you:
                </div>
                <ul className="text-[#0B1F4D] font-medium space-y-3 bg-white border border-accent/20 rounded-xl p-6 shadow-md">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent shrink-0" /> Track multiple projects</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent shrink-0" /> Manage staff access</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent shrink-0" /> Monitor changes with Audit Logs</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent shrink-0" /> Generate reports instantly</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent shrink-0" /> Access your data from anywhere</li>
                </ul>
              </div>
            </div>
            
            <p className="text-xl font-bold text-gray-900 mt-10">
              Save time. Reduce mistakes. Improve profit visibility.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
