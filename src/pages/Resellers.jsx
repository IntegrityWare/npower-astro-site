import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import CTASection from "@/components/shared/CTASection";
import ResellerRegionSection from "@/components/shared/ResellerRegionSection";
import { RESELLER_REGIONS } from "@/lib/resellersData";
import { Handshake, Search } from "lucide-react";

function regionAnchor(region) {
  return region.replace(/[^a-zA-Z]/g, "");
}

export default function Resellers() {
  const [search, setSearch] = useState("");

  const filteredRegions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return RESELLER_REGIONS;
    return RESELLER_REGIONS.map((r) => ({
      ...r,
      countries: r.countries
        .map((c) => ({
          ...c,
          resellers: c.country.toLowerCase().includes(q)
            ? c.resellers
            : c.resellers.filter((res) => res.name.toLowerCase().includes(q)),
        }))
        .filter((c) => c.resellers.length > 0),
    })).filter((r) => r.countries.length > 0);
  }, [search]);

  return (
    <div>
      <PageTitle
        title="Authorized Resellers | nPower Software"
        description="Find authorized nPower Software resellers by region and country to purchase Power Surfacing products locally, with contact details for each reseller."
      />
      <PageHero
        title="Authorized Resellers"
        subtitle="Purchase Power Surfacing products locally through our worldwide network of authorized resellers, grouped by region so you can quickly find your local contact."
        breadcrumbs={[{ label: "Resellers" }]}
      />

      {/* Search + region index */}
      <section className="py-10 bg-slate-50 border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by reseller name or country…"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {RESELLER_REGIONS.map((r) => (
                <button
                  key={r.region}
                  onClick={() => document.getElementById(regionAnchor(r.region))?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:border-red-400 hover:text-red-600 transition-colors"
                >
                  {r.region}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reseller listings grouped by region */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {filteredRegions.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg font-semibold text-slate-900 mb-1">No resellers found</p>
              <p className="text-sm text-slate-500">Try a different reseller name or country.</p>
            </div>
          ) : (
            filteredRegions.map((r) => (
              <ResellerRegionSection
                key={r.region}
                region={r.region}
                countries={r.countries}
                anchorId={regionAnchor(r.region)}
              />
            ))
          )}

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