import React from "react";

export default function PricingOptionCard({ option }) {
  return (
    <div className="relative bg-white border border-slate-200 rounded-xl p-6 text-center card-anim hover:border-red-200">
      {option.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold text-white bg-red-600 px-3 py-1 rounded-full">
          {option.badge}
        </span>
      )}
      <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-3">{option.label}</p>
      <p className="text-3xl font-bold text-slate-900">
        {option.originalPrice && (
          <span className="text-lg font-semibold text-slate-400 line-through mr-2">{option.originalPrice}</span>
        )}
        {option.price}
        {option.period && <span className="text-base font-semibold text-slate-500">{option.period}</span>}
      </p>
      {option.detail && <p className="text-xs text-slate-500 mt-2">{option.detail}</p>}
    </div>
  );
}