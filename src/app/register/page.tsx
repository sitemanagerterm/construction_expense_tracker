"use client";

import Link from "next/link";
import { FaGoogle, FaHardHat } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function Register() {
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
            Start building your profit today.
          </h1>
          <p className="text-base lg:text-lg text-slate-300 font-light tracking-wide leading-snug">
            Get complete control over your construction site expenses, material tracking, and daily reports in one unified dashboard.
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

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Create your account</h2>
            <p className="text-gray-500 text-sm lg:text-base">Start your 3-Month Free Trial. No credit card required.</p>
          </div>

          <div className="flex justify-center mt-6">
            <button 
              onClick={() => signIn('google')}
              aria-label="Sign up with Google"
              className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 text-gray-800 text-base font-bold py-3.5 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1"
            >
              <FaGoogle className="text-red-500 text-lg" />
              <span>Sign up with Google</span>
            </button>
          </div>

          <p className="text-center lg:text-left text-gray-600 mt-10 text-sm">
            Already have an account? <Link href="/login" className="text-primary-600 hover:text-primary-700 font-bold transition-colors">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
