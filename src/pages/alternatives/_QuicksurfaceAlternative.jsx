import React from "react";
import { Link } from '@/lib/link';
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import ProductCard from "@/components/shared/ProductCard";
import SeoFaq from "@/components/shared/SeoFaq";
import CTASection from "@/components/shared/CTASection";
import AlternativeComparisonTable from "@/components/shared/AlternativeComparisonTable";
import { PRODUCTS } from "@/lib/siteData";

const ROWS = [
  { area: "Input data", ours: "STL and OBJ meshes, OBJ point clouds, 3D scans, sculpted meshes, SOLIDWORKS Topology Study meshes", theirs: "Not verified — refer to vendor documentation" },
  { area: "Mesh editing", ours: "Mesh repair, smoothing, hole filling, Mesh Offset, and Shrink Wrap detail capture", theirs: "Not verified" },
  { area: "Feature extraction", ours: "Automatic identification and parameterization of planes, cylinders, spheres, and cones", theirs: "Not verified" },
  { area: "Parametric modeling", ours: "Dimension-driven sketching and feature-based construction history (full Power Surfacing Studio toolset included in RE Studio)", theirs: "Not verified" },
  { area: "Freeform surfacing", ours: "Automatic Quad Wrap retopology and Sub-D to NURBS conversion with G2 edge continuity", theirs: "Not verified" },
  { area: "CAD output & integration", ours: "STEP, STL, OBJ export and native SOLIDWORKS feature transfer from RE Studio; direct SOLIDWORKS add-in for in-app reconstruction as native features", theirs: "Not verified" },
  { area: "Licensing", ours: "Perpetual licenses or annual subscriptions with publicly listed pricing", theirs: "Contact vendor" },
  { area: "Deployment", ours: "Windows desktop application", theirs: "Contact vendor" },
];

const FAQS = [
  { q: "How does Power Surfacing compare with QUICKSURFACE?", a: "Both address scan-to-CAD reverse engineering. Power Surfacing offers automatic Quad Wrap retopology, analytic feature extraction, hybrid Sub-D / parametric NURBS modeling, STEP/STL/OBJ export, and a direct SOLIDWORKS add-in. For QUICKSURFACE capabilities and pricing, consult the vendor directly." },
  { q: "Does Power Surfacing integrate directly with CAD, or export files?", a: "Both. Power Surfacing RE Studio is standalone and exports STEP, STL, and OBJ, or transfers geometry as native SOLIDWORKS features. Power Surfacing RE for SOLIDWORKS is a direct add-in that reconstructs inside SOLIDWORKS as native features." },
  { q: "Is a trial or product demonstration available?", a: "Yes. Free trial downloads are available for every product, and recorded demonstrations are available in the video library." },
];

export default function QuicksurfaceAlternative() {
  const products = PRODUCTS.filter((p) =>
    ["power-surfacing-re-studio", "power-surfacing-re-solidworks"].includes(p.id)
  );
  return (
    <div>
      <PageTitle
        title="QUICKSURFACE Alternative for Reverse Engineering"
        description="Explore a QUICKSURFACE alternative for scan-to-CAD, mesh editing, feature extraction, parametric modeling, and freeform surfacing."
      />
      <PageHero
        title="A QUICKSURFACE Alternative for Scan-to-CAD"
        subtitle="A factual look at Power Surfacing for buyers comparing reverse-engineering software — covering mesh editing, feature extraction, parametric modeling, and freeform surfacing."
        breadcrumbs={[{ label: "QUICKSURFACE Alternative" }]}
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Contact Sales", path: "/contact" },
        ]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500 italic mb-8 max-w-3xl">
            QUICKSURFACE is a trademark of its respective owner. nPower Software and this website are not affiliated with, endorsed by, or sponsored by QUICKSURFACE. Competitor details below are intentionally marked "Not verified" or "Contact vendor" rather than guessed.
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Side-by-Side Comparison Areas</h2>
          <p className="text-slate-600 mb-8 max-w-3xl">
            The table lists verified Power Surfacing capabilities alongside the areas buyers typically compare. Verify competitor capabilities directly with the vendor before making a decision.
          </p>
          <AlternativeComparisonTable competitorName="QUICKSURFACE" rows={ROWS} />
          <p className="text-slate-600 mt-8 max-w-3xl">
            Dig deeper into the workflows: see{" "}
            <Link to="/workflows/mesh-to-cad" className="text-red-600 hover:text-red-700 font-semibold hover:underline">converting meshes to editable CAD</Link>,{" "}
            <Link to="/3d-scan-to-solidworks" className="text-red-600 hover:text-red-700 font-semibold hover:underline">the 3D scan to SOLIDWORKS workflow</Link>, or the{" "}
            <Link to="/geomagic-design-x-alternative" className="text-red-600 hover:text-red-700 font-semibold hover:underline">Geomagic Design X comparison</Link>. Full{" "}
            <Link to="/pricing" className="text-red-600 hover:text-red-700 font-semibold hover:underline">pricing and licensing</Link> is published openly.
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Reverse-Engineering Products to Evaluate</h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl">
            {products.map((p) => <ProductCard key={p.id} product={p} compact />)}
          </div>
        </div>
      </section>

      <SeoFaq faqs={FAQS} />

      <CTASection
        title="Evaluate It on Your Own Scan Data"
        subtitle="The fairest comparison is a hands-on one. Download a free trial and run your own scans through the workflow."
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Contact Sales", path: "/contact" },
        ]}
      />
    </div>
  );
}