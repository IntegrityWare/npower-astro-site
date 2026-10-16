export async function onRequest({ request, env }) {
  if (!env.CONTACT_SERVICE) return new Response(JSON.stringify({
    error: 'The contact form is temporarily unavailable. Please email us directly.',
  }), { status: 503, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  return env.CONTACT_SERVICE.fetch(request);
}
