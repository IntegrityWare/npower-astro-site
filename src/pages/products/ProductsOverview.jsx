import React from "react";
import { PRODUCTS, IMAGES } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import ProductCard from "@/components/shared/ProductCard";
import CTASection from "@/components/shared/CTASection";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function ProductsOverview() {
  return (
    <div>
      <PageHero
        title="Power Surfacing Products"
        subtitle="Five specialized products for CAD design, freeform modeling, reverse engineering, and advanced surfacing — standalone or inside SOLIDWORKS."
        breadcrumbs={[{ label: "Products" }]}
        image={IMAGES.hero}
        actions={[
          { label: "Compare Products", path: "/products/comparison" },
          { label: "Download Trial", path: "/pricing/trials" },
        ]}
      />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Standalone Applications</h2>
          <p className="text-slate-600 mb-8">Complete design and reverse engineering — no third-party CAD license required.</p>
          <div className="grid sm:grid-cols-2 gap-6 mb-16">
            {PRODUCTS.filter(p => p.platform === "Standalone").map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">SOLIDWORKS Add-ins</h2>
          <p className="text-slate-600 mb-8">Extend SOLIDWORKS with freeform surfacing, reverse engineering, and advanced shelling.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.filter(p => p.platform === "SOLIDWORKS Add-in").map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Not sure which product is right for you?</h2>
          <p className="text-slate-600 mb-6">Compare features, platforms, and capabilities side by side.</p>
          <Link to="/products/comparison" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            View Product Comparison <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      <CTASection
        title="Start Your Free Trial"
        subtitle="Download a free trial of any Power Surfacing product and see the difference for yourself."
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Contact Sales", path: "/contact" },
        ]}
      />
    </div>
  );
}