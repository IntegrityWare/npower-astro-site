import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Spline, Workflow, BookOpen, Video, FileText, Download, Headphones, ChevronDown, ChevronLeft, ChevronRight, BadgeCheck, Hexagon, Cpu, Globe2, Boxes, Box, DraftingCompass, ListTree, Combine, ScanSearch, Grid3x3, Puzzle, Layers } from "lucide-react";
import { PRODUCTS, WORKFLOWS, CAPABILITIES, IMAGES } from "@/lib/siteData";
import ProductCard from "@/components/shared/ProductCard";
import CTASection from "@/components/shared/CTASection";
import Reveal from "@/components/shared/Reveal";
import PageTitle from "@/components/shared/PageTitle";
import ProductFamilyIntro from "@/components/home/ProductFamilyIntro";

const capabilityIcons = {
  Ruler: DraftingCompass, // Dimension-Driven Sketching
  Layers: ListTree, // Feature-Based Modeling (feature tree)
  Box: Combine, // Surfacing & Solids
  Spline: Spline, // Freeform Sub-D Design
  ScanLine: ScanSearch, // Reverse Engineering
  FileInput: Grid3x3, // Scan/Mesh-to-CAD (polygon mesh)
  Workflow: Puzzle, // SOLIDWORKS Workflows (add-in)
  Shell: Layers // Shelling & Thickening (wall layers)
};

/* ------------------------------------------------------------------ */
/*  Living hexagonal mesh — self-drawing + traveling energy wave       */
/* ------------------------------------------------------------------ */
function HexMeshBackdrop() {
  const hexPoints = (cx, cy, r) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = Math.PI / 3 * i - Math.PI / 6;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

  const cells = [];
  const r = 46;
  const w = r * Math.sqrt(3);
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 16; col++) {
      const cx = col * w + (row % 2 ? w / 2 : 0);
      const cy = row * r * 1.5;
      cells.push({ cx, cy, key: `${row}-${col}`, d: (row * 7 + col * 3) % 10 * 0.35, wave: (row + col) * 0.22 });
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="anim-grid-drift absolute -inset-[6%]">
        <svg className="w-full h-full opacity-[0.17]" viewBox="0 0 1280 620" preserveAspectRatio="xMidYMid slice">
          {cells.map((c) =>
          <polygon
            key={c.key}
            points={hexPoints(c.cx, c.cy, r - 3)}
            fill="none"
            stroke="rgba(226,232,240,0.5)"
            strokeWidth="1"
            className="anim-draw"
            style={{ animationDelay: `${c.d}s` }} />

          )}
          {/* traveling red energy wave */}
          {cells.map((c) =>
          <polygon
            key={`w-${c.key}`}
            points={hexPoints(c.cx, c.cy, r - 3)}
            fill="none"
            strokeWidth="1.4"
            className="hex-wave"
            style={{ animationDelay: `${c.wave}s` }} />

          )}
          {cells.filter((_, i) => i % 9 === 0).map((c) =>
          <circle key={`n-${c.key}`} cx={c.cx} cy={c.cy - (r - 3)} r="3"
          fill="rgb(225,29,46)" className="anim-pulse-dot" style={{ animationDelay: `${c.d}s` }} />
          )}
        </svg>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(225,29,46,0.16),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(225,29,46,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/60" />
    </div>);

}

/* Rotating headline word — cycles on its own */
const HERO_WORDS = ["CAD Design", "Reverse Engineering", "Sub-D Modeling", "Class A Surfacing", "Scan-To-CAD"];
function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % HERO_WORDS.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span key={i} className="word-swap text-red-500 [text-shadow:0_0_28px_rgba(225,29,46,0.45)]">{HERO_WORDS[i]}</span>);

}

/* Self-running company facts ticker */
const COMPANY_FACTS = [
{ icon: Cpu, text: "Powered by IntegrityWare's Solids# geometry kernel" },
{ icon: Boxes, text: "5 specialized products — standalone or inside SOLIDWORKS" },
{ icon: Hexagon, text: "Sub-D freedom with true NURBS / CAD precision" },
{ icon: Globe2, text: "Trusted by industrial designers and reverse engineers worldwide" }];

