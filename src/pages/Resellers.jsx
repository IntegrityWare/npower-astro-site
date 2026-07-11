import React from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import CTASection from "@/components/shared/CTASection";
import { Globe2, MapPin, Building2, Handshake } from "lucide-react";

const REGIONS = [
  {
    region: "North America",
    resellers: [
      { name: "nPower Software (Direct)", location: "San Diego, CA, USA", description: "Purchase directly from nPower Software / IntegrityWare — worldwide sales, licensing, and support.", contact: "sales@npowersoftware.com" },
      { name: "SOLIDWORKS Value-Added Resellers", location: "USA & Canada", description: "Power Surfacing products are available through many authorized SOLIDWORKS VARs across North America. Ask your VAR or contact us for a referral." },
    ],
  },
  {
    region: "Europe",
    resellers: [
      { name: "Solid Solutions", location: "United Kingdom & Ireland", description: "Leading UK SOLIDWORKS reseller offering Power Surfacing licenses, training, and local support." },
      { name: "European SOLIDWORKS Partners", location: "EU Region", description: "Available through authorized SOLIDWORKS partners across Germany, France, Benelux, Scandinavia, and more. Contact us for the partner nearest you." },
    ],
  },
  {
    region: "Asia-Pacific",
    resellers: [
      { name: "Regional SOLIDWORKS Distributors", location: "Japan, South Korea, Australia, India, Southeast Asia", description: "Power Surfacing products are distributed through established SOLIDWORKS channel partners throughout the Asia-Pacific region. Contact us for a local referral." },
    ],
  },
  {
    region: "Rest of World",
    resellers: [
      { name: "Direct International Sales", location: "Worldwide", description: "No local reseller in your country? Purchase directly from nPower Software — electronic delivery and licensing available worldwide.", contact: "sales@npowersoftware.com" },
    ],
  },
];

export default function Resellers() {
  return (
    <div>
      <PageTitle
        title="Authorized Resellers & Distributors | nPower Software"
        description="Find authorized nPower Software resellers and distributors worldwide to purchase Power Surfacing products locally."
      />
      <PageHero
        title="Authorized Resellers & Distributors"
        subtitle="Purchase Power Surfacing products locally through our worldwide network of authorized resellers and distributors."
        breadcrumbs={[{ label: "Resellers" }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <Globe2 className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-slate-900">Find a Reseller in Your Region</h2>
          </div>

          <div className="space-y-12">
            {REGIONS.map((group) => (
              <div key={group.region}>
                <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">{group.region}</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  {group.resellers.map((reseller) => (
                    <div key={reseller.name} className="card-anim bg-slate-50 border border-slate-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{reseller.name}</h4>
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3 h-3" /> {reseller.location}</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{reseller.description}</p>
                      {reseller.contact && (
                        <a href={`mailto:${reseller.contact}`} className="text-sm font-semibold text-red-600 hover:text-red-700">{reseller.contact}</a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 bg-neutral-950 rounded-2xl p-8 sm:flex items-center justify-between gap-8">
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