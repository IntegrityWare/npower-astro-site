import React from "react";
import { Link } from '@/lib/link';
import { DollarSign, ArrowRight } from "lucide-react";
import PricingOptionCard from "@/components/shared/PricingOptionCard";

export default function ProductPricing({ product }) {
  if (!product.pricing) return null;
  const { options, note } = product.pricing;
  const cols = options.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-1 max-w-md mx-auto";
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <DollarSign className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold text-slate-900">Pricing</h2>
        </div>
        <div className={`grid sm:grid-cols-2 ${cols} gap-5`}>
          {options.map((o) => <PricingOptionCard key={o.label} option={o} />)}
        </div>
        {note && <p className="text-sm text-slate-500 text-center mt-6">{note}</p>}
        <div className="text-center mt-6">
          <Link to="/contact" className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700">
            Contact sales for quotes and upgrade pricing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}