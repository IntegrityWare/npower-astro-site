import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileInput, FileOutput, CheckCircle } from "lucide-react";

export default function ProductSelectionCard({ product }) {
  return (
    <div className="group card-anim bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:border-slate-300">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="relative w-full h-full object-contain px-8 pt-6 pb-10 transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:-rotate-[1.5deg] group-hover:-translate-y-2.5"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <span className="self-start text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full mb-2">{product.platform}</span>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{product.name}</h3>
        <p className="text-sm text-slate-600 mb-4">{product.tagline}</p>
        <ul className="space-y-1.5 mb-4">
          {product.useCases.slice(0, 3).map((uc) => (
            <li key={uc} className="flex items-start gap-2 text-sm text-slate-600">
              <CheckCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> {uc}
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-2 gap-3 text-xs mb-5">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="flex items-center gap-1.5 font-semibold text-slate-900 mb-1"><FileInput className="w-3.5 h-3.5 text-red-600" /> Inputs</p>
            <p className="text-slate-600">{product.inputs.join(", ")}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="flex items-center gap-1.5 font-semibold text-slate-900 mb-1"><FileOutput className="w-3.5 h-3.5 text-red-600" /> Outputs</p>
            <p className="text-slate-600">{product.outputs.join(", ")}</p>
          </div>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold">
          <Link to={product.path} className="inline-flex items-center gap-1 text-red-600 hover:text-red-700">Learn More <ArrowRight className="w-4 h-4" /></Link>
          <Link to="/pricing/plans" className="text-slate-600 hover:text-slate-900">Pricing</Link>
          <Link to="/pricing/trials" className="text-slate-600 hover:text-slate-900">Free Trial</Link>
        </div>
      </div>
    </div>
  );
}