"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, User } from 'lucide-react';

const signups = [
  { name: 'Rajesh K.', location: 'Chennai', action: 'started a free trial' },
  { name: 'Murugan Builders', location: 'Coimbatore', action: 'just saved 3 hours of calculations' },
  { name: 'Siva Constructions', location: 'Madurai', action: 'created their first project' },
  { name: 'Karthik S.', location: 'Bangalore', action: 'started tracking materials' },
  { name: 'Balaji', location: 'Trichy', action: 'upgraded to Pro' },
];

export default function RecentSignups() {
  const [currentNotification, setCurrentNotification] = useState<typeof signups[0] | null>(null);

  useEffect(() => {
    // Show first notification after 3 seconds
    const initialTimer = setTimeout(() => {
      showRandomNotification();
    }, 3000);

    return () => clearTimeout(initialTimer);
  }, []);

  const showRandomNotification = () => {
    const randomSignup = signups[Math.floor(Math.random() * signups.length)];
    setCurrentNotification(randomSignup);

    // Hide after 5 seconds
    setTimeout(() => {
      setCurrentNotification(null);
      
      // Show next notification after 15-25 seconds
      const nextDelay = Math.floor(Math.random() * 10000) + 15000;
      setTimeout(() => {
        showRandomNotification();
      }, nextDelay);
    }, 5000);
  };

  return (
    <AnimatePresence>
      {currentNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed bottom-6 left-6 z-50 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-4 max-w-[300px] flex gap-4 items-center"
        >
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 relative">
            <User className="w-5 h-5 text-green-600" />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[2px]">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
          </div>
          
          <div>
            <p className="text-sm font-bold text-slate-800">
              {currentNotification.name} <span className="text-xs font-normal text-slate-500">from {currentNotification.location}</span>
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              {currentNotification.action}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
