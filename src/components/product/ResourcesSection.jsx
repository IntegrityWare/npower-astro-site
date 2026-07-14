import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, FileText, Download, ArrowRight } from "lucide-react";
import VideoCard from "@/components/shared/VideoCard";

const LINKS = [
  { icon: GraduationCap, label: "Tutorials by Product", desc: "Step-by-step video tutorials", path: "/support/tutorials" },
  { icon: FileText, label: "Release Notes", desc: "What's new in each version", path: "/support/release-notes" },
  { icon: Download, label: "Downloads", desc: "Latest installers and free trials", path: "/pricing/downloads" },
];

export default function ResourcesSection({ videos }) {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">Learning & Resources</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-red-300 hover:shadow-md transition-all">
                <Icon className="w-6 h-6 text-red-600 mb-3" />
                <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-1">{item.label}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </Link>
            );
          })}
        </div>
        {videos.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Product Videos</h3>
              <Link to="/resources/videos" className="text-sm font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1">
                All Videos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {videos.map((v) => <VideoCard key={v.id} video={v} />)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}