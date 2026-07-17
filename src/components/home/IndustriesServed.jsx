import React from "react";
import { BadgeCheck } from "lucide-react";

const INDUSTRIES = [
  "Industrial and product design",
  "Consumer products",
  "Automotive and transportation",
  "Medical devices and prosthetics",
  "Manufacturing and tooling",
  "3D scanning and reverse engineering",
  "Concept development and visualization",
];

export default function IndustriesServed() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">Industries Served</h2>
        <p className="text-lg text-slate-600 text-center mb-10">
          Power Surfacing software is designed for industrial designers, mechanical engineers, reverse-engineering specialists and manufacturers working with complex product geometry.
        </p>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 max-w-2xl mx-auto">
          {INDUSTRIES.map((item) => (
            <li key={item} className="flex items-center gap-3 text-slate-700">
              <BadgeCheck className="w-5 h-5 text-red-600 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}