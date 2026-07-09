import React from "react";
import { Link } from "react-router-dom";
import { WORKFLOWS, IMAGES } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import CTASection from "@/components/shared/CTASection";
import { ArrowRight } from "lucide-react";

export default function WorkflowsOverview() {
  return (
    <div>
      <PageHero
        title="Workflows"
        subtitle="Explore specialized workflows for reverse engineering, CAD design, freeform modeling, surfacing, and more."
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
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-red-200 transition-all"
              >
                <div className="aspect-video overflow-hidden bg-slate-100">
                  <img src={wf.image} alt={wf.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">{wf.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{wf.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-600">
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
          { label: "Download Trial", path: "/pricing/trials" },
        ]}
      />
    </div>
  );
}