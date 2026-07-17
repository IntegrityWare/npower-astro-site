import React from "react";
import { Link } from "react-router-dom";

export default function ReStudioComparison() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Power Surfacing RE Studio vs. Power Surfacing RE for SOLIDWORKS</h2>
        <div className="space-y-4 text-slate-600 leading-relaxed mb-8">
          <p>
            Power Surfacing RE Studio is a standalone Windows application. It does not require SOLIDWORKS or any
            other third-party CAD license, and it includes the complete Power Surfacing Studio modeling toolset
            alongside its reverse-engineering capabilities. Reconstructed geometry is exported to downstream CAD
            systems using STEP, STL or Wavefront OBJ, or transferred as native SOLIDWORKS features.
          </p>
          <p>
            <Link to="/products/power-surfacing-re-solidworks" className="text-red-600 hover:text-red-700 font-semibold">Power Surfacing RE for SOLIDWORKS</Link>{" "}
            operates directly inside SOLIDWORKS as an add-in and is primarily targeted at reverse engineering
            organic data. It brings Quad Wrap retopology, Sub-D reconstruction and surface fitting into the
            SOLIDWORKS environment, where results become SOLIDWORKS surface and solid bodies integrated with the
            feature tree. Mechanical data must be reconstructed using native SOLIDWORKS tools.
          </p>
          <p>
            Choose RE Studio if you want an independent application with no SOLIDWORKS requirement — including
            automatic identification and extraction of mechanical surfaces and solids; choose RE for SOLIDWORKS
            if your workflow lives inside SOLIDWORKS and your parts are primarily organic.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/products/power-surfacing-re-solidworks" className="btn-anim px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg">Power Surfacing RE for SOLIDWORKS</Link>
          <Link to="/products/comparison" className="btn-anim px-5 py-2.5 text-sm font-semibold text-slate-700 border border-slate-300 hover:border-red-500 rounded-lg">Compare All Products</Link>
        </div>
      </div>
    </section>
  );
}