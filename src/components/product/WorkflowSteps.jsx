import React from "react";

export default function WorkflowSteps({ steps }) {
  return (
    <section id="workflow" className="scroll-mt-40 py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">How the Workflow Works</h2>
        <ol className="space-y-6">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-5 bg-white border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                <span className="text-base font-bold text-white">{i + 1}</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}