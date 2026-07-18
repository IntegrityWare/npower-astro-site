import React from "react";
import { Link } from '@/lib/link';
import { SAMPLE_VIDEOS } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import VideoCard from "@/components/shared/VideoCard";
import { Clock, Tag, BarChart3, Monitor, ExternalLink } from "lucide-react";

export default function VideoDetail({ videoId }) {
  const video = SAMPLE_VIDEOS.find((v) => v.id === videoId);

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Video Not Found</h1>
          <Link to="/resources/videos" className="text-red-600 hover:text-red-700">Browse Video Library</Link>
        </div>
      </div>
    );
  }

  const related = SAMPLE_VIDEOS.filter((v) => v.id !== video.id && (v.product === video.product || v.workflow === video.workflow)).slice(0, 4);

  return (
    <div>
      <PageTitle
        title={`${video.title} | nPower Software`}
        description={`Watch this ${video.type.toLowerCase()} on ${video.workflow} using ${video.product}.`}
      />
      <PageHero
        title={video.title}
        breadcrumbs={[
          { label: "Resources", path: "/resources" },
          { label: "Video Library", path: "/resources/videos" },
          { label: video.title },
        ]}
      />

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Video Player Area */}
            <div className="lg:col-span-2">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 mb-6">
                {video.youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80"  loading="lazy"/>
                )}
              </div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl font-bold text-slate-900">{video.title}</h1>
                {video.youtubeId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Watch on YouTube <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <p className="text-slate-600">
                This {video.type.toLowerCase()} covers {video.workflow.toLowerCase()} techniques using {video.product}. 
                Watch to learn key workflows and best practices for your projects.
              </p>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-slate-900">Video Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" /> Duration: {video.duration}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Tag className="w-4 h-4 text-slate-400" /> Type: {video.type}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <BarChart3 className="w-4 h-4 text-slate-400" /> Level: {video.level}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Monitor className="w-4 h-4 text-slate-400" /> Product: {video.product}
                  </div>
                </div>
              </div>
              <Link to="/pricing/trials" className="block w-full text-center px-4 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                Download Trial
              </Link>
              <Link to="/contact" className="block w-full text-center px-4 py-3 text-sm font-semibold text-slate-700 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors">
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Videos */}
      {related.length > 0 && (
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Related Videos</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((v) => <VideoCard key={v.id} video={v} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}