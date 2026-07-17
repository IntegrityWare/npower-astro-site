import { useEffect } from "react";

const DEFAULT_TITLE = "3D Reverse Engineering & Scan-to-CAD Software | nPower";
const DEFAULT_DESCRIPTION = "Convert 3D scans, meshes and STL files into editable CAD surfaces and solids for reverse engineering, scan-to-CAD and freeform Sub-D product design.";

function setMetaDescription(content) {
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", content);
}

function setCanonical(href) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function setRobots(noindex) {
  let meta = document.querySelector('meta[name="robots"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", noindex ? "noindex, nofollow" : "index, follow");
}

export default function PageTitle({ title, description, canonicalPath, noindex = false }) {
  useEffect(() => {
    document.title = title || DEFAULT_TITLE;
    setMetaDescription(description || DEFAULT_DESCRIPTION);
    setCanonical(window.location.origin + (canonicalPath || window.location.pathname));
    setRobots(noindex);
    return () => {
      document.title = DEFAULT_TITLE;
      setMetaDescription(DEFAULT_DESCRIPTION);
      setRobots(false);
    };
  }, [title, description, canonicalPath, noindex]);
  return null;
}