import React from "react";
import { PRODUCTS, IMAGES } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import ProductSelectionCard from "@/components/shared/ProductSelectionCard";
import ComparisonTable from "@/components/shared/ComparisonTable";
import CTASection from "@/components/shared/CTASection";
import { Link } from '@/lib/link';
import { ArrowRight } from "lucide-react";

export default function ProductsOverview() {
  return (
    <div>
      <PageTitle
        title="CAD & Reverse Engineering Software Products | nPower"
        description="Choose the right Power Surfacing product — standalone applications or SOLIDWORKS add-ins for freeform Sub-D design, scan-to-CAD reverse engineering, and advanced shelling."
      />
      <PageHero
        title="Products"
        subtitle="Six specialized products for CAD visualization, freeform modeling, reverse engineering, and advanced surfacing — standalone or inside SOLIDWORKS."
        breadcrumbs={[{ label: "Products" }]}
        image={IMAGES.hero}
        actions={[
          { label: "Free Trial", path: "/pricing/trials" },
          { label: "Compare Products", path: "/products/comparison" },
        ]}
      />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Standalone Applications</h2>
          <p className="text-slate-600 mb-8">CAD visualization, design, and reverse engineering — no third-party CAD license required.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {PRODUCTS.filter(p => p.platform === "Standalone").map(p => <ProductSelectionCard key={p.id} product={p} />)}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">SOLIDWORKS Add-ins</h2>
          <p className="text-slate-600 mb-8">Extend SOLIDWORKS with freeform surfacing, reverse engineering, and advanced shelling.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.filter(p => p.platform === "SOLIDWORKS Add-in").map(p => <ProductSelectionCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Compare Products</h2>
          <p className="text-slate-600 mb-8 text-center">Compare features, platforms, and capabilities side by side.</p>
          <ComparisonTable />
          <div className="text-center mt-8">
            <Link to="/products/comparison" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
              Open Full Comparison <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      <CTASection
        title="Start Your Free Trial"
        subtitle="Download a free trial of any Power Surfacing product and see the difference for yourself."
        actions={[
          { label: "Free Trial", path: "/pricing/trials" },
          { label: "Contact Sales", path: "/contact" },
        ]}
      />
    </div>
  );
}