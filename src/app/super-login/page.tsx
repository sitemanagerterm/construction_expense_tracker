import React from "react";
import SuperLoginClient from "./SuperLoginClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export const metadata = {
  title: "Super Admin Login - MySiteBook",
  description: "Secure login for platform super administrators.",
};

export default async function SuperLoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    if (session.user.role === "SUPER_ADMIN") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Panel: Branding & Social Proof (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col p-12 relative overflow-hidden sticky top-0 h-screen">
        {/* Ambient background blur */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "url('/construction-bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}></div>

        <div className="relative z-10">
          <div className="inline-flex items-center group rounded-lg p-1 -ml-4">
            <Image src="/mysitebook-logo-light.png" alt="MySiteBook" width={300} height={100} className="w-[150px] md:w-[190px] h-auto object-contain transition-transform group-hover:scale-105" />
            <span className="ml-3 text-accent font-bold tracking-widest uppercase text-sm border border-accent/30 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(249,115,22,0.2)]">Admin</span>
          </div>
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

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8">
        <div className="max-w-md w-full">
          {/* Mobile Logo with subtle background */}
          <div className="lg:hidden flex flex-col items-center justify-center mb-10 -mx-8 -mt-8 sm:-mx-12 sm:-mt-12 py-10 bg-slate-900 relative overflow-hidden rounded-b-[2rem] shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2"></div>
            <div className="inline-flex items-center relative z-10 rounded-lg p-1">
              <img src="/mysitebook-logo-light.png" alt="MySiteBook" width={300} height={100} className="w-[130px] sm:w-[160px] h-auto object-contain" />
            </div>
            <span className="relative z-10 mt-2 text-accent font-bold tracking-widest uppercase text-xs border border-accent/30 px-2 py-0.5 rounded">Admin Portal</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Super Admin Login</h2>
            <p className="text-gray-500 mt-1.5 text-sm lg:text-base">Restricted access for platform administrators only.</p>
          </div>

          <SuperLoginClient />
          
        </div>
      </div>
    </div>
  );
}
