import React from "react";
import { Link } from "@/lib/link";
import { PRODUCTS } from "@/lib/siteData";
import PageTitle from "@/components/shared/PageTitle";
import PageHero from "@/components/shared/PageHero";
import ProductPricing from "@/components/shared/ProductPricing";
import CTASection from "@/components/shared/CTASection";
import JsonLd from "@/components/shared/JsonLd";
import VizRenderShowcase from "@/components/products/viz/VizRenderShowcase";
import HoverZoomImage from "@/components/products/viz/HoverZoomImage";
import MicroFilletComparison from "@/components/products/viz/MicroFilletComparison";
import PlayInWindowVideo from "@/components/products/viz/PlayInWindowVideo";
import { InBetaBanner } from "@/components/shared/ProductAvailability";
import { getProductStructuredData } from "@/seo-content/productStructuredData";
import { VISUALIZE_CONTENT as C } from "@/seo-content/products/power-surfacing-visualize";
import { ArrowRight, CheckCircle } from "lucide-react";

const SHAVER_REVEAL_END_SECONDS = 9;
const SIDE_BY_SIDE_FRAME = "h-48";

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
          { label: "Power Surfacing Viz" },
        ]}
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Compare Products", path: "/products/comparison" },
        ]}
        media={<VizRenderShowcase />}
      />
      <InBetaBanner />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">{C.intro.heading}</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            {C.intro.paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-10 flex flex-wrap items-start justify-center gap-6">
            <figure className="m-0 w-full">
              <div className="grid gap-6 sm:grid-cols-2">
                {C.productExample.images.map((image) => (
                  <HoverZoomImage
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    className="w-full"
                    frameClassName="aspect-video"
                  />
                ))}
              </div>
              <figcaption className="mt-2 text-sm text-center text-slate-600">
                {C.productExample.caption}
              </figcaption>
            </figure>
            {C.productExample.videos.map((video) => (
              <figure key={video.src} className="m-0 w-[31%] min-w-[14rem] max-w-sm">
                <PlayInWindowVideo src={video.src} title={video.title} frameClassName={SIDE_BY_SIDE_FRAME} />
                <figcaption className="mt-2 text-sm text-center text-slate-600">
                  {video.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-slate-200 bg-slate-50 rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{C.tessellation.heading}</h2>
            <p className="text-slate-700 leading-relaxed mb-6">{C.tessellation.body}</p>
            <div className="mb-6 flex flex-wrap justify-center gap-6">
              {C.tessellation.images.map((img) => (
                <figure key={img.src} className="m-0 w-[31%] min-w-[14rem] max-w-sm">
                  <HoverZoomImage src={img.src} alt={img.alt} className="w-full" frameClassName={SIDE_BY_SIDE_FRAME} />
                  <figcaption className="mt-2 text-sm text-center text-slate-600">
                    {img.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
            <Link to={C.tessellation.linkPath} className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700">
              {C.tessellation.linkLabel} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-16 bg-white" aria-labelledby="multiple-rendering-options">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-slate-200 bg-slate-50 rounded-xl p-6 sm:p-8">
            <h2 id="multiple-rendering-options" className="scroll-mt-28 text-2xl font-bold text-slate-900 mb-3">{C.renderingOptions.heading}</h2>
            <p className="text-slate-700 leading-relaxed mb-4">{C.renderingOptions.intro}</p>
            <p className="text-slate-700 leading-relaxed mb-8">{C.renderingOptions.environment}</p>
            <div className="grid gap-8 sm:grid-cols-2 mb-10">
              {C.renderingOptions.stills.map((renderer) => (
                <div key={renderer.name} className="min-w-0 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{renderer.name}</h3>
                  <p className="text-sm font-semibold text-red-600 mb-3">{renderer.strength}</p>
                  <p className="text-slate-700 leading-relaxed mb-6">{renderer.description}</p>
                  <figure className="m-0 mt-auto">
                    <HoverZoomImage src={renderer.src} alt={renderer.alt} className="w-full" frameClassName="aspect-video" />
                    <figcaption className="mt-2 text-sm text-center text-slate-600">
                      {renderer.caption}
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{C.renderingOptions.animation.name}</h3>
              <p className="text-sm font-semibold text-red-600 mb-3">{C.renderingOptions.animation.strength}</p>
              <p className="text-slate-700 leading-relaxed mb-6">{C.renderingOptions.animation.description}</p>
              <figure className="m-0 w-full max-w-3xl mx-auto">
                <video
                  className="block w-full aspect-video rounded-xl border border-slate-200 bg-slate-950 object-contain"
                  aria-label={C.renderingOptions.animation.title}
                  src={C.renderingOptions.animation.src}
                  poster={C.renderingOptions.animation.poster}
                  controls
                  playsInline
                  loop
                  preload="none"
                  tabIndex={0}
                />
                <figcaption className="mt-2 text-sm text-center text-slate-600">
                  {C.renderingOptions.animation.caption}
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 bg-white" aria-labelledby="animation">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-slate-200 bg-slate-50 rounded-xl p-6 sm:p-8">
            <h2 id="animation" className="scroll-mt-28 text-2xl font-bold text-slate-900 mb-3">{C.animation.heading}</h2>
            <div className="space-y-4 text-slate-700 leading-relaxed mb-6">
              {C.animation.paragraphs.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">{C.animation.usesHeading}</h3>
            <ul className="space-y-3 mb-8">
              {C.animation.uses.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <figure className="m-0">
              <PlayInWindowVideo
                src={C.animation.video.src}
                title="Rendered animation"
                poster={C.animation.video.poster}
                endSeconds={SHAVER_REVEAL_END_SECONDS}
              />
              <figcaption className="mt-2 text-sm text-center text-slate-600">
                {C.animation.video.caption}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="pb-16 bg-white" aria-labelledby="view-based-tessellation">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-slate-200 bg-slate-50 rounded-xl p-6 sm:p-8">
            <h2 id="view-based-tessellation" className="text-2xl font-bold text-slate-900 mb-3">{C.viewBasedTessellation.heading}</h2>
            <div className="space-y-4 text-slate-700 leading-relaxed mb-6">
              {C.viewBasedTessellation.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 mb-8">
              {C.viewBasedTessellation.images.map((image) => (
                <figure key={image.src} className={image.wide ? "m-0 min-w-0 sm:col-span-2 w-full max-w-3xl mx-auto" : "m-0 min-w-0"}>
                  <HoverZoomImage src={image.src} alt={image.alt} className="w-full" frameClassName="aspect-video" />
                  <figcaption className="mt-2 text-sm text-center font-medium text-slate-700">
                    {image.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
            <ul className="space-y-3">
              {C.viewBasedTessellation.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-16 bg-white" aria-labelledby="edge-vertex-rendering">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-slate-200 bg-slate-50 rounded-xl p-6 sm:p-8">
            <h2 id="edge-vertex-rendering" className="text-2xl font-bold text-slate-900 mb-3">{C.edgeVertexRendering.heading}</h2>
            <div className="space-y-4 text-slate-700 leading-relaxed mb-8">
              {C.edgeVertexRendering.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="space-y-10">
              {C.edgeVertexRendering.groups.map((group) => (
                <div key={group.heading}>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{group.heading}</h3>
                  <p className="text-slate-700 leading-relaxed mb-6">{group.description}</p>
                  <div className={group.compactImages ? "flex flex-wrap justify-center gap-6" : "grid gap-x-6 gap-y-8 sm:grid-cols-2"}>
                    {group.images.map((image) => (
                      <figure key={image.src} className={group.compactImages ? "m-0 w-full sm:w-[31%] sm:min-w-[14rem] max-w-sm" : "m-0 min-w-0"}>
                        <HoverZoomImage
                          src={image.src}
                          alt={image.alt}
                          className="w-full"
                          frameClassName={group.compactImages ? SIDE_BY_SIDE_FRAME : "aspect-video"}
                        />
                        <figcaption className="mt-2 text-sm text-center font-medium text-slate-700">
                          {image.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="pb-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-slate-200 bg-slate-50 rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{C.microFilleting.heading}</h2>
            <p className="text-lg text-slate-800 leading-relaxed mb-4">{C.microFilleting.oneLine}</p>
            <p className="text-slate-700 leading-relaxed mb-6">{C.microFilleting.summary}</p>
            <div className="mx-auto mb-8 grid max-w-[57.5rem] gap-6 md:grid-cols-2">
              {C.microFilleting.images.slice(1).map((image) => (
                <MicroFilletComparison key={image.src} before={C.microFilleting.images[0]} after={image} />
              ))}
            </div>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              {C.microFilleting.paragraphs.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 bg-white" aria-labelledby="remote-rendering">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-slate-200 bg-slate-50 rounded-xl p-6 sm:p-8">
            <h2 id="remote-rendering" className="scroll-mt-28 text-2xl font-bold text-slate-900 mb-3">{C.remoteRendering.heading}</h2>
            <p className="text-slate-700 leading-relaxed mb-6">{C.remoteRendering.intro}</p>
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              {C.remoteRendering.benefits.map((benefit) => (
                <div key={benefit.title} className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{benefit.body}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">{C.remoteRendering.hardwareHeading}</h3>
              <p className="text-slate-700 leading-relaxed mb-3">{C.remoteRendering.hardwareIntro}</p>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">{C.remoteRendering.memoryAdvice}</p>
              <ul className="grid gap-4 md:grid-cols-3 mb-4">
                {C.remoteRendering.examples.map((example) => (
                  <li key={example.gpu} className="min-w-0 rounded-xl border border-slate-200 bg-white p-5">
                    <h4 className="text-base font-bold text-slate-900 mb-1">{example.gpu}</h4>
                    <p className="text-sm font-semibold text-red-600 mb-3">{example.memory}</p>
                    <p className="text-xl font-bold text-slate-900">{example.price}</p>
                    <p className="text-xs text-slate-500 mb-3">Complete desktop PC</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{example.detail}</p>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{C.remoteRendering.pricingNote}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm mb-8">
                <a href={C.remoteRendering.retailerUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-red-600 hover:text-red-700 underline underline-offset-2">{C.remoteRendering.retailerLabel}</a>
                <a href={C.remoteRendering.specsUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-red-600 hover:text-red-700 underline underline-offset-2">{C.remoteRendering.specsLabel}</a>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link to={C.remoteRendering.downloadPath} className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg">
                Download the free Render Worker <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link to={C.remoteRendering.detailsPath} className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700">
                Render Worker setup instructions <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
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
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Power Surfacing Viz FAQ</h2>
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
        title="Start using Viz"
        subtitle="Download a free trial of Power Surfacing Viz. KeyShot is bundled — no extra KeyShot license required."
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Request Demo", path: "/contact" },
        ]}
      />
    </div>
  );
}
