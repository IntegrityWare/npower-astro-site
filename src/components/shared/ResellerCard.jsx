import React from "react";
import { Globe, Mail, Phone } from "lucide-react";

export default function ResellerCard({ reseller }) {
  return (
    <div className="card-anim bg-slate-50 border border-slate-200 rounded-xl p-5">
      <h4 className="text-sm font-bold text-slate-900 mb-2">{reseller.name}</h4>
      <div className="space-y-1.5">
        {reseller.website && (
          <a href={reseller.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 break-all">
            <Globe className="w-3.5 h-3.5 shrink-0" />
            {reseller.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
          </a>
        )}
        {reseller.email && (
          <a href={`mailto:${reseller.email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 break-all">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            {reseller.email}
          </a>
        )}
        {reseller.phone && (
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            {reseller.phone}
          </span>
        )}
      </div>
    </div>
  );
}