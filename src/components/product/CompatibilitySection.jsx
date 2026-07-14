import React from "react";
import { Link } from "react-router-dom";
import { FileInput, FileOutput, MonitorCog } from "lucide-react";

export default function CompatibilitySection({ product }) {
  const { compatibility } = product.detail;
  return (
    <section id="compatibility" className="scroll-mt-40 py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">Supported Inputs, Outputs & Requirements</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileInput className="w-5 h-5 text-red-600" />
              <h3 className="text-base font-bold text-slate-900">Supported Inputs</h3>
            </div>
            <ul className="space-y-2">
              {product.inputs.map((item) => (
                <li key={item} className="text-sm text-slate-600">• {item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileOutput className="w-5 h-5 text-red-600" />
              <h3 className="text-base font-bold text-slate-900">Outputs</h3>
            </div>
            <ul className="space-y-2">
              {product.outputs.map((item) => (
                <li key={item} className="text-sm text-slate-600">• {item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200 bg-slate-50">
            <MonitorCog className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold text-slate-900">System Requirements</h3>
          </div>
          {compatibility.requirements.map((req, i) => (
            <div key={req.label} className={`grid sm:grid-cols-[220px_1fr] gap-1 sm:gap-6 px-6 py-3.5 ${i % 2 ? "bg-slate-50" : "bg-white"}`}>
              <span className="text-sm font-semibold text-slate-900">{req.label}</span>
              <span className="text-sm text-slate-600">{req.value}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-4">
          Full details on the <Link to="/support/system-requirements" className="font-semibold text-red-600 hover:text-red-700">System Requirements</Link> page.
        </p>
      </div>
    </section>
  );
}