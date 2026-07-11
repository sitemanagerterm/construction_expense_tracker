"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaLock, FaEnvelope, FaSpinner } from "react-icons/fa";

export default function SuperLoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("super-admin", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password, or unauthorized role.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 flex items-start gap-2">
          <FaLock className="w-5 h-5 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <label className="block text-sm font-bold text-gray-700 mb-1">Super Admin Email</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaEnvelope className="text-gray-400" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-sm bg-white text-gray-900"
            placeholder="admin@mysitebook.com"
          />
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <label className="block text-sm font-bold text-gray-700 mb-1">Access Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaLock className="text-gray-400" />
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-sm bg-white text-gray-900 tracking-widest text-lg"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 pt-2">
        <button
          type="submit"
          disabled={loading || !email || !password}
          className={`w-full flex justify-center items-center font-bold text-base py-3 rounded-xl transition-all mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 ${!loading && email && password ? 'bg-primary-900 text-white hover:bg-primary-800 shadow-[0_8px_25px_rgba(15,23,42,0.3)] hover:-translate-y-1' : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Authorizing...
            </>
          ) : "Access Command Center"}
        </button>
      </div>
    </form>
  );
}
