import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { NAV_ITEMS } from "@/lib/siteData";

function DesktopDropdown({ item, isActive }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const timeout = useRef(null);

  const handleEnter = () => { clearTimeout(timeout.current); setOpen(true); };
  const handleLeave = () => { timeout.current = setTimeout(() => setOpen(false), 150); };

  useEffect(() => () => clearTimeout(timeout.current), []);

  return (
    <div ref={ref} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        to={item.path}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-slate-100 ${isActive ? "text-blue-600" : "text-slate-600 hover:text-slate-900"}`}
      >
        {item.label}
        {item.children && <ChevronDown className="w-3.5 h-3.5" />}
      </Link>
      {open && item.children && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-slate-200 rounded-lg shadow-2xl py-2 z-50">
          {item.children.map((child) => (
            <Link
              key={child.path}
              to={child.path}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileAccordion({ item, onClose }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isActive = location.pathname.startsWith(item.path);

  if (!item.children) {
    return (
      <Link
        to={item.path}
        onClick={onClose}
        className={`block px-4 py-3 text-base font-medium border-b border-slate-200 ${isActive ? "text-blue-600" : "text-slate-700"}`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full px-4 py-3 text-base font-medium ${isActive ? "text-blue-600" : "text-slate-700"}`}
      >
        {item.label}
        <ChevronRight className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="bg-slate-50 pb-2">
          {item.children.map((child) => (
            <Link
              key={child.path}
              to={child.path}
              onClick={onClose}
              className="block px-8 py-2.5 text-sm text-slate-500 hover:text-slate-900"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="https://media.base44.com/images/public/6a44d2347ed5692671cd034a/1d6ddbb87_generated_image.png"
              alt="nPowerSoftware logo"
              className="w-9 h-9 object-contain"
            />
            <div className="hidden sm:block">
              <span className="text-slate-900 font-bold text-lg leading-none">Power Surfacing</span>
              <span className="text-slate-500 text-xs block leading-none mt-0.5">by nPowerSoftware</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <DesktopDropdown
                key={item.path}
                item={item}
                isActive={location.pathname === item.path || location.pathname.startsWith(item.path + "/")}
              />
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/pricing/trials"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Download Trial
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <MobileAccordion key={item.path} item={item} onClose={() => setMobileOpen(false)} />
          ))}
          <div className="p-4">
            <Link
              to="/pricing/trials"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Download Trial
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}