import React from "react";

export default function PricingOptionCard({ option }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 text-center card-anim hover:border-red-200">
      <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-3">{option.label}</p>
      <p className="text-3xl font-bold text-slate-900">
        {option.price}
        {option.period && <span className="text-base font-semibold text-slate-500">{option.period}</span>}
      </p>
      {option.detail && <p className="text-xs text-slate-500 mt-2">{option.detail}</p>}
    </div>
  );
}