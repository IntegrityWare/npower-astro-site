/**
 * Site host configuration.
 *
 * PUBLIC_SITE_URL — current public host (staging or production). Used for
 * canonicals, Open Graph, sitemap, and page-level structured data.
 *
 * PUBLIC_ORGANIZATION_URL — stable Organization entity (@id). Defaults to the
 * final brand domain so entity identity can stay on npowersoftware.com while
 * the site is temporarily hosted elsewhere.
 *
 * At launch: set PUBLIC_SITE_URL=https://www.npowersoftware.com and rebuild.
 */
import { withTrailingSlash } from "./urls.js";

const DEFAULT_SITE_URL = "https://www.npowersoftwarenew.com";
const DEFAULT_ORGANIZATION_URL = "https://www.npowersoftware.com";

function stripTrailingSlash(url) {
  return String(url || "").replace(/\/+$/, "");
}

function readPublicEnv(name, fallback) {
  const fromImportMeta =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    typeof import.meta.env[name] === "string" &&
    import.meta.env[name].trim()
      ? import.meta.env[name].trim()
      : "";
  if (fromImportMeta) return fromImportMeta;

  const fromProcess =
    typeof process !== "undefined" &&
    process.env &&
    typeof process.env[name] === "string" &&
    process.env[name].trim()
      ? process.env[name].trim()
      : "";
  if (fromProcess) return fromProcess;

  return fallback;
}

/** Current site origin with no trailing slash, e.g. https://www.npowersoftwarenew.com */
export const SITE_URL = stripTrailingSlash(
  readPublicEnv("PUBLIC_SITE_URL", DEFAULT_SITE_URL),
);

/** Stable Organization origin (final brand domain by default). */
export const ORGANIZATION_URL = stripTrailingSlash(
  readPublicEnv("PUBLIC_ORGANIZATION_URL", DEFAULT_ORGANIZATION_URL),
);

export const ORGANIZATION_ID = `${ORGANIZATION_URL}/#organization`;

/** Absolute URL for an internal path (adds trailing slash for pages). */
export function absoluteUrl(path = "/") {
  if (path == null || path === "") return `${SITE_URL}/`;
  if (/^(https?:|mailto:|tel:)/i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return SITE_URL + withTrailingSlash(normalized);
}

/** Site-scoped JSON-LD @id helper, e.g. siteId('website') → https://host/#website */
export function siteId(fragment) {
  const id = String(fragment || "").replace(/^#/, "");
  return `${SITE_URL}/#${id}`;
}
