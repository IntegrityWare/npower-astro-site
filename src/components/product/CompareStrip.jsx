import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/siteData";

export default function CompareStrip({ currentProductId }) {
  const others = PRODUCTS.filter((p) => p.id !== currentProductId);
  return (
    <section id="compare" className="scroll-mt-40 py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">How It Compares</h2>
          <Link to="/products/comparison" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
            Full Product Comparison <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {others.map((p) => (
            <Link key={p.id} to={p.path} className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-red-300 hover:shadow-md transition-all">
              <p className="text-xs font-semibold text-red-600 mb-2">{p.platform}</p>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-1.5">{p.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{p.tagline}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}