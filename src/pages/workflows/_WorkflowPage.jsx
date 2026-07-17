import React from "react";
import { Link } from '@/lib/link';
import { WORKFLOWS, PRODUCTS, SAMPLE_VIDEOS } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import ProductCard from "@/components/shared/ProductCard";
import VideoCard from "@/components/shared/VideoCard";
import CTASection from "@/components/shared/CTASection";
import PageTitle from "@/components/shared/PageTitle";
import SeoFaq from "@/components/shared/SeoFaq";
import { WORKFLOW_SEO } from "@/lib/workflowSeo";
import { CheckCircle, ArrowRight } from "lucide-react";

const workflowDetails = {
  "reverse-engineering": {
    overview: "Reverse engineering converts physical objects and 3D scan data into editable CAD geometry. Power Surfacing provides the fastest, most accurate scan-to-CAD and mesh-to-CAD workflows available.",
    steps: ["Capture or import 3D scan data", "Clean and repair mesh geometry", "Fit NURBS surfaces to scan data", "Refine surface quality and continuity", "Export as NURBS or solid CAD model"],
    products: ["power-surfacing-re-studio", "power-surfacing-re-solidworks"],
  },
  "scan-to-cad": {
    overview: "Transform raw 3D scanner output into clean, manufacturing-ready CAD surfaces and solids. Power Surfacing handles point clouds, mesh data, and scan artifacts to produce high-quality NURBS geometry.",
    steps: ["Import scan data from any 3D scanner", "Align and register multiple scans", "Process and clean mesh data", "Fit precision NURBS surfaces", "Output solid or surface CAD models"],
    products: ["power-surfacing-re-studio", "power-surfacing-re-solidworks"],
  },
  "mesh-to-cad": {
    overview: "Convert triangulated mesh data — STL, OBJ, and other mesh formats — into smooth, editable NURBS surfaces and solid CAD models ready for manufacturing.",
    steps: ["Import mesh files (STL, OBJ, PLY)", "Clean and repair mesh topology", "Decimate or refine mesh resolution", "Fit NURBS surface patches", "Export precision CAD geometry"],
    products: ["power-surfacing-re-studio", "power-surfacing-re-solidworks"],
  },
  "stl-obj-to-cad": {
    overview: "Import STL and OBJ files and convert them into editable, parametric CAD geometry suitable for manufacturing, simulation, and downstream design work. Unlike simply placing a polygon mesh inside a CAD file — which leaves you with uneditable facets — Power Surfacing reconstructs genuinely editable surfaces and solids that can be shelled, filleted, dimensioned, and exported to STEP.",
    steps: ["Open STL or OBJ file", "Inspect and repair mesh quality", "Select surface fitting regions", "Generate NURBS surfaces", "Create solid body from surfaces"],
    products: ["power-surfacing-re-studio", "power-surfacing-re-solidworks"],
  },
  "sculpted-mesh-to-cad": {
    overview: "Convert ZBrush, Mudbox, and other sculpted mesh models into production-ready NURBS CAD surfaces. Bridge the gap between artistic sculpting and engineering manufacturing.",
    steps: ["Import sculpted mesh from ZBrush, Mudbox, etc.", "Analyze mesh topology and density", "Define surface patch layout", "Fit NURBS surfaces to sculpted form", "Export manufacturing-ready CAD model"],
    products: ["power-surfacing-re-studio"],
  },
  "topology-optimization": {
    overview: "Convert topology optimization output meshes into clean, manufacturable CAD geometry. Turn FEA-optimized lattice structures into production-ready solid and surface models.",
    steps: ["Import topology optimization result mesh", "Clean and process optimized geometry", "Fit surfaces to organic optimized shapes", "Refine surface quality for manufacturing", "Export solid CAD model"],
    products: ["power-surfacing-re-studio"],
  },
  "dimension-driven-design": {
    overview: "Create precisely dimensioned CAD models with parametric sketching and constraint-driven geometry. Control every aspect of your design with exact dimensions and geometric relationships.",
    steps: ["Create constrained 2D sketches", "Add dimensions and geometric constraints", "Extrude, revolve, and sweep profiles", "Apply parametric features", "Modify dimensions to update geometry"],
    products: ["power-surfacing-studio"],
  },
  "feature-based-modeling": {
    overview: "Build complex models using feature-based construction history with full editing and rollback capabilities. Every design step is recorded and editable.",
    steps: ["Start with base sketches and features", "Build construction history step by step", "Edit features at any point in history", "Reorder and suppress features", "Roll back to previous design states"],
    products: ["power-surfacing-studio"],
  },
  "surfacing-solid-modeling": {
    overview: "Combine precision surface modeling with solid modeling for complete product design and manufacturing workflows. Create surfaces, trim, and knit into watertight solid bodies.",
    steps: ["Create surface geometry with full control", "Trim and extend surfaces", "Knit surfaces into solid bodies", "Apply fillets, chamfers, and details", "Export surfaces or solids as needed"],
    products: ["power-surfacing-studio", "power-surfacing-solidworks", "power-surfacing-re-solidworks"],
  },
  "freeform-sub-d": {
    overview: "Use subdivision surface modeling to create smooth, organic freeform shapes with intuitive push-pull control. Sub-D provides artistic freedom with engineering-grade surface output.",
    steps: ["Start with a Sub-D primitive or mesh", "Push, pull, and sculpt vertices", "Add edge loops and creases for detail", "Preview smooth limit surface in real time", "Convert to NURBS or solid body"],
    products: ["power-surfacing-studio", "power-surfacing-solidworks"],
  },
  "industrial-design-solidworks": {
    overview: "Create beautiful, ergonomic industrial designs directly inside SOLIDWORKS using Sub-D surfacing. Combine freeform organic shapes with SOLIDWORKS mechanical features.",
    steps: ["Create Sub-D shapes in SOLIDWORKS", "Refine organic forms interactively", "Convert Sub-D to SOLIDWORKS solid body", "Combine with standard SOLIDWORKS features", "Complete design with engineering details"],
    products: ["power-surfacing-solidworks"],
  },
  "shelling-thickening": {
    overview: "Shell and thicken complex geometry that standard SOLIDWORKS Shell cannot handle. Power Shell uses advanced algorithms to succeed where native tools fail.",
    steps: ["Select the body to shell or thicken", "Choose inner or outer shell direction", "Set wall thickness (uniform or variable)", "Preview the shelled result", "Apply as SOLIDWORKS feature"],
    products: ["power-shell-solidworks"],
  },
};

