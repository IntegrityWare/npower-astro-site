/**
 * Product installer catalog mirrored from
 * https://www.npowersoftware.com/NewDownloadingPowerSurfacing.html
 */

const BASE = "https://www.npowersoftware.com";

function swUrl(relativeOrAbsolute) {
  if (/^https?:\/\//i.test(relativeOrAbsolute)) return relativeOrAbsolute;
  return `${BASE}/${relativeOrAbsolute.replace(/^\//, "")}`;
}

/** @typedef {{ solidworks: string, version: string, label: string, url: string, current?: boolean }} InstallerRow */

/** Power Surfacing / Power Surfacing RE — shared SOLIDWORKS installer family */
export const POWER_SURFACING_INSTALLERS = {
  productIds: ["power-surfacing-solidworks", "power-surfacing-re-solidworks"],
  title: "Power Surfacing & Power Surfacing RE for SOLIDWORKS",
  anchor: "power-surfacing",
  currentRelease: "11.0",
  releasedOn: "February 6, 2026",
  lastUpdated: "May 6, 2026",
  notes: [
    "Release 11.0 supports SOLIDWORKS 2026. Use the installer that matches your SOLIDWORKS year.",
    "Power Surfacing RE is an extension of Power Surfacing Standard — the installer includes tools from both products.",
    "Power Shell is also included in both Power Surfacing and Power Surfacing RE.",
  ],
  current: [
    { solidworks: "2026", version: "11.0", label: "Power Surfacing 11.0 for SOLIDWORKS 2026", url: swUrl("SolidWorks/PowerSurfacing_11_0_SW2026.exe"), current: true },
    { solidworks: "2025", version: "11.0", label: "Power Surfacing 11.0 for SOLIDWORKS 2025", url: swUrl("SolidWorks/PowerSurfacing_11_0_SW2025.exe"), current: true },
    { solidworks: "2024", version: "11.0", label: "Power Surfacing 11.0 for SOLIDWORKS 2024", url: swUrl("SolidWorks/PowerSurfacing_11_0_SW2024.exe"), current: true },
    { solidworks: "2023", version: "11.0", label: "Power Surfacing 11.0 for SOLIDWORKS 2023", url: swUrl("SolidWorks/PowerSurfacing_11_0_SW2023.exe"), current: true },
  ],
  previous: [
    { solidworks: "2025", version: "10.0", label: "Power Surfacing 10.0 for SOLIDWORKS 2025", url: swUrl("SolidWorks/PowerSurfacing_10_0_SW2025.exe") },
    { solidworks: "2024", version: "10.0", label: "Power Surfacing 10.0 for SOLIDWORKS 2024", url: swUrl("SolidWorks/PowerSurfacing_10_0_SW2024.exe") },
    { solidworks: "2023", version: "10.0", label: "Power Surfacing 10.0 for SOLIDWORKS 2023", url: swUrl("SolidWorks/PowerSurfacing_10_0_SW2023.exe") },
    { solidworks: "2022", version: "10.0", label: "Power Surfacing 10.0 for SOLIDWORKS 2022", url: swUrl("SolidWorks/PowerSurfacing_10_0_SW2022.exe") },
    { solidworks: "2021", version: "10.0", label: "Power Surfacing 10.0 for SOLIDWORKS 2021", url: swUrl("SolidWorks/PowerSurfacing_10_0_SW2021.exe") },
    { solidworks: "2020", version: "10.0", label: "Power Surfacing 10.0 for SOLIDWORKS 2020", url: swUrl("SolidWorks/PowerSurfacing_10_0_SW2020.exe") },
    { solidworks: "2024", version: "9.0", label: "Power Surfacing 9.0 for SOLIDWORKS 2024", url: swUrl("SolidWorks/PowerSurfacing_9_0_SW2024.exe") },
    { solidworks: "2023", version: "8.0", label: "Power Surfacing 8.0 for SOLIDWORKS 2023", url: swUrl("SolidWorks/PowerSurfacing_8_0_SW2023.exe") },
    { solidworks: "2022", version: "8.0", label: "Power Surfacing 8.0 for SOLIDWORKS 2022", url: swUrl("SolidWorks/PowerSurfacing_8_0_SW2022.exe") },
    { solidworks: "2021", version: "8.0", label: "Power Surfacing 8.0 for SOLIDWORKS 2021", url: swUrl("SolidWorks/PowerSurfacing_8_0_SW2021.exe") },
    { solidworks: "2020", version: "8.0", label: "Power Surfacing 8.0 for SOLIDWORKS 2020", url: swUrl("SolidWorks/PowerSurfacing_8_0_SW2020.exe") },
    { solidworks: "2022", version: "7.0", label: "Power Surfacing 7.0 for SOLIDWORKS 2022", url: swUrl("SolidWorks/PowerSurfacing_7_0_SW2022.exe") },
    { solidworks: "2021", version: "7.0", label: "Power Surfacing 7.0 for SOLIDWORKS 2021", url: swUrl("SolidWorks/PowerSurfacing_7_0_SW2021.exe") },
    { solidworks: "2020", version: "7.0", label: "Power Surfacing 7.0 for SOLIDWORKS 2020", url: swUrl("SolidWorks/PowerSurfacing_7_0_SW2020.exe") },
    { solidworks: "2019", version: "7.0", label: "Power Surfacing 7.0 for SOLIDWORKS 2019", url: swUrl("SolidWorks/PowerSurfacing_7_0_SW2019.exe") },
    { solidworks: "2018", version: "7.0", label: "Power Surfacing 7.0 for SOLIDWORKS 2018", url: swUrl("SolidWorks/PowerSurfacing_7_0_SW2018.exe") },
    { solidworks: "2021", version: "6.1", label: "Power Surfacing 6.1 for SOLIDWORKS 2021", url: swUrl("SolidWorks/PowerSurfacing_6_1_SW2021.exe") },
    { solidworks: "2020", version: "6.1", label: "Power Surfacing 6.1 for SOLIDWORKS 2020", url: swUrl("SolidWorks/PowerSurfacing_6_1_SW2020.exe") },
    { solidworks: "2019", version: "6.1", label: "Power Surfacing 6.1 for SOLIDWORKS 2019", url: swUrl("SolidWorks/PowerSurfacing_6_1_SW2019.exe") },
    { solidworks: "2018", version: "6.1", label: "Power Surfacing 6.1 for SOLIDWORKS 2018", url: swUrl("SolidWorks/PowerSurfacing_6_1_SW2018.exe") },
    { solidworks: "2017", version: "6.1", label: "Power Surfacing 6.1 for SOLIDWORKS 2017", url: swUrl("SolidWorks/PowerSurfacing_6_1_SW2017.exe") },
    { solidworks: "2016", version: "6.1", label: "Power Surfacing 6.1 for SOLIDWORKS 2016", url: swUrl("SolidWorks/PowerSurfacing_6_1_SW2016.exe") },
  ],
  archive: [
    { solidworks: "2019", version: "5.1", label: "Power Surfacing 5.1 for SOLIDWORKS 2019", url: swUrl("SolidWorks/PowerSurfacing_5_1_SW2019_x64.exe") },
    { solidworks: "2018", version: "5.1", label: "Power Surfacing 5.1 for SOLIDWORKS 2018", url: swUrl("SolidWorks/PowerSurfacing_5_1_SW2018_x64.exe") },
    { solidworks: "2017", version: "5.1", label: "Power Surfacing 5.1 for SOLIDWORKS 2017", url: swUrl("SolidWorks/PowerSurfacing_5_1_SW2017_x64.exe") },
    { solidworks: "2016", version: "5.1", label: "Power Surfacing 5.1 for SOLIDWORKS 2016", url: swUrl("SolidWorks/PowerSurfacing_5_1_SW2016_x64.exe") },
    { solidworks: "2018", version: "4.2", label: "Power Surfacing 4.2 for SOLIDWORKS 2018", url: swUrl("SolidWorks/PowerSurfacing_4_2_6_SW2018_x64.exe") },
    { solidworks: "2017", version: "4.2", label: "Power Surfacing 4.2 for SOLIDWORKS 2017", url: swUrl("SolidWorks/PowerSurfacing_4_2_6_SW2017_x64.exe") },
    { solidworks: "2016", version: "4.2", label: "Power Surfacing 4.2 for SOLIDWORKS 2016", url: swUrl("SolidWorks/PowerSurfacing_4_2_6_SW2016_x64.exe") },
    { solidworks: "2015", version: "4.2", label: "Power Surfacing 4.2 for SOLIDWORKS 2015", url: swUrl("SolidWorks/PowerSurfacing_4_2_6_SW2015_x64.exe") },
    { solidworks: "2017", version: "3.0", label: "Power Surfacing 3.0 for SOLIDWORKS 2017", url: swUrl("SolidWorks/PowerSurfacing_v3-11-0075_SW2017_x64.exe") },
    { solidworks: "2016", version: "3.0", label: "Power Surfacing 3.0 for SOLIDWORKS 2016", url: swUrl("SolidWorks/PowerSurfacing_v3-11-0075_SW2016_x64.exe") },
    { solidworks: "2014", version: "2.4", label: "Power Surfacing 2.4 for SOLIDWORKS 2014", url: swUrl("SolidWorks/PowerSurfacing_v2-40-0075_SW2014_x64.exe") },
    { solidworks: "2013", version: "2.4", label: "Power Surfacing 2.4 for SOLIDWORKS 2013", url: swUrl("SolidWorks/PowerSurfacing_v2-40-0075_SW2013_x64.exe") },
    { solidworks: "2012", version: "2.4", label: "Power Surfacing 2.4 for SOLIDWORKS 2012", url: swUrl("SolidWorks/PowerSurfacing_v2-40-0075_SW2012_x64.exe") },
  ],
};

export const POWER_SHELL_INSTALLERS = {
  productIds: ["power-shell-solidworks"],
  title: "Power Shell for SOLIDWORKS",
  anchor: "power-shell",
  currentRelease: "5.0",
  notes: [
    "Download Power Shell only if you licensed Power Shell separately. Power Surfacing and Power Surfacing RE already include Power Shell.",
  ],
  current: [
    { solidworks: "2026", version: "5.0", label: "Power Shell 5.0 for SOLIDWORKS 2026", url: swUrl("SolidWorks/PowerShelling_5_0_SW2026.exe"), current: true },
    { solidworks: "2025", version: "5.0", label: "Power Shell 5.0 for SOLIDWORKS 2025", url: swUrl("SolidWorks/PowerShelling_5_0_SW2025.exe"), current: true },
    { solidworks: "2024", version: "5.0", label: "Power Shell 5.0 for SOLIDWORKS 2024", url: swUrl("SolidWorks/PowerShelling_5_0_SW2024.exe"), current: true },
    { solidworks: "2023", version: "5.0", label: "Power Shell 5.0 for SOLIDWORKS 2023", url: swUrl("SolidWorks/PowerShelling_5_0_SW2023.exe"), current: true },
  ],
  previous: [
    { solidworks: "2025", version: "4.0", label: "Power Shell 4.0 for SOLIDWORKS 2025", url: swUrl("SolidWorks/PowerShelling_4_0_SW2025.exe") },
    { solidworks: "2024", version: "4.0", label: "Power Shell 4.0 for SOLIDWORKS 2024", url: swUrl("SolidWorks/PowerShelling_4_0_SW2024.exe") },
    { solidworks: "2023", version: "4.0", label: "Power Shell 4.0 for SOLIDWORKS 2023", url: swUrl("SolidWorks/PowerShelling_4_0_SW2023.exe") },
    { solidworks: "2022", version: "4.0", label: "Power Shell 4.0 for SOLIDWORKS 2022", url: swUrl("SolidWorks/PowerShelling_4_0_SW2022.exe") },
    { solidworks: "2021", version: "4.0", label: "Power Shell 4.0 for SOLIDWORKS 2021", url: swUrl("SolidWorks/PowerShelling_4_0_SW2021.exe") },
    { solidworks: "2024", version: "3.0", label: "Power Shell 3.0 for SOLIDWORKS 2024", url: swUrl("SolidWorks/PowerShelling_3_0_SW2024.exe") },
    { solidworks: "2023", version: "2.0", label: "Power Shell 2.0 for SOLIDWORKS 2023", url: swUrl("SolidWorks/PowerShelling_2_0_SW2023.exe") },
    { solidworks: "2022", version: "2.0", label: "Power Shell 2.0 for SOLIDWORKS 2022", url: swUrl("SolidWorks/PowerShelling_2_0_SW2022.exe") },
    { solidworks: "2021", version: "2.0", label: "Power Shell 2.0 for SOLIDWORKS 2021", url: swUrl("SolidWorks/PowerShelling_2_0_SW2021.exe") },
    { solidworks: "2020", version: "2.0", label: "Power Shell 2.0 for SOLIDWORKS 2020", url: swUrl("SolidWorks/PowerShelling_2_0_SW2020.exe") },
    { solidworks: "2019", version: "2.0", label: "Power Shell 2.0 for SOLIDWORKS 2019", url: swUrl("SolidWorks/PowerShelling_2_0_SW2019.exe") },
    { solidworks: "2018", version: "2.0", label: "Power Shell 2.0 for SOLIDWORKS 2018", url: swUrl("SolidWorks/PowerShelling_2_0_SW2018.exe") },
    { solidworks: "2021", version: "1.0", label: "Power Shell 1.0 for SOLIDWORKS 2021", url: swUrl("SolidWorks/PowerShelling_1_0_SW2021.exe") },
    { solidworks: "2020", version: "1.0", label: "Power Shell 1.0 for SOLIDWORKS 2020", url: swUrl("SolidWorks/PowerShelling_1_0_SW2020.exe") },
    { solidworks: "2019", version: "1.0", label: "Power Shell 1.0 for SOLIDWORKS 2019", url: swUrl("SolidWorks/PowerShelling_1_0_SW2019.exe") },
    { solidworks: "2018", version: "1.0", label: "Power Shell 1.0 for SOLIDWORKS 2018", url: swUrl("SolidWorks/PowerShelling_1_0_SW2018.exe") },
    { solidworks: "2017", version: "1.0", label: "Power Shell 1.0 for SOLIDWORKS 2017", url: swUrl("SolidWorks/PowerShelling_1_0_SW2017.exe") },
    { solidworks: "2016", version: "1.0", label: "Power Shell 1.0 for SOLIDWORKS 2016", url: swUrl("SolidWorks/PowerShelling_1_0_SW2016.exe") },
  ],
  archive: [],
};

/** Standalone products — links filled in at release */
export const STANDALONE_DOWNLOADS = [
  {
    productId: "power-surfacing-visualize",
    title: "Power Surfacing Visualize",
    anchor: "visualize",
    platform: "Standalone",
    status: "coming-soon",
    summary: "Standalone CAD visualization installer. Download links will be published here at release.",
    url: null,
  },
  {
    productId: "power-surfacing-re-studio",
    title: "Power Surfacing RE Studio",
    anchor: "re-studio",
    platform: "Standalone",
    status: "coming-soon",
    summary: "Standalone reverse-engineering installer. Download links will be published here at release.",
    url: null,
  },
  {
    productId: "power-surfacing-studio",
    title: "Power Surfacing Studio",
    anchor: "studio",
    platform: "Standalone",
    status: "coming-soon",
    summary: "Standalone Sub-D / CAD modeling installer. Download links will be published here at release.",
    url: null,
  },
];

export const DOWNLOAD_DOCS = [
  {
    label: "Power Surfacing / Power Surfacing RE documentation (PDF)",
    url: swUrl("SolidWorks/PowerSurfacingHelp4.pdf"),
  },
  {
    label: "Online help files (5.0 / 6.0)",
    url: swUrl("SolidWorks/Power Surfacing documentation/Power Surfacing_Power Surfacing RE Help Files.html"),
  },
  {
    label: "Release notes",
    url: swUrl("SW_Release_Notes.html"),
    internalPath: "/support/release-notes",
  },
];

export const DOWNLOAD_PAGE_META = {
  title: "Download Power Surfacing & Power Shell",
  description:
    "Download current and previous Power Surfacing, Power Surfacing RE, and Power Shell installers for SOLIDWORKS. Standalone Studio downloads coming soon.",
  legacyUrl: `${BASE}/NewDownloadingPowerSurfacing.html`,
  gettingStartedVideo: "http://www.screencast.com/t/pq65guLsARg",
  supportEmail: "support@npowersoftware.com",
  supportPhone: "+1-858-592-8866",
};