function CompanyFactTicker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % COMPANY_FACTS.length), 3400);
    return () => clearInterval(t);
  }, []);
  const Icon = COMPANY_FACTS[i].icon;
  return (
    <div key={i} className="fact-swap inline-flex items-center gap-2.5 text-sm text-slate-300 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
      <Icon className="w-4 h-4 text-red-500 shrink-0" />
      {COMPANY_FACTS[i].text}
    </div>);

}

function HeroSection() {
  const layerRef = useRef(null);

  /* mouse parallax on the mesh — rAF-lerped, GPU only */
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = 0,ty = 0,cx = 0,cy = 0,raf;
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 26;
      ty = (e.clientY / window.innerHeight - 0.5) * 18;
    };
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      layer.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {window.removeEventListener("pointermove", onMove);cancelAnimationFrame(raf);};
  }, []);

  return (
    <section className="relative bg-neutral-950 overflow-hidden min-h-[92vh] flex items-center">
      {/* scene */}
      <div className="absolute inset-0 will-change-transform">
        <div className="aurora aurora-a w-[46rem] h-[46rem] -top-56 -left-40" style={{ background: "radial-gradient(circle, rgba(225,29,46,0.30), transparent 65%)" }} />
        <div className="aurora aurora-b w-[40rem] h-[40rem] -bottom-52 right-[-8rem]" style={{ background: "radial-gradient(circle, rgba(225,29,46,0.18), rgba(148,163,184,0.07) 45%, transparent 68%)" }} />
        <div ref={layerRef} className="absolute -inset-[3%] will-change-transform">
          <HexMeshBackdrop />
        </div>
      </div>

      {/* heartbeat rings behind the headline */}
      <div className="absolute left-[2%] md:left-[8%] top-1/2 -translate-y-1/2 w-[30rem] h-[30rem] pointer-events-none" aria-hidden="true">
        <div className="pulse-ring" />
        <div className="pulse-ring" style={{ animationDelay: "1.15s" }} />
        <div className="pulse-ring" style={{ animationDelay: "2.3s" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-12 items-center">
          {/* copy */}
          <div className="hero-stagger min-w-0 relative z-10">
            <div className="inline-flex items-center gap-2 text-sm text-red-400 bg-white/5 backdrop-blur-md border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              nPower Software · Powered by IntegrityWare, Inc. Solids# Technology
            </div>
            <h1 className="font-bold text-white tracking-tight leading-[1.1] text-3xl sm:text-5xl lg:text-[3.4rem] mt-7 mb-6">
              <span className="lg:whitespace-nowrap">Power Surfacing Software</span>
              <br />
              <span className="lg:whitespace-nowrap">
                for <RotatingWord />
              </span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 mb-8 leading-relaxed max-w-xl">
              Power Surfacing provides Windows-based CAD, Sub-D modeling and 3D reverse engineering software for industrial designers, engineers and manufacturers. Scan-to-CAD and mesh-to-CAD workflows turn scanned meshes, ZBrush sculpted meshes and STL files into editable, parametric CAD models — alongside dimension-driven sketching, feature-based solids and freeform Sub-D surfacing. Choose from standalone applications or integrated SOLIDWORKS add-ins.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products" className="btn-anim px-8 py-3.5 text-sm font-semibold text-white bg-red-600 rounded-lg inline-flex items-center gap-2">
                Explore Products <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/resources/videos" className="btn-anim px-8 py-3.5 text-sm font-semibold text-slate-300 bg-white/5 backdrop-blur-md border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:text-white rounded-lg inline-flex items-center gap-2">
                <Play className="w-4 h-4" /> Watch Overview
              </Link>
              <Link to="/pricing/trials" className="btn-anim px-8 py-3.5 text-sm font-semibold text-red-400 rounded-lg inline-flex items-center gap-2">
                Download Trial <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-8">
              <CompanyFactTicker />
            </div>
          </div>

          {/* model video — loops forever, floats gently */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-[32rem] max-w-full aspect-square lg:translate-x-10">
              <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle,rgba(225,29,46,0.18),transparent_65%)] blur-2xl" />
              <div className="anim-float-gentle relative w-full h-full">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  src="/assets/hero-bmw.webm"
                  className="absolute inset-0 w-full h-full object-contain will-change-transform [filter:drop-shadow(0_34px_50px_rgba(0,0,0,0.65))_drop-shadow(0_0_44px_rgba(225,29,46,0.22))]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: window.innerHeight * 0.92, behavior: "smooth" })}
        aria-label="Scroll down"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
        <span className="text-[11px] uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown className="w-5 h-5 scroll-hint text-red-500" />
      </button>
    </section>);

}

