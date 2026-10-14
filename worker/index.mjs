import Stripe from 'stripe';
import { CartStore } from '../store/d1-store.mjs';
import { createService, tokenMap, templateFor, MAX_SANDBOX_LICENSES, expectedPrices, CUSTOMER } from '../store/service.mjs';
import { catalog, quoteCart } from '../store/purchase-options.mjs';
import { CheckoutError, required, sha256, equalSecrets } from '../store/errors.mjs';

import { createLifecycle } from '../store/lifecycle.mjs';
import { cryptolensLifecycle, renewalTokenMap } from '../store/cryptolens-lifecycle.mjs';

const COOKIE = '__Host-npower_sandbox';
const origin = 'https://www.npowersoftwarenew.com';
const recipient = 'gcrocker61@gmail.com';
const now = () => Math.floor(Date.now() / 1000);
const headers = { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store',
  'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'same-origin' };
const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), { status, headers: { ...headers, ...extra } });
export async function limitedBody(request, limit = 16384) {
  required(Number(request.headers.get('content-length') || 0) <= limit, 'request_too_large', 413);
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks = []; let size = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > limit) { await reader.cancel(); throw new CheckoutError('request_too_large', 413); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(bytes);
}
function configured(env) {
  return env.STORE_ENABLED === 'true' && /^(sk|rk)_test_[A-Za-z0-9]+$/.test(env.STRIPE_SECRET_KEY ?? '') &&
    /^whsec_[A-Za-z0-9]+$/.test(env.STRIPE_WEBHOOK_SECRET ?? '') && env.DB &&
    env.SANDBOX_ACCESS_CODE?.length >= 20 && env.EMAIL_ENABLED === 'true' && env.EMAIL &&
    env.EMAIL_FROM === 'licenses@npowersoftwarenew.com' && env.SANDBOX_EMAIL === recipient;
}
async function owner(request, store) {
  const match = request.headers.get('cookie')?.match(/(?:^|;\s*)__Host-npower_sandbox=([a-f0-9]{64})(?:;|$)/);
  if (!match) return null;
  const hash = await sha256(match[1]);
  return await store.sessionValid(hash, now()) ? hash : null;
}
export async function handle(request, env) {
  const url = new URL(request.url), path = url.pathname.replace(/\/$/, '');
  if (!path.startsWith('/api/store/')) return env.ASSETS ? env.ASSETS.fetch(request) : new Response('Not found', { status: 404 });
  try {
    required(env.STORE_ORIGIN === origin, 'sandbox_configuration_required', 503);
    required(['www.npowersoftwarenew.com','npower-astro-site.gcrocker61.workers.dev','localhost','127.0.0.1'].includes(url.hostname), 'staging_host_required', 403);
    required(env.DB, 'store_setup_pending', 503);
    const store = new CartStore(env.DB), tokens = tokenMap(env);
    const authenticated = await owner(request, store);
    if (path === '/api/store/status' && request.method === 'GET') {
      return json({ sandbox: true, ready: Boolean(configured(env)), unlocked: Boolean(authenticated),
        options: catalog.products.flatMap(p => p.options.map(o => ({ product:p.key, option:o.key, ready:tokens.has(o.cryptolensTemplateId) }))) });
    }
    if (request.method === 'POST' && path !== '/api/store/webhook') {
      required(request.headers.get('origin') === origin, 'open_the_staging_store_first', 403);
      required(request.headers.get('content-type')?.startsWith('application/json'), 'json_required', 415);
    }
    if (path === '/api/store/unlock' && request.method === 'POST') {
      required(env.SANDBOX_ACCESS_CODE?.length >= 20, 'store_setup_pending', 503);
      const identity = await sha256('unlock:' + (request.headers.get('cf-connecting-ip') || 'unknown'));
      await store.limit(identity, 10, 600, now());
      const input = JSON.parse(await limitedBody(request, 2048));
      required(typeof input.code === 'string' && await equalSecrets(input.code, env.SANDBOX_ACCESS_CODE), 'access_code_incorrect', 403);
      const bytes = crypto.getRandomValues(new Uint8Array(32));
      const session = [...bytes].map(n => n.toString(16).padStart(2,'0')).join('');
      await store.saveSession(await sha256(session), now());
      return json({ unlocked:true }, 200, { 'Set-Cookie': COOKIE + '=' + session + '; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=172800' });
    }
    if (path === '/api/store/quote' && request.method === 'POST') {
      const quote = quoteCart(JSON.parse(await limitedBody(request)));
      return json({ ...quote, licenseLimit:MAX_SANDBOX_LICENSES, unlocked:Boolean(authenticated),
        checkoutReady: Boolean(configured(env) && authenticated && quote.items.length && quote.licenseCount <= MAX_SANDBOX_LICENSES && quote.items.every(q => tokens.has(templateFor(q)))) });
    }
    required(configured(env), 'store_setup_pending', 503);
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, { maxNetworkRetries:1, timeout:15000, httpClient:Stripe.createFetchHttpClient() });
    const lifecycle = env.LIFECYCLE_ENABLED === 'true' ? billingLifecycle(stripe, store, env) : undefined;
    const service = createService({ stripe, store, tokens, baseUrl:origin, lifecycle, customerId:env.SANDBOX_CHECKOUT_CUSTOMER || CUSTOMER,
      report: event => console.log(JSON.stringify(event)),
      sendEmail: message => {
        required(message.recipient === recipient, 'sandbox_recipient_required', 503);
        return env.EMAIL.send({ to:recipient, from:{ email:env.EMAIL_FROM, name:'nPower Software' },
          subject:message.subject, text:message.text, html:message.html });
      } });
    if (path === '/api/store/webhook' && request.method === 'POST') {
      let event;
      try {
        event = await stripe.webhooks.constructEventAsync(await limitedBody(request, 262144),
          request.headers.get('stripe-signature') || '', env.STRIPE_WEBHOOK_SECRET, 300, Stripe.createSubtleCryptoProvider());
      } catch { throw new CheckoutError('invalid_webhook_signature', 400); }
      return json({ status:await service.handleEvent(event) });
    }
    required(authenticated, 'sandbox_access_required', 401);
    if (path === '/api/store/checkout' && request.method === 'POST') {
      await store.limit('checkout:' + authenticated, 30, 3600, now());
      const input = JSON.parse(await limitedBody(request));
      return json(await service.start(input.cart, input.attempt, authenticated));
    }
    if (path === '/api/store/continue' && request.method === 'POST') {
      const input = JSON.parse(await limitedBody(request, 2048));
      return json({ url:await service.continue(input.order, authenticated) });
    }
    if (path === '/api/store/receipt' && request.method === 'GET') {
      let id = url.searchParams.get('order');
      const session = url.searchParams.get('session_id');
      if (session) {
        required(/^cs_test_[A-Za-z0-9]+$/.test(session), 'order_not_found', 404);
        id = (await store.forSession(session))?.order_id;
      }
      required(id, 'order_not_found', 404);
      return json(await service.receipt(id, authenticated));
    }
    return json({ error:'not_found' }, 404);
  } catch (error) {
    const known = error instanceof CheckoutError;
    if (!known) console.error(JSON.stringify({ code:'store_request_failed', type:error?.name || 'Error' }));
    return json({ error:known ? error.code : error instanceof SyntaxError ? 'invalid_request' : 'store_temporarily_unavailable' },
      known ? error.status : error instanceof SyntaxError ? 400 : 503);
  }
}
function billingLifecycle(stripe, store, env) {
  return createLifecycle({ stripe, store, licenses:cryptolensLifecycle(renewalTokenMap(env)),
    expectedPrices, report:event => console.log(JSON.stringify(event)) });
}
export async function scheduled(_controller, env) {
  if (env.LIFECYCLE_ENABLED !== 'true') return;
  required(configured(env), 'store_setup_pending', 503);
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { maxNetworkRetries:1, timeout:15000, httpClient:Stripe.createFetchHttpClient() });
  await billingLifecycle(stripe, new CartStore(env.DB), env).scheduled();
}
export default { fetch:handle, scheduled };
