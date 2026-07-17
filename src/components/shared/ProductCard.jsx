import React from "react";
import { Link } from '@/lib/link';
import { ArrowRight } from "lucide-react";

export default function ProductCard({ product, compact }) {
  return (
    <Link
      to={product.path}
      className="group card-anim bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="relative w-full h-full object-contain px-8 pt-6 pb-10 transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:-rotate-[1.5deg] group-hover:-translate-y-2.5"
        />
      </div>
      <div className="p-5 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            {product.platform}
          </span>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {product.category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 mb-3">{product.tagline}</p>
        {!compact && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{product.description}</p>
        )}
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 group-hover:gap-2.5 transition-all">
          Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
