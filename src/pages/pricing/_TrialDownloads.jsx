import React from "react";
import { Link } from "@/lib/link";
import { POWER_SURFACING_DEMO } from "@/lib/trialDownloads";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import TrialRegistrationForm from "@/components/pricing/TrialRegistrationForm";
import { ArrowRight } from "lucide-react";

export default function TrialDownloads() {
  return (
    <div>
      <PageTitle
        title="Free Trial — Download Power Surfacing | nPower Software"
        description="Register to download a free trial of Power Surfacing products — full feature access, no credit card required."
      />
      <PageHero
        title="Download a Power Surfacing Free Trial"
        subtitle="Full feature, 30-day evaluation with free technical support"
        breadcrumbs={[
          { label: "Pricing & Licensing", path: "/pricing" },
          { label: "Free Trial" },
        ]}
        actions={[{ label: "Contact Sales", path: "/contact" }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Register for your download</h2>
            <p className="text-slate-600">
              Complete the form below to register — trial download access is provided only after registration.
            </p>
          </div>

          <TrialRegistrationForm campaign={POWER_SURFACING_DEMO} />
        </div>
      </section>

      <section className="py-12 bg-slate-50">
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
