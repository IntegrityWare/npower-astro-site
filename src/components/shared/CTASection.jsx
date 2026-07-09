import React from "react";
import { Link } from "react-router-dom";

export default function CTASection({ title, subtitle, actions }) {
  return (
    <section className="bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(225,29,46,0.12),transparent_60%)]" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
        <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">{subtitle}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {actions.map((action, i) => (
            <Link
              key={i}
              to={action.path}
              className={i === 0
                ? "btn-anim px-8 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
                : "btn-anim btn-anim-ghost px-8 py-3 text-sm font-semibold text-slate-300 border border-slate-600 hover:border-red-500 hover:text-white rounded-lg"
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