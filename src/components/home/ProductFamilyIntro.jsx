import React from "react";
import { Link } from '@/lib/link';
import Reveal from "@/components/shared/Reveal";

const FAMILY = [
  { name: "Power Surfacing Visualize", path: "/products/power-surfacing-visualize", desc: "is a standalone CAD visualization and rendering-prep application. Import engineering models, clean up assemblies, create product visuals with KeyShot bundled, and prepare and export meshes for Blender, Modo, 3ds Max, and Maya — no extra KeyShot license and no full CAD seat required." },
  { name: "Power Surfacing Studio", path: "/products/power-surfacing-studio", desc: "is standalone CAD modeling software combining freeform Sub-D surfacing, dimension-driven sketching and feature-based solid modeling. It includes the full functionality of Power Surfacing Visualize plus the KeyShot render engine. No third-party CAD license is required." },
  { name: "Power Surfacing RE Studio", path: "/products/power-surfacing-re-studio", desc: "is standalone reverse-engineering software for reconstructing 3D scan meshes, sculpted meshes and STL files as editable NURBS surfaces and solids. Export reconstructed geometry to STEP and native SOLIDWORKS features. Power Surfacing RE Studio includes the complete Power Surfacing Studio modeling toolset, plus the full functionality of Power Surfacing Visualize and the KeyShot render engine." },
  { name: "Power Surfacing for SOLIDWORKS", path: "/products/power-surfacing-solidworks", desc: "is a freeform Sub-D modeling add-in for creating smooth organic shapes and high-quality surfaces directly inside SOLIDWORKS. Convert Power Surfacing models into SOLIDWORKS features that contain either solid and/or surface bodies." },
  { name: "Power Surfacing RE for SOLIDWORKS", path: "/products/power-surfacing-re-solidworks", desc: "provides mesh-to-CAD and reverse-engineering tools directly inside SOLIDWORKS. Reconstruct 3D scans, STL meshes and sculpted models using Quad Wrap retopology, Sub-D reconstruction and surface-fitting tools. It is primarily targeted at reverse engineering organic data; mechanical data is reconstructed using native SOLIDWORKS tools." },
  { name: "Power Shell for SOLIDWORKS", path: "/products/power-shell-solidworks", desc: "provides advanced shelling and thickening tools for complex geometry, including many cases where the standard SOLIDWORKS Shell and Thicken commands fail. Power Thicken is included." },
];

export default function ProductFamilyIntro() {
  return (
    <section className="relative bg-neutral-950 border-t border-red-900/30 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(225,29,46,0.09),transparent_55%)]" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">The Power Surfacing Product Family</h2>
          <div className="space-y-4 text-left">
            {FAMILY.map((p) => (
              <p key={p.name} className="text-slate-400 leading-relaxed">
                <Link to={p.path} className="font-semibold text-white hover:text-red-400 transition-colors">{p.name}</Link>
                {" "}{p.desc}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}