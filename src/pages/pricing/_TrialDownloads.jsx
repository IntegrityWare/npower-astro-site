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
        title="SOLIDWORKS Add-in Trial Signup | nPower Software"
        description="Register for Power Surfacing, Power Surfacing RE, and Power Shell trials for SOLIDWORKS."
      />
      <PageHero
        title="SOLIDWORKS Add-in Trial Signup"
        subtitle={
          <>
            <p>
              Register below for Power Surfacing, Power Surfacing RE, and Power Shell trials. These plug-ins run inside SOLIDWORKS and require a compatible SOLIDWORKS installation.
            </p>
            <p>
              Every trial includes full feature access, a 30-day evaluation period, and free technical support.
            </p>
          </>
        }
        breadcrumbs={[
          { label: "Pricing & Licensing", path: "/pricing" },
          { label: "Free Trial", path: "/pricing/trials" },
          { label: "SOLIDWORKS Add-ins" },
        ]}
        actions={[{ label: "Contact Sales", path: "/contact" }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Register for your download</h2>
            <p className="text-slate-600">
              Complete the form below to register for SOLIDWORKS add-in trial downloads. Looking for standalone products? Visit the <Link to="/pricing/trials/studio" className="text-red-600 font-semibold hover:underline">Standalone Studio signup page</Link>.
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
