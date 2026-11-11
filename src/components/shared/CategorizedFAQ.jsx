import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-base font-semibold text-slate-900 pr-4">{faq.q}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`px-4 pb-4 pt-0 ${open ? "" : "hidden"}`}>
        <p className="text-base text-slate-600 leading-relaxed whitespace-pre-line">{faq.a}</p>
        {faq.links?.length > 0 && (
          <p className="mt-3 flex flex-col items-start gap-2">
            {faq.links.map((link) => (
              <a key={link.href} href={link.href} className="text-base font-semibold text-red-600 underline hover:text-red-700" target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}

export default function CategorizedFAQ({ categories }) {
  return (
    <div className="space-y-8">
      {categories.map((cat) => (
        <div key={cat.category}>
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">{cat.category}</h2>
          {cat.links?.length > 0 && (
            <p className="mb-4 flex flex-col items-start gap-2">
              {cat.links.map((link) => (
                <a key={link.href} href={link.href} className="text-base font-semibold text-red-600 underline hover:text-red-700" target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ))}
            </p>
          )}
          <div className="space-y-1.5">
            {cat.items.map((faq) => <FAQItem key={faq.q} faq={faq} />)}
          </div>
        </div>
      ))}
    </div>
  );
}