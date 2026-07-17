// Single source of truth for the /products/power-surfacing-solidworks page.
// Body content lives in the PRODUCTS entry in src/lib/siteData.js and is
// referenced here so there is exactly one copy of the text.
import { PRODUCTS } from "@/lib/siteData";

const product = PRODUCTS.find((p) => p.id === "power-surfacing-solidworks");

export const PS_SOLIDWORKS_CONTENT = {
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
    { label: "Power Surfacing RE for SOLIDWORKS", path: "/products/power-surfacing-re-solidworks" },
    { label: "Power Shell for SOLIDWORKS", path: "/products/power-shell-solidworks" },
    { label: "Compare Power Surfacing Products", path: "/products/comparison" },
  ],
};