/* ------------------------------------------------------------------ */
/*  Capability circuit — one line, a red light travels through words   */
/* ------------------------------------------------------------------ */
function CapabilityCircuit() {
  return (
    <section className="relative bg-neutral-950 border-b border-white/5 py-12 overflow-hidden">
      <div className="hairline absolute top-0 inset-x-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cap-sweep flex flex-wrap items-center justify-center gap-y-4 text-center">
          {CAPABILITIES.map((c, i) =>
          <React.Fragment key={c.name}>
              <span className="px-4 text-[0.795rem] md:text-[0.93rem] font-bold uppercase tracking-[0.3em] whitespace-nowrap select-none">
                {c.name}
              </span>
              {i < CAPABILITIES.length - 1 &&
            <span className="w-1.5 h-1.5 rotate-45 bg-red-600/70 shrink-0" aria-hidden="true" />
            }
            </React.Fragment>
          )}
        </div>
      </div>
    </section>);

}

/* ------------------------------------------------------------------ */
/*  Showcase carousel — hex arrows, auto-advance until you take over   */
/* ------------------------------------------------------------------ */
const SHOWCASE_SLIDES = [
{ src: "/assets/subd-showcase.mp4" },
{ src: "/assets/manifold-showcase.mp4" }];


function HexArrow({ dir, onClick }) {
  const Icon = dir > 0 ? ChevronRight : ChevronLeft;
  return (
    <button
      onClick={onClick}
      aria-label={dir > 0 ? "Next video" : "Previous video"}
      className="group/arrow relative w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-sm flex items-center justify-center overflow-hidden transition-all duration-300 ease-out hover:border-red-500/70 hover:bg-red-600 hover:scale-110 hover:shadow-[0_0_26px_-4px_rgba(225,29,46,0.7)] active:scale-95 focus:outline-none">
      <Icon className={`w-5 h-5 md:w-6 md:h-6 text-slate-300 group-hover/arrow:text-white transition-all duration-300 ${dir > 0 ? "group-hover/arrow:translate-x-0.5" : "group-hover/arrow:-translate-x-0.5"}`} />
    </button>
  );
}

