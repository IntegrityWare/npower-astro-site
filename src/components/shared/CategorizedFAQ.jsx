import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-900 pr-4">{faq.q}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0">
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function CategorizedFAQ({ categories }) {
  return (
    <div className="space-y-12">
      {categories.map((cat) => (
        <div key={cat.category}>
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">{cat.category}</h2>
          <div className="space-y-3">
            {cat.items.map((faq) => <FAQItem key={faq.q} faq={faq} />)}
          </div>
        </div>
      ))}
    </div>
  );
}