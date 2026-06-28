import React from "react";
import MarketingLayout from "@/components/MarketingLayout";

export default function AboutPage() {
  return (
    <MarketingLayout title="About Us" subtitle="Built By People Who Understand Construction">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="prose prose-lg prose-slate mx-auto text-gray-700">
          <p className="text-xl leading-relaxed mb-6">
            MySiteBook was created to solve one of the biggest problems faced by contractors.
          </p>
          <p className="text-xl leading-relaxed mb-12">
            Many projects lose money not because of poor execution, but because expenses, payments, and materials are not tracked properly.
          </p>
          
          <h2 className="text-3xl font-black text-gray-900 mb-6">Our mission is simple:</h2>
          <div className="bg-[#0B1F4D] text-white rounded-2xl p-8 shadow-xl">
            <p className="text-2xl font-medium leading-relaxed m-0 text-center">
              Help every contractor understand exactly where their money is going and how much profit they are making.
            </p>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
