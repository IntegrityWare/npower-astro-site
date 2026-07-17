// Development-time validation of the content architecture.
// Runs automatically in dev (see App.jsx) and logs a prominent error report.
import { CONTENT_MAP } from "@/content/contentMap";

export function validateContent() {
  const issues = [];
  const titles = new Map();
  const descriptions = new Map();

  for (const [route, content] of Object.entries(CONTENT_MAP)) {
    if (!content || Object.keys(content).length === 0) {
      issues.push(`${route}: content file is empty`);
      continue;
    }
    const meta = content.meta || {};
    if (!meta.title) issues.push(`${route}: missing meta.title`);
    if (!meta.description) issues.push(`${route}: missing meta.description`);
    if (!meta.canonicalPath) {
      issues.push(`${route}: missing meta.canonicalPath`);
    } else if (meta.canonicalPath !== route) {
      issues.push(`${route}: canonicalPath "${meta.canonicalPath}" does not match its route`);
    }
    if (!content.hero || !content.hero.h1) issues.push(`${route}: missing hero.h1`);

    if (meta.title) {
      if (titles.has(meta.title)) issues.push(`${route}: duplicate title also used by ${titles.get(meta.title)}`);
      else titles.set(meta.title, route);
    }
    if (meta.description) {
      if (descriptions.has(meta.description)) issues.push(`${route}: duplicate description also used by ${descriptions.get(meta.description)}`);
      else descriptions.set(meta.description, route);
    }
    for (const link of content.relatedLinks || []) {
      if (!link.path || !link.path.startsWith("/")) {
        issues.push(`${route}: related link "${link.label}" has an invalid path`);
      }
    }
  }

  if (issues.length > 0) {
    console.error(`[content validation] ${issues.length} issue(s) found:\n- ${issues.join("\n- ")}`);
  } else {
    console.info(`[content validation] OK — ${Object.keys(CONTENT_MAP).length} routes validated, unique titles and descriptions confirmed.`);
  }
  return issues;
}