import React from "react";
import { Link } from "@/lib/link";
import { PRODUCTS } from "@/lib/siteData";
import PageTitle from "@/components/shared/PageTitle";
import PageHero from "@/components/shared/PageHero";
import ProductPricing from "@/components/shared/ProductPricing";
import CTASection from "@/components/shared/CTASection";
import JsonLd from "@/components/shared/JsonLd";
import { getProductStructuredData } from "@/seo-content/productStructuredData";
import { VISUALIZE_CONTENT as C } from "@/seo-content/products/power-surfacing-visualize";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function PowerSurfacingVisualize() {
  const product = PRODUCTS.find((p) => p.id === "power-surfacing-visualize");

  return (
    <div>
      <PageTitle title={C.meta.title} description={C.meta.description} canonicalPath={C.meta.canonicalPath} />
      <JsonLd data={getProductStructuredData("power-surfacing-visualize")} />
      <PageHero
        title={C.hero.h1}
        subtitle={C.hero.subtitle}
        breadcrumbs={[
          { label: "Products", path: "/products" },
          { label: "Power Surfacing Visualize" },
        ]}
        image={product.image}
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Compare Products", path: "/products/comparison" },
        ]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">{C.intro.heading}</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            {C.intro.paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-red-200 bg-red-50 rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{C.keyshot.heading}</h2>
            <p className="text-slate-700 leading-relaxed">{C.keyshot.body}</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{C.lineup.heading}</h2>
          <p className="text-slate-600 leading-relaxed mb-10 max-w-3xl">{C.lineup.intro}</p>
          <ol className="grid md:grid-cols-3 gap-6">
            {C.lineup.steps.map((step, i) => (
              <li key={step.name} className="bg-white border border-slate-200 rounded-xl p-6">
                <p className="text-sm font-bold text-red-600 mb-2">{i + 1}</p>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  <Link to={step.path} className="hover:text-red-600">
                    {step.name}
                  </Link>
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.role}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">{C.featuresHeading}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {C.features.map((f) => (
              <div key={f.title} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">{C.workflow.heading}</h2>
          <ol className="space-y-6">
            {C.workflow.steps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-4">
                <span className="w-10 h-10 rounded-lg bg-red-100 text-red-600 font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">{C.formats.heading}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Input formats</h3>
              <ul className="space-y-3">
                {C.formats.inputs.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Output formats</h3>
              <ul className="space-y-3">
                {C.formats.outputs.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ProductPricing product={product} />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: C.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }}
          />
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Power Surfacing Visualize FAQ</h2>
          <div className="space-y-8">
            {C.faqs.map((f) => (
              <div key={f.q}>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.q}</h3>
                <p className="text-slate-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-10">
            {C.relatedLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700"
              >
                {link.label} <ArrowRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Start using Visualize"
        subtitle="Download a free trial of Power Surfacing Visualize. KeyShot is bundled — no extra KeyShot license required."
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Request Demo", path: "/contact" },
        ]}
      />
    </div>
  );
}
