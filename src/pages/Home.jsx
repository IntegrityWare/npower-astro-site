import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Ruler, Layers, Box, Spline, ScanLine, FileInput, Workflow, Shell, BookOpen, Video, FileText, Download, Headphones, ChevronRight, CheckCircle } from "lucide-react";
import { PRODUCTS, WORKFLOWS, CAPABILITIES, IMAGES } from "@/lib/siteData";
import ProductCard from "@/components/shared/ProductCard";
import CTASection from "@/components/shared/CTASection";

const capabilityIcons = { Ruler, Layers, Box, Spline, ScanLine, FileInput, Workflow, Shell };

function HeroSection() {
  return (
    <section className="relative bg-slate-950 overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <img src={IMAGES.hero} alt="Power Surfacing CAD software" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/60" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.1),transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-sm text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Powered by IntegrityWare's Solids# Technology
          </div>
          <h1 className="font-bold text-white mb-6 leading-tight tracking-tight text-6xl md:text-6xl lg:text-6xl">Power Surfacing software for CAD design and reverse engineering

          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl">Create, edit, and reverse engineer, complex geometry with dimension-driven sketching, feature-based modeling, surfacing, solids, freeform Sub-D design, and NURBS/CAD precision.

          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/products" className="px-8 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-2">
              Explore Products <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/resources/videos" className="px-8 py-3.5 text-sm font-semibold text-slate-300 border border-slate-600 hover:border-slate-400 hover:text-white rounded-lg transition-colors inline-flex items-center gap-2">
              <Play className="w-4 h-4" /> Watch Overview
            </Link>
            <Link to="/pricing/trials" className="px-8 py-3.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-2">
              Download Trial <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>);

}

function FamilyOverview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The Power Surfacing Product Family</h2>
          <p className="text-lg text-slate-600">
            Five specialized products for CAD design, freeform modeling, reverse engineering, and advanced surfacing — available as standalone applications or SOLIDWORKS add-ins.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200 rounded-xl p-8">
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Standalone Applications</h3>
            <h4 className="text-xl font-bold text-slate-900 mb-3">Design and reverse engineer without SOLIDWORKS</h4>
            <p className="text-slate-600 text-sm mb-4">Power Surfacing RE Studio and Power Surfacing Studio are complete standalone applications — no third-party CAD license required.</p>
            <div className="flex gap-3">
              <Link to="/products/re-studio" className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">RE Studio <ArrowRight className="w-3.5 h-3.5" /></Link>
              <Link to="/products/studio" className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">Studio <ArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200 rounded-xl p-8">
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">SOLIDWORKS Add-ins</h3>
            <h4 className="text-xl font-bold text-slate-900 mb-3">Extend SOLIDWORKS with advanced capabilities</h4>
            <p className="text-slate-600 text-sm mb-4">Add freeform Sub-D surfacing, reverse engineering, and advanced shelling directly inside your SOLIDWORKS environment.</p>
            <div className="flex gap-3">
              <Link to="/products/solidworks" className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">Sub-D <ArrowRight className="w-3.5 h-3.5" /></Link>
              <Link to="/products/re-solidworks" className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">RE <ArrowRight className="w-3.5 h-3.5" /></Link>
              <Link to="/products/power-shell" className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">Shell <ArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

function ProductSelector() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Choose Your Product</h2>
            <p className="text-lg text-slate-600">Select the right Power Surfacing solution for your workflow.</p>
          </div>
          <Link to="/products/comparison" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
            Compare All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product) =>
          <ProductCard key={product.id} product={product} />
          )}
        </div>
        <div className="text-center mt-8 md:hidden">
          <Link to="/products/comparison" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
            Compare All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>);

}

function CapabilityCards() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Core Capabilities</h2>
          <p className="text-lg text-slate-600">From freeform artistic design to precision manufacturing, Power Surfacing covers every surfacing workflow.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAPABILITIES.map((cap) => {
            const Icon = capabilityIcons[cap.icon] || Box;
            return (
              <div key={cap.name} className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{cap.name}</h3>
                <p className="text-sm text-slate-600">{cap.description}</p>
              </div>);

          })}
        </div>
      </div>
    </section>);

}

