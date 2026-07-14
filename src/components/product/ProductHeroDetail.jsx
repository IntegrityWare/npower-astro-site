import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Play } from "lucide-react";

export default function ProductHeroDetail({ product }) {
  const d = product.detail;
  return (
    <section className="relative bg-neutral-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(225,29,46,0.08),transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-6">
          <Link to="/" className="hover:text-red-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-red-400 transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-300">{product.name}</span>
        </nav>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-5">{product.name}</h1>
            <p className="text-lg text-slate-400 mb-8">{d.definition}</p>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link to="/pricing/downloads" className="btn-anim px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg">
                Download Free Trial
              </Link>
              <a href="#pricing" className="btn-anim px-6 py-3 text-sm font-semibold text-slate-300 bg-white/5 backdrop-blur-md border border-white/15 hover:border-red-500 hover:text-white rounded-lg">
                View Pricing
              </a>
            </div>
            <a
              href={`https://www.youtube.com/watch?v=${d.overviewYoutubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-400 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" /> Watch Product Overview
            </a>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/15 bg-black shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${d.overviewYoutubeId}`}
              title={`${product.name} overview video`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}