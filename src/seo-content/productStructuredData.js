const SITE = "https://www.npowersoftwarenew.com";
const PUBLISHER_ID = SITE + "/#npower-software";

const publisher = {
  "@type": "Organization",
  "@id": PUBLISHER_ID,
  name: "nPower Software",
};

const offer = (name, price, url, description) => ({
  "@type": "Offer",
  name,
  price,
  priceCurrency: "USD",
  url: SITE + url,
  availability: "https://schema.org/InStock",
  ...(description ? { description } : {}),
});

export const PRODUCT_STRUCTURED_DATA = {
  "power-surfacing-re-studio": {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": SITE + "/products/power-surfacing-re-studio/#software",
    name: "Power Surfacing RE Studio",
    description: "Standalone Windows reverse-engineering and scan-to-CAD software for reconstructing 3D scan meshes, STL files and polygon models as editable CAD surfaces and solids.",
    url: SITE + "/products/power-surfacing-re-studio",
    operatingSystem: "Windows",
    applicationCategory: "DesignApplication",
    applicationSubCategory: "Reverse Engineering and Scan-to-CAD",
    image: SITE + "/assets/product-re-studio.webp",
    screenshot: SITE + "/assets/product-re-studio.webp",
    publisher,
    provider: publisher,
    softwareRequirements: "Standalone Windows application; SOLIDWORKS is not required.",
    featureList: [
      "STL and Wavefront OBJ import",
      "Quad Wrap retopology",
      "Sub-D surface reconstruction",
      "Mechanical surface and solid extraction",
      "G2-continuous NURBS conversion",
      "STEP, STL and Wavefront OBJ export",
      "Native SOLIDWORKS feature transfer",
    ],
    offers: [
      offer("Perpetual License", "6995", "/products/power-surfacing-re-studio", "One-time perpetual license purchase."),
      offer("Annual Subscription - First Year", "2995", "/products/power-surfacing-re-studio", "First-year annual subscription including updates and support."),
    ],
  },

  "power-surfacing-studio": {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": SITE + "/products/power-surfacing-studio/#software",
    name: "Power Surfacing Studio",
    description: "Standalone hybrid Sub-D and NURBS CAD modeling software for freeform Class A surfacing, dimension-driven sketching and feature-based design.",
    url: SITE + "/products/power-surfacing-studio",
    operatingSystem: "Windows",
    applicationCategory: "DesignApplication",
    applicationSubCategory: "CAD Design and Sub-D Modeling",
    image: SITE + "/assets/product-studio.webp",
    screenshot: SITE + "/assets/product-studio.webp",
    publisher,
    provider: publisher,
    softwareRequirements: "Standalone Windows application; no third-party CAD license is required.",
    featureList: [
      "Freeform Sub-D modeling",
      "Class A NURBS surface and solid conversion",
      "Dimension-driven sketching",
      "Feature-based construction history",
      "OBJ and FBX mesh import",
      "STEP export",
      "Advanced shelling and thickening",
    ],
    offers: [
      offer("Perpetual License", "1995", "/products/power-surfacing-studio", "One-time perpetual license purchase."),
      offer("Annual Subscription - First Year", "995", "/products/power-surfacing-studio", "First-year annual subscription including updates and support."),
    ],
  },

  "power-surfacing-solidworks": {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": SITE + "/products/power-surfacing-solidworks/#software",
    name: "Power Surfacing for SOLIDWORKS",
    description: "A freeform Sub-D and Class A surfacing add-in that creates SOLIDWORKS solid and surface bodies integrated with the feature tree.",
    url: SITE + "/products/power-surfacing-solidworks",
    operatingSystem: "Windows",
    applicationCategory: "DesignApplication",
    applicationSubCategory: "SOLIDWORKS Sub-D Surfacing Add-in",
    image: SITE + "/assets/product-solidworks.webp",
    screenshot: SITE + "/assets/product-solidworks.webp",
    publisher,
    provider: publisher,
    softwareRequirements: "Requires a compatible installation of SOLIDWORKS on Windows.",
    featureList: [
      "Freeform Sub-D modeling inside SOLIDWORKS",
      "Class A surface and solid conversion",
      "SOLIDWORKS sketch support",
      "OBJ and FBX mesh import",
      "SOLIDWORKS Feature Tree integration",
      "Power Shell and Power Thicken included",
    ],
    offers: [
      offer("Single Seat License", "2995", "/products/power-surfacing-solidworks", "Perpetual license for one user."),
      offer("Network License", "3995", "/products/power-surfacing-solidworks", "Floating license shared across a team."),
    ],
  },

  "power-surfacing-re-solidworks": {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": SITE + "/products/power-surfacing-re-solidworks/#software",
    name: "Power Surfacing RE for SOLIDWORKS",
    description: "A SOLIDWORKS reverse-engineering add-in for rebuilding 3D scans, STL meshes and sculpted models as SOLIDWORKS surface and solid bodies.",
    url: SITE + "/products/power-surfacing-re-solidworks",
    operatingSystem: "Windows",
    applicationCategory: "DesignApplication",
    applicationSubCategory: "SOLIDWORKS Reverse Engineering Add-in",
    image: SITE + "/assets/product-re-solidworks.webp",
    screenshot: SITE + "/assets/product-re-solidworks.webp",
    publisher,
    provider: publisher,
    softwareRequirements: "Requires a compatible installation of SOLIDWORKS on Windows.",
    featureList: [
      "3D scan and STL mesh reconstruction inside SOLIDWORKS",
      "Quad Wrap retopology",
      "Shrink Wrap detail capture",
      "Mesh smoothing and offset tools",
      "Approximation-accuracy distance display",
      "SOLIDWORKS Topology Study conversion",
      "SOLIDWORKS surface and solid output",
    ],
    offers: [
      offer("Single Seat License", "3995", "/products/power-surfacing-re-solidworks", "Perpetual license for one user."),
      offer("Network License", "4995", "/products/power-surfacing-re-solidworks", "Floating license shared across a team."),
    ],
  },

  "power-shell-solidworks": {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": SITE + "/products/power-shell-solidworks/#software",
    name: "Power Shell for SOLIDWORKS",
    description: "A SOLIDWORKS add-in for shelling and thickening complex, difficult and organic surface or solid geometry.",
    url: SITE + "/products/power-shell-solidworks",
    operatingSystem: "Windows",
    applicationCategory: "DesignApplication",
    applicationSubCategory: "SOLIDWORKS Shelling and Thickening Add-in",
    image: SITE + "/assets/product-power-shell.webp",
    screenshot: SITE + "/assets/product-power-shell.webp",
    publisher,
    provider: publisher,
    softwareRequirements: "Requires a compatible installation of SOLIDWORKS on Windows.",
    featureList: [
      "Advanced shelling for complex geometry",
      "Power Thicken included",
      "Variable wall thickness",
      "Multi-body support",
      "Live preview",
      "SOLIDWORKS Feature Tree integration",
    ],
    offers: [
      offer("Single Seat License", "1495", "/products/power-shell-solidworks", "Perpetual license for one user."),
    ],
  },
};

export function getProductStructuredData(productId) {
  return PRODUCT_STRUCTURED_DATA[productId] ?? null;
}
