import React from "react";
import ResellerCard from "@/components/shared/ResellerCard";

export default function ResellerRegionSection({ region, countries, anchorId }) {
  return (
    <div id={anchorId} className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-slate-900 mb-2">{region}</h2>
      <div className="h-1 w-16 bg-red-600 rounded-full mb-8" />
      <div className="space-y-10">
        {countries.map((c) => (
          <div key={c.country}>
            <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
              <span>{c.flag}</span> {c.country}
              <span className="text-sm font-medium text-slate-400">
                ({c.resellers.length} {c.resellers.length === 1 ? "reseller" : "resellers"})
              </span>
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {c.resellers.map((reseller) => (
                <ResellerCard key={reseller.name} reseller={reseller} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}