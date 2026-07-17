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
  { area: "Modeling workflow", ours: "Automatic Quad Wrap retopology, Sub-D editing, dimension-driven sketching, feature-based construction history", theirs: "Not verified" },
  { area: "Surfacing", ours: "Sub-D to NURBS conversion with G2 edge continuity; automatic recognition of planes, cylinders, spheres, and cones", theirs: "Not verified" },
  { area: "CAD output", ours: "STEP, IGES, SAT (RE Studio); native SOLIDWORKS solid and surface bodies (add-in)", theirs: "Not verified" },
  { area: "Integrations", ours: "Direct SOLIDWORKS add-in from an official SOLIDWORKS Gold Partner", theirs: "Not verified" },
  { area: "Licensing", ours: "Perpetual licenses or annual subscriptions with publicly listed pricing", theirs: "Contact vendor" },
  { area: "Deployment", ours: "Windows desktop application", theirs: "Contact vendor" },
  { area: "Training & support", ours: "Video tutorials, product documentation, and direct support", theirs: "Contact vendor" },
];

const FAQS = [
  { q: "How does Power Surfacing RE Studio compare with Geomagic Design X?", a: "Both target scan-to-CAD reverse engineering. Power Surfacing RE Studio converts scan meshes into editable NURBS solids and surfaces using automatic retopology and analytic feature recognition, includes a full hybrid Sub-D / parametric modeling toolset, and publishes its pricing openly. For Geomagic Design X capabilities and pricing, consult the vendor directly." },
  { q: "Can I move existing projects to Power Surfacing?", a: "Power Surfacing imports standard STL and OBJ mesh files, so any scan data you have in those formats can be brought in directly. Reconstructed geometry exports to STEP, IGES, and SAT for use in any downstream CAD system." },
  { q: "Is a trial available to compare for myself?", a: "Yes. Free trial downloads are available for every Power Surfacing product, so you can evaluate the workflow on your own scan data before purchasing." },
];

export default function GeomagicAlternative() {
  const products = PRODUCTS.filter((p) =>
    ["power-surfacing-re-studio", "power-surfacing-re-solidworks"].includes(p.id)
  );
  return (
    <div>
      <PageTitle
        title="Geomagic Design X Alternative for Scan-to-CAD"
        description="Compare a practical Geomagic Design X alternative for converting 3D scans and meshes into editable, parametric CAD models."
      />
      <PageHero
        title="A Practical Geomagic Design X Alternative"
        subtitle="If you're evaluating scan-to-CAD reverse-engineering software, here is a factual look at what Power Surfacing offers for converting 3D scans and meshes into editable, parametric CAD models."
        breadcrumbs={[{ label: "Geomagic Design X Alternative" }]}
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Contact Sales", path: "/contact" },
        ]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500 italic mb-8 max-w-3xl">
            Geomagic Design X is a trademark of its respective owner. nPower Software and this website are not affiliated with, endorsed by, or sponsored by Geomagic or its parent company. Competitor details below are intentionally marked "Not verified" or "Contact vendor" rather than guessed.
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Side-by-Side Comparison Areas</h2>
          <p className="text-slate-600 mb-8 max-w-3xl">
            The table lists verified Power Surfacing capabilities alongside the areas buyers typically compare. Verify competitor capabilities directly with the vendor before making a decision.
          </p>
          <AlternativeComparisonTable competitorName="Geomagic Design X" rows={ROWS} />
          <p className="text-slate-600 mt-8 max-w-3xl">
            Want to see the workflow in detail? Read about our{" "}
            <Link to="/workflows/scan-to-cad" className="text-red-600 hover:text-red-700 font-semibold hover:underline">scan-to-CAD software</Link>,{" "}
            <Link to="/automatic-surfacing" className="text-red-600 hover:text-red-700 font-semibold hover:underline">automatic surfacing tools</Link>, or the{" "}
            <Link to="/quicksurface-alternative" className="text-red-600 hover:text-red-700 font-semibold hover:underline">QUICKSURFACE comparison</Link>. Full{" "}
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