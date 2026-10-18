import React from 'react';
import { Download } from 'lucide-react';

export default function RenderWorkerDownload() {
  return (
    <section id="render-worker" className="scroll-mt-28 border border-slate-200 rounded-xl p-5 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h3 className="text-lg font-bold text-slate-900">Power Surfacing Render Worker</h3>
        <span className="text-xs font-semibold uppercase tracking-wide text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">Free</span>
      </div>
      <div className="text-sm text-slate-600 mb-4">
        <p>A free companion product for Power Surfacing Viz, Studio, and RE Studio.</p>
        <p>Render images and animations in batch mode on this computer or a different one.</p>
      </div>
      <p className="text-xs text-slate-500 mb-4">Windows x64 · Version 1.0.2026.1017 · 516 MiB<br />No registration or license required</p>
      <a href="/Downloads/PowerSurfacing-RenderWorker-Setup-20261017.exe" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg">
        <Download className="w-4 h-4" aria-hidden="true" /> Download Render Worker for Windows
      </a>
      <p className="mt-3 text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-2">
        <a href="/products/power-surfacing-render-worker/" className="font-semibold text-red-600 underline hover:text-red-700">About Render Worker</a>
        <a href="/downloads/render-worker-20261017.sha256" className="underline hover:text-slate-700">SHA-256 checksum</a>
      </p>
    </section>
  );
}
