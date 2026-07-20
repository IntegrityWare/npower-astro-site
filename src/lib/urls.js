/**
 * Ensure internal site paths always end with a trailing slash.
 * Leaves external URLs, mailto/tel, hashes, and file-like paths alone.
 */
export function withTrailingSlash(path) {
  if (path == null || typeof path !== "string" || path === "") return path;
  if (/^(https?:|mailto:|tel:|\/\/)/i.test(path)) return path;
  if (path.startsWith("#")) return path;

  const hashIndex = path.indexOf("#");
  const queryIndex = path.indexOf("?");
  let pathname = path;
  let suffix = "";

  if (hashIndex !== -1) {
    suffix = path.slice(hashIndex);
    pathname = path.slice(0, hashIndex);
  }
  if (queryIndex !== -1 && (hashIndex === -1 || queryIndex < hashIndex)) {
    const qEnd = hashIndex !== -1 ? hashIndex : path.length;
    suffix = path.slice(queryIndex, qEnd) + suffix;
    pathname = path.slice(0, queryIndex);
  }

  if (!pathname) pathname = "/";
  // Static files (e.g. /assets/favicon.png) should not get a slash
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return pathname + suffix;
  if (!pathname.endsWith("/")) pathname += "/";
  return pathname + suffix;
}
