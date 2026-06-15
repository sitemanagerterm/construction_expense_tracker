import React from "react";
import MarketingLayout from "@/components/MarketingLayout";
import { FaSearch, FaBook, FaMoneyBillWave, FaUsers, FaHardHat, FaMobileAlt, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

export default function HelpCenterPage() {
  const categories = [
    { icon: <FaHardHat />, title: "Getting Started", desc: "Setting up your first site, adding staff, and configuring settings." },
    { icon: <FaMoneyBillWave />, title: "Expense Tracking", desc: "Logging expenses, material purchases, and advance tracking." },
    { icon: <FaUsers />, title: "Team Management", desc: "Permissions, roles, and managing your site supervisors." },
    { icon: <FaBook />, title: "Reporting & Ledgers", desc: "Generating PDFs, exporting to Excel, and understanding analytics." },
    { icon: <FaMobileAlt />, title: "Mobile App", desc: "Offline sync, receipt scanning, and using the staff PWA." },
    { icon: <FaSearch />, title: "Troubleshooting", desc: "Common issues and how to resolve them quickly." },
  ];

  const faqs = [
    { q: "How do I add a new construction site?", a: "Go to your Dashboard, click on 'Projects' in the sidebar, and click 'Add New Site'. Enter the site details and assign your staff members to it." },
    { q: "Can I export my ledgers to Excel?", a: "Yes, all reports can be exported to PDF and Excel formats from the 'Reports' module in your Dashboard." },
    { q: "Does the app work without internet?", a: "Absolutely. Site supervisors can log expenses offline. The app will automatically sync to the cloud when a connection is restored." },
    { q: "How many users can I invite?", a: "Our Unlimited Plan allows you to invite an unlimited number of staff, managers, and site supervisors." }
  ];

  return (
    <MarketingLayout title="Help Center" subtitle="Find answers to your questions and get the most out of MySiteBook.">
      
      {/* Search Bar Section */}
      <div className="bg-slate-50 border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-12 -mt-8 relative z-20">
          <div className="relative shadow-xl rounded-2xl overflow-hidden flex items-center bg-white border border-gray-200 p-2 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all">
            <FaSearch className="text-gray-400 text-xl ml-4 mr-3" />
            <input 
              type="text" 
              placeholder="Search for articles, guides, or troubleshooting..." 
              className="w-full py-4 text-lg outline-none text-gray-800 placeholder-gray-400"
            />
            <button className="bg-primary hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Categories Grid */}
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-10 text-center">Browse by Topic</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {categories.map((cat, i) => (
            <Link href="#" key={i} className="bg-white border border-gray-200 p-8 rounded-3xl hover:border-accent hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary text-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{cat.title}</h3>
              <p className="text-gray-600 mb-6 font-medium leading-relaxed">{cat.desc}</p>
              <span className="text-primary font-bold flex items-center group-hover:text-accent transition-colors">
                View Articles <FaArrowRight className="ml-2 w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support CTA */}
        <div className="mt-24 bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white tracking-tight mb-4">Still need help?</h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">Our support team is available Monday through Saturday to help you with any issues.</p>
            <Link href="/contact" className="inline-block bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
              Contact Support
            </Link>
          </div>
        </div>

      </div>
    </MarketingLayout>
  );
}
