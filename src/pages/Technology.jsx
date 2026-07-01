import React from "react";
import { IMAGES } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import CTASection from "@/components/shared/CTASection";
import { CheckCircle, Cpu, Zap, Shield, Layers } from "lucide-react";

export default function Technology() {
  return (
    <div>
      <PageHero
        title="IntegrityWare's Solids#"
        subtitle="The advanced geometry kernel powering every Power Surfacing product."
        breadcrumbs={[{ label: "Technology" }]}
        image={IMAGES.cyborg3d} />
      

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Built on Proven Technology</h2>
              <p className="text-slate-600 mb-6"> IntegrityWare's Solids# Technology is the high-performance geometry kernel at the core of every Power Surfacing product. It provides the mathematical foundation for subdivision surface (Sub-D) modeling, NURBS representation, and mesh-to-CAD surface fitting.  Solids# is implemented in the C# 

              </p>
              <p className="text-slate-600 mb-8">
                Developed by IntegrityWare, Inc., Solids# Technology is aggressively priced compared to other industry solutions and captures very fine detail on scanned and sculpted meshes. Its highly automated workflow processes complex, high-poly geometry in a matter of minutes, producing G2-continuous NURBS boundary representations that export cleanly to STEP, IGES, and SAT.
              </p>
              <ul className="space-y-3">
                {[
                "Sub-D to Brep NURBS conversion with G2 edge continuity",
                "Automatic Quad Wrap retopology that follows curvature flow",
                "Shrink Wrap detail capture without adding polygon count",
                "Optimized, lightweight representation for large, complex scans",
                "Mesh repair, smoothing, and hole-filling tools",
                "Export to STEP, IGES, and SAT CAD formats"].
                map((item) =>
                <li key={item} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" /> {item}
                  </li>
                )}
              </ul>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img src={IMAGES.cyborg3d} alt="Solids# Technology" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Core Technology Capabilities</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
            { icon: Cpu, title: "High-Performance Kernel", desc: "Optimized geometry processing that turns even large, highly detailed scans into editable geometry in minutes." },
            { icon: Layers, title: "Sub-D to NURBS", desc: "Convert subdivision surfaces to G2-continuous NURBS representation with precise edge and curvature control." },
            { icon: Zap, title: "Surface Fitting", desc: "Quad Wrap and Shrink Wrap algorithms fit smooth NURBS surfaces to scan data, meshes, and point clouds." },
            { icon: Shield, title: "Production Proven", desc: "Trusted across industrial design, ergonomics, automotive, dental, and consumer product industries." }].
            map((item) =>
            <div key={item.title} className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <CTASection
        title="Experience Solids# Technology"
        subtitle="See the power of Solids# Technology in action through Power Surfacing products."
        actions={[
        { label: "Explore Products", path: "/products" },
        { label: "Watch Demos", path: "/resources/demos" }]
        } />
      
    </div>);

}