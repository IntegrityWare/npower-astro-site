import React, { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronRight, ShoppingCart } from "lucide-react";
import { NAV_ITEMS, STOREFRONT_CART_URL } from "@/lib/siteData";
import { withTrailingSlash } from "@/lib/urls";
import { readCart } from "../store/cart-state";
import TrialDropdown from "./TrialDropdown";

function isNavActive(pathname, itemPath) {
  const current = withTrailingSlash(pathname);
  const target = withTrailingSlash(itemPath);
  return current === target || current.startsWith(target);
}

function DesktopDropdown({ item, isActive }) {
  const [open, setOpen] = useState(false);
  const timeout = useRef(null);

  const handleEnter = () => { clearTimeout(timeout.current); setOpen(true); };
  const handleLeave = () => { timeout.current = setTimeout(() => setOpen(false), 110); };

  useEffect(() => () => clearTimeout(timeout.current), []);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <a
        href={withTrailingSlash(item.path)}
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
                href={withTrailingSlash(child.path)}
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
  const isActive = isNavActive(pathname, item.path);

  if (!item.children) {
    return (
      <a
        href={withTrailingSlash(item.path)}
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
              href={withTrailingSlash(child.path)}
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

function readCartCount() {
  return readCart().reduce((total, item) => total + (Number.isInteger(item?.quantity) && item.quantity > 0 ? item.quantity : 0), 0);
}

function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!STOREFRONT_CART_URL) return;
    const update = () => setCount(readCartCount());
    update();
    window.addEventListener("pageshow", update);
    window.addEventListener("storage", update);
    window.addEventListener("npower-cart-change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.removeEventListener("pageshow", update);
      window.removeEventListener("storage", update);
      window.removeEventListener("npower-cart-change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return count;
}

function CartCount({ count }) {
  return (
    <span className="min-w-5 h-5 px-1.5 rounded-full bg-red-600 text-white text-xs font-semibold flex items-center justify-center">
      {count}
    </span>
  );
}

export default function Navbar({ pathname = "/" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartCount();

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
              <DesktopDropdown
                key={item.path}
                item={item}
                isActive={isNavActive(pathname, item.path)}
              />
            ))}
            {STOREFRONT_CART_URL && (
              <a
                href={STOREFRONT_CART_URL}
                aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-md hover:bg-white/5"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden xl:inline">Cart</span>
                <CartCount count={cartCount} />
              </a>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <TrialDropdown />
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
            <MobileAccordion
              key={item.path}
              item={item}
              pathname={pathname}
              onClose={() => setMobileOpen(false)}
            />
          ))}
          {STOREFRONT_CART_URL && (
            <a
              href={STOREFRONT_CART_URL}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-base font-medium text-slate-200 border-b border-white/10"
            >
              <ShoppingCart className="w-4 h-4" />
              Cart
              <CartCount count={cartCount} />
            </a>
          )}
          <div className="p-4">
            <TrialDropdown mobile onSelect={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
}
