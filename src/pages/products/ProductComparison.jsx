import React from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import CTASection from "@/components/shared/CTASection";
import ComparisonTable from "@/components/shared/ComparisonTable";

export default function ProductComparison() {
  return (
    <div>
      <PageTitle
        title="Compare Power Surfacing Products | nPower Software"
        description="Compare features and capabilities across Power Surfacing RE Studio, Power Surfacing Studio, the SOLIDWORKS add-ins, and Power Shell side by side."
      />
      <PageHero
        title="Compare Products"
        subtitle="Compare features and capabilities across the Power Surfacing product family."
        breadcrumbs={[
          { label: "Products", path: "/products" },
          { label: "Compare Products" },
        ]}
      />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ComparisonTable />
          <p className="text-slate-600 mt-10 max-w-3xl">
            Evaluating other reverse-engineering tools as well? See how Power Surfacing stacks up as a{" "}
            <Link to="/geomagic-design-x-alternative" className="text-red-600 hover:text-red-700 font-semibold hover:underline">Geomagic Design X alternative</Link> or a{" "}
            <Link to="/quicksurface-alternative" className="text-red-600 hover:text-red-700 font-semibold hover:underline">QUICKSURFACE alternative</Link>.
          </p>
        </div>
      </section>
      <CTASection
        title="Find the Right Product for You"
        subtitle="Need help choosing? Contact our team for a personalized recommendation."
        actions={[
          { label: "Contact Sales", path: "/contact" },
          { label: "Free Trial", path: "/pricing/trials" },
        ]}
      />
    </div>
  );
}