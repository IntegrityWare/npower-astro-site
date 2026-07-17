import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const INPUTS = ["STL", "Wavefront OBJ meshes", "OBJ point clouds", "Sculpted meshes (e.g. ZBrush exports via STL/OBJ)", "SOLIDWORKS Topology Study meshes"];
const OUTPUTS = ["STEP", "IGES", "SAT"];
const NOT_SUPPORTED = [
  "PLY — not supported; convert PLY scans to STL or OBJ before import",
  "Parasolid export — not supported; use STEP, IGES or SAT",
  "Native SOLIDWORKS feature transfer — not available in RE Studio (standalone); Power Surfacing RE for SOLIDWORKS provides direct in-SOLIDWORKS integration",
];

export default function ReStudioFormats() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-10">Supported Input and Output Formats</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Input Formats</h3>
            <ul className="space-y-3">
              {INPUTS.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />{f}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Output Formats</h3>
            <ul className="space-y-3">
              {OUTPUTS.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />{f}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Not Supported</h3>
          <ul className="space-y-3">
            {NOT_SUPPORTED.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                <XCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />{f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}