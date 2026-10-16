// The download Worker serves only files explicitly listed in its manifest.
export async function onRequest({ request, env }) {
  if (!env.DOWNLOADS_SERVICE) return new Response('Downloads are temporarily unavailable.', {
    status: 503, headers: { 'Cache-Control': 'no-store', 'Retry-After': '60' },
  });
  return env.DOWNLOADS_SERVICE.fetch(request);
}
