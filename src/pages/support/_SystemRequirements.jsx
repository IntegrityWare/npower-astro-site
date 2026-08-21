import React from "react";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import CTASection from "@/components/shared/CTASection";
import { Cpu, MonitorCog, HardDrive, Layers, CheckCircle, AlertTriangle } from "lucide-react";

const SECTIONS = [
  {
    title: "SOLIDWORKS Add-ins",
    subtitle: "Power Surfacing, Power Surfacing RE, and Power Shell for SOLIDWORKS",
    icon: Layers,
    requirements: [
      { label: "SOLIDWORKS Version", value: "SOLIDWORKS 2021 or newer (64-bit) for current releases. Older SOLIDWORKS versions (2020 and earlier — even SOLIDWORKS 2017) are supported with matching older product versions; contact sales for availability. The add-ins follow SOLIDWORKS system requirements." },
      { label: "Operating System", value: "Windows 10 or Windows 11, 64-bit" },
      { label: "Processor", value: "3.3 GHz or higher, multi-core Intel or AMD (as recommended by SOLIDWORKS)" },
      { label: "Memory (RAM)", value: "16 GB minimum; 32 GB recommended for large scan meshes" },
      { label: "Graphics Card", value: "Certified SOLIDWORKS GPU (NVIDIA RTX / Quadro or AMD Radeon Pro) with OpenGL Shader support and up-to-date certified drivers" },
      { label: "Disk Space", value: "2 GB free space for installation" },
    ],
  },
  {
    title: "Standalone Studio Products",
    subtitle: "Power Surfacing Visualize, Power Surfacing Studio and Power Surfacing RE Studio",
    icon: MonitorCog,
    requirements: [
      { label: "Operating System", value: "Windows 10 or Windows 11, 64-bit — no SOLIDWORKS license required" },
      { label: "Processor", value: "2.5 GHz or higher, multi-core Intel or AMD" },
      { label: "Memory (RAM)", value: "8 GB minimum; 16–32 GB recommended when reverse engineering dense scan meshes" },
      { label: "Graphics Card", value: "Dedicated GPU with OpenGL Shader support; 2 GB+ VRAM recommended" },
      { label: "Disk Space", value: "2 GB free space for installation" },
      { label: "File Formats", value: "See each product page for import and export formats. Visualize focuses on CAD import and visualization export; Studio and RE Studio cover modeling and reverse-engineering formats." },
    ],
  },
];

const NOTES = [
  "GPU drivers matter: most display issues are resolved by updating to the latest certified driver for your graphics card.",
  "Working with large 3D scans (millions of polygons)? More RAM and a faster GPU significantly improve Quad Wrap and Shrink Wrap performance.",
  "The SOLIDWORKS add-ins install on top of an existing SOLIDWORKS installation — a valid SOLIDWORKS license is required.",
  "An internet connection is required for license activation and updates.",
];

export default function SystemRequirements() {
  return (
    <div>
      <PageTitle
        title="System Requirements | Power Surfacing Suite"
        description="Hardware, operating system, and software versions needed to run Power Surfacing, Power Surfacing RE, Power Shell, and the standalone Studio products."
      />
      <PageHero
        title="System Requirements"
        subtitle="The hardware, operating system, and software versions needed to run the Power Surfacing suite effectively."
        breadcrumbs={[{ label: "Support", path: "/support" }, { label: "System Requirements" }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title}>
                <div className="flex items-center gap-3 mb-1">
                  <Icon className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                </div>
                <p className="text-sm text-slate-500 mb-6 ml-9">{section.subtitle}</p>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  {section.requirements.map((req, i) => (
                    <div key={req.label} className={`grid sm:grid-cols-[220px_1fr] gap-1 sm:gap-6 px-6 py-4 ${i % 2 ? "bg-slate-50" : "bg-white"}`}>
                      <span className="text-sm font-semibold text-slate-900">{req.label}</span>
                      <span className="text-sm text-slate-600">{req.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div>
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-slate-900">Good to Know</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {NOTES.map((note) => (
                <div key={note} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <CheckCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Not Sure If Your System Qualifies?"
        subtitle="Download a free trial and test the software on your own hardware, or contact support with your specs."
        actions={[
          { label: "Download Trial", path: "/pricing/trials" },
          { label: "Contact Support", path: "/support/contact" },
        ]}
      />
    </div>
  );
}