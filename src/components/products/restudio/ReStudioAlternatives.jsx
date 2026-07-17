import React from "react";
import { Link } from '@/lib/link';

export default function ReStudioAlternatives() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">An Alternative to Geomagic Design X and QuickSurface</h2>
        <p className="text-slate-600 leading-relaxed mb-8">
          Teams evaluating reverse-engineering software often compare Power Surfacing RE Studio with Geomagic
          Design X and QuickSurface. RE Studio may be a good fit for users who work with organic and sculpted
          shapes as well as mechanical parts, who want an included Sub-D and NURBS modeling toolset in the same
          application, or who are looking for a lower-cost standalone option with STEP, STL and Wavefront OBJ export plus native SOLIDWORKS feature transfer. The
          right choice depends on your scan data, part types and budget — the detailed comparison pages below
          walk through the differences.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/geomagic-design-x-alternative" className="btn-anim px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg">Geomagic Design X Alternative</Link>
          <Link to="/quicksurface-alternative" className="btn-anim px-5 py-2.5 text-sm font-semibold text-slate-700 border border-slate-300 hover:border-red-500 rounded-lg">QuickSurface Alternative</Link>
        </div>
      </div>
    </section>
  );
}