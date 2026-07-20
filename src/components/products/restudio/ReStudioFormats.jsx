import React from "react";
import { CheckCircle } from "lucide-react";
import { RE_STUDIO_CONTENT } from "@/seo-content/products/power-surfacing-re-studio";

export default function ReStudioFormats() {
  const { formats } = RE_STUDIO_CONTENT;
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-10">{formats.heading}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Input Formats</h3>
            <ul className="space-y-3">
              {formats.inputs.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />{f}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Output Formats</h3>
            <ul className="space-y-3">
              {formats.outputs.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />{f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
