import React from "react";

const FEATURES = [
  {
    title: "Mesh Import and Preparation",
    text: "Import STL and Wavefront OBJ files, including OBJ point clouds and SOLIDWORKS Topology Study meshes. Built-in mesh repair, smoothing and hole-filling tools prepare scanned or sculpted data for reconstruction.",
  },
  {
    title: "Quad Wrap Retopology",
    text: "Quad Wrap generates a clean quad layout that follows the curvature flow of the underlying mesh, producing a structured foundation for high-quality surface reconstruction.",
  },
  {
    title: "Sub-D Surface Reconstruction",
    text: "Rebuild scanned and sculpted meshes as editable Sub-D geometry. The Shrink Wrap tool captures very fine surface detail without adding polygons, preserving detail on jewelry, cutlery and consumer products.",
  },
  {
    title: "Automatic and Analytic Surface Fitting",
    text: "Automatically identify and parameterize analytic shapes — planes, cylinders, spheres and cones — so mechanical regions of a scan become true analytic CAD surfaces rather than approximations.",
  },
  {
    title: "Dimension-Driven Sketching",
    text: "Create sketches controlled by parametric dimensions, constraints and relationships — part of the complete Power Surfacing Studio toolset included in RE Studio.",
  },
  {
    title: "Feature-Based Solid Modeling",
    text: "Build models with a construction history that can be edited and rolled back at any time, combining reconstructed scan geometry with conventional CAD features.",
  },
  {
    title: "Surface and Solid Creation",
    text: "Convert Sub-D geometry into Brep NURBS surfaces with G2 edge continuity, and create solid bodies. Advanced shelling supports variable wall thickness on complex geometry.",
  },
  {
    title: "CAD Export",
    text: "Export reconstructed surfaces and solids to STEP, STL and Wavefront OBJ, or transfer geometry as native SOLIDWORKS features.",
  },
];

export default function ReStudioFeatures() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-10">Power Surfacing RE Studio Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
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