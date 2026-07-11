"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is MySiteBook suitable for small contractors?",
      answer: "Yes. It is designed for both individual contractors and growing construction companies."
    },
    {
      question: "Do I need accounting knowledge?",
      answer: "No. MySiteBook is designed to be simple and easy to use."
    },
    {
      question: "Can I use it on mobile?",
      answer: "Yes. It works on mobile, tablet, and desktop devices."
    },
    {
      question: "How is profit calculated?",
      answer: "Profit is calculated using Project Value minus Total Expenses."
    },
    {
      question: "Is there a free plan?",
      answer: "Yes. One project is free forever."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes. There are no long-term contracts."
    }
  ];

  return (
    <section className="py-12 lg:py-16 bg-white relative" id="faq">
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
        <div className="space-y-4">
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
                  <span className={`font-semibold text-lg md:text-xl pr-8 ${isOpen ? 'text-white' : 'text-gray-900'}`}>
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
                      <div className="px-6 pb-6 text-gray-300 text-lg leading-relaxed border-t border-white/10 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
