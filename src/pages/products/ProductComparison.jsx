import React, { useState } from "react";
import { PRODUCTS } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import CTASection from "@/components/shared/CTASection";
import { Link } from "react-router-dom";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";

const features = [
  { name: "Dimension-Driven Sketching", products: ["re-studio", "studio"] },
  { name: "Feature-Based Modeling", products: ["re-studio", "studio"] },
  { name: "Surfacing & Solid Modeling", products: ["re-studio", "studio", "solidworks", "re-solidworks"] },
  { name: "Freeform Sub-D Design", products: ["re-studio", "studio", "solidworks"] },
  { name: "NURBS Output", products: ["re-studio", "studio", "solidworks", "re-solidworks"] },
  { name: "Scan-to-CAD", products: ["re-studio", "re-solidworks"] },
  { name: "Mesh-to-CAD", products: ["re-studio", "re-solidworks"] },
  { name: "STL/OBJ Import", products: ["re-studio", "re-solidworks"] },
  { name: "Point Cloud Processing", products: ["re-studio"] },
  { name: "Mesh Cleanup & Repair", products: ["re-studio", "re-solidworks"] },
  { name: "Class A Surfacing", products: ["solidworks"] },
  { name: "Advanced Shelling", products: ["power-shell"] },
  { name: "Variable Wall Thickness", products: ["power-shell"] },
  { name: "SOLIDWORKS Integration", products: ["solidworks", "re-solidworks", "power-shell"] },
  { name: "Standalone Application", products: ["re-studio", "studio"] },
];

function MobileComparisonCards() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="space-y-4 md:hidden">
      {PRODUCTS.map((product) => {
        const isOpen = expanded === product.id;
        const productFeatures = features.filter(f => f.products.includes(product.id));
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

export default function ProductComparison() {
  return (
    <div>
      <PageHero
        title="Product Comparison"
        subtitle="Compare features and capabilities across the Power Surfacing product family."
        breadcrumbs={[
          { label: "Products", path: "/products" },
          { label: "Comparison" },
        ]}
      />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Table */}
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
        </div>
      </section>
      <CTASection
        title="Find the Right Product for You"
        subtitle="Need help choosing? Contact our team for a personalized recommendation."
        actions={[
          { label: "Contact Sales", path: "/contact" },
          { label: "Download Trial", path: "/pricing/trials" },
        ]}
      />
    </div>
  );
}