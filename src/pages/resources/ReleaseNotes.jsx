import React from "react";
import { PRODUCTS } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import { CheckCircle, Calendar } from "lucide-react";

const releases = [
  {
    version: "2024.2",
    date: "December 2024",
    product: "Power Surfacing RE Studio",
    changes: ["Improved automatic surface fitting accuracy", "New mesh simplification algorithms", "Enhanced point cloud processing speed", "Bug fixes and stability improvements"],
  },
  {
    version: "2024.2",
    date: "November 2024",
    product: "Power Surfacing Studio",
    changes: ["New dimension-driven sketching constraints", "Feature history improvements", "Multi-body support enhancements", "Performance optimizations"],
  },
  {
    version: "2024.1",
    date: "October 2024",
    product: "Power Surfacing for SOLIDWORKS",
    changes: ["SOLIDWORKS 2025 compatibility", "Improved Sub-D to solid conversion", "New symmetry tools", "Enhanced crease and edge control"],
  },
  {
    version: "2024.1",
    date: "September 2024",
    product: "Power Surfacing RE for SOLIDWORKS",
    changes: ["SOLIDWORKS 2025 compatibility", "Improved mesh import performance", "Enhanced surface deviation analysis", "New guided surfacing workflows"],
  },
  {
    version: "2024.1",
    date: "August 2024",
    product: "Power Shell for SOLIDWORKS",
    changes: ["SOLIDWORKS 2025 compatibility", "Variable wall thickness improvements", "Better handling of complex topology", "Preview performance enhancements"],
  },
];

export default function ReleaseNotes() {
  return (
    <div>
      <PageHero
        title="Release Notes"
        subtitle="Stay up to date with the latest features, improvements, and fixes across all Power Surfacing products."
        breadcrumbs={[
          { label: "Resources", path: "/resources" },
          { label: "Release Notes" },
        ]}
      />
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {releases.map((release, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-xs font-semibold text-white bg-red-600 px-3 py-1 rounded-full">v{release.version}</span>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{release.product}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="w-3 h-3" /> {release.date}
                  </span>
                </div>
                <ul className="space-y-2">
                  {release.changes.map((change, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}