import React from "react";
import MarketingLayout from "@/components/MarketingLayout";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactPage() {
  return (
    <MarketingLayout title="Contact Us" subtitle="Have questions? We're here to help you succeed.">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left Side: Info */}
          <div className="lg:w-2/5 bg-slate-900 text-white p-10 md:p-16 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">Get in touch</h2>
              <p className="text-slate-400 font-medium mb-12">Whether you need help onboarding your team or have questions about pricing, our team is ready to assist.</p>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-accent mr-6 shrink-0">
                    <FaEnvelope className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Email Support</h4>
                    <p className="text-lg font-medium">support@mysitebook.com</p>
                    <p className="text-slate-500 text-sm mt-1">Avg response: 2 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-primary-400 mr-6 shrink-0">
                    <FaPhoneAlt className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Sales Phone</h4>
                    <p className="text-lg font-medium">+91 98765 43210</p>
                    <p className="text-slate-500 text-sm mt-1">Mon-Sat, 9AM-6PM IST</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-green-400 mr-6 shrink-0">
                    <FaMapMarkerAlt className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Office HQ</h4>
                    <p className="text-lg font-medium">Hitech City, Hyderabad</p>
                    <p className="text-slate-500 text-sm mt-1">Telangana, India 500081</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 mt-16">
              <img src="/mysitebook-horizontal-dark.png" alt="MySiteBook" className="h-8 opacity-50 grayscale object-contain" />
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:w-3/5 p-10 md:p-16 bg-white">
            <h3 className="text-2xl font-black text-gray-900 mb-8">Send us a message</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50" placeholder="Ramesh" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50" placeholder="Kumar" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50" placeholder="ramesh@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50" placeholder="+91 98765 43210" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">How can we help?</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50 resize-none" placeholder="Tell us about your issue or sales inquiry..."></textarea>
              </div>
              
              <button type="button" className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl hover:bg-primary-700 transition-colors shadow-lg hover:-translate-y-0.5">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </MarketingLayout>
  );
}
