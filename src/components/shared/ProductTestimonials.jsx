import React from "react";
import { Link } from '@/lib/link';
import { Quote, Star } from "lucide-react";

export default function ProductTestimonials({ testimonials, moreLink }) {
  if (!testimonials || testimonials.length === 0) return null;
  return (
    <section className="py-16 bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(225,29,46,0.08),transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-red-500 fill-red-500" />)}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">What Our Customers Say</h2>
        </div>
        <div className={`grid gap-6 ${testimonials.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2 max-w-4xl mx-auto"}`}>
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col">
              <Quote className="w-7 h-7 text-red-500 mb-4" />
              <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">"{t.quote}"</p>
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-slate-400">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
        {moreLink && (
          <div className="text-center mt-10">
            <Link to={moreLink} className="btn-anim inline-block px-6 py-3 text-sm font-semibold text-slate-300 bg-white/5 backdrop-blur-md border border-white/15 hover:border-red-500 hover:text-white rounded-lg">
              Read More Customer Comments
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}