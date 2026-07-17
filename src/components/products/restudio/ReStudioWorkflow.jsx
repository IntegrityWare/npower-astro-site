import React from "react";

const STEPS = [
  { title: "Import scan or polygon mesh data", text: "Load STL or OBJ data, or bring in sculpted meshes and SOLIDWORKS Topology Study output." },
  { title: "Inspect and prepare the mesh", text: "Repair defects, fill holes and smooth noisy regions so the mesh is ready for reconstruction." },
  { title: "Generate a quad layout", text: "Use Quad Wrap retopology to create a clean quad structure that follows the curvature flow of the mesh." },
  { title: "Build editable Sub-D geometry", text: "Reconstruct the shape as editable Sub-D geometry, using Shrink Wrap to capture fine surface detail." },
  { title: "Fit analytic or freeform surfaces", text: "Automatically identify and parameterize planes, cylinders, spheres and cones where appropriate, keeping freeform regions as smooth NURBS surfaces." },
  { title: "Create surfaces or solids", text: "Convert to Brep NURBS surfaces with G2 edge continuity and build solid bodies, including shelled parts with variable wall thickness." },
  { title: "Export to downstream CAD", text: "Export the reconstructed model to STEP, STL or Wavefront OBJ, or transfer it as native SOLIDWORKS features." },
];

export default function ReStudioWorkflow() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-10">How the Scan-to-CAD Workflow Works</h2>
        <ol className="space-y-6">
          {STEPS.map((step, i) => (
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