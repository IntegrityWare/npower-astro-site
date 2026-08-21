import React from "react";
import { Link } from '@/lib/link';
import { ArrowRight, BadgeCheck } from "lucide-react";
import { PRODUCTS } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import CTASection from "@/components/shared/CTASection";
import PricingOptionCard from "@/components/shared/PricingOptionCard";

const HIGHLIGHTS = [
  "Perpetual licenses — buy once, own it forever",
  "Optional annual maintenance for updates and support",
  "Annual subscriptions available for Visualize and the standalone Studio products",
  "Upgrade paths for existing Power Surfacing customers",
];

export default function Pricing() {
  return (
    <div>
      <PageTitle
        title="Pricing | Power Surfacing Product Family"
        description="Pricing for Power Surfacing, Power Surfacing RE, Power Shell, and the standalone Studio products. Perpetual licenses, annual maintenance, and subscription options."
      />
      <PageHero
        title="Pricing"
        subtitle="Flexible licensing for every team — perpetual licenses with optional maintenance, or annual subscriptions for a lower upfront cost."
        breadcrumbs={[
          { label: "Pricing & Downloads", path: "/pricing" },
          { label: "Pricing" },
        ]}
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Contact Sales", path: "/contact" },
        ]}
      />

      <section className="bg-red-50 border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-800">
            Existing SOLIDWORKS Power Surfacing or Power Surfacing RE customer? Special upgrade pricing to the Studio products is available.
          </p>
          <Link to="/pricing/upgrades" className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 whitespace-nowrap">
            View Upgrade Pricing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HIGHLIGHTS.map((h) => (
              <div key={h} className="flex items-start gap-3">
                <BadgeCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">{h}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {PRODUCTS.filter((p) => p.pricing).map((product) => (
            <div key={product.id}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{product.name}</h2>
                  <p className="text-sm text-slate-500 mt-1">{product.tagline}</p>
                </div>
                <Link to={product.path} className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700">
                  Product Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className={`grid sm:grid-cols-2 ${product.pricing.options.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-3"} gap-5`}>
                {product.pricing.options.map((o) => <PricingOptionCard key={o.label} option={o} />)}
              </div>
              {product.pricing.note && <p className="text-sm text-slate-500 mt-4">{product.pricing.note}</p>}
            </div>
          ))}
        </div>
      </section>

      <CTASection
        title="Questions About Licensing?"
        subtitle="Contact our sales team for quotes, volume pricing, and upgrade paths for existing customers."
        actions={[
          { label: "Contact Sales", path: "/contact" },
          { label: "Download Trial", path: "/pricing/trials" },
        ]}
      />
    </div>
  );
}