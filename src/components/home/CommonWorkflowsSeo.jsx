import React from "react";

const WORKFLOW_BLOCKS = [
  {
    title: "Scan-to-CAD and Mesh-to-CAD Reverse Engineering",
    text: "Reconstruct scanned parts, STL meshes and sculpted polygon models as editable CAD surfaces and solids. Use retopology, Sub-D reconstruction, surface fitting and CAD export tools to move from scan data to production-ready geometry.",
  },
  {
    title: "Freeform Sub-D Product Design",
    text: "Create smooth, organic and ergonomic product shapes using intuitive push-pull Sub-D editing. Convert completed Sub-D models into NURBS surfaces and CAD bodies for detailed engineering and manufacturing.",
  },
  {
    title: "Dimension-Driven and Feature-Based Modeling",
    text: "Create constrained sketches, extrusions and other editable CAD features alongside freeform surface modeling. Combine analytic and organic geometry in one product-development workflow.",
  },
  {
    title: "Sub-D Modeling Inside SOLIDWORKS",
    text: "Create and edit freeform shapes directly inside SOLIDWORKS, then convert them into SOLIDWORKS features that contain either solid and/or surface bodies.",
  },
  {
    title: "Advanced Shelling and Thickening",
    text: "Create shells and offsets for complex geometry, including many cases where standard SOLIDWORKS Shell and Thicken operations fail.",
  },
];

export default function CommonWorkflowsSeo() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center">
          Common CAD and Reverse-Engineering Workflows
        </h2>
        <div className="space-y-6">
          {WORKFLOW_BLOCKS.map((wf) => (
            <div key={wf.title} className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{wf.title}</h3>
              <p className="text-slate-600 leading-relaxed">{wf.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}