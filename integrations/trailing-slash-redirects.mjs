/**
 * After a static build, emit `_redirects` (Cloudflare Pages / Netlify) with:
 * - old www.npowersoftware.com pages -> their new pages (see legacy-redirects.mjs)
 * - URLs without a trailing slash -> the canonical trailing-slash URL
 *
 * Do not emit sibling `{path}.html` redirect stubs — those conflict with
 * directory routes (`{path}/index.html`) on Cloudflare Pages and can break
 * nav links like /products/.
 */
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { LEGACY_REDIRECTS } from "./legacy-redirects.mjs";

function normalizePathname(pathname) {
  let path = pathname || "/";
  if (!path.startsWith("/")) path = `/${path}`;
  if (path !== "/" && !path.endsWith("/")) path += "/";
  return path;
}

function legacyRules(builtPaths) {
  const staticRules = [];
  const folderRules = [];
  const sources = new Set();

  for (const { to, from } of LEGACY_REDIRECTS) {
    if (!builtPaths.has(to.split("#", 1)[0])) {
      throw new Error(`Legacy redirect target ${to} is not a page on this site`);
    }
    for (const source of from) {
      if (!source.startsWith("/") || /\s/.test(source)) {
        throw new Error(`Legacy redirect source "${source}" must start with / and contain no spaces`);
      }
      if (sources.has(source)) {
        throw new Error(`Legacy redirect source ${source} is listed more than once`);
      }
      sources.add(source);
      (source.endsWith("*") ? folderRules : staticRules).push(`${source}\t${to}\t301`);
    }
  }

  return { staticRules, folderRules };
}

export default function trailingSlashRedirects() {
  return {
    name: "trailing-slash-redirects",
    hooks: {
      "astro:build:done": async ({ dir, pages, logger }) => {
        const outDir = fileURLToPath(dir);
        const builtPaths = new Set(pages.map((page) => normalizePathname(page.pathname)));
        const slashRules = [];

        for (const page of pages) {
          const withSlash = normalizePathname(page.pathname);
          if (withSlash === "/") continue;

          const withoutSlash = withSlash.slice(0, -1);
          slashRules.push(`${withoutSlash}\t${withSlash}\t301`);
        }

        const { staticRules, folderRules } = legacyRules(builtPaths);

        // Cloudflare Pages requires static redirects before splat (`*`) redirects.
        const lines = [
          "# Auto-generated: old www.npowersoftware.com pages -> new pages",
          ...staticRules,
          "# Auto-generated: no trailing slash -> trailing slash",
          ...slashRules,
          "# Auto-generated: old www.npowersoftware.com folders -> new pages",
          ...folderRules,
        ];
        await writeFile(join(outDir, "_redirects"), `${lines.join("\r\n")}\r\n`, "utf8");

        logger.info(
          `Wrote ${staticRules.length + folderRules.length} legacy and ${slashRules.length} trailing-slash redirects to _redirects`,
        );
      },
    },
  };
}
