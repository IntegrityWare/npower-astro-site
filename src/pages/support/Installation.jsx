import React from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import { Monitor, Key, RefreshCw, AlertTriangle, HelpCircle } from "lucide-react";

const sections = [
  {
    icon: Monitor,
    title: "System Requirements",
    items: [
      "Windows 10 or later (64-bit)",
      "4 GB RAM minimum (8 GB recommended)",
      "OpenGL 3.3 compatible graphics card",
      "500 MB available disk space",
      "Internet connection for license activation",
      "SOLIDWORKS 2020 or later (for add-in products)",
    ],
  },
  {
    icon: Key,
    title: "License Activation",
    items: [
      "Launch the product after installation",
      "Enter your license key when prompted",
      "Click 'Activate' to validate your license",
      "For trial users, select 'Start Trial' instead",
      "License is tied to a single machine",
      "Contact support to transfer a license",
    ],
  },
  {
    icon: RefreshCw,
    title: "Updating Your Software",
    items: [
      "Download the latest version from Product Downloads",
      "Close SOLIDWORKS and Power Surfacing before updating",
      "Run the installer — it will update your existing installation",
      "Your license key will be preserved during the update",
      "Check Release Notes for changes in each version",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Common Issues",
    items: [
      "Add-in not appearing in SOLIDWORKS — restart SOLIDWORKS and check Add-in Manager",
      "License activation failure — check internet connection and firewall settings",
      "Graphics display issues — update your graphics card drivers",
      "Slow performance — check RAM and close other applications",
      "For persistent issues, contact support with your system info",
    ],
  },
];

export default function Installation() {
  return (
    <div>
      <PageTitle
        title="Install & Activate — Setup and License Activation | nPower Software"
        description="Install and activate Power Surfacing — installation instructions, system requirements, license activation, and troubleshooting."
      />
      <PageHero
        title="Install & Activate"
        subtitle="Installation instructions, system requirements, license activation, and troubleshooting."
        breadcrumbs={[
          { label: "Support", path: "/support" },
          { label: "Install & Activate" },
        ]}
      />
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
              </div>
              <ul className="space-y-3 ml-13">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Still need help?</h2>
          <p className="text-slate-600 mb-4">Our support team is ready to assist with installation and licensing issues.</p>
          <Link to="/support/contact" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}