import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileInput, FileOutput, CheckCircle } from "lucide-react";

export default function ProductSelectionCard({ product }) {
  return (
    <div className="group card-anim bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
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
        <div className="mt-auto pt-1 flex flex-wrap items-center gap-2.5">
          <Link
            to={product.path}
            className="btn-anim group/btn inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
          >
            Learn More <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
          <Link
            to="/pricing/plans"
            className="btn-anim inline-flex items-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:border-red-400 hover:text-red-600 rounded-lg"
          >
            Pricing
          </Link>
          <Link
            to="/pricing/trials"
            className="btn-anim inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-lg"
          >
            Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
}