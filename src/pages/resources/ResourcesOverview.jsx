import React from "react";
import { Link } from "react-router-dom";
import { IMAGES } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import { Video, Monitor, BookOpen, FileText, Bell, HelpCircle, ArrowRight } from "lucide-react";

const resources = [
  { icon: Video, title: "Video Library", desc: "Browse all Power Surfacing videos — demos, tutorials, overviews, and webinars.", path: "/resources/videos" },
  { icon: Monitor, title: "Product Demos", desc: "Watch in-depth product demonstrations showing real-world workflows.", path: "/resources/demos" },
  { icon: BookOpen, title: "Tutorials", desc: "Step-by-step tutorials to help you master Power Surfacing tools.", path: "/resources/tutorials" },
  { icon: FileText, title: "Documentation", desc: "Complete product documentation, user guides, and reference materials.", path: "/resources/documentation" },
  { icon: Bell, title: "Release Notes", desc: "Stay up to date with the latest features, improvements, and fixes.", path: "/resources/release-notes" },
  { icon: HelpCircle, title: "FAQ", desc: "Find answers to frequently asked questions about Power Surfacing products.", path: "/resources/faq" },
];

export default function ResourcesOverview() {
  return (
    <div>
      <PageHero
        title="Resources"
        subtitle="Videos, tutorials, documentation, and support to help you succeed with Power Surfacing."
        breadcrumbs={[{ label: "Resources" }]}
        image={IMAGES.studio}
      />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((r) => (
              <Link
                key={r.title}
                to={r.path}
                className="group bg-white border border-slate-200 rounded-xl p-8 hover:shadow-xl hover:border-red-200 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center mb-5 transition-colors">
                  <r.icon className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">{r.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{r.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-600">
                  Explore <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}