function SubDShowcase() {
  const [[index, direction], setSlide] = useState([0, 0]);
  const manual = useRef(false);

  const go = (dir, isManual = false) => {
    if (isManual) manual.current = true;
    setSlide(([i]) => [(i + dir + SHOWCASE_SLIDES.length) % SHOWCASE_SLIDES.length, dir]);
  };

  const variants = {
    enter: (d) => ({
      x: d >= 0 ? "14%" : "-14%",
      opacity: 0,
      scale: 0.96,
      clipPath: d >= 0 ? "inset(0% 0% 0% 16% round 24px)" : "inset(0% 16% 0% 0% round 24px)"
    }),
    center: { x: 0, opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 24px)" },
    exit: (d) => ({
      x: d >= 0 ? "-9%" : "9%",
      opacity: 0,
      scale: 0.97,
      clipPath: d >= 0 ? "inset(0% 10% 0% 0% round 24px)" : "inset(0% 0% 0% 10% round 24px)"
    })
  };

  return (
    <section className="relative bg-neutral-950 py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(225,29,46,0.08),transparent_55%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12">
          <p className="eyebrow-glow text-[13px] md:text-[15px] font-bold uppercase tracking-[0.4em] text-red-500 mb-4">See It In Motion</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Subdivision Surface Modeling</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 110 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 md:gap-6">
          <HexArrow dir={-1} onClick={() => go(-1, true)} />

          <div className="relative flex-1 min-w-0">
            <div className="absolute -inset-6 rounded-[32px] bg-[radial-gradient(ellipse_at_center,rgba(225,29,46,0.16),transparent_70%)] blur-2xl" />
            <div className="relative aspect-video">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.video
                  key={index}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  onEnded={(e) => {
                    if (!manual.current) {go(1);return;}
                    e.currentTarget.currentTime = 0;
                    e.currentTarget.play();
                  }}
                  src={SHOWCASE_SLIDES[index].src}
                  className="absolute inset-0 w-full h-full object-cover rounded-3xl border border-white/10 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.9)] will-change-transform" />
                
              </AnimatePresence>
            </div>

            {/* slide dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {SHOWCASE_SLIDES.map((_, d) =>
              <button
                key={d}
                onClick={() => {if (d !== index) go(d > index ? 1 : -1, true);}}
                aria-label={`video ${d + 1}`}
                className={`h-1.5 rounded-full transition-all duration-400 ${d === index ? "w-8 bg-red-500" : "w-2.5 bg-white/20 hover:bg-white/40"}`} />

              )}
            </div>
          </div>

          <HexArrow dir={1} onClick={() => go(1, true)} />
        </motion.div>
      </div>
    </section>);

}

function FamilyOverview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The Power Surfacing Product Family</h2>
          <p className="text-lg text-slate-600">
            Five specialized products for CAD design, freeform modeling, reverse engineering, and advanced surfacing — available as standalone applications or SOLIDWORKS add-ins.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Reveal direction="left">
            <div className="card-anim h-full bg-gradient-to-br from-slate-50 to-red-50/50 border border-slate-200 hover:border-red-200 rounded-xl p-8">
              <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-2">Standalone Applications</h3>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Design and reverse engineer without SOLIDWORKS</h4>
              <p className="text-slate-600 text-sm mb-4">Power Surfacing RE Studio and Power Surfacing Studio are complete standalone applications — no third-party CAD license required.</p>
              <div className="flex items-center gap-3 text-sm font-semibold">
                <Link to="/products/power-surfacing-re-studio" className="text-red-600 hover:text-red-700">RE Studio</Link>
                <span className="text-slate-300">|</span>
                <Link to="/products/power-surfacing-studio" className="text-red-600 hover:text-red-700">Studio</Link>
              </div>
            </div>
          </Reveal>
          <Reveal direction="right" delay={120}>
            <div className="card-anim h-full bg-gradient-to-br from-slate-50 to-red-50/50 border border-slate-200 hover:border-red-200 rounded-xl p-8">
              <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-2">SOLIDWORKS Add-ins</h3>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Extend SOLIDWORKS with advanced capabilities</h4>
              <p className="text-slate-600 text-sm mb-4">Add freeform Sub-D surfacing, reverse engineering, and advanced shelling directly inside your SOLIDWORKS environment.</p>
              <div className="flex items-center gap-3 text-sm font-semibold">
                <Link to="/products/power-surfacing-solidworks" className="text-red-600 hover:text-red-700">Sub-D</Link>
                <span className="text-slate-300">|</span>
                <Link to="/products/power-surfacing-re-solidworks" className="text-red-600 hover:text-red-700">RE</Link>
                <span className="text-slate-300">|</span>
                <Link to="/products/power-shell-solidworks" className="text-red-600 hover:text-red-700">Shell</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>);

}

function ProductSelector() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Choose Your Product</h2>
            <p className="text-lg text-slate-600">Select the right Power Surfacing solution for your workflow.</p>
          </div>
          <Link to="/products/comparison" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700">
            Compare All <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
        {/* the two flagship studios */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
          {PRODUCTS.slice(0, 2).map((product, i) =>
          <Reveal key={product.id} delay={i * 130} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          )}
        </div>
        {/* SOLIDWORKS family */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.slice(2).map((product, i) =>
          <Reveal key={product.id} delay={i % 3 * 110} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          )}
        </div>
        <div className="text-center mt-8 md:hidden">
          <Link to="/products/comparison" className="inline-flex items-center gap-1 text-sm font-semibold text-red-600">
            Compare All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>);

}

function CapabilityCards() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Core Capabilities</h2>
          <p className="text-lg text-slate-600">From freeform artistic design to precision manufacturing, Power Surfacing covers every surfacing workflow.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAPABILITIES.map((cap, i) => {
            const Icon = capabilityIcons[cap.icon] || Box;
            return (
              <Reveal key={cap.name} delay={i % 4 * 90}>
                <div className="group card-anim h-full bg-slate-50 hover:bg-white border border-slate-200 hover:border-red-200 rounded-xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-red-600" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{cap.name}</h3>
                  <p className="text-sm text-slate-600">{cap.description}</p>
                </div>
              </Reveal>);

          })}
        </div>
      </div>
    </section>);

}

