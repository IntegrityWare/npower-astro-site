import React from "react";
import JsonLd from "@/components/shared/JsonLd";

export default function SeoFaq({ title = "Frequently Asked Questions", faqs }) {
  if (!faqs || faqs.length === 0) return null;
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">{title}</h2>
        <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
          {faqs.map((f) => (
            <div key={f.q} className="py-2">
              <h3 className="text-base font-bold text-slate-900 py-2">{f.q}</h3>
              <p className="text-base text-slate-600 pb-2">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </section>
  );
}