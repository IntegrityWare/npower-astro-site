import React from "react";
import { SAMPLE_VIDEOS } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import VideoCard from "@/components/shared/VideoCard";

export default function Tutorials() {
  const tutorials = SAMPLE_VIDEOS.filter((v) => v.type === "Tutorial");
  return (
    <div>
      <PageTitle
        title="Power Surfacing Tutorials — Step-by-Step | nPower"
        description="Step-by-step video tutorials to help you master Power Surfacing tools and workflows, from beginner to advanced."
      />
      <PageHero
        title="Tutorials"
        subtitle="Step-by-step tutorials to help you master Power Surfacing tools and workflows."
        breadcrumbs={[
          { label: "Resources", path: "/resources" },
          { label: "Tutorials" },
        ]}
      />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        </div>
      </section>
    </div>
  );
}