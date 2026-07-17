import React from "react";

export default function SupportedGeometry() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Supported Geometry and File Types</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Power Surfacing workflows support polygon meshes, 3D scan data, STL files, sculpted meshes, Sub-D control cages, NURBS surfaces and CAD solids. Available export formats vary by product and include STEP, STL, Wavefront OBJ and native SOLIDWORKS features.
        </p>
      </div>
    </section>
  );
}