function FeaturedVideo() {
  return (
    <section className="py-20 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal direction="left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">See Power Surfacing in Action</h2>
            <p className="text-lg text-slate-400 mb-6">Watch how Power Surfacing transforms complex geometry workflows — from scan-to-CAD reverse engineering to freeform Sub-D design and precision surfacing.</p>
            <ul className="space-y-3 mb-8">
              {["Scan-to-CAD in minutes, not hours", "Freeform Sub-D with NURBS precision", "Feature-based modeling with full history", "Works standalone or inside SOLIDWORKS"].map((item) =>
              <li key={item} className="flex items-center gap-3 text-slate-300">
                  <BadgeCheck className="w-5 h-5 text-emerald-500 shrink-0" /> {item}
                </li>
              )}
            </ul>
            <Link to="/resources/videos" className="btn-anim inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg">
              Browse Video Library <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
          <Reveal direction="right" delay={120}>
            <div className="group img-shadow-frame relative aspect-video rounded-xl overflow-hidden border border-slate-700 hover:border-red-600/60 bg-neutral-900 transition-colors duration-500">
              <img src="https://img.youtube.com/vi/l87K8yfbEdY/hqdefault.jpg" alt="Power Surfacing 10.0 New Features" className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Link to="/resources/videos/v10" className="btn-anim w-20 h-20 rounded-full bg-red-600/90 hover:bg-red-600 flex items-center justify-center shadow-2xl shadow-red-950/50">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>);

}

function KeyWorkflows() {
  const featured = WORKFLOWS.filter((w) =>
  ["reverse-engineering", "scan-to-cad", "mesh-to-cad", "stl-obj-to-cad", "sculpted-mesh-to-cad", "freeform-sub-d", "industrial-design-solidworks", "shelling-thickening"].includes(w.id)
  );
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Key Workflows</h2>
            <p className="text-lg text-slate-600">Specialized workflows for every surfacing and reverse engineering challenge.</p>
          </div>
          <Link to="/workflows" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700">
            All Workflows <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
        <div className="flex flex-wrap justify-center gap-5">
          {featured.map((wf, i) =>
          <Reveal key={wf.id} delay={i % 4 * 90} className="h-full w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">
              <Link
              to={wf.path}
              className="group card-anim flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-red-200">
                <div className="img-shadow-frame aspect-video bg-slate-50 border-b border-slate-100">
                  <img src={wf.image} alt={wf.name} loading="lazy" className="w-full h-full object-contain group-hover:scale-[1.04] transition-transform duration-700" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">{wf.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{wf.description}</p>
                </div>
              </Link>
            </Reveal>
          )}
        </div>
        <div className="text-center mt-8 md:hidden">
          <Link to="/workflows" className="inline-flex items-center gap-1 text-sm font-semibold text-red-600">All Workflows <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </section>);

}

