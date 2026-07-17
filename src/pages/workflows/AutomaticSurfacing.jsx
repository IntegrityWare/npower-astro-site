import React from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import ProductCard from "@/components/shared/ProductCard";
import SeoFaq from "@/components/shared/SeoFaq";
import CTASection from "@/components/shared/CTASection";
import { PRODUCTS } from "@/lib/siteData";
import { CheckCircle } from "lucide-react";

const FAQS = [
  { q: "What is automatic surfacing?", a: "Automatic surfacing converts a polygon mesh into smooth mathematical surfaces without manually laying out every patch. Power Surfacing uses automatic Quad Wrap retopology that follows curvature flow, then converts the result to NURBS surfaces." },
  { q: "How are NURBS surfaces created from scan data?", a: "The scan mesh is retopologized into a clean quad structure, refined as a Sub-D model, and converted to Brep NURBS with G2 edge continuity — a patented IntegrityWare process." },
  { q: "Can surface accuracy be verified against the original mesh?", a: "Yes. A distance display measures how closely the reconstructed surfaces approximate the original reference mesh." },
  { q: "Does automatic surfacing handle mechanical features?", a: "Power Surfacing RE Studio automatically identifies and parameterizes analytic shapes — planes, cylinders, spheres, and cones — so prismatic regions become true analytic geometry rather than freeform patches." },
];

export default function AutomaticSurfacing() {
  const products = PRODUCTS.filter((p) =>
    ["power-surfacing-re-studio", "power-surfacing-re-solidworks"].includes(p.id)
  );
  return (
    <div>
      <PageTitle
        title="Automatic Surfacing and Mesh-to-NURBS Software"
        description="Create accurate NURBS surfaces from 3D scan meshes with automatic Quad Wrap retopology, Sub-D refinement, and distance-based accuracy checks."
      />
      <PageHero
        title="Automatic Surfacing and Mesh-to-NURBS Tools"
        subtitle="Turn scanned and sculpted meshes into high-quality, G2-continuous NURBS surfaces with a highly automated workflow — organic shapes and analytic features alike."
        breadcrumbs={[{ label: "Workflows", path: "/workflows" }, { label: "Automatic Surfacing" }]}
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Watch Demos", path: "/resources/demos" },
        ]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Surface Reconstruction From Meshes</h2>
              <p className="text-slate-600 mb-4">
                Manually fitting surfaces to a dense scan mesh is slow and error-prone. Power Surfacing automates the hardest steps: Quad Wrap retopology builds a clean quad layout that follows the mesh's curvature and flow lines, and the resulting Sub-D model converts to Brep NURBS surfaces with G2 edge continuity — a patented IntegrityWare process.
              </p>
              <p className="text-slate-600 mb-4">
                For organic shapes, the Shrink Wrap tool captures very fine surface detail without adding polygons. For mechanical regions, analytic shapes such as planes, cylinders, spheres, and cones are automatically identified and parameterized.
              </p>
              <p className="text-slate-600">
                Automatic surfacing is the core of our{" "}
                <Link to="/workflows/scan-to-cad" className="text-red-600 hover:text-red-700 font-semibold hover:underline">scan-to-CAD workflow</Link> and{" "}
                <Link to="/workflows/mesh-to-cad" className="text-red-600 hover:text-red-700 font-semibold hover:underline">mesh-to-CAD conversion</Link>, and it powers the{" "}
                <Link to="/3d-scan-to-solidworks" className="text-red-600 hover:text-red-700 font-semibold hover:underline">3D scan to SOLIDWORKS</Link> add-in workflow as well.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Capabilities</h2>
              <ul className="space-y-3">
                {[
                  "Automatic Quad Wrap retopology that follows curvature flow",
                  "Sub-D to Brep NURBS conversion with G2 edge continuity",
                  "Automatic identification of planes, cylinders, spheres, and cones",
                  "Shrink Wrap detail capture without polygon bloat",
                  "Mesh repair, smoothing, and hole-filling before fitting",
                  "Distance display to verify surface accuracy against the mesh",
                  "Export to STEP, IGES, and SAT, or native SOLIDWORKS bodies",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Products With Automatic Surfacing</h2>
          <p className="text-slate-600 mb-8">Available standalone or as a SOLIDWORKS add-in.</p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl">
            {products.map((p) => <ProductCard key={p.id} product={p} compact />)}
          </div>
        </div>
      </section>

      <SeoFaq faqs={FAQS} />

      <CTASection
        title="See Automatic Surfacing on Your Own Data"
        subtitle="Download a free trial and convert one of your meshes into clean NURBS surfaces."
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Contact Sales", path: "/contact" },
        ]}
      />
    </div>
  );
}