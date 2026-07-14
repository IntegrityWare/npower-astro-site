import React from "react";
import { Award, Check, X } from "lucide-react";

export default function ExamplesSection({ detail }) {
  return (
    <section id="examples" className="scroll-mt-40 py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">Real-World Results</h2>

        {detail.examples && (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {detail.examples.map((ex) => (
              <div key={ex.title} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <Award className="w-5 h-5 text-red-600 mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-2">{ex.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{ex.description}</p>
              </div>
            ))}
          </div>
        )}

        {detail.benchmark && (
          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{detail.benchmark.title}</h3>
            <p className="text-sm text-slate-600 mb-5">{detail.benchmark.subtitle}</p>
            <div className="border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-5 py-3 font-semibold text-slate-900">Model</th>
                    <th className="px-5 py-3 font-semibold text-slate-900">SOLIDWORKS Shell</th>
                    <th className="px-5 py-3 font-semibold text-slate-900">Power Shell</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.benchmark.rows.map((row, i) => (
                    <tr key={row.model} className={i % 2 ? "bg-slate-50" : "bg-white"}>
                      <td className="px-5 py-3 font-medium text-slate-900">{row.model}</td>
                      <td className="px-5 py-3 text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          {row.swSucceeds ? <Check className="w-4 h-4 text-slate-400" /> : <X className="w-4 h-4 text-red-500" />}
                          {row.sw}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-700">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <Check className="w-4 h-4 text-green-600" /> {row.ps}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {detail.industries && (
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-5">Industries Served</h3>
            <div className="flex flex-wrap gap-2">
              {detail.industries.map((ind) => (
                <span key={ind} className="text-sm text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">{ind}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}