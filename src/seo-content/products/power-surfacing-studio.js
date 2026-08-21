// Single source of truth for the /products/power-surfacing-studio page.
// Body content (description, features, use cases, pricing, testimonials) lives
// in the PRODUCTS entry in src/lib/siteData.js and is referenced here so there
// is exactly one copy of the text.
import { PRODUCTS } from "@/lib/siteData";

const product = PRODUCTS.find((p) => p.id === "power-surfacing-studio");

export const STUDIO_CONTENT = {
  meta: {
    title: product.pageTitle,
    description: product.pageDescription,
    canonicalPath: product.path,
    index: true,
  },
  hero: {
    h1: product.name,
    subtitle: product.description,
  },
  product,
  relatedLinks: [
    { label: "Power Surfacing Visualize", path: "/products/power-surfacing-visualize" },
    { label: "Power Surfacing RE Studio", path: "/products/power-surfacing-re-studio" },
    { label: "Power Surfacing for SOLIDWORKS", path: "/products/power-surfacing-solidworks" },
    { label: "Compare Power Surfacing Products", path: "/products/comparison" },
  ],
};