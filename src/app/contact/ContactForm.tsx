"use client";

import React, { useState } from "react";
import { submitContactForm } from "@/app/actions/contact";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      phone: formData.get("phone") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    const result = await submitContactForm(data);

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } else {
      setError(result.error || "An unexpected error occurred. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h3>
        <p className="text-gray-600 mb-8">
          Thank you for reaching out. Our team will get back to you within 24 business hours.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-700 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
          <input name="name" type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50" placeholder="Ramesh Kumar" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Company Name (Optional)</label>
          <input name="company" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50" placeholder="RK Builders" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
          <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50" placeholder="ramesh@company.com" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number (Optional)</label>
          <input name="phone" type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50" placeholder="+91 98765 43210" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
        <input name="subject" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50" placeholder="How can we help?" />
      </div>
      
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Message *</label>
        <textarea name="message" rows={5} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50 resize-none" placeholder="Tell us about your issue or sales inquiry..."></textarea>
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className={`w-full bg-primary text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg ${
          loading ? "opacity-75 cursor-not-allowed" : "hover:bg-primary-700 hover:-translate-y-0.5"
        }`}
      >
        {loading ? "Sending Message..." : "Send Message"}
      </button>
      
      <p className="text-center text-sm font-medium text-gray-500 mt-4">
        We usually respond within 24 business hours.
      </p>
    </form>
  );
}
