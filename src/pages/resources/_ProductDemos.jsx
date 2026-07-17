import React from "react";
import { SAMPLE_VIDEOS } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import VideoCard from "@/components/shared/VideoCard";

export default function ProductDemos() {
  const demos = SAMPLE_VIDEOS.filter((v) => v.type === "Demo");
  return (
    <div>
      <PageTitle
        title="Product Demos — Power Surfacing in Action | nPower"
        description="Watch in-depth demonstrations showing real-world Power Surfacing workflows, from scan-to-CAD reverse engineering to Sub-D design."
      />
      <PageHero
        title="Product Demos"
        subtitle="Watch in-depth demonstrations showing real-world Power Surfacing workflows."
        breadcrumbs={[
          { label: "Resources", path: "/resources" },
          { label: "Product Demos" },
        ]}
      />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {demos.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        </div>
      </section>
    </div>
  );
}