import React, { useState, useMemo, useEffect } from "react";
import { SAMPLE_VIDEOS, PRODUCTS } from "@/lib/siteData";
import { fetchChannelVideos, loadCachedVideos } from "@/lib/youtube";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import VideoCard from "@/components/shared/VideoCard";
import { Search, Filter, X } from "lucide-react";

const videoTypes = ["All", "Overview", "Demo", "Tutorial"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function VideoLibrary() {
  const [search, setSearch] = useState("");
  const [filterProduct, setFilterProduct] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterLevel, setFilterLevel] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  /* start from the cached channel list (instant) — fall back to the built-in list */
  const [videos, setVideos] = useState(() => loadCachedVideos() || SAMPLE_VIDEOS);

  /* auto-sync with the YouTube channel (newest first) when an API key is set.
     Pages are pushed to the UI as they arrive, and the final list is cached
     in localStorage so the next visit shows everything with zero delay. */
  useEffect(() => {
    let alive = true;
    fetchChannelVideos((partial) => {
      if (alive && partial && partial.length) setVideos(partial);
    }).then((list) => {
      if (alive && list && list.length) setVideos(list);
    });
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    return videos.filter((v) => {
      if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterProduct !== "All" && v.product !== filterProduct) return false;
      if (filterType !== "All" && v.type !== filterType) return false;
      if (filterLevel !== "All" && v.level && v.level !== filterLevel) return false;
      return true;
    });
  }, [videos, search, filterProduct, filterType, filterLevel]);

  const hasFilters = filterProduct !== "All" || filterType !== "All" || filterLevel !== "All" || search;

  return (
    <div>
      <PageTitle
        title="Video Library — Demos, Tutorials & Overviews | nPower Software"
        description="Browse demos, tutorials, and overview videos for all Power Surfacing products — searchable by product, type, and skill level."
      />
      <PageHero
        title="Video Library"
        subtitle="Browse demos, tutorials, and overview videos for all Power Surfacing products."
        breadcrumbs={[
          { label: "Resources", path: "/resources" },
          { label: "Video Library" },
        ]}
      />
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search videos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
            <div className={`${showFilters ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-3`}>
              <select value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="All">All Products</option>
                {PRODUCTS.map(p => <option key={p.id} value={p.name}>{p.shortName}</option>)}
              </select>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                {videoTypes.map(t => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
              </select>
              <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                {levels.map(l => <option key={l} value={l}>{l === "All" ? "All Levels" : l}</option>)}
              </select>
            </div>
            {hasFilters && (
              <button
                onClick={() => { setSearch(""); setFilterProduct("All"); setFilterType("All"); setFilterLevel("All"); }}
                className="flex items-center gap-1 px-3 py-2.5 text-sm text-slate-500 hover:text-slate-700"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>

          <p className="text-sm text-slate-500 mb-6">{filtered.length} video{filtered.length !== 1 ? "s" : ""} found</p>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-lg mb-2">No videos match your filters.</p>
              <p className="text-sm">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((v) => <VideoCard key={v.id} video={v} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}