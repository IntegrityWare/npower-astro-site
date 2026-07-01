import React from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/shared/PageHero";
import CTASection from "@/components/shared/CTASection";
import { ArrowRight, CheckCircle, ArrowUpCircle } from "lucide-react";

const upgradePaths = [
  {
    from: "Power Surfacing for SOLIDWORKS",
    to: "Power Surfacing Studio",
    benefit: "Get standalone CAD design without needing a SOLIDWORKS license.",
  },
  {
    from: "Power Surfacing RE for SOLIDWORKS",
    to: "Power Surfacing RE Studio",
    benefit: "Access the full standalone reverse engineering platform with advanced features.",
  },
  {
    from: "Power Surfacing Studio",
    to: "Power Surfacing RE Studio",
    benefit: "Add reverse engineering capabilities — scan-to-CAD, mesh-to-CAD, and more.",
  },
  {
    from: "Any single product",
    to: "Multi-product bundle",
    benefit: "Save with bundled pricing when you need multiple Power Surfacing products.",
  },
];

export default function UpgradeInfo() {
  return (
    <div>
      <PageHero
        title="Upgrade Information"
        subtitle="Upgrade your Power Surfacing license to access more capabilities and advanced features."
        breadcrumbs={[
          { label: "Pricing & Downloads", path: "/pricing/trials" },
          { label: "Upgrade Information" },
        ]}
      />
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Common Upgrade Paths</h2>
          <div className="space-y-4">
            {upgradePaths.map((up, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{up.from}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{up.to}</span>
                </div>
                <p className="text-sm text-slate-600 flex items-start gap-2">
                  <ArrowUpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> {up.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection
        title="Ready to Upgrade?"
        subtitle="Contact our sales team for upgrade pricing and to process your upgrade."
        actions={[
          { label: "Contact Sales", path: "/contact" },
          { label: "Compare Products", path: "/products/comparison" },
        ]}
      />
    </div>
  );
}