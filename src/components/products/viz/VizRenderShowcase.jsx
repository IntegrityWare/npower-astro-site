import React from "react";

/* Material swatches echo the Viz materials library (steel, matte, copper, carbon, satin, chrome). */
const SWATCHES = [
  "radial-gradient(circle at 32% 28%, #f8fafc, #94a3b8 45%, #334155 100%)",
  "radial-gradient(circle at 32% 28%, #52525b, #18181b 60%, #09090b 100%)",
  "radial-gradient(circle at 32% 28%, #fdba74, #c2410c 55%, #431407 100%)",
  "repeating-linear-gradient(45deg, #27272a 0 3px, #3f3f46 3px 6px)",
  "radial-gradient(circle at 32% 28%, #e11d2e, #991b1b 55%, #3f0a0a 100%)",
  "radial-gradient(circle at 32% 28%, #ffffff, #d4d4d8 40%, #71717a 100%)",
];

/**
 * Hero media for Power Surfacing Viz: a looping KeyShot render presented
 * inside a "render viewport" frame. Pure HTML/CSS so it works in static output.
 */
export default function VizRenderShowcase() {
  return (
    <div className="viz-stage relative mx-auto w-full max-w-[640px]">
      {/* ambient glow */}
      <div aria-hidden="true" className="absolute -inset-10 rounded-[48px] bg-[radial-gradient(ellipse_at_center,rgba(225,29,46,0.22),transparent_65%)] blur-2xl" />

      <div className="viz-tilt relative">
        <div className="relative rounded-2xl border border-white/10 bg-neutral-900/80 p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
          {/* viewport header */}
          <div className="flex items-center justify-between px-2.5 pt-1 pb-2.5 text-[11px] font-medium tracking-wide">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="viz-live relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              <span className="uppercase tracking-[0.2em]">Live Render</span>
            </span>
            <span className="font-mono text-slate-500">1920 × 1080</span>
          </div>

          {/* render canvas */}
          <div className="relative aspect-video overflow-hidden rounded-xl bg-[radial-gradient(ellipse_at_50%_40%,#ffffff,#e9ecef_70%,#d4d8dd)]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/assets/viz-shaver-render.mp4"
              poster="/assets/viz-shaver-render-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Exploded product render of an electric shaver created with Power Surfacing Viz and bundled KeyShot"
            />
            {/* light sweep */}
            <div aria-hidden="true" className="viz-sweep pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            {/* viewfinder corners */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-3">
              <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-red-500/80 rounded-tl" />
              <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-red-500/80 rounded-tr" />
              <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-red-500/80 rounded-bl" />
              <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-red-500/80 rounded-br" />
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10" />
          </div>

          {/* materials strip */}
          <div className="flex items-center gap-3 px-2.5 pt-2.5 pb-1">
            <div className="flex items-center gap-1.5">
              {SWATCHES.map((bg, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="h-4 w-4 rounded-full ring-1 ring-white/15 shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
                  style={{ background: bg }}
                />
              ))}
            </div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Materials</span>
          </div>
        </div>

      </div>
    </div>
  );
}
