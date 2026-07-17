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
      "Internet connection for license activation (offline / manual activation is available for machines without network access, such as military and government organizations)",
      "SOLIDWORKS 2020 or later for the current add-in products — older SOLIDWORKS versions (2019 and earlier) are supported with matching older product versions; contact sales for availability",
    ],
  },
  {
    icon: Key,
    title: "License Activation",
    items: [
      "Run the installer first — we strongly recommend right-clicking it and choosing 'Run as Administrator'",
      "Launch the product after installation",
      "Enter your license key when prompted",
      "Click 'Activate' to validate your license",
      "For trial users of SOLIDWORKS products, select 'Continue Evaluation'",
      "No internet access? Manual (offline) activation is available — contact support",
      "A license is activated on one machine at a time, and can easily be moved: deactivate it on the old machine, then activate it on the new one",
      "For SOLIDWORKS products you can transfer a license yourself — simply deactivate on the current machine and activate on the new machine",
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
      "For SOLIDWORKS products, make sure BOTH checkboxes are checked in the Add-in Manager — the add-in will not load automatically unless the 'Start Up' (autoload) checkbox is also checked",
      "Verify that the version you downloaded matches your version of SOLIDWORKS, and that your license is valid for that version",
      "License activation failure — check internet connection and firewall settings (or use manual activation)",
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
        title="Install & Activate Power Surfacing | nPower"
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