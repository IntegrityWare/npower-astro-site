import React from "react";

export default function ReStudioIntro() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Convert 3D Scan and Mesh Data into Editable CAD</h2>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            Power Surfacing RE Studio is built for reverse engineers, 3D scan technicians, industrial designers,
            medical and prosthetics professionals, and artists who need to turn polygon mesh data into real,
            editable CAD geometry. Typical starting points include 3D scan meshes, STL files, Wavefront OBJ meshes,
            ZBrush and other sculpted models, and SOLIDWORKS Topology Study output.
          </p>
          <p>
            Power Surfacing RE Studio reverse engineers freeform organic parts, mechanical parts and hybrid parts
            that combine both. Its ability to identify and extract mechanical surfaces and solids — planes,
            cylinders, cones, spheres, extruded and revolved shapes — makes it a powerful choice for almost any
            reverse-engineering task.
          </p>
          <p>
            From that mesh data, RE Studio reconstructs high-quality, G2-continuous NURBS surfaces and solid bodies
            that can be modified, measured and used in downstream engineering workflows. Because RE Studio includes
            the complete Power Surfacing Studio toolset, reconstructed geometry can be combined with
            dimension-driven sketches, feature-based solids and freeform Sub-D modeling — all in one standalone
            Windows application, with no third-party CAD license required.
          </p>
        </div>
      </div>
    </section>
  );
}