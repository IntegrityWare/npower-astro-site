// Preserve the original download URLs and streaming/range responses from R2.
export async function onRequest({ request, env, next }) {
  const path = new URL(request.url).pathname;
  if (!/^\/SolidWorks\/(?:PowerSurfacing_|PowerShelling_)/.test(path) &&
      path !== '/SolidWorks/PowerSurfacingHelp4.pdf') return next();
  if (!env.DOWNLOADS_SERVICE) return new Response('Downloads are temporarily unavailable.', {
    status: 503, headers: { 'Cache-Control': 'no-store', 'Retry-After': '60' },
  });
  return env.DOWNLOADS_SERVICE.fetch(request);
}
