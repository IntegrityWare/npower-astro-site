import React from "react";
import { Link } from '@/lib/link';
import { ArrowRight, ExternalLink } from "lucide-react";
import { PRODUCTS, SOLIDWORKS_STORE_URL } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import PricingOptionCard from "@/components/shared/PricingOptionCard";
import BuyButton from "@/components/shared/BuyButton";

const STORE_PRODUCT_IDS = ["power-surfacing-visualize", "power-surfacing-studio", "power-surfacing-re-studio"];

const AVAILABILITY = {
  "power-surfacing-visualize": "In Beta, Releasing Very Soon",
  "power-surfacing-re-studio": "Coming Soon",
};

const storeProducts = STORE_PRODUCT_IDS.map((id) => PRODUCTS.find((p) => p.id === id));
const solidworksProducts = PRODUCTS.filter((p) => p.platform === "SOLIDWORKS Add-in");

function SolidworksStoreButton({ compact = false }) {
  return (
    <a
      href={SOLIDWORKS_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-anim inline-flex items-center gap-2 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg whitespace-nowrap ${compact ? "px-4 py-2 text-sm" : "px-8 py-3 text-sm"}`}
    >
      Go to the SOLIDWORKS Product Store <ExternalLink className="w-4 h-4" />
    </a>
  );
}

export default function Store() {
  return (
    <div>
      <PageTitle
        title="Store | Power Surfacing Viz, Studio & RE Studio"
        description="Buy Power Surfacing Viz, Studio, and RE Studio perpetual, network, and subscription licenses, or visit the SOLIDWORKS Product Store for Power Surfacing add-ins."
      />
      <PageHero
        title="Store"
        subtitle="License options for the new standalone Power Surfacing products: Viz, Studio, and RE Studio. Power Surfacing add-ins for SOLIDWORKS are sold through the SOLIDWORKS Product Store."
        breadcrumbs={[{ label: "Store" }]}
      />

      <section className="bg-red-50 border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-800">
            Buying Power Surfacing, Power Surfacing RE, or Power Shell for SOLIDWORKS?
          </p>
          <SolidworksStoreButton compact />
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {storeProducts.map((product) => (
            <div key={product.id}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-900">{product.name}</h2>
                    <BuyButton product={product} />
                    {AVAILABILITY[product.id] && (
                      <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                        {AVAILABILITY[product.id]}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{product.tagline}</p>
                </div>
                <Link to={product.path} className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700">
                  Product Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className={`grid sm:grid-cols-2 ${product.pricing.options.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-5`}>
                {product.pricing.options.map((o) => <PricingOptionCard key={o.label} option={o} />)}
              </div>
              {product.pricing.note && <p className="text-sm text-slate-500 mt-4">{product.pricing.note}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Need a quote?</h2>
          <p className="text-slate-600 mb-6">
            Contact our sales team for quotes, volume pricing, or help choosing the right license for Viz, Studio, or RE Studio. You can also buy through an authorized reseller.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-anim px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg">
              Contact Sales
            </Link>
            <Link to="/resellers" className="btn-anim px-6 py-3 text-sm font-semibold text-slate-700 border border-slate-300 hover:border-red-500 rounded-lg">
              Find a Reseller
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(225,29,46,0.12),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">SOLIDWORKS Product Store</h2>
          <p className="text-lg text-slate-400 mb-6 max-w-2xl mx-auto">
            Power Surfacing add-ins for SOLIDWORKS are sold through our online store, hosted by SoftwareKey.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
            {solidworksProducts.map((p) => (
              <Link key={p.id} to={p.path} className="text-sm text-slate-300 hover:text-white underline-offset-4 hover:underline">
                {p.name}
              </Link>
            ))}
          </div>
          <SolidworksStoreButton />
        </div>
      </section>
    </div>
  );
}
