export const DOWNLOAD_CHOICES = [
  {
    id: "studio",
    label: "Standalone Studio Products",
    title: "Standalone Studio Downloads",
    path: "/pricing/downloads/studio/",
    trialPath: "/pricing/trials/studio/",
    guidePath: "/support/viz-beta/",
    description: "Download Power Surfacing VIZ, Render Worker, and Render Monitor. Power Surfacing Studio and RE Studio are coming soon. No SOLIDWORKS installation is required.",
    anchors: ["standalone", "visualize", "studio", "re-studio", "render-worker", "render-monitor"],
  },
  {
    id: "solidworks",
    label: "SOLIDWORKS Products",
    title: "SOLIDWORKS Product Downloads",
    path: "/pricing/downloads/solidworks/",
    trialPath: "/pricing/trials/solidworks/",
    guidePath: "/support/installation/",
    description: "Download Power Surfacing, Power Surfacing RE, and Power Shell add-ins for your version of SOLIDWORKS, plus documentation and learning resources.",
    anchors: ["solidworks", "power-surfacing", "power-shell", "documentation"],
  },
];

// Preserve bookmarks from the former combined downloads page.
export function legacyDownloadDestination(hash) {
  const anchor = hash.replace(/^#/, "");
  const choice = DOWNLOAD_CHOICES.find(item => item.anchors.includes(anchor));
  return choice ? choice.path + "#" + anchor : null;
}
