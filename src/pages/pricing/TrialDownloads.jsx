import React from "react";
import { Link } from "react-router-dom";
import { PRODUCTS } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import { Download, CheckCircle, ArrowRight } from "lucide-react";

export default function TrialDownloads() {
  return (
    <div>
      <PageTitle
        title="Free Trial — Download Power Surfacing | nPower Software"
        description="Download a free 30-day trial of any Power Surfacing product — full feature access, no credit card required."
      />
      <PageHero
        title="Free Trial"
        subtitle="Download free trial versions of any Power Surfacing product. No credit card required."
        breadcrumbs={[
          { label: "Pricing & Licensing", path: "/pricing" },
          { label: "Free Trial" },
        ]}
        actions={[{ label: "Contact Sales", path: "/contact" }]}
      />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-red-200 transition-all">
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 mb-4">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{product.platform}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-2 mb-1">{product.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{product.tagline}</p>
                <ul className="space-y-2 mb-6">
                  {["Full feature access", "30-day evaluation", "Free technical support"].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-red-500 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                  <Download className="w-4 h-4" /> Download Trial
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Need help choosing?</h2>
          <p className="text-slate-600 mb-6">Compare products side by side or contact our team for a recommendation.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/products/comparison" className="inline-flex items-center gap-1 px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
              Compare Products <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-1 px-6 py-3 text-sm font-semibold text-slate-700 border border-slate-300 hover:border-slate-400 rounded-lg transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}