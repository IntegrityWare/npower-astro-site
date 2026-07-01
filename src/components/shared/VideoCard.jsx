import React from "react";
import { Link } from "react-router-dom";
import { Play, Clock } from "lucide-react";

export default function VideoCard({ video }) {
  return (
    <Link
      to={`/resources/videos/${video.id}`}
      className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-blue-600/90 flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
          <Clock className="w-3 h-3" /> {video.duration}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{video.type}</span>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{video.level}</span>
        </div>
        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
          {video.title}
        </h3>
        <p className="text-xs text-slate-500">{video.product}</p>
      </div>
    </Link>
  );
}