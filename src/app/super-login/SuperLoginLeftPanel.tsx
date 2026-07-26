"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SuperLoginLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col p-12 relative overflow-hidden sticky top-0 h-screen">
      {/* Ambient background blur */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "url('/construction-bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}></div>

      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center group focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:outline-none rounded-lg p-1 -ml-4">
          <Image src="/mysitebook-logo-dark.png" alt="MySiteBook" width={300} height={100} className="w-[150px] md:w-[190px] h-auto object-contain transition-transform group-hover:scale-105" />
          <span className="ml-3 text-accent font-bold tracking-widest uppercase text-sm border border-accent/30 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(249,115,22,0.2)]">Admin</span>
        </Link>
      </div>

      <div className="relative z-10 max-w-lg mt-8">
        <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
          Platform Command Center
        </h1>
        <p className="text-base lg:text-lg text-slate-300 font-light tracking-wide leading-snug">
          Secure access to manage tenants, subscriptions, and system-wide configurations.
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
  );
}
