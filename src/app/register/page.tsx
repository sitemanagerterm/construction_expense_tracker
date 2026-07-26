"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { motion } from "framer-motion";
import { HardHat, Building2, TrendingUp, IndianRupee } from "lucide-react";

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
          <Link href="/" className="inline-flex items-center group focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:outline-none rounded-lg p-1 -ml-4">
            <Image src="/mysitebook-logo-dark.png" alt="MySiteBook" width={300} height={100} className="w-[150px] md:w-[190px] h-auto object-contain transition-transform group-hover:scale-105" />
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mt-8">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
            Build your business.<br/>We'll handle the math.
          </h1>
          <p className="text-base lg:text-lg text-slate-300 font-light tracking-wide leading-snug">
            Create your account to start tracking expenses, managing materials, and knowing your exact profit margins on every project.
          </p>
        </div>

        {/* Dashboard Image */}
        <div className="relative z-10 flex-grow flex items-center justify-center mt-12 w-full">
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-full max-w-lg relative"
          >
            <div className="absolute inset-0 bg-accent/20 blur-[80px] -z-10 rounded-full"></div>
            <Image src="/dashboard-mockup.png" alt="MySiteBook Dashboard" width={800} height={600} priority className="w-full h-auto drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8">
        <div className="max-w-md w-full">
          {/* Mobile Logo with subtle background */}
          <div className="lg:hidden flex flex-col items-center justify-center mb-10 -mx-8 -mt-8 sm:-mx-12 sm:-mt-12 py-10 bg-slate-900 relative overflow-hidden rounded-b-[2rem] shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2"></div>
            <Link href="/" className="inline-block group relative z-10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:outline-none rounded-lg p-1">
              <Image src="/mysitebook-logo-dark.png" alt="MySiteBook" width={300} height={100} className="w-[130px] sm:w-[160px] h-auto object-contain" />
            </Link>
          </div>

          <div className="text-center lg:text-left mb-6">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Create an account</h2>
            <p className="text-gray-500 mt-1.5 text-sm lg:text-base">Start tracking your site expenses today.</p>
          </div>

          <button 
            onClick={() => signIn('google')}
            aria-label="Sign up with Google"
            className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 text-gray-800 text-base font-bold py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 mb-6"
          >
            <FaGoogle className="text-red-500 text-lg" />
            <span>Sign up with Google</span>
          </button>

          <p className="text-center lg:text-left text-gray-600 mt-10 text-sm">
            Already have an account? <Link href="/login" className="text-primary-600 hover:text-primary-700 font-bold transition-colors">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
