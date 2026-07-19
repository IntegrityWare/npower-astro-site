import React from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import CTASection from "@/components/shared/CTASection";
import { PlayCircle, MonitorPlay, GraduationCap, BookOpen, HelpCircle, Bell, Mail, CalendarDays, Cpu, ArrowRight } from "lucide-react";

const resources = [
  { icon: PlayCircle, title: "Video Library", desc: "Browse the full library of product videos, demos, and tutorials.", path: "/resources/videos" },
  { icon: MonitorPlay, title: "Product Demos", desc: "Watch overview demos of each Power Surfacing product.", path: "/resources/demos" },
  { icon: GraduationCap, title: "Tutorials", desc: "Step-by-step tutorials from beginner to advanced.", path: "/resources/tutorials" },
  { icon: HelpCircle, title: "FAQ", desc: "Answers to common product, licensing, and workflow questions.", path: "/resources/faq" },
  { icon: Cpu, title: "How It Works", desc: "Learn about the Solids# geometry kernel behind every product.", path: "/technology" },
  { icon: Bell, title: "Release Notes", desc: "Latest updates, features, and fixes across the product family.", path: "/resources/release-notes" },
  { icon: Mail, title: "Newsletter", desc: "Get product updates and workflow tips in your inbox.", path: "/newsletter" },
  { icon: CalendarDays, title: "Events & Webinars", desc: "Upcoming webinars, trade shows, and training events.", path: "/events" },
];

export default function LearningCenter() {
  return (
    <div>
      <PageTitle
        title="Learning Center — Videos, Tutorials & Documentation | nPower Software"
        description="Learn Power Surfacing with video demos, step-by-step tutorials, documentation, FAQs, webinars, and release notes — all in one place."
      />
      <PageHero
        title="Learning Center"
        subtitle="Everything you need to learn Power Surfacing — videos, tutorials, documentation, FAQs, and events."
        breadcrumbs={[{ label: "Learn" }]}
      />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((r) => (
              <Link key={r.title} to={r.path} className="group bg-white border border-slate-200 rounded-xl p-8 hover:shadow-xl hover:border-red-200 transition-all">
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
      <CTASection
        title="Ready to Try Power Surfacing?"
        subtitle="Download a free trial of any Power Surfacing product — no credit card required."
        actions={[
          { label: "Free Trial", path: "/pricing/trials" },
          { label: "Contact Sales", path: "/contact" },
        ]}
      />
    </div>
  );
}