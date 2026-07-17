import React from "react";
import JsonLd from "@/components/shared/JsonLd";
import { RE_STUDIO_CONTENT } from "@/content/products/power-surfacing-re-studio";

// Re-exported for structured-data and other consumers; content lives in src/content.
export const RE_STUDIO_FAQS = RE_STUDIO_CONTENT.faqs;

export default function ReStudioFaq() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: RE_STUDIO_FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }}
        />
        <h2 className="text-3xl font-bold text-slate-900 mb-10">Power Surfacing RE Studio FAQ</h2>
        <div className="space-y-8">
          {RE_STUDIO_FAQS.map((f) => (
            <div key={f.q}>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{f.q}</h3>
              <p className="text-slate-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}