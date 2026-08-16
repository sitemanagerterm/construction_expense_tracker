"use client";

import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string | null;
}

export default function WhatsAppFloatingButton({ phoneNumber }: WhatsAppFloatingButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show after a slight delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      setShowTooltip(true);
      
      // Hide tooltip after some time to not be annoying
      const tooltipTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);

      return () => clearTimeout(tooltipTimer);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  // Format phone number for WhatsApp URL (remove non-digits)
  const formattedPhone = phoneNumber ? phoneNumber.replace(/\D/g, '') : '911234567890';
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=Hi%2C%20I%20want%20to%20know%20more%20about%20MySiteBook.`;

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[99] flex flex-col items-end">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: [0, -4, 0],
              scale: 1 
            }}
            transition={{ 
              y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 }
            }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="mb-4 mr-2 bg-white text-gray-800 px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium relative border border-gray-100 z-10"
          >
            Need help? Chat with us!
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white rotate-45 border-b border-r border-gray-100"></div>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTooltip(false); }}
              className="absolute -top-2 -right-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-1 border border-gray-200 shadow-sm transition-colors"
              aria-label="Close tooltip"
            >
              <FaTimes size={10} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_28px_rgba(37,211,102,0.5)] transition-colors group relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onMouseEnter={() => setShowTooltip(true)}
      >
        {/* Continuous pulse and ping effect behind the button */}
        <span className="absolute w-full h-full rounded-full border-2 border-[#25D366] animate-ping opacity-75" style={{ animationDuration: '2s' }} />
        <span className="absolute w-full h-full rounded-full bg-[#25D366] animate-pulse opacity-40" style={{ animationDuration: '2.5s' }} />
        
        {/* Icon with periodic ringing/wobble effect */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.6 }}
          className="relative z-10"
        >
          <FaWhatsapp className="w-8 h-8 sm:w-9 sm:h-9" />
        </motion.div>
      </motion.a>
    </div>
  );
}