function WhyPowerSurfacing() {
  const reasons = [
  { title: "Sub-D Freedom", desc: "Create smooth, organic shapes intuitively with or without subdivision surface modeling." },
  { title: "Dimension-Driven Control", desc: "Precisely constrain geometry with parametric dimensions for manufacturing accuracy." },
  { title: "Feature-Based CAD", desc: "Build with a construction history — edit, reorder, and roll back features at any time." },
  { title: "NURBS Precision", desc: "Output high-quality NURBS surfaces suitable for manufacturing and downstream CAD systems." },
  { title: "Surface & Solid Output", desc: "Create surface bodies or solid bodies to match your downstream workflow requirements." },
  { title: "Standalone Studio Apps", desc: "Complete standalone applications — no third-party CAD license required." },
  { title: "SOLIDWORKS Add-ins", desc: "Extend SOLIDWORKS with Sub-D surfacing, reverse engineering, and advanced shelling." },
  { title: "Cyborg3D Technology", desc: "Built on proven, high-performance geometry kernel technology." }];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Power Surfacing</h2>
          <p className="text-lg text-slate-600">The complete platform for advanced surfacing, CAD design, and reverse engineering.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) =>
          <Reveal key={r.title} delay={i % 4 * 80}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <BadgeCheck className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{r.title}</h3>
                <p className="text-sm text-slate-600">{r.desc}</p>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

function LearningSupport() {
  const items = [
  { icon: Video, label: "Video Library", desc: "Watch demos and tutorials", path: "/resources/videos" },
  { icon: BookOpen, label: "Tutorials", desc: "Step-by-step learning guides", path: "/resources/tutorials" },
  { icon: FileText, label: "Documentation", desc: "Complete product documentation", path: "/resources/documentation" },
  { icon: FileText, label: "Release Notes", desc: "Latest updates and changes", path: "/resources/release-notes" },
  { icon: Download, label: "Downloads", desc: "Get trials and updates", path: "/pricing/trials" },
  { icon: Headphones, label: "Support", desc: "Get help from our team", path: "/support" }];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Learning & Support</h2>
          <p className="text-lg text-slate-600">Everything you need to get started and succeed with Power Surfacing.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) =>
          <Reveal key={item.label} delay={i % 3 * 100} className="h-full">
              <Link
              to={item.path}
              className="group card-anim flex items-start gap-4 h-full bg-white border border-slate-200 rounded-xl p-5 hover:border-red-200">
                <div className="w-10 h-10 rounded-lg bg-red-50 group-hover:bg-red-600 flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:shadow-[inset_0_2px_6px_rgba(0,0,0,0.3)]">
                  <item.icon className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-0.5 group-hover:text-red-600 transition-colors">{item.label}</h3>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </Link>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

export default function Home() {
  return (
    <div>
      <PageTitle
        title="3D Reverse Engineering & Scan-to-CAD Software | nPower"
        description="Convert 3D scans, meshes, and point clouds into editable, parametric CAD models for reverse engineering, manufacturing, and part recreation."
        canonicalPath="/"
      />
      <HeroSection />
      <CapabilityCircuit />
      <ProductFamilyIntro />
      <SubDShowcase />
      <FamilyOverview />
      <ProductSelector />
      <CapabilityCards />
      <FeaturedVideo />
      <KeyWorkflows />
      <WhyPowerSurfacing />
      <LearningSupport />
      <CTASection
        title="Ready to Transform Your Workflow?"
        subtitle="Choose a product, watch demos, or download a free trial to experience Power Surfacing for yourself."
        actions={[
        { label: "Explore Products", path: "/products" },
        { label: "Watch Demos", path: "/resources/demos" },
        { label: "Download Trial", path: "/pricing/trials" }]
        } />

    </div>);

}