import React from 'react';
import { Download } from 'lucide-react';
import { RENDER_MONITOR_DOWNLOAD_URL } from '../../lib/productDownloads';

export default function RenderMonitorDownload() {
  return (
    <section id="render-monitor" className="scroll-mt-28 border border-slate-200 rounded-xl p-5 bg-white">
      <h3 className="text-lg font-bold text-slate-900 mb-2">Power Surfacing Render Monitor</h3>
      <p className="text-sm text-slate-600 mb-4">Track render progress and collect results from your Power Surfacing render jobs.</p>
      <p className="text-xs text-slate-500 mb-4">Windows x64 · Version 1.0.2026.1028 · 209 MiB<br />Released October 28, 2026 · Signed by nPower Software</p>
      <a href={RENDER_MONITOR_DOWNLOAD_URL} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg">
        <Download className="w-4 h-4" aria-hidden="true" /> Download Render Monitor for Windows
      </a>
      <p className="mt-3 text-xs text-slate-500">
        <a href="/downloads/render-monitor-20261028.sha256" className="underline hover:text-slate-700">SHA-256 checksum</a>
      </p>
    </section>
  );
}
