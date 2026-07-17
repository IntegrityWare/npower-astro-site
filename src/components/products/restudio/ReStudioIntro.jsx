import React from "react";
import { RE_STUDIO_CONTENT } from "@/content/products/power-surfacing-re-studio";

export default function ReStudioIntro() {
  const { intro } = RE_STUDIO_CONTENT;
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">{intro.heading}</h2>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          {intro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}