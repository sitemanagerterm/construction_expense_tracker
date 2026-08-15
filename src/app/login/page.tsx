"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaGoogle, FaUserTie, FaMobileAlt } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { HardHat, Building2, Wallet, TrendingUp, IndianRupee, CheckCircle2, AlertCircle } from "lucide-react";

export default function Login() {
  const [loginMode, setLoginMode] = useState<"owner" | "staff">("owner");
  const [pin, setPin] = useState("");
  const [mobile, setMobile] = useState("");
  const [touchedMobile, setTouchedMobile] = useState(false);
  const [touchedPin, setTouchedPin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10 || pin.length !== 4) return;

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        mobile,
        pin,
        redirect: true,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setError("Invalid mobile number or PIN. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <Link href="/" className="inline-flex items-center group focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:outline-none rounded-lg p-1 -ml-4">
            <Image src="/mysitebook-logo-light.png" alt="MySiteBook" width={300} height={100} className="w-[150px] md:w-[190px] h-auto object-contain transition-transform group-hover:scale-105" />
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mt-8">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
            Track Every Rupee.<br />Stop Profit Drain.
          </h1>
          <p className="text-base lg:text-lg text-slate-300 font-light tracking-wide leading-snug">
            Join thousands of construction business who have eliminated ledger leaks and automated their site accounting.
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
              <Image src="/mysitebook-logo-light.png" alt="MySiteBook" width={300} height={100} className="w-[130px] sm:w-[160px] h-auto object-contain" />
            </Link>
          </div>

          <div className="text-center lg:text-left mb-6">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 mt-1.5 text-sm lg:text-base">Enter your details to access your dashboard.</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-gray-100 p-1.5 rounded-xl mb-6 border border-gray-200 shadow-inner" role="tablist">
            <button
              role="tab"
              aria-selected={loginMode === "owner"}
              onClick={() => { setLoginMode("owner"); setPin(""); setMobile(""); setError(""); }}
              className={`flex-1 flex justify-center items-center space-x-2 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset ${loginMode === "owner" ? "bg-white text-gray-900 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`}
            >
              <FaUserTie className={loginMode === "owner" ? "text-primary-600" : ""} /> <span>Site Owner</span>
            </button>
            <button
              role="tab"
              aria-selected={loginMode === "staff"}
              onClick={() => { setLoginMode("staff"); setPin(""); setMobile(""); setError(""); }}
              className={`flex-1 flex justify-center items-center space-x-2 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset ${loginMode === "staff" ? "bg-white text-gray-900 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`}
            >
              <FaMobileAlt className={loginMode === "staff" ? "text-accent" : ""} /> <span>Site Staff</span>
            </button>
          </div>

          {loginMode === "owner" ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => signIn('google')}
                  aria-label="Log in with Google"
                  className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 text-gray-800 text-base font-bold py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1"
                >
                  <FaGoogle className="text-red-500 text-lg" />
                  <span>Log in with Google</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <form className="space-y-5" onSubmit={handleStaffLogin}>
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="staffMobile" className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <input
                      id="staffMobile"
                      type="tel"
                      maxLength={10}
                      value={mobile}
                      onChange={handleMobileChange}
                      onBlur={() => setTouchedMobile(true)}
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-all shadow-sm bg-white text-gray-900 pr-10 ${touchedMobile && mobile.length !== 10 && mobile.length > 0
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/30'
                          : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                        }`}
                      placeholder="Enter 10-digit mobile number"
                      required
                    />
                    {mobile.length === 10 && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                    {touchedMobile && mobile.length !== 10 && mobile.length > 0 && (
                      <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    )}
                  </div>
                  {touchedMobile && mobile.length !== 10 && mobile.length > 0 && (
                    <p className="text-red-500 text-xs mt-1 font-medium">Please enter a valid 10-digit mobile number.</p>
                  )}
                </div>

                <div>
                  <label htmlFor="staffPin" className="block text-sm font-bold text-gray-700 mb-1">4-Digit Access PIN</label>
                  <div className="relative">
                    <input
                      id="staffPin"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={pin}
                      onChange={handlePinChange}
                      onBlur={() => setTouchedPin(true)}
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-all shadow-sm tracking-widest text-lg bg-white text-gray-900 pr-10 ${touchedPin && pin.length > 0 && pin.length < 4
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/30'
                          : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                        }`}
                      placeholder="••••"
                      required
                    />
                    {pin.length === 4 && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                    {touchedPin && pin.length > 0 && pin.length < 4 && (
                      <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    )}
                  </div>
                  {touchedPin && pin.length > 0 && pin.length < 4 && (
                    <p className="text-red-500 text-xs mt-1 font-medium">PIN must be exactly 4 digits.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={pin.length < 4 || mobile.length !== 10 || loading}
                  className={`w-full flex justify-center items-center font-bold text-base py-3 rounded-xl transition-all mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 ${pin.length === 4 && mobile.length === 10 ? 'bg-accent text-white hover:bg-accent-600 shadow-[0_8px_25px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_35px_rgba(249,115,22,0.4)] hover:-translate-y-1 border border-accent/50 focus:ring-accent' : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </>
                  ) : "Log In to Site"}
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
