import React from "react";
import { Users } from "lucide-react";

export default function WhoItsFor({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <section id="who-its-for" className="scroll-mt-40 py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Who Is It For?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item} className="flex items-start gap-3 bg-white border border-slate-200 rounded-lg p-4">
              <Users className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}