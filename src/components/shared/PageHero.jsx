import React from "react";
import { Link } from '@/lib/link';
import { ChevronRight } from "lucide-react";
import JsonLd from "@/components/shared/JsonLd";

export default function PageHero({ title, subtitle, breadcrumbs, image, actions }) {
  return (
    <section className="relative bg-neutral-950 overflow-hidden">
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-neutral-950/70" />
        </div>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(225,29,46,0.08),transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {breadcrumbs && (
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.npowersoftware.com/" },
                ...breadcrumbs.map((bc, i) => ({
                  "@type": "ListItem",
                  position: i + 2,
                  name: bc.label,
                  ...(bc.path ? { item: "https://www.npowersoftware.com" + bc.path } : {}),
                })),
              ],
            }}
          />
        )}
        {breadcrumbs && (
          <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-6">
            <Link to="/" className="hover:text-red-400 transition-colors">Home</Link>
            {breadcrumbs.map((bc, i) => (
              <React.Fragment key={i}>
                <ChevronRight className="w-3.5 h-3.5" />
                {bc.path ? (
                  <Link to={bc.path} className="hover:text-red-400 transition-colors">{bc.label}</Link>
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
                  ? "btn-anim px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
                  : "btn-anim btn-anim-ghost px-6 py-3 text-sm font-semibold text-slate-300 bg-white/5 backdrop-blur-md border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-red-500 hover:text-white rounded-lg"
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