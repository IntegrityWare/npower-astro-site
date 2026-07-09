import React from "react";
import { Link } from "react-router-dom";
import { PRODUCTS } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import { FileText, ExternalLink, BookOpen, Download } from "lucide-react";

export default function Documentation() {
  return (
    <div>
      <PageHero
        title="Documentation"
        subtitle="Complete product documentation, user guides, and reference materials for Power Surfacing products."
        breadcrumbs={[
          { label: "Resources", path: "/resources" },
          { label: "Documentation" },
        ]}
      />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-red-200 transition-all">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{p.name}</h3>
                <p className="text-sm text-slate-600 mb-4">User guide, reference manual, and API documentation for {p.shortName}.</p>
                <div className="space-y-2">
                  <Link to={p.path} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700">
                    <FileText className="w-4 h-4" /> User Guide
                  </Link>
                  <Link to={p.path} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700">
                    <Download className="w-4 h-4" /> Quick Start PDF
                  </Link>
                </div>
              </div>
            ))}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Cyborg3D Technology</h3>
              <p className="text-sm text-slate-600 mb-4">Technical reference for the geometry kernel underlying all Power Surfacing products.</p>
              <Link to="/technology" className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700">
                <ExternalLink className="w-4 h-4" /> View Technology Overview
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}