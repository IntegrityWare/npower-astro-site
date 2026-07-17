// Explicit route → content-file mapping.
// Every important indexable route with a dedicated content file is listed here.
// Never fall back to another route's content: missing routes return null and
// log a development warning.
import { HOME_CONTENT } from "@/seo-content/home";
import { RE_STUDIO_CONTENT } from "@/seo-content/products/power-surfacing-re-studio";
import { STUDIO_CONTENT } from "@/seo-content/products/power-surfacing-studio";
import { PS_SOLIDWORKS_CONTENT } from "@/seo-content/products/power-surfacing-solidworks";
import { PS_RE_SOLIDWORKS_CONTENT } from "@/seo-content/products/power-surfacing-re-solidworks";
import { POWER_SHELL_CONTENT } from "@/seo-content/products/power-shell-solidworks";

export const CONTENT_MAP = {
  "/": HOME_CONTENT,
  "/products/power-surfacing-re-studio": RE_STUDIO_CONTENT,
  "/products/power-surfacing-studio": STUDIO_CONTENT,
  "/products/power-surfacing-solidworks": PS_SOLIDWORKS_CONTENT,
  "/products/power-surfacing-re-solidworks": PS_RE_SOLIDWORKS_CONTENT,
  "/products/power-shell-solidworks": POWER_SHELL_CONTENT,
};

export function getContentForRoute(route) {
  const content = CONTENT_MAP[route];
  if (!content) {
    if (import.meta.env.DEV) {
      console.warn(`[content] No content file mapped for route "${route}". Add one to src/content/ and register it in contentMap.js. No fallback content will be used.`);
    }
    return null;
  }
  return content;
}