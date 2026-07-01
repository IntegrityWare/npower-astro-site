import React from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/shared/PageHero";
import { Rocket, BookOpen, Settings, Bell, Headphones, ArrowRight } from "lucide-react";

const supportItems = [
  { icon: Rocket, title: "Getting Started", desc: "New to Power Surfacing? Start here for setup guides and first steps.", path: "/support/getting-started" },
  { icon: BookOpen, title: "Tutorials by Product", desc: "Step-by-step tutorials organized by product.", path: "/support/tutorials" },
  { icon: Settings, title: "Installation & Licensing", desc: "Installation instructions, license activation, and troubleshooting.", path: "/support/installation" },
  { icon: Bell, title: "Release Notes", desc: "Latest updates, features, and bug fixes.", path: "/support/release-notes" },
  { icon: Headphones, title: "Contact Support", desc: "Reach our support team for help with your products.", path: "/support/contact" },
];

export default function SupportOverview() {
  return (
    <div>
      <PageHero
        title="Support"
        subtitle="Get help with Power Surfacing products — from getting started to advanced troubleshooting."
        breadcrumbs={[{ label: "Support" }]}
        actions={[{ label: "Contact Support", path: "/support/contact" }]}
      />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportItems.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="group bg-white border border-slate-200 rounded-xl p-8 hover:shadow-xl hover:border-blue-200 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-5 transition-colors">
                  <item.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{item.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                  View <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}