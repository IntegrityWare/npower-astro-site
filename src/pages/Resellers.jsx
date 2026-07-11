import React from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import CTASection from "@/components/shared/CTASection";
import ResellerCard from "@/components/shared/ResellerCard";
import { RESELLER_COUNTRIES } from "@/lib/resellersData";
import { Handshake } from "lucide-react";

function countryAnchor(country) {
  return country.replace(/[^a-zA-Z]/g, "");
}

export default function Resellers() {
  return (
    <div>
      <PageTitle
        title="International Resellers | nPower Software"
        description="Find authorized nPower Software international resellers by country to purchase Power Surfacing products locally, with contact details for each reseller."
      />
      <PageHero
        title="International Resellers"
        subtitle="Purchase Power Surfacing products locally through our worldwide network of authorized resellers. Select a country to find contacts near you."
        breadcrumbs={[{ label: "Resellers" }]}
      />

      {/* Country index */}
      <section className="py-10 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Select a Country</h2>
          <div className="flex flex-wrap gap-2">
            {RESELLER_COUNTRIES.map((c) => (
              <button
                key={c.country}
                onClick={() => document.getElementById(countryAnchor(c.country))?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:border-red-400 hover:text-red-600 transition-colors"
              >
                <span>{c.flag}</span> {c.country}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Reseller listings */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {RESELLER_COUNTRIES.map((c) => (
            <div key={c.country} id={countryAnchor(c.country)} className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-5 pb-2 border-b border-slate-200 flex items-center gap-2">
                <span className="text-xl">{c.flag}</span> {c.country}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {c.resellers.map((reseller) => (
                  <ResellerCard key={reseller.name} reseller={reseller} />
                ))}
              </div>
            </div>
          ))}

          <div className="bg-neutral-950 rounded-2xl p-8 sm:flex items-center justify-between gap-8">
            <div className="mb-5 sm:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <Handshake className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-bold text-white">Interested in Becoming a Reseller?</h3>
              </div>
              <p className="text-sm text-slate-400">We're always looking for qualified partners to represent Power Surfacing products in new markets.</p>
            </div>
            <Link to="/contact" className="btn-anim shrink-0 inline-block px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Prefer to Buy Direct?"
        subtitle="Purchase any Power Surfacing product directly from nPower Software with electronic delivery worldwide."
        actions={[
          { label: "View Pricing", path: "/pricing/plans" },
          { label: "Contact Sales", path: "/contact" },
        ]}
      />
    </div>
  );
}