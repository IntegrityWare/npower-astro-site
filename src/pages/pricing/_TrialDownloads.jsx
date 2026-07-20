import React, { useMemo, useState } from "react";
import { Link } from "@/lib/link";
import { PRODUCTS } from "@/lib/siteData";
import { PRODUCT_TRIAL_CAMPAIGNS } from "@/lib/trialDownloads";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import TrialRegistrationForm from "@/components/pricing/TrialRegistrationForm";
import { Download, CheckCircle, ArrowRight } from "lucide-react";

export default function TrialDownloads() {
  const [selectedProductId, setSelectedProductId] = useState("power-surfacing-solidworks");

  const selectedCampaign = useMemo(
    () => PRODUCT_TRIAL_CAMPAIGNS[selectedProductId] ?? null,
    [selectedProductId]
  );

  const selectProduct = (productId) => {
    setSelectedProductId(productId);
    requestAnimationFrame(() => {
      document.getElementById("trial-register")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div>
      <PageTitle
        title="Free Trial — Download Power Surfacing | nPower Software"
        description="Register to download a free trial of Power Surfacing products — full feature access, no credit card required."
      />
      <PageHero
        title="Download a Power Surfacing Free Trial"
        subtitle="Register to receive a demo download for Power Surfacing and Power Surfacing RE for SOLIDWORKS, Power Shell, or standalone reverse engineering."
        breadcrumbs={[
          { label: "Pricing & Licensing", path: "/pricing" },
          { label: "Free Trial" },
        ]}
        actions={[{ label: "Contact Sales", path: "/contact" }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => {
              const isSelected = selectedProductId === product.id;
              return (
                <div
                  key={product.id}
                  className={`bg-white border rounded-xl p-6 transition-all ${
                    isSelected ? "border-red-500 shadow-md" : "border-slate-200 hover:border-red-200"
                  }`}
                >
                  <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 mb-4">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    {product.platform}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2 mb-1">{product.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{product.tagline}</p>
                  <ul className="space-y-2 mb-6">
                    {["Full feature access", "30-day evaluation", "Free technical support"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-red-500 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => selectProduct(product.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" /> Register to Download
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="trial-register" className="py-16 bg-slate-50 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Register for your download</h2>
            <p className="text-slate-600">
              Complete the form below to register. Trial download access is provided only after registration — there is no direct download without submitting this form.
            </p>
          </div>

          {selectedCampaign && (
            <TrialRegistrationForm key={selectedCampaign.id} campaign={selectedCampaign} />
          )}
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Need help choosing?</h2>
          <p className="text-slate-600 mb-6">Compare products side by side or contact our team for a recommendation.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/products/comparison"
              className="inline-flex items-center gap-1 px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Compare Products <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1 px-6 py-3 text-sm font-semibold text-slate-700 border border-slate-300 hover:border-slate-400 rounded-lg transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
