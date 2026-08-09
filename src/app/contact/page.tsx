import React from "react";
import MarketingLayout from "@/components/MarketingLayout";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCommentDots } from "react-icons/fa";
import { Wrench, CreditCard, Lightbulb } from "lucide-react";

export default function ContactPage() {
  return (
    <MarketingLayout title="Contact Us" subtitle="Have questions? We'd love to hear from you.">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row mb-16">
          
          {/* Left Side: Info */}
          <div className="lg:w-2/5 bg-slate-900 text-white p-10 md:p-16 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">Get in touch</h2>
              <p className="text-slate-400 font-medium mb-12">Whether you need help with MySiteBook, have a billing question, or want to share feedback, our team is here to help.</p>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-accent mr-6 shrink-0">
                    <FaEnvelope className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Email Support</h4>
                    <p className="text-lg font-medium">support@mysitebook.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-primary-400 mr-6 shrink-0">
                    <FaCommentDots className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Business Inquiries</h4>
                    <p className="text-lg font-medium">business@mysitebook.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-green-400 mr-6 shrink-0">
                    <FaPhoneAlt className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Support Hours</h4>
                    <p className="text-lg font-medium">Monday – Saturday</p>
                    <p className="text-slate-500 text-sm mt-1">9:00 AM – 6:00 PM (IST)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-blue-400 mr-6 shrink-0">
                    <FaMapMarkerAlt className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Location</h4>
                    <p className="text-lg font-medium">Tamil Nadu, India</p>
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50" placeholder="Ramesh Kumar" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Company Name (Optional)</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50" placeholder="RK Builders" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                  <input type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50" placeholder="ramesh@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number (Optional)</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50" placeholder="+91 98765 43210" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50" placeholder="How can we help?" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea rows={5} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50 resize-none" placeholder="Tell us about your issue or sales inquiry..."></textarea>
              </div>
              
              <button type="button" className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl hover:bg-primary-700 transition-colors shadow-lg hover:-translate-y-0.5">
                Send Message
              </button>
              
              <p className="text-center text-sm font-medium text-gray-500 mt-4">
                We usually respond within 24 business hours.
              </p>
            </form>
          </div>

        </div>
        
        {/* Bonus Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Wrench className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Technical Support</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Need help using MySiteBook? Contact our support team.</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Billing Support</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Questions about subscriptions or payments? We're here to help.</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Feature Request</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Have an idea? We'd love to hear your suggestions.</p>
          </div>
        </div>

      </div>
    </MarketingLayout>
  );
}
