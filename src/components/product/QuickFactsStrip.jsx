import React from "react";

export default function QuickFactsStrip({ facts }) {
  return (
    <section className="bg-neutral-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4">
          {facts.map((f) => (
            <div key={f.label}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-red-500 mb-1">{f.label}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{f.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}