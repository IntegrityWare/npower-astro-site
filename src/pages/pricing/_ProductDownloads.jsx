import React from "react";
import { Link } from '@/lib/link';
import { PRODUCTS } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import { Download, Key } from "lucide-react";

export default function ProductDownloads() {
  return (
    <div>
      <PageTitle
        title="Downloads — Licensed Power Surfacing | nPower"
        description="Download the latest licensed versions of Power Surfacing products. A valid license key is required for full access."
      />
      <PageHero
        title="Downloads"
        subtitle="Download the latest versions of Power Surfacing products. A valid license is required for full access."
        breadcrumbs={[
          { label: "Support", path: "/support" },
          { label: "Downloads" },
        ]}
      />
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8 flex items-start gap-3">
            <Key className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900">License Required</p>
              <p className="text-sm text-red-700">Product downloads require a valid license key. If you need a trial, visit the <Link to="/pricing/trials" className="underline font-semibold">Trial Downloads</Link> page.</p>
            </div>
          </div>
          <div className="space-y-4">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{product.name}</h3>
                  <p className="text-sm text-slate-500">{product.platform} · Latest version</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shrink-0">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Need installation help?</h2>
          <p className="text-slate-600 mb-4">Check our installation and licensing guide for step-by-step instructions.</p>
          <Link to="/support/installation" className="text-sm font-semibold text-red-600 hover:text-red-700">View Installation Guide →</Link>
        </div>
      </section>
    </div>
  );
}