import React from "react";
import MarketingLayout from "@/components/MarketingLayout";
import { FaArrowUp, FaArrowDown, FaQuoteLeft } from "react-icons/fa";

export default function CaseStudiesPage() {
  return (
    <MarketingLayout title="Customer Success Stories" subtitle="See how top contractors are scaling their business with MySiteBook.">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Case Study */}
        <div className="bg-slate-900 rounded-[3rem] overflow-hidden flex flex-col lg:flex-row mb-24 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center relative z-10">
            <img src="/mysitebook-horizontal.png" alt="Logo" className="h-8 w-auto mb-8 opacity-50 grayscale invert self-start object-contain" />
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">
              How Sri Ram Constructions reduced cost overruns by 15%.
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed font-light mb-10">
              By replacing physical ledgers with MySiteBook's PWA for their 12 site supervisors, Sri Ram Constructions eliminated missing receipts and caught material leakage in real-time.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-slate-900 px-8 py-3.5 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">Read Full Study</button>
            </div>
          </div>

          <div className="lg:w-1/2 bg-slate-800/50 p-10 md:p-16 border-l border-white/10 flex flex-col justify-center relative z-10">
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-accent text-5xl font-black flex items-center mb-2"><FaArrowDown className="text-2xl mr-2"/> 15%</p>
                <p className="text-slate-400 font-medium text-sm uppercase tracking-wider">Cost Overruns</p>
              </div>
              <div>
                <p className="text-green-400 text-5xl font-black flex items-center mb-2"><FaArrowUp className="text-2xl mr-2"/> 40h</p>
                <p className="text-slate-400 font-medium text-sm uppercase tracking-wider">Saved per month</p>
              </div>
              <div>
                <p className="text-blue-400 text-5xl font-black flex items-center mb-2"><FaArrowUp className="text-2xl mr-2"/> 100%</p>
                <p className="text-slate-400 font-medium text-sm uppercase tracking-wider">Receipt Capture</p>
              </div>
              <div>
                <p className="text-purple-400 text-5xl font-black mb-2">₹12L</p>
                <p className="text-slate-400 font-medium text-sm uppercase tracking-wider">Leakage Prevented</p>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 relative">
              <FaQuoteLeft className="text-white/10 text-4xl absolute top-6 right-6" />
              <p className="text-white italic text-lg mb-4 relative z-10">
                "Before MySiteBook, we had no idea what our actual daily burn rate was. Now, every rupee is tracked in real-time."
              </p>
              <p className="text-slate-300 font-bold text-sm">— Ramesh Kumar, MD</p>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-10 text-center">More Success Stories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Suresh Patel", role: "Owner, Patel Builders", quote: "The Voice AI logging is magic. My supervisors who struggle with typing just speak into the phone and the expense is logged instantly." },
            { name: "Amit Singh", role: "Project Manager, APEX Infra", quote: "Offline sync saved us. Many of our highway projects have no network. Staff logs everything offline and it syncs when they reach home." },
            { name: "Priya Sharma", role: "Finance Head, GlobalBuild", quote: "Generating weekly P&L reports used to take 2 full days of matching receipts to Excel. Now it takes 1 click." }
          ].map((test, i) => (
            <div key={i} className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary transition-all">
              <div className="text-accent mb-6 flex">
                {[...Array(5)].map((_, j) => <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
              </div>
              <p className="text-gray-700 text-lg italic mb-8 leading-relaxed">"{test.quote}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full mr-4 border border-gray-200"></div>
                <div>
                  <h4 className="font-bold text-gray-900">{test.name}</h4>
                  <p className="text-sm font-medium text-gray-500">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </MarketingLayout>
  );
}