export default function WorkflowPage({ workflowId }) {
  const workflow = WORKFLOWS.find((w) => w.id === workflowId);
  const details = workflowDetails[workflowId];

  if (!workflow || !details) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Workflow Not Found</h1>
          <Link to="/workflows" className="text-red-600 hover:text-red-700">View All Workflows</Link>
        </div>
      </div>
    );
  }

  const relatedProducts = PRODUCTS.filter((p) => details.products.includes(p.id));
  const relatedVideos = SAMPLE_VIDEOS.filter((v) => v.workflow === workflow.name).slice(0, 4);
  const seo = WORKFLOW_SEO[workflowId] || {};

  return (
    <div>
      <PageTitle title={seo.title} description={seo.description} />
      <PageHero
        title={seo.h1 || workflow.name}
        subtitle={workflow.description}
        breadcrumbs={[
          { label: "Workflows", path: "/workflows" },
          { label: workflow.name },
        ]}
        image={workflow.image}
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Watch Demos", path: "/resources/demos" },
        ]}
      />

      {/* Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Overview</h2>
              <p className="text-slate-600 mb-8">{details.overview}</p>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Typical Workflow Steps</h3>
              <ol className="space-y-3">
                {details.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-slate-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img src={workflow.image} alt={workflow.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* SEO topic sections */}
      {seo.sections?.length > 0 && (
        <section className="py-16 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {seo.sections.map((s) => (
                <div key={s.h2}>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">{s.h2}</h2>
                  <p className="text-slate-600">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products for this workflow */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Products for This Workflow</h2>
          <p className="text-slate-600 mb-8">These Power Surfacing products support {workflow.name.toLowerCase()} workflows.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => <ProductCard key={p.id} product={p} compact />)}
          </div>
        </div>
      </section>

      {/* Videos */}
      {relatedVideos.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Videos</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedVideos.map((v) => <VideoCard key={v.id} video={v} />)}
            </div>
          </div>
        </section>
      )}

      {seo.related?.length > 0 && (
        <section className="py-10 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Related Topics</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {seo.related.map((l) => (
                <Link key={l.path} to={l.path} className="text-sm font-semibold text-red-600 hover:text-red-700 hover:underline">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <SeoFaq faqs={seo.faqs} />

      <CTASection
        title={`Try ${workflow.name} Today`}
        subtitle="Download a free trial and experience this workflow for yourself."
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Contact Sales", path: "/contact" },
        ]}
      />
    </div>
  );
}