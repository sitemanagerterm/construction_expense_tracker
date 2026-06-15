"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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
          <Link href="/" className="inline-flex items-center group bg-white px-5 py-2.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20">
            <img src="/mysitebook-horizontal.png" alt="MySiteBook" className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>
        </div>

        <div className="relative z-10 max-w-lg flex-grow flex flex-col justify-center mt-12">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
            Just one more step.
          </h1>
          <p className="text-base lg:text-lg text-slate-300 font-light tracking-wide leading-snug">
            We need a few details about your construction business to set up your ledger and invite your team.
          </p>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="max-w-md w-full">
          {/* Mobile Logo with subtle background */}
          <div className="lg:hidden flex flex-col items-center justify-center mb-10 -mx-8 -mt-8 sm:-mx-12 sm:-mt-12 py-10 bg-slate-900 relative overflow-hidden rounded-b-[2rem] shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2"></div>
            <Link href="/" className="inline-block group relative z-10">
              <img src="/mysitebook-horizontal.png" alt="MySiteBook" className="h-10 sm:h-12 w-auto object-contain" />
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
