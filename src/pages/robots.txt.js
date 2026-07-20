import { SITE_URL } from '../lib/siteUrl.js';

/** Generated from PUBLIC_SITE_URL so the sitemap host flips with the site. */
export async function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${SITE_URL}/sitemap-index.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
