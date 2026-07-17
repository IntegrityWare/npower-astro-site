import React from "react";
import { RE_STUDIO_CONTENT } from "@/content/products/power-surfacing-re-studio";

export default function ReStudioFeatures() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-10">{RE_STUDIO_CONTENT.featuresHeading}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {RE_STUDIO_CONTENT.features.map((f) => (
            <div key={f.title} className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}