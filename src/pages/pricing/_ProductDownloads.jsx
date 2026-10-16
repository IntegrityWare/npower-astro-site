import React, { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/link";
import PageHero from "@/components/shared/PageHero";
import RenderWorkerDownload from "@/components/pricing/RenderWorkerDownload";
import PageTitle from "@/components/shared/PageTitle";
import {
  DOWNLOAD_DOCS,
  DOWNLOAD_PAGE_META,
  POWER_SHELL_INSTALLERS,
  POWER_SURFACING_INSTALLERS,
  STANDALONE_DOWNLOADS,
} from "@/lib/productDownloads";
import {
  AlertTriangle,
  ChevronDown,
  Download,
  ExternalLink,
  Key,
  BookOpen,
  Clock,
} from "lucide-react";

function InstallerTable({ rows }) {
  if (!rows?.length) return null;
  return (
    <div className="overflow-x-auto border border-slate-200 rounded-xl">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">SOLIDWORKS</th>
            <th className="px-4 py-3 font-semibold">Release</th>
            <th className="px-4 py-3 font-semibold">Installer</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={`${row.version}-${row.solidworks}-${row.url}`} className="bg-white">
              <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">SW {row.solidworks}</td>
              <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{row.version}</td>
              <td className="px-4 py-3">
                <a
                  href={row.url}
                  className="inline-flex items-center gap-1.5 font-semibold text-red-600 hover:text-red-700"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  {row.label}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VersionGroup({ family }) {
  const [showPrevious, setShowPrevious] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  return (
    <section id={family.anchor} className="scroll-mt-28 mb-14">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{family.title}</h2>
          <p className="text-sm text-slate-600 mt-1">
            Current release <span className="font-semibold text-slate-900">{family.currentRelease}</span>
            {family.releasedOn && <> · Released {family.releasedOn}</>}
            {family.lastUpdated && <> · Updated {family.lastUpdated}</>}
          </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-red-700 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
          Current
        </span>
      </div>

      {family.notes?.length > 0 && (
        <ul className="mb-5 space-y-1.5 text-sm text-slate-600">
          {family.notes.map((note) => (
            <li key={note} className="flex gap-2">
              <span className="text-red-500 mt-1.5 shrink-0">•</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      )}

      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
        Current versions — pick your SOLIDWORKS year
      </h3>
      <InstallerTable rows={family.current} />

      {family.previous?.length > 0 && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowPrevious((v) => !v)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-red-600"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showPrevious ? "rotate-180" : ""}`} />
            Previous versions ({family.previous.length})
          </button>
          {showPrevious && (
            <div className="mt-3">
              <InstallerTable rows={family.previous} />
            </div>
          )}
        </div>
      )}

      {family.archive?.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowArchive((v) => !v)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-red-600"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showArchive ? "rotate-180" : ""}`} />
            Older archive builds ({family.archive.length})
          </button>
          {showArchive && (
            <div className="mt-3">
              <InstallerTable rows={family.archive} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function StandaloneCard({ item }) {
  return (
    <div id={item.anchor} className="scroll-mt-28 border border-dashed border-slate-300 rounded-xl p-5 bg-slate-50">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
        <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
          <Clock className="w-3.5 h-3.5" /> Coming soon
        </span>
      </div>
      <p className="text-sm text-slate-600 mb-4">{item.summary}</p>
      {item.url ? (
        <a
          href={item.url}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
        >
          <Download className="w-4 h-4" /> Download
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-400 bg-slate-200 rounded-lg cursor-not-allowed"
        >
          <Download className="w-4 h-4" /> Coming soon
        </button>
      )}
    </div>
  );
}

export default function ProductDownloads() {
  const families = useMemo(() => [POWER_SURFACING_INSTALLERS, POWER_SHELL_INSTALLERS], []);
  const [filter, setFilter] = useState("all");
  const chooseFilter = (value) => {
    setFilter(value);
    const anchor = value === "all" ? "power-surfacing" : value;
    window.history.replaceState(null, "", "#" + anchor);
  };

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      setFilter(hash === "render-worker" ? "render-worker" :
        ["standalone", "visualize", "studio", "re-studio"].includes(hash) ? "standalone" : "all");
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [filter]);

  return (
    <div>
      <PageTitle title={`${DOWNLOAD_PAGE_META.title} | nPower Software`} description={DOWNLOAD_PAGE_META.description} />
      <PageHero
        title="Product Downloads"
        subtitle="Download the free Render Worker and current Power Surfacing, Power Surfacing RE, and Power Shell installers for SOLIDWORKS."
        breadcrumbs={[
          { label: "Pricing & Licensing", path: "/pricing" },
          { label: "Downloads" },
        ]}
        actions={[
          { label: "Free Trial Registration", path: "/pricing/trials" },
          { label: "Installation Guide", path: "/support/installation" },
        ]}
      />

      <section className="py-6 bg-white border-b border-slate-100" aria-label="Download categories">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-2">
          {[
            { id: "all", label: "All SOLIDWORKS products" },
            { id: "standalone", label: "All Power Surfacing Studio Products" },
            { id: "render-worker", label: "Render Worker" },
          ].map((opt) => (
            <button key={opt.id} type="button" aria-pressed={filter === opt.id}
              onClick={() => chooseFilter(opt.id)}
              className={`px-4 py-2.5 text-sm font-semibold rounded-lg border transition-colors ${filter === opt.id
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-slate-700 border-slate-200 hover:border-red-200"}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {filter === "render-worker" && <RenderWorkerDownload />}

      {filter === "all" && <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
            <Key className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-semibold text-red-900 mb-1">SOLIDWORKS product downloads</p>
              <p>
                The SOLIDWORKS installers below are for licensed customers and authorized installers. For a free trial, you must{" "}
                <Link to="/pricing/trials" className="underline font-semibold">
                  register on the trial page
                </Link>{" "}
                first — trial download links are provided only after registration.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-semibold mb-1">Run as Administrator</p>
              <p>
                Run the installer as Administrator. The first time you launch SOLIDWORKS after installing, also run{" "}
                <code className="text-xs bg-amber-100 px-1 rounded">SLDWorks.exe</code> as Administrator (right-click → Run as administrator).
              </p>
            </div>
          </div>
        </div>
      </section>}

      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {filter === "standalone" && <section id="standalone" className="scroll-mt-28 mb-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Power Surfacing Studio Products</h2>
            <p className="text-sm text-slate-600 mb-6">
              Choose Power Surfacing Viz, Studio, or RE Studio. Download links will appear here as each product becomes available.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {STANDALONE_DOWNLOADS.map((item) => (
                <StandaloneCard key={item.productId} item={item} />
              ))}
            </div>
          </section>}

          {filter === "all" && families.map((family) => (
            <VersionGroup key={family.anchor} family={family} />
          ))}

          <section id="documentation" className="scroll-mt-28 mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Documentation & learning</h2>
            <ul className="space-y-3 mb-6">
              {DOWNLOAD_DOCS.map((doc) => (
                <li key={doc.label}>
                  {doc.internalPath ? (
                    <Link to={doc.internalPath} className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700">
                      <BookOpen className="w-4 h-4" /> {doc.label}
                    </Link>
                  ) : (
                    <a href={doc.url} className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700" target="_blank" rel="noopener noreferrer">
                      <BookOpen className="w-4 h-4" /> {doc.label}
                    </a>
                  )}
                </li>
              ))}
              <li>
                <a
                  href={DOWNLOAD_PAGE_META.gettingStartedVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  <ExternalLink className="w-4 h-4" /> Getting Started video
                </a>
              </li>
              <li>
                <Link to="/resources/videos" className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700">
                  <BookOpen className="w-4 h-4" /> Video library
                </Link>
              </li>
            </ul>
            <p className="text-sm text-slate-600">
              Support:{" "}
              <a href={`mailto:${DOWNLOAD_PAGE_META.supportEmail}`} className="text-red-600 font-medium">
                {DOWNLOAD_PAGE_META.supportEmail}
              </a>{" "}
              · {DOWNLOAD_PAGE_META.supportPhone}
            </p>
          </section>

          <p className="text-xs text-slate-500">
            Installer catalog sourced from{" "}
            <a href={DOWNLOAD_PAGE_META.legacyUrl} target="_blank" rel="noopener noreferrer" className="underline">
              npowersoftware.com/NewDownloadingPowerSurfacing.html
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
