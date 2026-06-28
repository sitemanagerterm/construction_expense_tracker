"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from "framer-motion";
import { HardHat, Building2, TrendingUp, IndianRupee } from "lucide-react";

export default function Onboarding() {
  const router = useRouter();
  const { update } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      companyName: formData.get('companyName'),
      mobile: formData.get('mobile'),
      businessType: formData.get('businessType'),
    };

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      // Refresh the session so the new tenantId is attached to the JWT
      await update();

      // Redirect to the dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Panel: Branding & Value Proposition (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col p-12 relative overflow-hidden sticky top-0 h-screen">
        {/* Ambient background blur */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "url('/construction-bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}></div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center group">
            <img src="/mysitebook-horizontal-dark.png" alt="MySiteBook" className="h-12 md:h-16 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mt-12">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
            Just one more step.
          </h1>
          <p className="text-base lg:text-lg text-slate-300 font-light tracking-wide leading-snug">
            We need a few details about your construction business to set up your ledger and invite your team.
          </p>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="relative z-10 flex-grow flex items-center justify-center mt-12 w-full">
          <div className="relative w-full max-w-md bg-slate-800/80 rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md flex flex-col">
            {/* Window Header */}
            <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-slate-900/80">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            {/* Window Body */}
            <div className="p-6 flex-grow flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-24 bg-white/20 rounded"></div>
                  <div className="h-6 w-32 bg-white/40 rounded"></div>
                </div>
                <div className="h-8 w-20 bg-accent/20 text-accent text-xs font-bold flex items-center justify-center rounded-full border border-accent/30">+14.2%</div>
              </div>
              
              {/* Bar Chart Mockup */}
              <div className="flex-grow flex items-end gap-3 h-32 mt-4">
                <div className="w-full bg-white/10 rounded-t h-[40%] transition-all hover:bg-white/20"></div>
                <div className="w-full bg-white/10 rounded-t h-[60%] transition-all hover:bg-white/20"></div>
                <div className="w-full bg-accent rounded-t h-[90%] relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">Peak</div>
                </div>
                <div className="w-full bg-white/10 rounded-t h-[50%] transition-all hover:bg-white/20"></div>
                <div className="w-full bg-white/10 rounded-t h-[70%] transition-all hover:bg-white/20"></div>
                <div className="w-full bg-white/10 rounded-t h-[30%] transition-all hover:bg-white/20"></div>
              </div>
            </div>
          </div>
          
          {/* Decorative gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-accent/5 to-transparent rounded-full blur-[80px] -z-10"></div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="max-w-md w-full">
          {/* Mobile Logo with subtle background */}
          <div className="lg:hidden flex flex-col items-center justify-center mb-10 -mx-8 -mt-8 sm:-mx-12 sm:-mt-12 py-10 bg-slate-900 relative overflow-hidden rounded-b-[2rem] shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2"></div>
            <Link href="/" className="inline-block group relative z-10">
              <img src="/mysitebook-horizontal-dark.png" alt="MySiteBook" className="h-10 sm:h-12 w-auto object-contain" />
            </Link>
          </div>

          <div className="text-center lg:text-left mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-2">Google Sign-In Successful!</h2>
            <p className="text-gray-500 text-base lg:text-lg">Complete your business profile to enter the dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
            <div>
              <label htmlFor="companyName" className="block text-sm font-bold text-gray-700 mb-1.5">Company / Site Owner Name</label>
              <input 
                id="companyName"
                name="companyName"
                type="text" 
                className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm bg-white text-gray-900"
                placeholder="Sri Ram Constructions"
                required
              />
            </div>
            
            <div>
              <label htmlFor="mobile" className="block text-sm font-bold text-gray-700 mb-1.5">Mobile Number</label>
              <input 
                id="mobile"
                name="mobile"
                type="tel" 
                className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm bg-white text-gray-900"
                placeholder="10-digit mobile number"
                maxLength={10}
                required
              />
            </div>

            <div>
              <label htmlFor="businessType" className="block text-sm font-bold text-gray-700 mb-1.5">Business Type</label>
              <select 
                id="businessType"
                name="businessType"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm bg-white text-gray-900 appearance-none"
                required
                defaultValue=""
              >
                <option value="" disabled>Select type</option>
                <option value="general_contractor">General Contractor</option>
                <option value="builder">Builder / Developer</option>
                <option value="subcontractor">Subcontractor</option>
                <option value="architect">Architect / Designer</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-primary text-white font-bold text-lg py-4 rounded-xl transition-all mt-6 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${loading ? 'opacity-70 cursor-wait' : 'hover:bg-primary-700 shadow-[0_8px_25px_rgba(21,62,117,0.3)] hover:shadow-[0_8px_35px_rgba(21,62,117,0.4)] hover:-translate-y-1'}`}
            >
              {loading ? 'Setting up Dashboard...' : 'Complete Setup & Enter'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
