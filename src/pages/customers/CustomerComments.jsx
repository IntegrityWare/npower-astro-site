import React from "react";
import { useParams, Link } from "react-router-dom";
import { Quote } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import CTASection from "@/components/shared/CTASection";
import { TESTIMONIAL_GROUPS } from "@/lib/testimonialsData";

export default function CustomerComments() {
  const { groupId } = useParams();
  const group = TESTIMONIAL_GROUPS[groupId];

  if (!group) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Page not found</h1>
        <Link to="/products" className="text-red-600 font-semibold">Browse products</Link>
      </div>
    );
  }

  return (
    <div>
      <PageTitle title={group.pageTitle} description={group.pageDescription} />
      <PageHero
        title={group.title}
        subtitle={group.subtitle}
        breadcrumbs={[{ label: "Products", path: "/products" }, { label: "Customer Comments" }]}
      />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[...group.testimonials].sort((a, b) => (b.image ? 1 : 0) - (a.image ? 1 : 0)).map((t, i) => (
              <div key={i} className="card-anim break-inside-avoid bg-slate-50 border border-slate-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <Quote className="w-7 h-7 text-red-600" />
                  {t.product && (
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-red-700 bg-red-50 border border-red-100 rounded-full px-2.5 py-1">
                      {t.product}
                    </span>
                  )}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5">"{t.quote}"</p>
                {t.image && (
                  <div className="img-shadow-frame rounded-lg overflow-hidden border border-slate-200 mb-5">
                    <img src={t.image} alt={`Design by ${t.name}`} loading="lazy" className="w-full h-auto object-cover" />
                  </div>
                )}
                <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">{t.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection
        title="Ready to see it for yourself?"
        subtitle="Download a free trial and experience what our customers are talking about."
        actions={[
          { label: "Download Free Trial", path: "/pricing/trials" },
          { label: "View Pricing", path: "/pricing/plans" },
        ]}
      />
    </div>
  );
}