import React from "react";
import { Link } from "react-router-dom";
import { PRODUCTS, SAMPLE_VIDEOS } from "@/lib/siteData";
import PageTitle from "@/components/shared/PageTitle";
import PageHero from "@/components/shared/PageHero";
import ProductPricing from "@/components/shared/ProductPricing";
import ProductTestimonials from "@/components/shared/ProductTestimonials";
import CTASection from "@/components/shared/CTASection";
import VideoCard from "@/components/shared/VideoCard";
import ReStudioIntro from "@/components/products/restudio/ReStudioIntro";
import ReStudioFeatures from "@/components/products/restudio/ReStudioFeatures";
import ReStudioWorkflow from "@/components/products/restudio/ReStudioWorkflow";
import ReStudioFormats from "@/components/products/restudio/ReStudioFormats";
import ReStudioComparison from "@/components/products/restudio/ReStudioComparison";
import ReStudioAlternatives from "@/components/products/restudio/ReStudioAlternatives";
import ReStudioFaq from "@/components/products/restudio/ReStudioFaq";
import ReStudioStructuredData from "@/components/products/restudio/ReStudioStructuredData";
import { ArrowRight } from "lucide-react";

export default function PowerSurfacingREStudio() {
  const product = PRODUCTS.find((p) => p.id === "power-surfacing-re-studio");
  const productVideos = SAMPLE_VIDEOS.filter((v) => v.product === product.name).slice(0, 4);

  return (
    <div>
      <PageTitle
        title="Power Surfacing RE Studio | Scan-to-CAD Reverse Engineering"
        description="Convert 3D scans, STL files and polygon meshes into editable CAD surfaces and solids with standalone Power Surfacing RE Studio software."
        canonicalPath="/products/power-surfacing-re-studio"
      />
      <ReStudioStructuredData product={product} />
      <PageHero
        title="Power Surfacing RE Studio"
        subtitle="Power Surfacing RE Studio is standalone Windows reverse-engineering and scan-to-CAD software for reconstructing 3D scan meshes, STL files and polygon models as editable CAD surfaces and solids."
        breadcrumbs={[
          { label: "Products", path: "/products" },
          { label: "Power Surfacing RE Studio" },
        ]}
        image={product.image}
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Watch Demo", path: "/resources/demos" },
          { label: "Compare Products", path: "/products/comparison" },
        ]}
      />
      <ReStudioIntro />
      <ReStudioFeatures />
      <ReStudioWorkflow />
      <ReStudioFormats />
      <ReStudioComparison />
      <ReStudioAlternatives />
      <ProductTestimonials testimonials={product.testimonials} moreLink={product.testimonialsPath} />
      <ProductPricing product={product} />
      <ReStudioFaq />
      {productVideos.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Power Surfacing RE Studio Videos</h2>
              <Link to="/resources/videos" className="text-sm font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1">
                All Videos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {productVideos.map((v) => <VideoCard key={v.id} video={v} />)}
            </div>
          </div>
        </section>
      )}
      <CTASection
        title="Start Using RE Studio Today"
        subtitle="Download a free trial of Power Surfacing RE Studio and experience the difference."
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Request Demo", path: "/contact" },
        ]}
      />
    </div>
  );
}