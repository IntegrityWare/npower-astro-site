import React from "react";
import { Link } from '@/lib/link';
import { PRODUCTS } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import { Download, Settings, Play, BookOpen, ArrowRight } from "lucide-react";

const steps = [
  { icon: Download, title: "Download & Install", desc: "Download the trial or licensed version and follow the installation wizard." },
  { icon: Settings, title: "Activate License", desc: "Enter your license key or start your trial evaluation period." },
  { icon: Play, title: "Watch Overview Videos", desc: "Watch product overview videos to learn the interface and core workflows." },
  { icon: BookOpen, title: "Follow Tutorials", desc: "Work through step-by-step tutorials to build your first models." },
];

export default function GettingStarted() {
  return (
    <div>
      <PageTitle
        title="Getting Started with Power Surfacing | nPower Software"
        description="New to Power Surfacing? Follow these quick start steps — download, activate, watch overview videos, and follow tutorials."
      />
      <PageHero
        title="Getting Started"
        subtitle="New to Power Surfacing? Follow these steps to get up and running quickly."
        breadcrumbs={[
          { label: "Support", path: "/support" },
          { label: "Getting Started" },
        ]}
      />
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Quick Start Steps</h2>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={step.title} className="flex items-start gap-5 bg-slate-50 border border-slate-200 rounded-xl p-6">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-red-600">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Choose Your Product to Get Started</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRODUCTS.map((p) => (
              <Link key={p.id} to={p.path} className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg hover:border-red-200 transition-all group">
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover"  loading="lazy"/>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600">{p.shortName}</h3>
                  <p className="text-xs text-slate-500">{p.platform}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}