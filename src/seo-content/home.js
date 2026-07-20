// Single source of truth for the / (home) page metadata.
// The home page body content is composed from its section components
// (SeoCrawlerContent, ProductFamilyIntro, CommonWorkflowsSeo, HomeFaq),
// each of which holds its own unique text.
export const HOME_CONTENT = {
  meta: {
    title: "3D Reverse Engineering & Scan-to-CAD Software | nPower",
    description: "Convert 3D scans, meshes and STL files into editable CAD surfaces and solids for reverse engineering, scan-to-CAD and freeform Sub-D product design.",
    canonicalPath: "/",
    index: true,
  },
  hero: {
    h1: "Power Surfacing Software for CAD Design, Sub-D Modeling and Reverse Engineering",
  },
  relatedLinks: [
    { label: "Power Surfacing RE Studio", path: "/products/power-surfacing-re-studio" },
    { label: "Power Surfacing Studio", path: "/products/power-surfacing-studio" },
    { label: "Power Surfacing for SOLIDWORKS", path: "/products/power-surfacing-solidworks" },
    { label: "Power Surfacing RE for SOLIDWORKS", path: "/products/power-surfacing-re-solidworks" },
    { label: "Power Shell for SOLIDWORKS", path: "/products/power-shell-solidworks" },
  ],
};