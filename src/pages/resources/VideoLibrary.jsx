import React, { useState, useMemo } from "react";
import { SAMPLE_VIDEOS, PRODUCTS } from "@/lib/siteData";
import PageHero from "@/components/shared/PageHero";
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

  const filtered = useMemo(() => {
    return SAMPLE_VIDEOS.filter((v) => {
      if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterProduct !== "All" && v.product !== filterProduct) return false;
      if (filterType !== "All" && v.type !== filterType) return false;
      if (filterLevel !== "All" && v.level !== filterLevel) return false;
      return true;
    });
  }, [search, filterProduct, filterType, filterLevel]);

  const hasFilters = filterProduct !== "All" || filterType !== "All" || filterLevel !== "All" || search;

  return (
    <div>
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
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
            <div className={`${showFilters ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-3`}>
              <select value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="All">All Products</option>
                {PRODUCTS.map(p => <option key={p.id} value={p.name}>{p.shortName}</option>)}
              </select>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {videoTypes.map(t => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
              </select>
              <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
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