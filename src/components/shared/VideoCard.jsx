import React from "react";
import { Link } from '@/lib/link';
import { Play, Clock } from "lucide-react";

export default function VideoCard({ video }) {
  const inner = (
    <>
      <div className="relative aspect-video overflow-hidden bg-slate-100 rounded-t-2xl">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          </div>
        </div>
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" /> {video.duration}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {video.type && <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{video.type}</span>}
          {video.level && <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{video.level}</span>}
        </div>
        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-red-600 transition-colors mb-1 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-xs text-slate-500">{video.product}</p>
      </div>
    </>
  );

  const cls = "group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300";

  if (video.external) {
    return (
      <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={`/resources/videos/${video.id}`} className={cls}>
      {inner}
    </Link>
  );
}
