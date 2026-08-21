import fs from "fs";
import path from "path";

const DIST = "dist";
const SITE = "https://www.npowersoftwarenew.com";

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else files.push(p);
  }
  return files;
}

function extract(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

const allFiles = walk(DIST);
const htmlFiles = allFiles.filter((f) => f.endsWith(".html") && !f.endsWith("404.html"));

const results = {
  fileCounts: {
    total: allFiles.length,
    html: htmlFiles.length,
    robots: allFiles.some((f) => f.replace(/\\/g, "/").endsWith("robots.txt")),
    sitemapIndex: allFiles.some((f) => f.includes("sitemap-index")),
    sitemapParts: allFiles.filter((f) => /sitemap-\d+\.xml$/.test(f.replace(/\\/g, "/"))).length,
    llmsTxt: allFiles.some((f) => /llms\.txt$/i.test(f)),
  },
  robots: null,
  sitemapUrls: [],
  aggregates: {
    withCanonical: 0,
    selfRefCanonical: 0,
    trailingSlashCanonical: 0,
    withTitle: 0,
    withDescription: 0,
    withOg: 0,
    jsonLdBlocks: 0,
    schemaTypes: {},
    domainsInCanonical: {},
    igesSat: 0,
    softwarenewInBody: 0,
    npowersoftwareComInBody: 0,
    missingH1: 0,
    multiH1: 0,
    emptyTitle: 0,
    emptyDesc: 0,
    noindex: 0,
    base44Urls: 0,
    solidSurfaceBodies: 0,
    pagesWithFaq: 0,
    pagesWithSoftwareApp: 0,
    pagesWithBreadcrumb: 0,
  },
  issues: [],
  keyPageChecks: {},
};

const robotsPath = path.join(DIST, "robots.txt");
if (fs.existsSync(robotsPath)) {
  results.robots = fs.readFileSync(robotsPath, "utf8").trim();
} else {
  results.issues.push({ severity: "critical", area: "Discovery", finding: "robots.txt missing from dist" });
}

const smPath = path.join(DIST, "sitemap-index.xml");
if (fs.existsSync(smPath)) {
  const sm = fs.readFileSync(smPath, "utf8");
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const loc of locs) {
    const name = loc.split("/").pop();
    const local = path.join(DIST, name);
    if (fs.existsSync(local)) {
      const partXml = fs.readFileSync(local, "utf8");
      results.sitemapUrls.push(...[...partXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
    }
  }
} else {
  results.issues.push({ severity: "critical", area: "Discovery", finding: "sitemap-index.xml missing from dist" });
}

function fileToCanon(file) {
  let p = "/" + file.replace(/\\/g, "/").replace(/^dist\//, "").replace(/index\.html$/, "");
  if (!p.endsWith("/")) p += "/";
  if (p === "//") p = "/";
  return SITE + p;
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const rel = file.replace(/\\/g, "/").replace(/^dist\//, "");
  const title = extract(html, /<title[^>]*>([^<]*)<\/title>/i);
  const desc =
    extract(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
    extract(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const canonical =
    extract(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ||
    extract(html, /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  const ogUrl =
    extract(html, /property=["']og:url["'][^>]+content=["']([^"']*)["']/i) ||
    extract(html, /content=["']([^"']*)["'][^>]+property=["']og:url["']/i);
  const ogTitle =
    extract(html, /property=["']og:title["'][^>]+content=["']([^"']*)["']/i) ||
    extract(html, /content=["']([^"']*)["'][^>]+property=["']og:title["']/i);
  const robotsMeta =
    extract(html, /name=["']robots["'][^>]+content=["']([^"']*)["']/i) ||
    extract(html, /content=["']([^"']*)["'][^>]+name=["']robots["']/i);
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
  );
  const jsonLdBlocks = [...html.matchAll(/<script type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(
    (m) => m[1],
  );

  if (title) results.aggregates.withTitle++;
  else {
    results.aggregates.emptyTitle++;
    results.issues.push({ severity: "high", area: "Meta", finding: `Missing title: ${rel}` });
  }
  if (desc) results.aggregates.withDescription++;
  else {
    results.aggregates.emptyDesc++;
    results.issues.push({ severity: "high", area: "Meta", finding: `Missing description: ${rel}` });
  }

  if (canonical) {
    results.aggregates.withCanonical++;
    if (canonical.endsWith("/")) results.aggregates.trailingSlashCanonical++;
    try {
      const host = new URL(canonical).host;
      results.aggregates.domainsInCanonical[host] = (results.aggregates.domainsInCanonical[host] || 0) + 1;
    } catch {}
    const expected = fileToCanon(file);
    if (canonical === expected) results.aggregates.selfRefCanonical++;
    else
      results.issues.push({
        severity: "medium",
        area: "Canonical",
        finding: `${rel}: got ${canonical}, expected ${expected}`,
      });
  } else {
    results.issues.push({ severity: "critical", area: "Canonical", finding: `Missing canonical: ${rel}` });
  }

  if (ogTitle && ogUrl) results.aggregates.withOg++;
  if (robotsMeta && /noindex/i.test(robotsMeta)) results.aggregates.noindex++;
  if (h1s.length === 0) {
    results.aggregates.missingH1++;
    results.issues.push({ severity: "high", area: "Headings", finding: `Missing H1: ${rel}` });
  }
  if (h1s.length > 1) {
    results.aggregates.multiH1++;
    results.issues.push({ severity: "medium", area: "Headings", finding: `Multiple H1 (${h1s.length}): ${rel}` });
  }
  if (/IGES|\bSAT\b/.test(html)) results.aggregates.igesSat++;
  if (/npowersoftwarenew\.com/i.test(html)) results.aggregates.softwarenewInBody++;
  if (/www\.npowersoftware\.com/i.test(html)) results.aggregates.npowersoftwareComInBody++;
  if (/base44\.(com|app)/i.test(html)) results.aggregates.base44Urls++;
  if (/solid and surface bod/i.test(html)) results.aggregates.solidSurfaceBodies++;
  if (/FAQPage/.test(html)) results.aggregates.pagesWithFaq++;
  if (/SoftwareApplication/.test(html)) results.aggregates.pagesWithSoftwareApp++;
  if (/BreadcrumbList/.test(html)) results.aggregates.pagesWithBreadcrumb++;

  for (const block of jsonLdBlocks) {
    results.aggregates.jsonLdBlocks++;
    try {
      const data = JSON.parse(block);
      const arr = Array.isArray(data) ? data : [data];
      for (const obj of arr) {
        const t = obj["@type"];
        if (!t) continue;
        for (const ty of Array.isArray(t) ? t : [t]) {
          results.aggregates.schemaTypes[ty] = (results.aggregates.schemaTypes[ty] || 0) + 1;
        }
      }
    } catch {
      results.issues.push({ severity: "high", area: "Structured data", finding: `Invalid JSON-LD in ${rel}` });
    }
  }
}

const htmlPaths = new Set(htmlFiles.map(fileToCanon));
const smSet = new Set(results.sitemapUrls);
const inHtmlNotSm = [...htmlPaths].filter((u) => !smSet.has(u));
const inSmNotHtml = [...smSet].filter((u) => !htmlPaths.has(u));

results.sitemapCoverage = {
  htmlPages: htmlPaths.size,
  sitemapUrls: smSet.size,
  missingFromSitemapCount: inHtmlNotSm.length,
  missingFromSitemap: inHtmlNotSm.slice(0, 15),
  orphanSitemapCount: inSmNotHtml.length,
  orphanSitemap: inSmNotHtml.slice(0, 10),
  sampleSitemapUrls: results.sitemapUrls.slice(0, 8),
};

const keyPages = [
  "index.html",
  "products/power-surfacing-re-studio/index.html",
  "products/power-surfacing-studio/index.html",
  "workflows/scan-to-cad/index.html",
  "3d-scan-to-solidworks/index.html",
  "about/index.html",
];

for (const kp of keyPages) {
  const fp = path.join(DIST, kp);
  if (!fs.existsSync(fp)) {
    results.keyPageChecks[kp] = { missing: true };
    continue;
  }
  const html = fs.readFileSync(fp, "utf8");
  results.keyPageChecks[kp] = {
    title: extract(html, /<title[^>]*>([^<]*)<\/title>/i),
    canonical:
      extract(html, /rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ||
      extract(html, /href=["']([^"']*)["'][^>]+rel=["']canonical["']/i),
    hasSoftwareApp: /SoftwareApplication/.test(html),
    hasFAQ: /FAQPage/.test(html),
    hasBreadcrumb: /BreadcrumbList/.test(html),
    hasOrg: /Organization/.test(html),
    hasWebSite: /WebSite/.test(html),
    stepExport: /STEP/.test(html),
    iges: /IGES/.test(html),
    nativeFeatures: /native SOLIDWORKS features/i.test(html),
    solidBodies: /solid and surface bod/i.test(html),
    readableHtml: html.includes("\n") ? "newlines" : "minified",
    htmlKB: Math.round(html.length / 1024),
  };
}

const a = results.aggregates;
const n = htmlFiles.length;
results.scorecard = [
  {
    dimension: "Technical discovery (robots/sitemap)",
    score: results.fileCounts.robots && results.fileCounts.sitemapIndex ? 9 : 3,
    note: `robots=${results.fileCounts.robots}; sitemap=${results.fileCounts.sitemapIndex}; urls=${smSet.size}`,
  },
  {
    dimension: "Canonical / trailing-slash consistency",
    score: a.selfRefCanonical === n && a.trailingSlashCanonical === n ? 9 : 6,
    note: `${a.selfRefCanonical}/${n} self-ref; ${a.trailingSlashCanonical}/${n} trailing slash`,
  },
  {
    dimension: "Meta title/description coverage",
    score: Math.round((10 * (a.withTitle + a.withDescription)) / (2 * n)),
    note: `${a.withTitle}/${n} titles, ${a.withDescription}/${n} descriptions`,
  },
  {
    dimension: "Structured data breadth",
    score: Object.keys(a.schemaTypes).length >= 6 ? 8 : 5,
    note: Object.entries(a.schemaTypes)
      .map(([k, v]) => `${k}:${v}`)
      .join(", "),
  },
  {
    dimension: "Fact consistency (IGES/SAT removed)",
    score: a.igesSat === 0 ? 10 : 2,
    note: a.igesSat === 0 ? "Clean" : `${a.igesSat} pages still mention IGES/SAT`,
  },
  {
    dimension: "AI discovery (llms.txt)",
    score: results.fileCounts.llmsTxt ? 8 : 2,
    note: results.fileCounts.llmsTxt ? "present" : "absent from dist",
  },
  {
    dimension: "Host/domain readiness",
    score: 7,
    note: `Canonical host ${JSON.stringify(a.domainsInCanonical)}; org entity on npowersoftware.com by design`,
  },
  {
    dimension: "Crawlable static HTML",
    score: 8,
    note: `${n} HTML pages; FAQPage on ${a.pagesWithFaq}; SoftwareApplication on ${a.pagesWithSoftwareApp}`,
  },
];

results.avgScore =
  Math.round((results.scorecard.reduce((s, r) => s + r.score, 0) / results.scorecard.length) * 10) / 10;

const sev = { critical: 0, high: 0, medium: 0 };
for (const i of results.issues) sev[i.severity] = (sev[i.severity] || 0) + 1;
results.issueSummary = sev;

fs.writeFileSync("dist-seo-audit.json", JSON.stringify(results, null, 2));
console.log(JSON.stringify({
  avgScore: results.avgScore,
  fileCounts: results.fileCounts,
  robots: results.robots,
  sitemapCoverage: results.sitemapCoverage,
  aggregates: results.aggregates,
  scorecard: results.scorecard,
  keyPageChecks: results.keyPageChecks,
  issueSummary: results.issueSummary,
  issuesSample: results.issues.slice(0, 20),
}, null, 2));
