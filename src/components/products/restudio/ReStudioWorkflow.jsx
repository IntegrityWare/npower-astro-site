import React from "react";
import { RE_STUDIO_CONTENT } from "@/content/products/power-surfacing-re-studio";

export default function ReStudioWorkflow() {
  const { workflow } = RE_STUDIO_CONTENT;
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-10">{workflow.heading}</h2>
        <ol className="space-y-6">
          {workflow.steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="w-9 h-9 shrink-0 rounded-full bg-red-600 text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}