import React from "react";
import { Link } from "react-router-dom";
import { PRODUCTS, SAMPLE_VIDEOS } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import VideoCard from "@/components/shared/VideoCard";
import { ArrowRight } from "lucide-react";

export default function TutorialsByProduct() {
  return (
    <div>
      <PageHero
        title="Tutorials by Product"
        subtitle="Browse tutorials organized by Power Surfacing product."
        breadcrumbs={[
          { label: "Support", path: "/support" },
          { label: "Tutorials by Product" },
        ]}
      />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {PRODUCTS.map((product) => {
            const tutorials = SAMPLE_VIDEOS.filter(v => v.product === product.name && v.type === "Tutorial");
            return (
              <div key={product.id}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{product.name}</h2>
                    <p className="text-sm text-slate-500">{product.platform}</p>
                  </div>
                  <Link to={product.path} className="text-sm font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1">
                    Product Page <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                {tutorials.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {tutorials.map((v) => <VideoCard key={v.id} video={v} />)}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 bg-slate-50 rounded-xl p-8 text-center">Tutorials for {product.shortName} coming soon.</p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}