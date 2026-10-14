// Pages serves the Astro site; the Worker owns secrets, D1, and license delivery.
// Forward only the storefront API. The backend validates origin, session and signatures.
const BACKEND = 'https://npower-astro-site.gcrocker61.workers.dev';
export async function onRequest({ request }) {
  const url = new URL(request.url);
  if (url.hostname !== 'www.npowersoftwarenew.com') return new Response('Sandbox staging host required.', { status: 403 });
  const target = new URL(url.pathname + url.search, BACKEND);
  const headers = new Headers();
  for (const key of ['content-type', 'origin', 'cookie', 'stripe-signature', 'cf-connecting-ip']) {
    const value = request.headers.get(key);
    if (value) headers.set(key, value);
  }
  const response = await fetch(target, {
    method: request.method, headers, redirect: 'manual',
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body
  });
  const output = new Response(response.body, response);
  output.headers.set('Cache-Control', 'no-store');
  return output;
}
