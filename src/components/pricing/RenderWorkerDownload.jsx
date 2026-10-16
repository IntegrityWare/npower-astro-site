import React from 'react';
import { Download, Server } from 'lucide-react';

export default function RenderWorkerDownload() {
  return (
    <section id="render-worker" className="scroll-mt-28 mt-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Server className="w-6 h-6 text-red-600" aria-hidden="true" />
            <h3 className="text-2xl font-bold text-slate-900">Power Surfacing Render Worker</h3>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">No license required</span>
          </div>
          <p className="text-slate-600 mb-3">A free companion product for Power Surfacing Viz, Studio, and RE Studio. Install it on another Windows computer to render still images, turntables, and animations while you continue working on your main computer.</p>
          <p className="text-slate-600 mb-3">Prepare your scene and rendering settings in your Power Surfacing application, then send the job through a shared folder. The worker processes queued jobs and saves the rendered results for your application to collect. Cycles and LuxCore rendering engines and their required runtimes are included.</p>
          <p className="text-sm text-slate-600 mb-5">Free download. No registration or license key is required for the Render Worker. A Power Surfacing application is needed to submit render jobs.</p>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <a href="/Downloads/PowerSurfacing-RenderWorker-Setup-20261015-Trial.exe" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg">
              <Download className="w-4 h-4" aria-hidden="true" /> Download Render Worker for Windows
            </a>
            <p className="text-xs text-slate-500">Windows x64 · Version 1.0.2026.1015 · 516 MiB<br />Released October 15, 2026 · Signed by nPower Software</p>
          </div>
          <h4 className="font-semibold text-slate-900 mb-2">Getting started</h4>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600">
            <li>Run the installer on your rendering computer and follow its setup instructions.</li>
            <li>Select a shared queue folder that both Power Surfacing and the rendering computer can read and write.</li>
            <li>Start the worker, then select that same queue folder in Power Surfacing's remote rendering settings.</li>
          </ol>
          <p className="mt-4 text-xs text-slate-500">Updating an existing worker? Stop it after its current frames finish, close its control window, and run the new installer. <a href="/downloads/render-worker-20261015.sha256" className="underline hover:text-slate-700">SHA-256 checksum</a></p>
        </div>
    </section>
  );
}