function FeaturedVideo() {
  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">See Power Surfacing in Action</h2>
            <p className="text-lg text-slate-400 mb-6">Watch how Power Surfacing transforms complex geometry workflows — from scan-to-CAD reverse engineering to freeform Sub-D design and precision surfacing.</p>
            <ul className="space-y-3 mb-8">
              {["Scan-to-CAD in minutes, not hours", "Freeform Sub-D with NURBS precision", "Feature-based modeling with full history", "Works standalone or inside SOLIDWORKS"].map((item) =>
              <li key={item} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" /> {item}
                </li>
              )}
            </ul>
            <Link to="/resources/videos" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              Browse Video Library <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
            <img src={IMAGES.hero} alt="Power Surfacing overview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Link to="/resources/videos/v1" className="w-20 h-20 rounded-full bg-blue-600/90 hover:bg-blue-600 flex items-center justify-center transition-colors shadow-2xl">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

function KeyWorkflows() {
  const featured = WORKFLOWS.filter((w) =>
  ["reverse-engineering", "scan-to-cad", "mesh-to-cad", "stl-obj-to-cad", "sculpted-mesh-to-cad", "freeform-sub-d", "industrial-design-solidworks", "shelling-thickening"].includes(w.id)
  );
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Key Workflows</h2>
            <p className="text-lg text-slate-600">Specialized workflows for every surfacing and reverse engineering challenge.</p>
          </div>
          <Link to="/workflows" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
            All Workflows <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((wf) =>
          <Link
            key={wf.id}
            to={wf.path}
            className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all">
            
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                <img src={wf.image} alt={wf.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{wf.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{wf.description}</p>
              </div>
            </Link>
          )}
        </div>
        <div className="text-center mt-8 md:hidden">
          <Link to="/workflows" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600">All Workflows <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </section>);

}

function WhyPowerSurfacing() {
  const reasons = [
  { title: "Sub-D Freedom", desc: "Create smooth, organic shapes intuitively with subdivision surface modeling." },
  { title: "Dimension-Driven Control", desc: "Precisely constrain geometry with parametric dimensions for manufacturing accuracy." },
  { title: "Feature-Based CAD", desc: "Build with a construction history — edit, reorder, and roll back features at any time." },
  { title: "NURBS Precision", desc: "Output high-quality NURBS surfaces suitable for manufacturing and downstream CAD systems." },
  { title: "Surface & Solid Output", desc: "Create surface bodies or solid bodies to match your downstream workflow requirements." },
  { title: "Standalone Studio Apps", desc: "Complete standalone applications — no third-party CAD license required." },
  { title: "SOLIDWORKS Add-ins", desc: "Extend SOLIDWORKS with Sub-D surfacing, reverse engineering, and advanced shelling." },
  { title: "Cyborg3D Technology", desc: "Built on proven, high-performance geometry kernel technology." }];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Power Surfacing</h2>
          <p className="text-lg text-slate-600">The complete platform for advanced surfacing, CAD design, and reverse engineering.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r) =>
          <div key={r.title} className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{r.title}</h3>
              <p className="text-sm text-slate-600">{r.desc}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}

function LearningSupport() {
  const items = [
  { icon: Video, label: "Video Library", desc: "Watch demos and tutorials", path: "/resources/videos" },
  { icon: BookOpen, label: "Tutorials", desc: "Step-by-step learning guides", path: "/resources/tutorials" },
  { icon: FileText, label: "Documentation", desc: "Complete product documentation", path: "/resources/documentation" },
  { icon: FileText, label: "Release Notes", desc: "Latest updates and changes", path: "/resources/release-notes" },
  { icon: Download, label: "Downloads", desc: "Get trials and updates", path: "/pricing/trials" },
  { icon: Headphones, label: "Support", desc: "Get help from our team", path: "/support" }];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Learning & Support</h2>
          <p className="text-lg text-slate-600">Everything you need to get started and succeed with Power Surfacing.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) =>
          <Link
            key={item.label}
            to={item.path}
            className="group flex items-start gap-4 bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 transition-all">
            
              <div className="w-10 h-10 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors">
                <item.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-0.5 group-hover:text-blue-600 transition-colors">{item.label}</h3>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>);

}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FamilyOverview />
      <ProductSelector />
      <CapabilityCards />
      <FeaturedVideo />
      <KeyWorkflows />
      <WhyPowerSurfacing />
      <LearningSupport />
      <CTASection
        title="Ready to Transform Your Workflow?"
        subtitle="Choose a product, watch demos, or download a free trial to experience Power Surfacing for yourself."
        actions={[
        { label: "Explore Products", path: "/products" },
        { label: "Watch Demos", path: "/resources/demos" },
        { label: "Download Trial", path: "/pricing/trials" }]
        } />
      
    </div>);

}