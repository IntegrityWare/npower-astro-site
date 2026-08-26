// Single source of truth for the / (home) page metadata.
// The home page body content is composed from its section components
// (SeoCrawlerContent, ProductFamilyIntro, CommonWorkflowsSeo, HomeFaq),
// each of which holds its own unique text.
export const HOME_CONTENT = {
  meta: {
    title: "Reverse Engineering, Scan-to-CAD & CAD Visualization Software | nPower",
    description: "Reverse engineering, scan-to-CAD, freeform Sub-D and CAD visualization software. Convert 3D scans and meshes into editable CAD, create freeform designs, and produce product visuals with bundled KeyShot.",
    canonicalPath: "/",
    index: true,
  },
  hero: {
    h1: "Power Surfacing Software for Reverse Engineering, CAD Design, Sub-D Modeling and CAD Visualization",
  },
  relatedLinks: [
    { label: "Power Surfacing Viz", path: "/products/power-surfacing-visualize" },
    { label: "Power Surfacing RE Studio", path: "/products/power-surfacing-re-studio" },
    { label: "Power Surfacing Studio", path: "/products/power-surfacing-studio" },
    { label: "Power Surfacing for SOLIDWORKS", path: "/products/power-surfacing-solidworks" },
    { label: "Power Surfacing RE for SOLIDWORKS", path: "/products/power-surfacing-re-solidworks" },
    { label: "Power Shell for SOLIDWORKS", path: "/products/power-shell-solidworks" },
  ],
};