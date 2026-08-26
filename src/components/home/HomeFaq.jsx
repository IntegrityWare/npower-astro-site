import React from "react";
import JsonLd from "@/components/shared/JsonLd";

const FAQS = [
  {
    q: "What is Power Surfacing?",
    a: "Power Surfacing is a family of reverse-engineering, Sub-D modeling and CAD visualization software products for creating mesh-to-CAD models, freeform surfaces, editable CAD geometry and product visuals.",
  },
  {
    q: "Does Power Surfacing work with SOLIDWORKS?",
    a: "Yes. Power Surfacing for SOLIDWORKS, Power Surfacing RE for SOLIDWORKS and Power Shell for SOLIDWORKS operate directly inside SOLIDWORKS. Power Surfacing Viz, Power Surfacing Studio and Power Surfacing RE Studio are standalone Windows applications.",
  },
  {
    q: "What is Sub-D modeling?",
    a: "Subdivision-surface modeling is a method for creating smooth organic shapes by editing a relatively simple control cage. Power Surfacing converts completed Sub-D forms into CAD-compatible surface and solid geometry.",
  },
  {
    q: "What is scan-to-CAD?",
    a: "Scan-to-CAD is the process of reconstructing 3D scan or polygon mesh data as editable CAD surfaces and solids that can be modified, measured and used in engineering workflows.",
  },
  {
    q: "Can Power Surfacing convert STL files to CAD?",
    a: "Power Surfacing reverse-engineering products can use STL and other polygon mesh data as the basis for reconstructing editable CAD geometry. The exact workflow and output options depend on the selected product.",
  },
  {
    q: "What is the difference between Power Surfacing Viz, Studio and RE Studio?",
    a: "Power Surfacing Viz is for CAD import, IntegrityWare tessellation of CAD data to meshes, and bundled KeyShot rendering — no extra KeyShot license and no full CAD seat required. Power Surfacing Studio is standalone CAD with Sub-D surfacing, sketching and feature-based modeling. Power Surfacing RE Studio includes the Studio toolset and adds reverse-engineering for scanned and polygonal mesh data. Studio and RE Studio each include the full functionality of Viz plus the KeyShot render engine.",
  },
  {
    q: "What is the difference between Power Surfacing and Power Surfacing RE for SOLIDWORKS?",
    a: "Power Surfacing for SOLIDWORKS focuses on freeform Sub-D design. Power Surfacing RE for SOLIDWORKS adds reverse-engineering tools for reconstructing scanned meshes, STL files and polygon models directly inside SOLIDWORKS.",
  },
  {
    q: "Does Power Surfacing require SOLIDWORKS?",
    a: "The standalone products — Power Surfacing Viz, Power Surfacing Studio and Power Surfacing RE Studio — do not require SOLIDWORKS. The products specifically named \u201cfor SOLIDWORKS\u201d operate as SOLIDWORKS add-ins.",
  },
  {
    q: "Which Power Surfacing product should I choose?",
    a: "Choose Power Surfacing Viz for CAD visualization, translation and bundled KeyShot rendering without a full CAD seat or a separate KeyShot license. Choose Power Surfacing Studio when you need CAD modeling or Sub-D design — it includes the full functionality of Viz plus the KeyShot render engine. Choose RE Studio when you need reverse engineering; it includes Studio, Viz, and KeyShot. Choose a SOLIDWORKS add-in when you want the workflow inside SOLIDWORKS. Use the product comparison page for a detailed feature comparison.",
  },
];

export default function HomeFaq() {
  return (
    <section className="py-20 bg-slate-50">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((f) => (
            <div key={f.q} className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-base font-bold text-slate-900 mb-2">{f.q}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}