import Stripe from 'stripe';
import {handleTrials} from '../trials/http.mjs';
import {TrialStore} from '../trials/store.mjs';
import { CartStore } from '../store/d1-store.mjs';
import { createService, tokenMap, templateFor, MAX_SANDBOX_LICENSES, MAX_LIVE_LICENSES, expectedPrices, CUSTOMER } from '../store/service.mjs';
import { catalog, quoteCart } from '../store/purchase-options.mjs';
import { CheckoutError, required, sha256, equalSecrets } from '../store/errors.mjs';

import { createLifecycle } from '../store/lifecycle.mjs';
import { cryptolensLifecycle, renewalTokenMap } from '../store/cryptolens-lifecycle.mjs';

import { storeEnvironment, liveReadiness, productTokens } from '../store/environment.mjs';
import { liveLicenseCreator } from '../store/live-license.mjs';
import { createStoreMailer } from '../store/email.mjs';
import { authorizePrivateTest, privateTestCart, privateTestMode } from '../store/private-test.mjs';
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
async function owner(request, store, cookie) {
  const match = request.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(cookie+'='))?.match(/=([a-f0-9]{64})$/);
  if (!match) return null;
  const hash = await sha256(match[1]);
  return await store.sessionValid(hash, now()) ? hash : null;
}
export async function handle(request, env) {
  const url = new URL(request.url), live=url.pathname.startsWith('/api/live-store/');
  const path = url.pathname.replace('/api/live-store/','/api/store/').replace(/\/$/, '');
  if (path.startsWith('/api/trials/')) return handleTrials(request, env);
  if (!path.startsWith('/api/store/')) return env.ASSETS ? env.ASSETS.fetch(request) : new Response('Not found', { status: 404 });
  try {
    const mode=storeEnvironment(env,live,live?(request.headers.get('x-store-origin') || request.headers.get('origin') || undefined):undefined);
    if(!live) required(env.STORE_ORIGIN === origin, 'sandbox_configuration_required', 503);
    required(['www.npowersoftwarenew.com','npower-astro-site.gcrocker61.workers.dev','localhost','127.0.0.1'].includes(url.hostname), 'store_host_required', 403);
    const missing=live?liveReadiness(env,mode):[];
    const operational=live?missing.filter(s=>!['LIVE_STORE_ENABLED','LIVE_LIFECYCLE_ENABLED'].includes(s)).length===0:Boolean(configured(env));
    const enabled=live?missing.length===0:Boolean(configured(env));
    const store=mode.database?new CartStore(mode.database):null;
    const tokens=live?productTokens(env.CRYPTOLENS_LIVE_ISSUING_TOKENS):tokenMap(env);
    const authenticated=store?await owner(request,store,mode.cookie):null;
    const licenseLimit=live?MAX_LIVE_LICENSES:MAX_SANDBOX_LICENSES;
    if (path === '/api/store/status' && request.method === 'GET') {
      return json({ sandbox:!live, ready:enabled, unlocked:Boolean(authenticated),licenseLimit,
        options:mode.catalog.products.flatMap(p=>p.options.map(o=>({product:p.key,option:o.key,
          ready:enabled && tokens.has(live?p.cryptolensProductId:o.cryptolensTemplateId)}))) });
    }
    if (request.method === 'POST' && path !== '/api/store/webhook') {
      required(request.headers.get('origin') === mode.origin, 'open_the_store_first', 403);
      required(request.headers.get('content-type')?.startsWith('application/json'), 'json_required', 415);
    }
    if ((!live && path === '/api/store/unlock' || live && path === '/api/store/session') && request.method === 'POST') {
      required(store && enabled,'store_setup_pending',503);
      if(authenticated) return json({unlocked:true});
      if(!live) required(env.SANDBOX_ACCESS_CODE?.length >= 20, 'store_setup_pending', 503);
      const identity = await sha256('unlock:' + (request.headers.get('cf-connecting-ip') || 'unknown'));
      await store.limit(identity, 10, 600, now());
      const input = JSON.parse(await limitedBody(request, 2048));
      if(!live) required(typeof input.code === 'string' && await equalSecrets(input.code, env.SANDBOX_ACCESS_CODE), 'access_code_incorrect', 403);
      const bytes = crypto.getRandomValues(new Uint8Array(32));
      const session = [...bytes].map(n => n.toString(16).padStart(2,'0')).join('');
      await store.saveSession(await sha256(session), now());
      return json({ unlocked:true }, 200, { 'Set-Cookie': mode.cookie + '=' + session + '; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=172800' });
    }
    if (path === '/api/store/quote' && request.method === 'POST') {
      const quote = quoteCart(JSON.parse(await limitedBody(request)),now(),mode.catalog);
      return json({ ...quote,sandbox:!live,licenseLimit,unlocked:Boolean(authenticated),
        checkoutReady:Boolean(enabled && (live || authenticated) && quote.items.length && quote.licenseCount<=licenseLimit &&
          quote.items.every(q=>tokens.has(live?q.cryptolensProductId:templateFor(q)))) });
    }
    required(store && operational,'store_setup_pending',503);
    const stripe = new Stripe(live?env.STRIPE_LIVE_SECRET_KEY:env.STRIPE_SECRET_KEY, { maxNetworkRetries:1, timeout:15000, httpClient:Stripe.createFetchHttpClient() });
    const lifecycle = (live?env.LIVE_LIFECYCLE_ENABLED:env.LIFECYCLE_ENABLED) === 'true' ? billingLifecycle(stripe,store,env,mode) : undefined;
    const dependencies = { stripe, store, tokens, baseUrl:mode.origin, lifecycle,mode,
      ...(live?{createLicense:liveLicenseCreator(tokens,store)}:{}),customerId:env.SANDBOX_CHECKOUT_CUSTOMER || CUSTOMER,
      report: event => console.log(JSON.stringify(event)),
      sendEmail: live?createStoreMailer({...env,LIVE_STORE_ORIGIN:mode.origin}):message => {
        required(message.recipient === recipient, 'sandbox_recipient_required', 503);
        return env.EMAIL.send({ to:recipient, from:{ email:env.EMAIL_FROM, name:'nPower Software' },
          subject:message.subject, text:message.text, html:message.html });
      } };
    const service=createService(dependencies);
    if (live && path === '/api/store/private-test' && request.method === 'POST') {
      required(env.LIVE_PURCHASE_TEST_ENABLED==='true', 'store_setup_pending', 503);
      await store.limit('private-test:'+await sha256(request.headers.get('cf-connecting-ip') || 'unknown'),10,600,now());
      const input=JSON.parse(await limitedBody(request,1024));
      const grant=await authorizePrivateTest(store,input.code,now());
      const testService=createService({...dependencies,mode:privateTestMode(mode,env.STRIPE_LIVE_TEST_PRICE_ID),purchaseTest:grant.purchaseTest});
      // The invitation always resolves to the same owner/attempt, including concurrent requests.
      const result=await testService.start(privateTestCart,grant.attempt,grant.ownerHash);
      await store.saveSession(grant.ownerHash,now());
      return json(result,200,{'Set-Cookie':mode.cookie+'='+input.code+'; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=172800'});
    }
    if (path === '/api/store/webhook' && request.method === 'POST') {
      let event;
      try {
        event = await stripe.webhooks.constructEventAsync(await limitedBody(request, 262144),
          request.headers.get('stripe-signature') || '', live?env.STRIPE_LIVE_WEBHOOK_SECRET:env.STRIPE_WEBHOOK_SECRET, 300, Stripe.createSubtleCryptoProvider());
      } catch { throw new CheckoutError('invalid_webhook_signature', 400); }
      return json({ status:await service.handleEvent(event) });
    }
    required(authenticated, live?'store_session_required':'sandbox_access_required', 401);
    if (path === '/api/store/checkout' && request.method === 'POST') {
      required(enabled,'store_setup_pending',503);
      if(live) await store.limit('checkout-ip:'+await sha256(request.headers.get('cf-connecting-ip') || 'unknown'),10,3600,now());
      await store.limit('checkout:' + authenticated, 30, 3600, now());
      const input = JSON.parse(await limitedBody(request));
      return json(await service.start(input.cart, input.attempt, authenticated));
    }
    if (path === '/api/store/continue' && request.method === 'POST') {
      required(enabled,'store_setup_pending',503);
      const input = JSON.parse(await limitedBody(request, 2048));
      return json({ url:await service.continue(input.order, authenticated) });
    }
    if (path === '/api/store/receipt' && request.method === 'GET') {
      let id = url.searchParams.get('order');
      const session = url.searchParams.get('session_id');
      if (session) {
        required((live?/^cs_live_[A-Za-z0-9]+$/:/^cs_test_[A-Za-z0-9]+$/).test(session), 'order_not_found', 404);
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
function billingLifecycle(stripe, store, env, mode=storeEnvironment(env)) {
  const tokens=mode.live?productTokens(env.CRYPTOLENS_LIVE_RENEWAL_TOKENS):renewalTokenMap(env);
  return createLifecycle({stripe,store,mode,licenses:cryptolensLifecycle(tokens,fetch,mode.live),
    expectedPrices:(plan,order)=>expectedPrices(plan,order,mode.catalog),report:event=>console.log(JSON.stringify(event))});
}
export async function scheduled(controller, env) {
  const liveTick=controller?.cron==='2-59/5 * * * *';
  if (!liveTick && env.TRIALS_ENABLED === 'true' && env.DB) await new TrialStore(env.DB).cleanup(now());
  // Separate environments so closing new live purchases never stops existing renewals.
  // Offset cron invocations keep each database within the per-invocation query budget.
  for(const live of [liveTick]) {
    if((live?env.LIVE_LIFECYCLE_ENABLED:env.LIFECYCLE_ENABLED)!=='true') continue;
    try {
      const mode=storeEnvironment(env,live);
      required(live?liveReadiness(env,mode).filter(s=>s!=='LIVE_STORE_ENABLED').length===0:configured(env),'store_setup_pending',503);
      const stripe=new Stripe(live?env.STRIPE_LIVE_SECRET_KEY:env.STRIPE_SECRET_KEY,{maxNetworkRetries:1,timeout:15000,httpClient:Stripe.createFetchHttpClient()});
      await billingLifecycle(stripe,new CartStore(mode.database),env,mode).scheduled();
    } catch(error) { console.error(JSON.stringify({code:'store_lifecycle_unavailable',environment:live?'live':'sandbox',type:error?.name || 'Error'})); }
  }
}
export default { fetch:handle, scheduled };
