import React from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import { Download, Key, ArrowUpCircle, ArrowRight, DollarSign } from "lucide-react";

const options = [
  { icon: DollarSign, title: "Pricing", desc: "View license, maintenance, and subscription pricing for the full Power Surfacing product family.", path: "/pricing/plans" },
  { icon: Download, title: "Free Trial", desc: "Download free trial versions of any Power Surfacing product. No credit card required.", path: "/pricing/trials" },
  { icon: Key, title: "Downloads", desc: "Download the latest licensed versions of Power Surfacing products.", path: "/pricing/downloads" },
  { icon: ArrowUpCircle, title: "Upgrades & Maintenance", desc: "Learn about upgrade paths, annual maintenance, and bundle pricing across the product family.", path: "/pricing/upgrades" },
];

export default function PricingOverview() {
  return (
    <div>
      <PageTitle
        title="Pricing & Licensing — Perpetual Licenses & Subscriptions | nPower Software"
        description="Explore Power Surfacing pricing and licensing — perpetual licenses, annual maintenance, subscriptions, free trials, and upgrade paths."
      />
      <PageHero
        title="Pricing & Licensing"
        subtitle="View pricing, start a free trial, or explore upgrade and maintenance options for the Power Surfacing product family."
        breadcrumbs={[{ label: "Pricing & Licensing" }]}
        actions={[
          { label: "Free Trial", path: "/pricing/trials" },
          { label: "Contact Sales", path: "/contact" },
        ]}
      />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {options.map((o) => (
              <Link
                key={o.title}
                to={o.path}
                className="group bg-white border border-slate-200 rounded-xl p-8 hover:shadow-xl hover:border-red-200 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center mb-5 transition-colors">
                  <o.icon className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">{o.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{o.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-600">
                  View <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}