import React from "react";
import { Link } from '@/lib/link';
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import ProductCard from "@/components/shared/ProductCard";
import SeoFaq from "@/components/shared/SeoFaq";
import CTASection from "@/components/shared/CTASection";
import { PRODUCTS } from "@/lib/siteData";
import { CheckCircle } from "lucide-react";

const STEPS = [
  "Import STL or OBJ scan data as a reference mesh in SOLIDWORKS",
  "Repair scan anomalies like tears and holes with automated tools",
  "Run automatic Quad Wrap retopology that follows curvature flow",
  "Refine the fit with Shrink Wrap, Mesh Smooth, and Mesh Offset",
  "Convert to native SOLIDWORKS solid or surface bodies in the feature tree",
];

const FAQS = [
  { q: "Can a scanned mechanical part be recreated in SOLIDWORKS?", a: "Yes. Power Surfacing RE for SOLIDWORKS imports the scan mesh as a reference, rebuilds the shape with automatic retopology and surface fitting, and converts the result into native SOLIDWORKS solid or surface bodies." },
  { q: "Is this a plugin or a file-export workflow?", a: "Power Surfacing RE for SOLIDWORKS is a direct SOLIDWORKS add-in from an official SOLIDWORKS Gold Partner — geometry is created inside the SOLIDWORKS feature tree. Alternatively, the standalone Power Surfacing RE Studio exports STEP, IGES, and SAT files that open in SOLIDWORKS." },
  { q: "What scan formats can be imported?", a: "STL and Wavefront OBJ meshes, including 3D scanner output, FEA meshes, sculpted meshes, and 3D printer files." },
  { q: "Can SOLIDWORKS Topology Study results be converted?", a: "Yes. SOLIDWORKS Topology Study meshes can be converted directly into usable solid geometry." },
];

export default function ScanToSolidworks() {
  const products = PRODUCTS.filter((p) =>
    ["power-surfacing-re-solidworks", "power-surfacing-re-studio"].includes(p.id)
  );
  return (
    <div>
      <PageTitle
        title="3D Scan to SOLIDWORKS | Reverse Engineering"
        description="Convert 3D scans and STL meshes into editable SOLIDWORKS models with a direct add-in for retopology, surface fitting, and feature tree integration."
      />
      <PageHero
        title="Convert 3D Scans Into Editable SOLIDWORKS Models"
        subtitle="Reverse engineer 3D scanner data, STL meshes, and sculpted models directly inside SOLIDWORKS — no file hand-offs, no uneditable polygon imports."
        breadcrumbs={[{ label: "Workflows", path: "/workflows" }, { label: "3D Scan to SOLIDWORKS" }]}
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Watch Demos", path: "/resources/demos" },
        ]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">A Direct SOLIDWORKS Add-In, Not a File Hand-Off</h2>
              <p className="text-slate-600 mb-4">
                Converting a 3D scan to SOLIDWORKS usually means juggling separate tools and exchanging files. Power Surfacing RE for SOLIDWORKS works differently: it is a direct add-in, built by an official SOLIDWORKS Gold Partner, that imports scan meshes and rebuilds them as native SOLIDWORKS solid and surface bodies — fully integrated with the feature tree.
              </p>
              <p className="text-slate-600 mb-4">
                Prefer a standalone application? <Link to="/products/power-surfacing-re-studio" className="text-red-600 hover:text-red-700 font-semibold hover:underline">Power Surfacing RE Studio</Link> reconstructs the same scan data and exports STEP, IGES, and SAT files for SOLIDWORKS and any other downstream CAD system.
              </p>
              <p className="text-slate-600">
                This page covers the SOLIDWORKS-specific workflow. For the general process, see our{" "}
                <Link to="/workflows/scan-to-cad" className="text-red-600 hover:text-red-700 font-semibold hover:underline">scan-to-CAD software</Link> overview or{" "}
                <Link to="/workflows/stl-obj-to-cad" className="text-red-600 hover:text-red-700 font-semibold hover:underline">STL to CAD reconstruction</Link>.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">From Scan Mesh to Editable Model</h2>
              <ol className="space-y-3">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-slate-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Supported Scan Data and Output</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { title: "Input Data", items: ["3D scanner meshes (STL, OBJ)", "FEA and 3D printer meshes", "ZBrush and other sculpted meshes", "SOLIDWORKS Topology Study meshes"] },
              { title: "Reconstruction Tools", items: ["Automatic Quad Wrap retopology", "Shrink Wrap with self-intersection fixes", "Mesh Smooth and Mesh Offset", "Distance display for accuracy checks"] },
              { title: "Output", items: ["Native SOLIDWORKS solid bodies", "Native SOLIDWORKS surface bodies", "Full feature tree integration", "STEP / IGES / SAT via RE Studio"] },
            ].map((col) => (
              <div key={col.title} className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">{col.title}</h3>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Products for This Workflow</h2>
          <p className="text-slate-600 mb-8">Two ways to get scan data into SOLIDWORKS — directly with the add-in, or via CAD file export from the standalone studio.</p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl">
            {products.map((p) => <ProductCard key={p.id} product={p} compact />)}
          </div>
        </div>
      </section>

      <SeoFaq faqs={FAQS} />

      <CTASection
        title="Bring Your Scans Into SOLIDWORKS"
        subtitle="Download a free trial and convert your first scan mesh into an editable SOLIDWORKS model."
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Contact Sales", path: "/contact" },
        ]}
      />
    </div>
  );
}