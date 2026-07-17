import React from "react";

export default function AlternativeComparisonTable({ competitorName, rows }) {
  return (
    <div className="overflow-x-auto border border-slate-200 rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-left">
            <th className="p-4 font-bold text-slate-900 whitespace-nowrap">Area</th>
            <th className="p-4 font-bold text-slate-900">Power Surfacing</th>
            <th className="p-4 font-bold text-slate-900">{competitorName}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.area} className="border-t border-slate-100 align-top">
              <td className="p-4 font-semibold text-slate-900 whitespace-nowrap">{r.area}</td>
              <td className="p-4 text-slate-600">{r.ours}</td>
              <td className="p-4 text-slate-500 italic">{r.theirs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}