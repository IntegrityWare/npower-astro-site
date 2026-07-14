import React from "react";
import { Target } from "lucide-react";

export default function ProblemSection({ problem }) {
  return (
    <section id="overview" className="scroll-mt-40 py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">What Problem Does It Solve?</h2>
        </div>
        <div className="space-y-5">
          {problem.paragraphs.map((p, i) => (
            <p key={i} className="text-slate-600 leading-relaxed">{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}