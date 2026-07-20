/**
 * After a static build, emit `_redirects` so URLs without a trailing slash
 * forward to the canonical trailing-slash URL (Cloudflare Pages / Netlify).
 *
 * Do not emit sibling `{path}.html` redirect stubs — those conflict with
 * directory routes (`{path}/index.html`) on Cloudflare Pages and can break
 * nav links like /products/.
 */
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

function normalizePathname(pathname) {
  let path = pathname || "/";
  if (!path.startsWith("/")) path = `/${path}`;
  if (path !== "/" && !path.endsWith("/")) path += "/";
  return path;
}

export default function trailingSlashRedirects() {
  return {
    name: "trailing-slash-redirects",
    hooks: {
      "astro:build:done": async ({ dir, pages, logger }) => {
        const outDir = fileURLToPath(dir);
        const rules = [];

        for (const page of pages) {
          const withSlash = normalizePathname(page.pathname);
          if (withSlash === "/") continue;

          const withoutSlash = withSlash.slice(0, -1);
          rules.push(`${withoutSlash}\t${withSlash}\t301`);
        }

        const redirectsFile = join(outDir, "_redirects");
        const header = "# Auto-generated: no trailing slash -> trailing slash\n";
        await writeFile(redirectsFile, `${header}${rules.join("\n")}\n`, "utf8");

        logger.info(`Wrote ${rules.length} trailing-slash redirects to _redirects`);
      },
    },
  };
}
