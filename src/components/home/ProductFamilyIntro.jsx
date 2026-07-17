import React from "react";
import { Link } from "react-router-dom";
import Reveal from "@/components/shared/Reveal";

const FAMILY = [
  { name: "Power Surfacing RE Studio", path: "/products/power-surfacing-re-studio", desc: "standalone reverse-engineering software that converts 3D scan meshes, sculpted meshes and STL files into editable NURBS surfaces and solids, with export to STEP, IGES and SAT. Includes the complete Power Surfacing Studio toolset." },
  { name: "Power Surfacing Studio", path: "/products/power-surfacing-studio", desc: "standalone hybrid Sub-D / parametric NURBS modeling software for Class A surfacing, dimension-driven sketching and feature-based design. No third-party CAD license required." },
  { name: "Power Surfacing for SOLIDWORKS", path: "/products/power-surfacing-solidworks", desc: "freeform Sub-D surfacing add-in that models Class A surfaces like digital clay and converts them into native SOLIDWORKS solid and surface bodies integrated with the feature tree." },
  { name: "Power Surfacing RE for SOLIDWORKS", path: "/products/power-surfacing-re-solidworks", desc: "reverse engineer 3D scans, STL meshes and sculpted models directly inside SOLIDWORKS with automatic Quad Wrap retopology and surface fitting." },
  { name: "Power Shell for SOLIDWORKS", path: "/products/power-shell-solidworks", desc: "shell and thicken complex, organic geometry that standard SOLIDWORKS Shell and Thicken commands cannot handle. Includes Power Thicken." },
];

export default function ProductFamilyIntro() {
  return (
    <section className="relative bg-neutral-950 border-t border-red-900/30 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(225,29,46,0.09),transparent_55%)]" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Power Surfacing Product Family</h2>
          <p className="text-slate-400 leading-relaxed mb-8">
            Power Surfacing provides Windows-based CAD, Sub-D modeling and 3D reverse engineering software for industrial designers, engineers and manufacturers. Scan-to-CAD and mesh-to-CAD workflows turn scanned meshes, ZBrush sculpted meshes and STL files into editable, parametric CAD models — alongside dimension-driven sketching, feature-based solids and freeform Sub-D surfacing. Choose from standalone applications or integrated SOLIDWORKS add-ins.
          </p>
          <div className="space-y-4 text-left">
            {FAMILY.map((p) => (
              <p key={p.name} className="text-slate-400 leading-relaxed">
                <Link to={p.path} className="font-semibold text-white hover:text-red-400 transition-colors">{p.name}</Link>
                {" — "}{p.desc}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}