import { catalog, quoteCart, cartCheckoutParameters, purchaseFlow } from './purchase-options.mjs';
import { CheckoutError, required } from './errors.mjs';
import { licenseEmail } from './license-email.mjs';

export const ACCOUNT = 'acct_1UQGwdJvz9ox51DZ';
export const MAX_SANDBOX_LICENSES = 10;
export const CUSTOMER = 'cus_VRAhVpG9174b2F';
const idOf = value => typeof value === 'string' ? value : value?.id;
export const templateFor = q => catalog.products.find(p => p.key === q.product)?.options.find(o => o.key === q.option)?.cryptolensTemplateId;

export function tokenMap(env) {
  let parsed;
  try { parsed = JSON.parse(env.CRYPTOLENS_TOKENS || '{}'); } catch { return new Map(); }
  return new Map(Object.entries(parsed).filter(([id, token]) =>
    /^\d+$/.test(id) && typeof token === 'string' && token.length > 20 && !/[\r\n]/.test(token)).map(([id, token]) => [Number(id), token]));
}
export function templateCreator(tokens, fetchImpl = fetch) {
  return async unit => {
    const token = tokens.get(unit.template_id);
    required(token, 'issuing_credential_missing', 503);
    // Never retry this non-idempotent API after an uncertain outcome.
    const response = await fetchImpl('https://api.cryptolens.io/api/key/CreateKeyFromTemplate', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token, LicenseTemplateId: String(unit.template_id), v: '1' }),
      signal: AbortSignal.timeout(15000), redirect: 'error'
    });
    required(response.ok, 'license_response_unavailable', 503);
    const reader = response.body?.getReader();
    required(reader, 'license_response_invalid', 503);
    const chunks = []; let length = 0;
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 65536) { await reader.cancel(); throw new CheckoutError('license_response_invalid', 503); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const result = JSON.parse(new TextDecoder().decode(bytes));
    required(result.result === 0 && /^[A-Z]{5}(?:-[A-Z]{5}){3}$/.test(result.key ?? ''), 'license_response_requires_review', 503);
    return result.key;
  };
}
export function expectedPrices(plan, order) {
  const prices = new Map();
  for (const q of order.quote.items.filter(q => plan.group.itemKeys.includes(q.key))) {
    const add = (id, product, amount, recurring, quantity, due) => {
      const old = prices.get(id);
      prices.set(id, { id, product, amount, recurring, quantity: quantity + (old?.quantity ?? 0), due: due + (old?.due ?? 0) });
    };
    add(q.stripePriceId, q.stripeProductId, q.unitAmount, q.access === 'annual', q.quantity, q.dueToday);
    if (q.maintenance) {
      const p = catalog.products.find(p => p.key === q.product);
      add(q.maintenancePriceId, p.maintenance.stripeProductId, p.maintenance.unitAmount, true, q.quantity, 0);
    }
  }
  return prices;
}
export function validatePayment(session, group, order) {
  const parameters = group.plan.parameters;
  required(session?.livemode === false && session.id?.startsWith('cs_test_'), 'sandbox_session_required');
  required(session.id === group.session_id && session.status === 'complete' && session.payment_status === 'paid', 'payment_not_paid');
  required(session.mode === parameters.mode && idOf(session.customer) === CUSTOMER, 'customer_or_mode_mismatch');
  required(session.metadata?.flow === purchaseFlow && session.metadata?.order_id === group.id &&
    session.metadata?.cart_order_id === order.id && session.client_reference_id === group.id, 'order_mismatch');
  required(session.currency === 'usd' && session.amount_total === group.plan.group.dueToday &&
    session.amount_subtotal === group.plan.group.dueToday, 'amount_mismatch');
  for (const field of ['amount_discount', 'amount_tax', 'amount_shipping'])
    required((session.total_details?.[field] ?? 0) === 0, 'unexpected_adjustment');
  const expected = expectedPrices(group.plan, order), lines = session.line_items;
  required(lines?.has_more === false && lines.data?.length === expected.size, 'line_items_mismatch');
  const seen = new Set();
  for (const line of lines.data) {
    const price = line.price, want = expected.get(price?.id);
    required(want && !seen.has(price.id), 'price_mismatch');
    seen.add(price.id);
    required(line.quantity === want.quantity && idOf(price.product) === want.product &&
      price.currency === 'usd' && price.unit_amount === want.amount && price.livemode === false, 'price_mismatch');
    required(price.type === (want.recurring ? 'recurring' : 'one_time') &&
      (!want.recurring || (price.recurring?.interval === 'year' && (price.recurring.interval_count ?? 1) === 1)), 'interval_mismatch');
    required(line.amount_total === want.due && (line.amount_subtotal === undefined || line.amount_subtotal === want.due), 'line_amount_mismatch');
  }
  if (parameters.mode === 'subscription') required(idOf(session.subscription)?.startsWith('sub_'), 'subscription_missing');
  else required(!session.subscription, 'unexpected_subscription');
}
export async function verifyEnvironment(stripe) {
  required((await stripe.accounts.retrieve()).id === ACCOUNT, 'wrong_stripe_account', 503);
  const customer = await stripe.customers.retrieve(CUSTOMER);
  required(!customer.deleted && customer.livemode === false, 'sandbox_customer_required', 503);
  const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
  required(!endpoints.has_more, 'webhook_inventory_requires_review', 503);
  required(!endpoints.data.some(e => e.status === 'enabled' && e.url.startsWith('https://api.cryptolens.io/api/Subscription/StripeUrl')),
    'legacy_webhook_must_be_disabled', 503);
}
export function createService({ stripe, store, tokens, baseUrl, sendEmail, createLicense = templateCreator(tokens),
  report = () => {}, clock = () => Math.floor(Date.now() / 1000) }) {
  const ready = items => items.every(q => tokens.has(templateFor(q)));
  async function authorized(id, ownerHash) {
    const order = await store.order(id);
    required(order && order.owner_hash === ownerHash, 'order_not_found', 404);
    return order;
  }
  async function deliver(id) {
    const groups = await store.groups(id);
    if (!groups.every(g => g.status === 'fulfilled')) return;
    const units = (await Promise.all(groups.map(g => store.units(g.id)))).flat();
    await store.queueMail(id, licenseEmail(await store.order(id), units));
    if (!(await store.claimMail(id))) return;
    try {
      const message = await store.mail(id);
      const result = await sendEmail(message);
      await store.finishMail(id, result.messageId);
    } catch {
      // The provider may have accepted the message before a timeout. Do not double-send.
      await store.reviewMail(id);
      report({ code: 'email_requires_review', orderId: id });
    }
  }
  async function startGroup(order, group) {
    required(group.status === 'pending', 'group_not_pending', 409);
    if (group.checkout_url) {
      required(order.created + 7200 > clock(), 'checkout_expired_start_again', 410);
      return group.checkout_url;
    }
    required(order.created > clock() - 3500, 'checkout_expired_start_again', 410);
    required(ready((await store.units(group.id)).map(u => u.selection)), 'issuing_credentials_missing', 503);
    await verifyEnvironment(stripe);
    for (const price of expectedPrices(group.plan, order).values()) {
      const actual = await stripe.prices.retrieve(price.id);
      required(actual.active && actual.livemode === false && actual.currency === 'usd' &&
        actual.unit_amount === price.amount && idOf(actual.product) === price.product, 'sandbox_price_not_ready', 503);
      required(actual.type === (price.recurring ? 'recurring' : 'one_time') &&
        (!price.recurring || (actual.recurring?.interval === 'year' && (actual.recurring.interval_count ?? 1) === 1)), 'price_interval_mismatch', 503);
    }
    const session = await stripe.checkout.sessions.create({ ...group.plan.parameters, expires_at: order.created + 7200 },
      { idempotencyKey: group.plan.idempotencyKey });
    required(session.livemode === false && session.id?.startsWith('cs_test_'), 'sandbox_session_required');
    const url = new URL(session.url);
    required(url.protocol === 'https:' && url.hostname === 'checkout.stripe.com', 'invalid_checkout_url');
    await store.bind(group.id, session.id, session.url);
    return session.url;
  }
  const service = {
    ready,
    async receipt(id, ownerHash) {
      const order = await authorized(id, ownerHash), groups = await store.groups(id);
      return { id, quote: order.quote, complete: groups.every(g => g.status === 'fulfilled'),
        groups: await Promise.all(groups.map(async g => ({
          id: g.id, position: g.position, status: g.status, dueToday: g.plan.group.dueToday,
          licenses: (await store.units(g.id)).filter(u => u.status === 'issued').map(u => ({
            product: u.selection.productName, option: u.selection.option, key: u.license_key, ordinal: u.ordinal
          }))
        }))), email: (await store.mail(id))?.status ?? 'waiting_for_licenses' };
    },
    async start(input, attempt, ownerHash) {
      required(/^[a-zA-Z0-9_-]{16,100}$/.test(attempt ?? ''), 'checkout_attempt_required');
      const now = clock(), quote = quoteCart(input, now);
      required(quote.items.length && quote.licenseCount <= MAX_SANDBOX_LICENSES, 'sandbox_license_limit');
      required(ready(quote.items), 'issuing_credentials_missing', 503);
      const order = await store.open(ownerHash, attempt, quote,
        id => cartCheckoutParameters(input, { orderId: id, customerId: CUSTOMER, baseUrl, now }), templateFor, now);
      return { orderId: order.id, url: await service.continue(order.id, ownerHash) };
    },
    async continue(id, ownerHash) {
      const order = await authorized(id, ownerHash), groups = await store.groups(id);
      const next = groups.find(g => g.status !== 'fulfilled');
      if (!next) return baseUrl + '/checkout/receipt/?order=' + id;
      required(next.status === 'pending', 'fulfillment_requires_review', 503);
      // Stripe's idempotency key and D1 constraints coordinate separate Worker isolates.
      return startGroup(order, next);
    },
    async handleEvent(event) {
      required(event?.livemode === false, 'sandbox_event_required');
      required((!event.account || event.account === ACCOUNT) && (!event.context || event.context === ACCOUNT), 'account_mismatch');
      const stub = event.data?.object;
      if (['invoice.paid','invoice.payment_failed','customer.subscription.updated','customer.subscription.deleted'].includes(event.type)) {
        const subId = event.type.startsWith('invoice.') ? idOf(stub?.parent?.subscription_details?.subscription ?? stub?.subscription) : stub?.id;
        const group = subId && await store.forSubscription(subId);
        if (!group) return 'ignored';
        const status = event.type === 'invoice.paid' && stub.billing_reason === 'subscription_create' ? 'initial_invoice_recorded' : 'sandbox_lifecycle_review';
        await store.lifecycle(event, subId, status);
        return status;
      }
      if (!['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type) ||
        stub?.metadata?.flow !== purchaseFlow) return 'ignored';
      required(stub.id?.startsWith('cs_test_'), 'sandbox_session_required');
      const session = await stripe.checkout.sessions.retrieve(stub.id, { expand: ['line_items'] });
      if (session.payment_status === 'unpaid') return 'awaiting_payment';
      if (session.line_items?.has_more) {
        session.line_items = await stripe.checkout.sessions.listLineItems(session.id, { limit:100 });
      }
      const group = await store.forSession(session.id);
      required(group, 'order_not_found', 503);
      const order = await store.order(group.order_id);
      validatePayment(session, group, order);
      if (group.status === 'fulfilled') { await deliver(order.id); return 'already_fulfilled'; }
      const subscriptionId = idOf(session.subscription);
      if (subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        required(sub.livemode === false && idOf(sub.customer) === CUSTOMER && ['active','trialing'].includes(sub.status), 'subscription_not_ready');
        required(sub.metadata?.order_id === group.id && sub.metadata?.cart_order_id === order.id &&
          sub.metadata?.flow === purchaseFlow, 'subscription_mismatch');
        const trial = group.plan.parameters.subscription_data?.trial_end;
        required(trial ? sub.trial_end === trial && !sub.cancel_at_period_end : !sub.trial_end, 'subscription_trial_mismatch');
        const expected = [...expectedPrices(group.plan, order).values()].filter(p => p.recurring);
        required(sub.items?.has_more === false && sub.items.data?.length === expected.length, 'subscription_items_mismatch');
        for (const p of expected) required(sub.items.data.some(i => i.price.id === p.id && i.quantity === p.quantity), 'subscription_items_mismatch');
      }
      required(await store.claim(group.id, event.id, subscriptionId), 'fulfillment_requires_review', 503);
      try {
        for (const unit of await store.units(group.id)) {
          if (unit.status === 'issued') continue;
          required(await store.claimUnit(unit.id), 'unit_requires_review', 503);
          try { await store.finishUnit(unit.id, await createLicense(unit)); }
          catch (error) { await store.reviewUnit(unit.id); throw error; }
        }
        await store.finish(group.id);
      } catch {
        await store.review(group.id, 'license_issuance_requires_review');
        report({ code: 'cart_fulfillment_requires_review', orderId: order.id });
        throw new CheckoutError('fulfillment_requires_review', 503);
      }
      // Email/database delivery failures must never reset an already fulfilled license group.
      await deliver(order.id);
      report({ code: 'cart_group_fulfilled', orderId: order.id, groupId: group.id });
      return 'fulfilled';
    }
  };
  return service;
}
