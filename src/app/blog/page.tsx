import React from "react";
import MarketingLayout from "@/components/MarketingLayout";
import Link from "next/link";
import { FaClock } from "react-icons/fa";

export default function BlogPage() {
  const articles = [
    { title: "5 Ways to Stop Material Theft on Construction Sites", category: "Site Management", readTime: "5 min read", img: "from-blue-100 to-blue-200" },
    { title: "Why Excel is Killing Your Construction Profit Margins", category: "Technology", readTime: "8 min read", img: "from-orange-100 to-orange-200" },
    { title: "How to Manage Subcontractor Advances Effectively", category: "Finance", readTime: "6 min read", img: "from-green-100 to-green-200" },
    { title: "The Ultimate Guide to GST for Indian Builders", category: "Compliance", readTime: "12 min read", img: "from-purple-100 to-purple-200" },
    { title: "Automating Daily Site Reports with AI", category: "Innovation", readTime: "4 min read", img: "from-teal-100 to-teal-200" },
    { title: "Choosing the Right Cement: Cost vs. Quality Analysis", category: "Materials", readTime: "7 min read", img: "from-slate-100 to-slate-200" },
  ];

  return (
    <MarketingLayout title="Contractor Blog" subtitle="Insights, strategies, and industry news for Indian construction businesses.">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Featured Article */}
        <Link href="#" className="block relative bg-slate-900 rounded-[2.5rem] overflow-hidden group mb-20 shadow-xl hover:shadow-2xl transition-all">
          <div className="absolute inset-0 bg-[url('/construction-bg.png')] opacity-20 bg-cover bg-center mix-blend-overlay group-hover:scale-105 transition-transform duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
          
          <div className="relative z-10 p-8 md:p-16 flex flex-col justify-end min-h-[400px] md:min-h-[500px]">
            <div className="flex items-center space-x-4 mb-6">
              <span className="bg-accent text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">Featured</span>
              <span className="text-gray-300 font-medium text-sm flex items-center"><FaClock className="mr-2"/> 10 min read</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6 max-w-3xl">
              The Future of Indian Construction: How Cloud Computing is Eliminating Ledger Leaks.
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-light leading-relaxed mb-8">
              An in-depth look at how top builders are migrating from physical "khata" books to centralized cloud platforms to gain real-time visibility into their cost overruns.
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold text-xl mr-4">R</div>
              <div>
                <p className="text-white font-bold">Ramesh Kumar</p>
                <p className="text-gray-400 text-sm font-medium">CEO, MySiteBook</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Article Grid */}
        <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-10">Latest Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article, i) => (
            <Link href="#" key={i} className="group flex flex-col h-full">
              <div className={`w-full aspect-[4/3] rounded-3xl bg-gradient-to-br ${article.img} mb-6 overflow-hidden relative shadow-sm border border-gray-100 group-hover:shadow-md transition-all`}>
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-primary font-bold text-sm uppercase tracking-wider">{article.category}</span>
                <span className="text-gray-400 text-sm font-medium flex items-center"><FaClock className="mr-1.5"/> {article.readTime}</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 leading-snug mb-4 group-hover:text-primary transition-colors">
                {article.title}
              </h4>
              <p className="text-gray-600 font-medium leading-relaxed mt-auto">
                Read our comprehensive breakdown of why this matters for your site's bottom line...
              </p>
            </Link>
          ))}
        </div>

      </div>
    </MarketingLayout>
  );
}
