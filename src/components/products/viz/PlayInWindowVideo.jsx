import { Play } from "lucide-react";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
  ));
}

export function openVideoWindow({ src, title, endSeconds }) {
  const absolute = new URL(src, window.location.origin).href;
  const win = window.open("", "_blank", "popup=yes,width=1280,height=800,resizable=yes");
  if (!win) {
    window.open(absolute, "_blank", "noopener");
    return;
  }

  const end = Number(endSeconds);
  const endScript = Number.isFinite(end)
    ? `<script>const v=document.querySelector("video");v.addEventListener("timeupdate",()=>{if(v.currentTime>=${end}){v.pause();if(v.currentTime!==${end})v.currentTime=${end};}});</script>`
    : "";

  win.document.open();
  win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  html, body { margin: 0; height: 100%; background: #0f172a; }
  video { width: 100%; height: 100%; object-fit: contain; background: #0f172a; }
</style>
</head>
<body>
<video src="${escapeHtml(absolute)}" controls autoplay playsinline></video>
${endScript}
</body>
</html>`);
  win.document.close();
}

export default function PlayInWindowVideo({ src, title, poster, endSeconds, frameClassName = "aspect-video" }) {
  function open() {
    openVideoWindow({ src, title, endSeconds });
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`group relative block w-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white ${frameClassName}`}
      aria-label={`Play ${title}`}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      }}
    >
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        preload="metadata"
        muted
        playsInline
        poster={poster}
        src={poster ? undefined : src}
        tabIndex={-1}
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/15 transition group-hover:bg-slate-950/25">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg">
          <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
        </span>
      </span>
    </div>
  );
}
