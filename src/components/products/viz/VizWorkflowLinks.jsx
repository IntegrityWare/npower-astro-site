import React from 'react';
import { VIZ_WORKFLOWS } from '@/lib/vizWorkflows.js';

export default function VizWorkflowLinks() {
  return (
    <section id="viz-workflows" className="scroll-mt-28 bg-slate-50 py-12 md:py-16" aria-labelledby="viz-workflows-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-red-600">Power Surfacing VIZ workflows</p>
        <h2 id="viz-workflows-heading" className="text-2xl md:text-3xl font-bold text-slate-900">What do you want to create?</h2>
        <p className="mt-3 mb-7 text-slate-600">Start with your CAD model. Choose a workflow for the image, animation, or mesh you need.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VIZ_WORKFLOWS.map((workflow) => (
            <a key={workflow.id} href={workflow.path} className="group rounded-xl border border-slate-200 bg-white p-5 hover:border-red-300 hover:shadow-md transition-all focus-visible:outline focus-visible:outline-red-600 focus-visible:outline-offset-4">
              <h3 className="font-bold text-slate-900 group-hover:text-red-700">{workflow.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{workflow.description}</p>
              <span className="mt-4 block text-sm font-semibold text-red-600">Explore workflow →</span>
            </a>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-600">Questions about platforms, rendering, or the trial? <a href="/resources/faq/viz/" className="font-semibold text-red-600 underline">Read the VIZ FAQ</a>.</p>
      </div>
    </section>
  );
}
