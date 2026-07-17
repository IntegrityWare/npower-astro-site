import React from "react";
import JsonLd from "@/components/shared/JsonLd";

export const RE_STUDIO_FAQS = [
  { q: "What is Power Surfacing RE Studio?", a: "Power Surfacing RE Studio is standalone Windows reverse-engineering and scan-to-CAD software that reconstructs 3D scan meshes, STL files and polygon models as editable NURBS surfaces and solids. It includes the complete Power Surfacing Studio modeling toolset." },
  { q: "Does Power Surfacing RE Studio require SOLIDWORKS?", a: "No. RE Studio is a fully standalone Windows application and does not require SOLIDWORKS or any other third-party CAD license." },
  { q: "Can it convert STL meshes into CAD?", a: "Yes. RE Studio imports STL files and reconstructs them as editable NURBS surfaces and solid bodies that can be exported to STEP, STL or Wavefront OBJ, or transferred as native SOLIDWORKS features." },
  { q: "What is Quad Wrap?", a: "Quad Wrap is RE Studio's retopology tool. It generates a clean quad layout that follows the curvature flow of the underlying mesh, producing a structured foundation for high-quality Sub-D and NURBS surface reconstruction." },
  { q: "Can it create editable NURBS surfaces?", a: "Yes. RE Studio converts Sub-D geometry into Brep NURBS surfaces with G2 edge continuity, and can automatically fit analytic surfaces such as planes, cylinders, spheres and cones." },
  { q: "Can it create solid CAD models?", a: "Yes. RE Studio creates solid bodies as well as surfaces, and supports advanced shelling with variable wall thickness on complex geometry." },
  { q: "Which file formats does it support?", a: "Inputs: STL and Wavefront OBJ files, including OBJ point clouds, plus SOLIDWORKS Topology Study meshes. Outputs: STEP, STL, Wavefront OBJ and native SOLIDWORKS features. PLY, IGES, SAT and Parasolid are not supported." },
  { q: "How does RE Studio differ from Power Surfacing Studio?", a: "Power Surfacing Studio focuses on standalone CAD, Sub-D surfacing, sketching and feature-based modeling. RE Studio includes the entire Studio toolset and adds reverse-engineering capabilities for reconstructing scanned and polygonal mesh data." },
  { q: "How does RE Studio differ from Power Surfacing RE for SOLIDWORKS?", a: "RE Studio is a standalone Windows application that exports via STEP, STL and Wavefront OBJ, or transfers geometry as native SOLIDWORKS features. Power Surfacing RE for SOLIDWORKS runs as an add-in inside SOLIDWORKS, where reconstructed geometry becomes SOLIDWORKS surface and solid bodies integrated with the feature tree." },
  { q: "Is a free trial available?", a: "Yes. A free trial of Power Surfacing RE Studio is available from the trial downloads page." },
];

export default function ReStudioFaq() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: RE_STUDIO_FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }}
        />
        <h2 className="text-3xl font-bold text-slate-900 mb-10">Power Surfacing RE Studio FAQ</h2>
        <div className="space-y-8">
          {RE_STUDIO_FAQS.map((f) => (
            <div key={f.q}>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{f.q}</h3>
              <p className="text-slate-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}