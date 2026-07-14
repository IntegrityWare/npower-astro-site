import React from "react";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "workflow", label: "Workflow" },
  { id: "features", label: "Features" },
  { id: "compatibility", label: "Compatibility" },
  { id: "examples", label: "Examples" },
  { id: "compare", label: "Compare" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

export default function StickyProductNav() {
  return (
    <nav className="sticky top-24 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto py-2 -mx-1">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}