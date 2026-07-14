import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-2 text-left gap-4">
        <span className="text-base font-semibold text-slate-900">{q}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={open ? "pb-3" : "sr-only"}>
        <p className="text-base text-slate-600 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function ProductFAQ({ faq, faqLink }) {
  return (
    <section id="faq" className="scroll-mt-40 py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
        <div className="border-t border-slate-200">
          {faq.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
        {faqLink && (
          <p className="text-sm text-slate-500 mt-6">
            More questions answered in the <Link to={faqLink} className="font-semibold text-red-600 hover:text-red-700">full product FAQ</Link>.
          </p>
        )}
      </div>
    </section>
  );
}