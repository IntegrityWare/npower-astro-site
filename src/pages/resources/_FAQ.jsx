import React, { useState } from "react";
import { Link } from '@/lib/link';
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import CTASection from "@/components/shared/CTASection";
import { ChevronDown, Layers, MonitorCog, ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "What is Power Surfacing?",
    a: "Power Surfacing is a family of CAD design and reverse engineering software products developed by nPower Software. The product family includes standalone applications and SOLIDWORKS add-ins for freeform Sub-D design, surfacing, solid modeling, and reverse engineering.",
  },
  {
    q: "What is the difference between Power Surfacing Visualize, RE Studio and Studio?",
    a: "Power Surfacing Visualize is a standalone CAD visualization and rendering-prep product with IntegrityWare’s tessellation engine converting CAD data to meshes and KeyShot bundled — no extra KeyShot license is required. Power Surfacing Studio is a standalone CAD design application with dimension-driven sketching, feature-based modeling, and freeform Sub-D design. Power Surfacing RE Studio is the flagship reverse-engineering product for converting scan data, meshes, STL/OBJ files, and sculpted geometry into CAD surfaces. Studio and RE Studio each include the full functionality of Visualize plus the KeyShot render engine.",
  },
  {
    q: "Do I need a separate KeyShot license for Power Surfacing Visualize?",
    a: "No. KeyShot is bundled with Power Surfacing Visualize. You do not need to purchase an extra KeyShot license to render product visuals. Power Surfacing Studio and Power Surfacing RE Studio also include the full functionality of Visualize plus the KeyShot render engine.",
  },
  {
    q: "Do I need SOLIDWORKS to use Power Surfacing?",
    a: "Not necessarily. Power Surfacing Visualize, Power Surfacing RE Studio and Power Surfacing Studio are standalone applications that do not require SOLIDWORKS. The SOLIDWORKS add-ins (Power Surfacing for SOLIDWORKS, Power Surfacing RE for SOLIDWORKS, and Power Shell for SOLIDWORKS) require an active SOLIDWORKS license.",
  },
  {
    q: "What file formats can Power Surfacing RE Studio import?",
    a: "Power Surfacing RE Studio can import STL, OBJ, PLY, and other common mesh formats, as well as point cloud data from 3D scanners. It can output NURBS surfaces and solid CAD models in standard formats.",
  },
  {
    q: "What is Cyborg3D Technology?",
    a: "Cyborg3D Technology is the advanced geometry kernel developed by IntegrityWare, Inc. that powers all Power Surfacing products. It provides the mathematical foundation for subdivision surface modeling, NURBS conversion, and surface fitting.",
  },
  {
    q: "Can I try Power Surfacing before purchasing?",
    a: "Yes. Free trial versions are available for all Power Surfacing products. Visit our Trial Downloads page to get started.",
  },
  {
    q: "What versions of SOLIDWORKS are supported?",
    a: "Power Surfacing add-ins support the current and recent versions of SOLIDWORKS. Check the Release Notes or contact support for specific version compatibility.",
  },
  {
    q: "How is Power Shell different from the standard SOLIDWORKS Shell?",
    a: "Power Shell uses advanced shelling algorithms that can handle complex and organic geometry that the standard SOLIDWORKS Shell command fails on. It supports variable wall thickness and can shell models with difficult topology.",
  },
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-2 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-base font-semibold text-slate-900 pr-4">{faq.q}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`px-5 pb-4 pt-0 ${open ? "" : "hidden"}`}>
        <p className="text-base text-slate-600 leading-relaxed">{faq.a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <div>
      <PageTitle
        title="FAQ — Frequently Asked Questions | nPower Software"
        description="Find answers to common questions about Power Surfacing products, licensing, technology, and workflows."
      />
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about Power Surfacing products, licensing, and workflows."
        breadcrumbs={[
          { label: "Resources", path: "/resources" },
          { label: "FAQ" },
        ]}
      />
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 gap-5">
          <Link to="/resources/faq/solidworks" className="card-anim bg-white border border-slate-200 rounded-xl p-6 group">
            <Layers className="w-6 h-6 text-red-600 mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">SOLIDWORKS Products FAQ</h3>
            <p className="text-sm text-slate-600 mb-3">Installation, licensing, upgrades, and import/export for Power Surfacing, Power Surfacing RE, and Power Shell.</p>
            <span className="text-sm font-semibold text-red-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">View FAQ <ArrowRight className="w-4 h-4" /></span>
          </Link>
          <Link to="/resources/faq/studio" className="card-anim bg-white border border-slate-200 rounded-xl p-6 group">
            <MonitorCog className="w-6 h-6 text-red-600 mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">Studio Products FAQ</h3>
            <p className="text-sm text-slate-600 mb-3">Installation, licensing, modeling, and import/export for Power Surfacing Studio and RE Studio.</p>
            <span className="text-sm font-semibold text-red-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">View FAQ <ArrowRight className="w-4 h-4" /></span>
          </Link>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <h2 className="text-xl font-bold text-slate-900 pb-2">General Questions</h2>
          {faqs.map((faq) => <FAQItem key={faq.q} faq={faq} />)}
        </div>
      </section>
      <CTASection
        title="Still Have Questions?"
        subtitle="Our team is here to help. Contact support or request a personalized demo."
        actions={[
          { label: "Contact Support", path: "/support/contact" },
          { label: "Request Demo", path: "/contact" },
        ]}
      />
    </div>
  );
}