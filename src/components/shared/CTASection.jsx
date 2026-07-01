import React from "react";
import { Link } from "react-router-dom";

export default function CTASection({ title, subtitle, actions }) {
  return (
    <section className="bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.12),transparent_60%)]" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
        <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">{subtitle}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {actions.map((action, i) => (
            <Link
              key={i}
              to={action.path}
              className={i === 0
                ? "px-8 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                : "px-8 py-3 text-sm font-semibold text-slate-300 border border-slate-600 hover:border-slate-400 hover:text-white rounded-lg transition-colors"
              }
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}