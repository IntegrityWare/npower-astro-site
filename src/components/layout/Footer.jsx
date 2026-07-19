import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = [
{
  title: "Products",
  links: [
  { label: "Power Surfacing RE Studio", path: "/products/power-surfacing-re-studio" },
  { label: "Power Surfacing Studio", path: "/products/power-surfacing-studio" },
  { label: "Power Surfacing", path: "/products/power-surfacing-solidworks" },
  { label: "Power Surfacing RE", path: "/products/power-surfacing-re-solidworks" },
  { label: "Power Shell", path: "/products/power-shell-solidworks" },
  { label: "Compare Products", path: "/products/comparison" }]

},
{
  title: "Workflows",
  links: [
  { label: "Reverse Engineering", path: "/workflows/reverse-engineering" },
  { label: "Scan-to-CAD", path: "/workflows/scan-to-cad" },
  { label: "Mesh-to-CAD", path: "/workflows/mesh-to-cad" },
  { label: "Freeform Sub-D", path: "/workflows/freeform-sub-d" },
  { label: "Industrial Design", path: "/workflows/industrial-design-solidworks" },
  { label: "All Workflows", path: "/workflows" }]

},
{
  title: "Resources",
  links: [
  { label: "Video Library", path: "/resources/videos" },
  { label: "Tutorials", path: "/resources/tutorials" },
  { label: "FAQ", path: "/resources/faq" },
  { label: "Release Notes", path: "/resources/release-notes" }]

},
{
  title: "Company",
  links: [
  { label: "How It Works", path: "/technology" },
  { label: "Support", path: "/support" },
  { label: "Contact Sales", path: "/contact" },
  { label: "Free Trial", path: "/pricing/trials" }]

}];


export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-red-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Link to="/" className="group flex items-center gap-3 mb-4">
              <img
                src="/assets/small-logo.png"
                alt="nPower Software"
                className="w-11 h-11 shrink-0 object-contain transition-transform duration-500 group-hover:rotate-[30deg] group-hover:scale-110 drop-shadow-[0_0_10px_rgba(215,26,46,0.4)]" />
              <span className="text-white font-bold text-lg whitespace-nowrap">Power Surfacing</span>
            </Link>
            <p className="text-slate-400 text-sm mb-4 max-w-xs">Advanced CAD design and reverse engineering software by nPowerSoftware.

            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <a href="mailto:info@npowersoftware.com" className="flex items-center gap-2 hover:text-red-400 transition-colors">
                <Mail className="w-4 h-4" /> info@npowersoftware.com
              </a>
              <a href="tel:+1-800-555-0199" className="flex items-center gap-2 hover:text-red-400 transition-colors">
                <Phone className="w-4 h-4" /> Contact Sales
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((col) =>
          <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) =>
              <li key={link.path}>
                    <Link to={link.path} className="text-slate-400 text-sm hover:text-red-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} IntegrityWare, Inc. All rights reserved. Powered by Solids# Technology.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/contact" className="hover:text-red-400 transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-red-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>);

}