import React from "react";
import { Link } from "react-router-dom";
import { WORKFLOWS, IMAGES } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import CTASection from "@/components/shared/CTASection";
import { ArrowRight, Database, Target, Package } from "lucide-react";

export default function WorkflowsOverview() {
  return (
    <div>
      <PageTitle
        title="Scan-to-CAD & Design Workflows | nPower Software"
        description="Task-oriented workflows for reverse engineering, scan-to-CAD, mesh-to-CAD, freeform Sub-D design, and shelling — with the recommended Power Surfacing product for each task."
      />
      <PageHero
        title="Workflows"
        subtitle="Start from what you have — a scan, a mesh, a sketch, or a solid — and follow the workflow to the result you need."
        breadcrumbs={[{ label: "Workflows" }]}
        image={IMAGES.scanToCad}
      />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WORKFLOWS.map((wf) => (
              <Link
                key={wf.id}
                to={wf.path}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-red-200 transition-all flex flex-col"
              >
                <div className="aspect-video overflow-hidden bg-slate-100">
                  <img src={wf.image} alt={wf.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors">{wf.name}</h3>
                  <div className="space-y-2 text-sm mb-4">
                    <p className="flex items-start gap-2 text-slate-600">
                      <Database className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span><span className="font-semibold text-slate-900">You have:</span> {wf.startingData}</span>
                    </p>
                    <p className="flex items-start gap-2 text-slate-600">
                      <Target className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span><span className="font-semibold text-slate-900">You get:</span> {wf.result}</span>
                    </p>
                    <p className="flex items-start gap-2 text-slate-600">
                      <Package className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span><span className="font-semibold text-slate-900">Recommended:</span> {wf.recommendedProduct}</span>
                    </p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-red-600">
                    Explore Workflow <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTASection
        title="See These Workflows in Action"
        subtitle="Watch video demos and tutorials showing real-world applications of Power Surfacing workflows."
        actions={[
          { label: "Watch Demos", path: "/resources/demos" },
          { label: "Free Trial", path: "/pricing/trials" },
        ]}
      />
    </div>
  );
}