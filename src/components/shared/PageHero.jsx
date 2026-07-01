import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function PageHero({ title, subtitle, breadcrumbs, image, actions }) {
  return (
    <section className="relative bg-slate-950 overflow-hidden">
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
        </div>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.08),transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {breadcrumbs && (
          <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-6">
            <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            {breadcrumbs.map((bc, i) => (
              <React.Fragment key={i}>
                <ChevronRight className="w-3.5 h-3.5" />
                {bc.path ? (
                  <Link to={bc.path} className="hover:text-blue-400 transition-colors">{bc.label}</Link>
                ) : (
                  <span className="text-slate-300">{bc.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-3xl">{title}</h1>
        {subtitle && <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-8">{subtitle}</p>}
        {actions && (
          <div className="flex flex-wrap gap-3">
            {actions.map((action, i) => (
              <Link
                key={i}
                to={action.path}
                className={i === 0
                  ? "px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  : "px-6 py-3 text-sm font-semibold text-slate-300 border border-slate-600 hover:border-slate-400 hover:text-white rounded-lg transition-colors"
                }
              >
                {action.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}