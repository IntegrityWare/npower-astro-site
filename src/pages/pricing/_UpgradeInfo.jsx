import React from "react";
import { Link } from '@/lib/link';
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import CTASection from "@/components/shared/CTASection";
import { ArrowRight, CheckCircle, ArrowUpCircle } from "lucide-react";

const upgradePaths = [
  {
    from: "Power Surfacing Viz",
    to: "Power Surfacing Studio",
    benefit: "Add standalone CAD, sketching, and full Sub-D organic modeling.",
  },
  {
    from: "Power Surfacing Viz",
    to: "Power Surfacing RE Studio",
    benefit: "Move up to reverse engineering and scan-to-CAD plus the full Studio toolset.",
  },
  {
    from: "Power Surfacing for SOLIDWORKS",
    to: "Power Surfacing Studio",
    price: "$995",
    benefit: "Get standalone CAD design without needing a SOLIDWORKS license.",
  },
  {
    from: "Power Surfacing RE for SOLIDWORKS",
    to: "Power Surfacing Studio",
    price: "$995",
    benefit: "Get standalone CAD design without needing a SOLIDWORKS license.",
  },
  {
    from: "Power Surfacing for SOLIDWORKS",
    to: "Power Surfacing RE Studio",
    price: "$2,995",
    benefit: "Move to the full standalone reverse engineering platform with advanced features.",
  },
  {
    from: "Power Surfacing RE for SOLIDWORKS",
    to: "Power Surfacing RE Studio",
    price: "$2,995",
    benefit: "Access the full standalone reverse engineering platform with advanced features.",
  },
  {
    from: "Power Surfacing Studio",
    to: "Power Surfacing RE Studio",
    price: "$4,995",
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
      <PageTitle
        title="Upgrades & Maintenance | nPower Software"
        description="Upgrade your Power Surfacing license — upgrade paths, pricing, and annual maintenance options across the product family."
      />
      <PageHero
        title="Upgrades & Maintenance"
        subtitle="Upgrade your Power Surfacing license to access more capabilities and advanced features."
        breadcrumbs={[
          { label: "Pricing & Licensing", path: "/pricing" },
          { label: "Upgrades & Maintenance" },
        ]}
      />
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Common Upgrade Paths</h2>
          <div className="space-y-4">
            {upgradePaths.map((up, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{up.from}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">{up.to}</span>
                  {up.price ? (
                    <span className="ml-auto text-lg font-bold text-slate-900">{up.price}</span>
                  ) : (
                    <span className="ml-auto text-sm font-semibold text-slate-500">Contact sales</span>
                  )}
                </div>
                <p className="text-sm text-slate-600 flex items-start gap-2">
                  <ArrowUpCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> {up.benefit}
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