import React from "react";
import { IMAGES } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import CTASection from "@/components/shared/CTASection";
import { CheckCircle, Cpu, Zap, Shield, Layers } from "lucide-react";

export default function Technology() {
  return (
    <div>
      <PageHero
        title="Cyborg3D Technology"
        subtitle="The advanced geometry kernel powering every Power Surfacing product."
        breadcrumbs={[{ label: "Technology" }]}
        image={IMAGES.cyborg3d}
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Built on Proven Technology</h2>
              <p className="text-slate-600 mb-6">
                Cyborg3D Technology is the high-performance geometry kernel at the core of every Power Surfacing product. It provides the mathematical foundation for subdivision surface modeling, NURBS representation, and surface-solid conversion.
              </p>
              <p className="text-slate-600 mb-8">
                Developed by IntegrityWare, Inc., Cyborg3D Technology delivers the precision, speed, and reliability needed for professional CAD design and reverse engineering applications.
              </p>
              <ul className="space-y-3">
                {[
                  "Subdivision surface to NURBS conversion",
                  "High-quality surface fitting algorithms",
                  "Precise mesh-to-NURBS workflows",
                  "Solid body creation from surfaces",
                  "Real-time surface preview and evaluation",
                  "Multi-format CAD output support",
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img src={IMAGES.cyborg3d} alt="Cyborg3D Technology" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Core Technology Capabilities</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Cpu, title: "High-Performance Kernel", desc: "Optimized geometry processing for real-time interaction and fast computation on complex models." },
              { icon: Layers, title: "Sub-D to NURBS", desc: "Convert subdivision surfaces to high-quality NURBS representation with precise continuity control." },
              { icon: Zap, title: "Surface Fitting", desc: "Advanced algorithms for fitting smooth NURBS surfaces to scan data, meshes, and point clouds." },
              { icon: Shield, title: "Production Proven", desc: "Trusted by engineers and designers worldwide in demanding CAD and reverse engineering applications." },
            ].map(item => (
              <div key={item.title} className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Experience Cyborg3D Technology"
        subtitle="See the power of Cyborg3D Technology in action through Power Surfacing products."
        actions={[
          { label: "Explore Products", path: "/products" },
          { label: "Watch Demos", path: "/resources/demos" },
        ]}
      />
    </div>
  );
}