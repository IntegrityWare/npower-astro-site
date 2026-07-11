import React from "react";
import { useParams, Link } from "react-router-dom";
import { PRODUCTS, SAMPLE_VIDEOS } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import VideoCard from "@/components/shared/VideoCard";
import CTASection from "@/components/shared/CTASection";
import PageTitle from "@/components/shared/PageTitle";
import ProductPricing from "@/components/shared/ProductPricing";
import ProductTestimonials from "@/components/shared/ProductTestimonials";
import { CheckCircle, Play, ArrowRight, Users, Target, Zap, Star } from "lucide-react";

export default function ProductPage() {
  const { productId } = useParams();
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Product Not Found</h1>
          <Link to="/products" className="text-red-600 hover:text-red-700">View All Products</Link>
        </div>
      </div>
    );
  }

  const productVideos = SAMPLE_VIDEOS.filter((v) => v.product === product.name).slice(0, 4);
  const featuredVideo = productVideos[0];

  return (
    <div>
      {(product.pageTitle || product.pageDescription) && <PageTitle title={product.pageTitle} description={product.pageDescription} />}
      <PageHero
        title={product.name}
        subtitle={product.description}
        breadcrumbs={[
          { label: "Products", path: "/products" },
          { label: product.shortName },
        ]}
        image={product.image}
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Watch Demo", path: "/resources/demos" },
          { label: "Compare Products", path: "/products/comparison" },
        ]}
      />

      {/* Overview Video */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img src={featuredVideo ? featuredVideo.thumbnail : product.image} alt={`${product.name} overview`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                {featuredVideo ? (
                  <Link to={`/resources/videos/${featuredVideo.id}`} className="w-16 h-16 rounded-full bg-red-600/90 hover:bg-red-600 flex items-center justify-center transition-colors">
                    <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                  </Link>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center">
                    <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full mb-4">
                {product.platform} · {product.category}
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">{product.tagline}</h2>
              <p className="text-slate-600 mb-6">{product.description}</p>
              <Link to="/pricing/trials" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                Try {product.shortName} Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <ProductTestimonials testimonials={product.testimonials} />

      {/* Who It's For */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-slate-900">Who Is It For</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.whoIsItFor.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-5">
                <CheckCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-slate-900">Key Benefits</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.benefits.map((benefit) => (
              <div key={benefit} className="bg-gradient-to-br from-red-50 to-slate-50 border border-red-100 rounded-xl p-6">
                <Zap className="w-5 h-5 text-red-600 mb-3" />
                <p className="text-sm font-medium text-slate-800">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Target className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-slate-900">Key Features</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {product.features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-4">
                <CheckCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-sm text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Use Cases</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {product.useCases.map((uc, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mb-3">
                  <span className="text-sm font-bold text-red-600">{i + 1}</span>
                </div>
                <p className="text-sm text-slate-700">{uc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <ProductPricing product={product} />

      {/* Videos */}
      {productVideos.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Videos</h2>
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
        title={`Start Using ${product.shortName} Today`}
        subtitle={`Download a free trial of ${product.name} and experience the difference.`}
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Request Demo", path: "/contact" },
        ]}
      />
    </div>
  );
}