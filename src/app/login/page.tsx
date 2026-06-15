"use client";

import { useState } from "react";
import Link from "next/link";
import { FaGoogle, FaHardHat, FaMobileAlt, FaUserTie } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function Login() {
  const [loginMode, setLoginMode] = useState<"owner" | "staff">("owner");
  const [pin, setPin] = useState("");
  const [mobile, setMobile] = useState("");

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setMobile(val);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 4) setPin(val);
  };

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
          <Link href="/" className="inline-flex items-center group bg-white px-5 py-2.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20">
            <img src="/mysitebook-horizontal.png" alt="MySiteBook" className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>
        </div>

        <div className="relative z-10 max-w-lg flex-grow flex flex-col justify-center mt-12">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
            Track Every Rupee.<br/>Stop Profit Drain.
          </h1>
          <p className="text-base lg:text-lg text-slate-300 font-light tracking-wide leading-snug">
            Join thousands of Indian contractors who have eliminated ledger leaks and automated their site accounting.
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
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 mt-2 text-sm lg:text-base">Enter your details to access your dashboard.</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-gray-100 p-1.5 rounded-xl mb-8 border border-gray-200 shadow-inner" role="tablist">
            <button 
              role="tab"
              aria-selected={loginMode === "owner"}
              onClick={() => { setLoginMode("owner"); setPin(""); setMobile(""); }}
              className={`flex-1 flex justify-center items-center space-x-2 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset ${loginMode === "owner" ? "bg-white text-gray-900 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`}
            >
              <FaUserTie className={loginMode === "owner" ? "text-primary-600" : ""} /> <span>Site Owner</span>
            </button>
            <button 
              role="tab"
              aria-selected={loginMode === "staff"}
              onClick={() => { setLoginMode("staff"); setPin(""); setMobile(""); }}
              className={`flex-1 flex justify-center items-center space-x-2 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset ${loginMode === "staff" ? "bg-white text-gray-900 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`}
            >
              <FaMobileAlt className={loginMode === "staff" ? "text-accent" : ""} /> <span>Site Staff</span>
            </button>
          </div>

          {loginMode === "owner" ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-center mt-6">
                <button 
                  onClick={() => signIn('google')}
                  aria-label="Log in with Google"
                  className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 text-gray-800 text-base font-bold py-3.5 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1"
                >
                  <FaGoogle className="text-red-500 text-lg" />
                  <span>Log in with Google</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <form className="space-y-6">
                <div>
                  <label htmlFor="staffMobile" className="block text-sm font-bold text-gray-700 mb-1.5">Mobile Number</label>
                  <input 
                    id="staffMobile"
                    type="tel" 
                    maxLength={10}
                    value={mobile}
                    onChange={handleMobileChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm bg-white text-gray-900"
                    placeholder="Enter 10-digit mobile number"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="staffPin" className="block text-sm font-bold text-gray-700 mb-1.5">4-Digit Access PIN</label>
                  <input 
                    id="staffPin"
                    type="password" 
                    inputMode="numeric"
                    maxLength={4}
                    value={pin}
                    onChange={handlePinChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm tracking-widest text-lg bg-white text-gray-900"
                    placeholder="••••"
                    required
                  />
                </div>
                
                <button 
                  type="button" 
                  disabled={pin.length < 4 || mobile.length !== 10}
                  className={`w-full font-bold text-base py-3.5 rounded-xl transition-all mt-6 focus:outline-none focus:ring-2 focus:ring-offset-2 ${pin.length === 4 && mobile.length === 10 ? 'bg-accent text-white hover:bg-accent-600 shadow-[0_8px_25px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_35px_rgba(249,115,22,0.4)] hover:-translate-y-1 border border-accent/50 focus:ring-accent' : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'}`}
                >
                  Log In to Site
                </button>
              </form>
            </div>
          )}

          <p className="text-center lg:text-left text-gray-600 mt-10 text-sm">
            Don't have an account? <Link href="/register" className="text-primary-600 hover:text-primary-700 font-bold transition-colors">Start Free Trial</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
