import React from "react";
import MarketingLayout from "@/components/MarketingLayout";

export default function HelpPage() {
  const faqs = [
    {
      q: "How do I create a project?",
      a: "Go to Dashboard → Create Project → Enter Project Details."
    },
    {
      q: "Can I manage multiple projects?",
      a: "Yes. Pro users can manage unlimited projects."
    },
    {
      q: "Can my staff add expenses?",
      a: "Yes. Team access is available on the Pro Plan."
    },
    {
      q: "Is my data secure?",
      a: "Yes. All project data is stored securely using industry-standard security practices."
    },
    {
      q: "Can I export reports?",
      a: "Yes. Reports can be downloaded and shared."
    }
  ];

  return (
    <MarketingLayout title="Help Center" subtitle="Frequently Requested Support">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-200">
          <div className="space-y-8">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-lg text-gray-600 font-medium leading-relaxed m-0">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MarketingLayout>
  );
}
