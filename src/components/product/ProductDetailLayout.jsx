import React from "react";
import { SAMPLE_VIDEOS } from "@/lib/siteData";
import PageTitle from "@/components/shared/PageTitle";
import CTASection from "@/components/shared/CTASection";
import ProductPricing from "@/components/shared/ProductPricing";
import ProductTestimonials from "@/components/shared/ProductTestimonials";
import ProductHeroDetail from "@/components/product/ProductHeroDetail";
import QuickFactsStrip from "@/components/product/QuickFactsStrip";
import StickyProductNav from "@/components/product/StickyProductNav";
import ProblemSection from "@/components/product/ProblemSection";
import WorkflowSteps from "@/components/product/WorkflowSteps";
import CapabilityCards from "@/components/product/CapabilityCards";
import CompatibilitySection from "@/components/product/CompatibilitySection";
import ExamplesSection from "@/components/product/ExamplesSection";
import CompareStrip from "@/components/product/CompareStrip";
import ProductFAQ from "@/components/product/ProductFAQ";
import ResourcesSection from "@/components/product/ResourcesSection";

export default function ProductDetailLayout({ product }) {
  const d = product.detail;
  const videos = SAMPLE_VIDEOS.filter((v) => v.product === product.name).slice(0, 4);

  return (
    <div>
      <PageTitle
        title={product.pageTitle || `${product.name} | nPower Software`}
        description={product.pageDescription || product.description}
      />
      <ProductHeroDetail product={product} />
      <QuickFactsStrip facts={d.quickFacts} />
      <StickyProductNav />
      <ProblemSection problem={d.problem} />
      <WorkflowSteps steps={d.workflowSteps} />
      <CapabilityCards capabilities={d.capabilities} />
      <CompatibilitySection product={product} />
      <ExamplesSection detail={d} />
      <CompareStrip currentProductId={product.id} />
      <ProductTestimonials testimonials={product.testimonials} moreLink={product.testimonialsPath} />
      <div id="pricing" className="scroll-mt-40">
        <ProductPricing product={product} />
      </div>
      <ProductFAQ faq={d.faq} faqLink={d.faqLink} />
      <ResourcesSection videos={videos} />
      <CTASection
        title={`Start Using ${product.shortName} Today`}
        subtitle={`Download a free trial of ${product.name} and experience the difference.`}
        actions={[
          { label: "Download Trial", path: "/pricing/downloads" },
          { label: "Request Demo", path: "/contact" },
        ]}
      />
    </div>
  );
}