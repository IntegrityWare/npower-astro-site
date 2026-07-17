import React from "react";
import JsonLd from "@/components/shared/JsonLd";

const FAQS = [
  {
    q: "What is Power Surfacing?",
    a: "Power Surfacing is a family of CAD, Sub-D modeling and reverse-engineering software products for creating freeform surfaces, editable CAD geometry and mesh-to-CAD models.",
  },
  {
    q: "Does Power Surfacing work with SOLIDWORKS?",
    a: "Yes. Power Surfacing for SOLIDWORKS, Power Surfacing RE for SOLIDWORKS and Power Shell for SOLIDWORKS operate directly inside SOLIDWORKS. Power Surfacing Studio and Power Surfacing RE Studio are standalone Windows applications.",
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
    q: "What is the difference between Power Surfacing Studio and Power Surfacing RE Studio?",
    a: "Power Surfacing Studio focuses on standalone CAD, Sub-D surfacing, sketching and feature-based modeling. Power Surfacing RE Studio includes the Studio toolset and adds reverse-engineering capabilities for reconstructing scanned and polygonal mesh data.",
  },
  {
    q: "What is the difference between Power Surfacing and Power Surfacing RE for SOLIDWORKS?",
    a: "Power Surfacing for SOLIDWORKS focuses on freeform Sub-D design. Power Surfacing RE for SOLIDWORKS adds reverse-engineering tools for reconstructing scanned meshes, STL files and polygon models directly inside SOLIDWORKS.",
  },
  {
    q: "Does Power Surfacing require SOLIDWORKS?",
    a: "The standalone Studio products do not require SOLIDWORKS. The products specifically named \u201cfor SOLIDWORKS\u201d operate as SOLIDWORKS add-ins.",
  },
  {
    q: "Which Power Surfacing product should I choose?",
    a: "Choose a standalone Studio product when you want an independent Windows application. Choose a SOLIDWORKS add-in when you want the modeling or reverse-engineering workflow integrated directly into SOLIDWORKS. Use the product comparison page for a detailed feature comparison.",
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