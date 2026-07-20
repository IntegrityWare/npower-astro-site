import React from "react";
import { Link } from '@/lib/link';
import { ArrowRight } from "lucide-react";

const LINKS = [
  { label: "Compare Power Surfacing Products", path: "/products/comparison", desc: "Side-by-side feature comparison of all five products" },
  { label: "Geomagic Design X Alternative", path: "/geomagic-design-x-alternative", desc: "How Power Surfacing compares as a reverse-engineering alternative" },
  { label: "QuickSurface Alternative", path: "/quicksurface-alternative", desc: "How Power Surfacing compares as a scan-to-CAD alternative" },
];

export default function ProductLinksSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center">
          Compare Products and Alternatives
        </h2>
        <ul className="grid sm:grid-cols-2 gap-4 list-none">
          {LINKS.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="group card-anim flex items-start justify-between gap-3 h-full bg-slate-50 hover:bg-white border border-slate-200 hover:border-red-200 rounded-xl p-5"
              >
                <span>
                  <span className="block text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-1">{item.label}</span>
                  <span className="block text-sm text-slate-500">{item.desc}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-red-600 shrink-0 mt-1.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}