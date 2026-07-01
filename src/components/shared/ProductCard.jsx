import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function ProductCard({ product, compact }) {
  return (
    <Link
      to={product.path}
      className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300"
    >
      <div className="aspect-video overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {product.platform}
          </span>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {product.category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 mb-3">{product.tagline}</p>
        {!compact && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{product.description}</p>
        )}
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
          Learn more <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}