import React from "react";
import { Zap } from "lucide-react";

export default function CapabilityCards({ capabilities }) {
  return (
    <section id="features" className="scroll-mt-40 py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">Key Capabilities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <div key={cap.name} className="bg-slate-50 border border-slate-200 rounded-xl p-6 card-anim">
              <Zap className="w-5 h-5 text-red-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">{cap.name}</h3>
              <p className="text-sm font-medium text-slate-700 mb-2">{cap.benefit}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{cap.technical}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}