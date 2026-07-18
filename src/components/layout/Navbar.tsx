import React, { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { NAV_ITEMS } from "@/lib/siteData";

function DesktopDropdown({ item, isActive }) {
  const [open, setOpen] = useState(false);
  const timeout = useRef(null);

  const handleEnter = () => { clearTimeout(timeout.current); setOpen(true); };
  const handleLeave = () => { timeout.current = setTimeout(() => setOpen(false), 110); };

  useEffect(() => () => clearTimeout(timeout.current), []);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <a
        href={item.path}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-white/5 ${isActive ? "text-red-500" : "text-slate-300 hover:text-white"}`}
      >
        {item.label}
        {item.children && (
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        )}
      </a>
      <div
        className={`absolute top-full left-0 pt-1 w-72 origin-[28px_top] transition-[transform,opacity] duration-200 ease-out ${
          open && item.children
            ? "opacity-100 translate-y-0 scale-100 visible"
            : "opacity-0 -translate-y-1.5 scale-[0.82] invisible pointer-events-none"
        }`}
      >
        {item.children && (
          <div className="bg-neutral-950/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl shadow-black/60 py-2 z-50 overflow-hidden">
            {item.children.map((child) => (
              <a
                key={child.path}
                href={child.path}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-red-600/15 hover:pl-5 border-l-2 border-transparent hover:border-red-600 transition-all duration-150"
              >
                {child.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MobileAccordion({ item, pathname, onClose }) {
  const [open, setOpen] = useState(false);
  const isActive = pathname.startsWith(item.path);

  if (!item.children) {
    return (
      <a
        href={item.path}
        onClick={onClose}
        className={`block px-4 py-3 text-base font-medium border-b border-white/10 ${isActive ? "text-red-500" : "text-slate-200"}`}
      >
        {item.label}
      </a>
    );
  }

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full px-4 py-3 text-base font-medium ${isActive ? "text-red-500" : "text-slate-200"}`}
      >
        {item.label}
        <ChevronRight className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="bg-white/5 pb-2">
          {item.children.map((child) => (
            <a
              key={child.path}
              href={child.path}
              onClick={onClose}
              className="block px-8 py-2.5 text-sm text-slate-400 hover:text-white"
            >
              {child.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar({ pathname = "/" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-neutral-950 border-b transition-all duration-300 ${
        scrolled ? "border-red-600/40 shadow-lg shadow-red-950/20" : "border-white/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/assets/npower-logo.webp"
              alt="nPower Software logo"
              className="h-16 w-auto object-contain select-none pointer-events-none"
              draggable={false} loading="eager"
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <React.Fragment key={item.path}>
                <DesktopDropdown
                  item={item}
                  isActive={pathname === item.path || pathname.startsWith(item.path + "/")}
                />
                {item.path === "/products" && (
                  <a
                    href="https://secure.softwarekey.com/solo/products/Author.aspx?AuthorID=3545461"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Store
                  </a>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/pricing/trials"
              className="btn-anim px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Download Trial
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-neutral-950 border-t border-white/10 max-h-[calc(100vh-6rem)] overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <React.Fragment key={item.path}>
              <MobileAccordion
                item={item}
                pathname={pathname}
                onClose={() => setMobileOpen(false)}
              />
              {item.path === "/products" && (
                <a
                  href="https://secure.softwarekey.com/solo/products/Author.aspx?AuthorID=3545461"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-slate-200 border-b border-white/10"
                >
                  Store
                </a>
              )}
            </React.Fragment>
          ))}
          <div className="p-4">
            <a
              href="/pricing/trials"
              onClick={() => setMobileOpen(false)}
              className="btn-anim block w-full text-center px-4 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Download Trial
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
