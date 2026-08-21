import React, { useState } from "react";
import { Link } from '@/lib/link';
import { PRODUCTS } from "@/lib/siteData";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";

const features = [
  { name: "CAD Import & Translation", products: ["power-surfacing-visualize", "power-surfacing-studio", "power-surfacing-re-studio"] },
  { name: "Tessellation Controls", products: ["power-surfacing-visualize", "power-surfacing-studio", "power-surfacing-re-studio"] },
  { name: "Material & Color Cleanup", products: ["power-surfacing-visualize", "power-surfacing-studio", "power-surfacing-re-studio"] },
  { name: "Bundled KeyShot (no extra license)", products: ["power-surfacing-visualize", "power-surfacing-studio", "power-surfacing-re-studio"] },
  { name: "Mesh Export for Blender / Modo / 3ds Max / Maya", products: ["power-surfacing-visualize", "power-surfacing-studio", "power-surfacing-re-studio"] },
  { name: "Dimension-Driven Sketching", products: ["power-surfacing-re-studio", "power-surfacing-studio"] },
  { name: "Feature-Based Modeling", products: ["power-surfacing-re-studio", "power-surfacing-studio"] },
  { name: "Surfacing & Solid Modeling", products: ["power-surfacing-re-studio", "power-surfacing-studio", "power-surfacing-solidworks", "power-surfacing-re-solidworks"] },
  { name: "Freeform Sub-D Design", products: ["power-surfacing-re-studio", "power-surfacing-studio", "power-surfacing-solidworks", "power-surfacing-re-solidworks"] },
  { name: "NURBS Output", products: ["power-surfacing-re-studio", "power-surfacing-studio", "power-surfacing-solidworks", "power-surfacing-re-solidworks"] },
  { name: "Scan-to-CAD", products: ["power-surfacing-re-studio", "power-surfacing-re-solidworks"] },
  { name: "Mesh-to-CAD", products: ["power-surfacing-re-studio", "power-surfacing-re-solidworks"] },
  { name: "STL/OBJ Import", products: ["power-surfacing-visualize", "power-surfacing-re-studio", "power-surfacing-re-solidworks"] },
  { name: "Point Cloud Processing", products: ["power-surfacing-re-studio"] },
  { name: "Mesh Cleanup & Repair", products: ["power-surfacing-re-studio", "power-surfacing-re-solidworks"] },
  { name: "Class A Surfacing", products: ["power-surfacing-re-studio", "power-surfacing-studio", "power-surfacing-solidworks", "power-surfacing-re-solidworks"] },
  { name: "Advanced Shelling", products: ["power-surfacing-re-studio", "power-surfacing-studio", "power-surfacing-solidworks", "power-surfacing-re-solidworks", "power-shell-solidworks"] },
  { name: "Variable Wall Thickness", products: ["power-surfacing-re-studio", "power-surfacing-studio", "power-surfacing-solidworks", "power-surfacing-re-solidworks", "power-shell-solidworks"] },
  { name: "SOLIDWORKS Integration", products: ["power-surfacing-solidworks", "power-surfacing-re-solidworks", "power-shell-solidworks"] },
  { name: "Standalone Application", products: ["power-surfacing-visualize", "power-surfacing-re-studio", "power-surfacing-studio"] },
];

function MobileComparisonCards() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="space-y-4 md:hidden">
      {PRODUCTS.map((product) => {
        const isOpen = expanded === product.id;
        return (
          <div key={product.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <button onClick={() => setExpanded(isOpen ? null : product.id)} className="w-full flex items-center justify-between p-4">
              <div className="text-left">
                <h3 className="font-bold text-slate-900 text-sm">{product.name}</h3>
                <span className="text-xs text-slate-500">{product.platform}</span>
              </div>
              {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            {isOpen && (
              <div className="border-t border-slate-100 p-4 space-y-2">
                {features.map(f => (
                  <div key={f.name} className="flex items-center justify-between py-1">
                    <span className="text-xs text-slate-600">{f.name}</span>
                    {f.products.includes(product.id) ? <Check className="w-4 h-4 text-red-600" /> : <X className="w-4 h-4 text-slate-300" />}
                  </div>
                ))}
                <Link to={product.path} className="block text-center mt-4 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg">Learn More</Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ComparisonTable() {
  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4 border-b-2 border-slate-200 text-sm font-semibold text-slate-500 w-56">Feature</th>
              {PRODUCTS.map((p) => (
                <th key={p.id} className="p-4 border-b-2 border-slate-200 text-center">
                  <Link to={p.path} className="text-sm font-bold text-slate-900 hover:text-red-600 transition-colors">{p.shortName}</Link>
                  <div className="text-xs text-slate-500 mt-0.5">{p.platform}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((f, i) => (
              <tr key={f.name} className={i % 2 === 0 ? "bg-slate-50/50" : ""}>
                <td className="p-4 border-b border-slate-100 text-sm text-slate-700 font-medium">{f.name}</td>
                {PRODUCTS.map((p) => (
                  <td key={p.id} className="p-4 border-b border-slate-100 text-center">
                    {f.products.includes(p.id) ? <Check className="w-5 h-5 text-red-600 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MobileComparisonCards />
    </>
  );
}