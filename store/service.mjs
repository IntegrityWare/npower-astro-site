import { catalog, quoteCart, cartCheckoutParameters, purchaseFlow } from './purchase-options.mjs';
import { CheckoutError, required } from './errors.mjs';
import { licenseEmail } from './license-email.mjs';
import { validMailbox } from './environment.mjs';

export const ACCOUNT = 'acct_1UQGwdJvz9ox51DZ';
export const MAX_SANDBOX_LICENSES = 10;
export const MAX_LIVE_LICENSES = 3;
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
    // Workers supports manual/follow redirects; manual prevents forwarding the issuing token.
    const response = await fetchImpl('https://api.cryptolens.io/api/key/CreateKeyFromTemplate', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token, LicenseTemplateId: String(unit.template_id), v: '1' }),
      signal: AbortSignal.timeout(15000), redirect: 'manual'
    });
    required(response.ok, 'license_response_http_' + response.status, 503);
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
export function expectedPrices(plan, order, products = catalog) {
  const prices = new Map();
  for (const q of order.quote.items.filter(q => plan.group.itemKeys.includes(q.key))) {
    const add = (id, product, amount, recurring, quantity, due) => {
      const old = prices.get(id);
      prices.set(id, { id, product, amount, recurring, quantity: quantity + (old?.quantity ?? 0), due: due + (old?.due ?? 0) });
    };
    add(q.stripePriceId, q.stripeProductId, q.unitAmount, q.access === 'annual', q.quantity, q.dueToday);
    if (q.maintenance) {
      const p = products.products.find(p => p.key === q.product);
      add(q.maintenancePriceId, q.maintenanceProductId ?? p.maintenance.stripeProductId, q.maintenanceUnitAmount ?? p.maintenance.unitAmount, true, q.quantity, 0);
    }
  }
  return prices;
}
export function validatePayment(session, group, order, mode = {}) {
  const live = mode.live === true, flow = mode.flow ?? purchaseFlow;
  required((order.quote.environment ?? 'sandbox') === (live ? 'live' : 'sandbox'), 'order_environment_mismatch', 503);
  const parameters = group.plan.parameters;
  required(session?.livemode === live && session.id?.startsWith(live ? 'cs_live_' : 'cs_test_'), 'payment_environment_mismatch');
  required(session.id === group.session_id && session.status === 'complete' && session.payment_status === 'paid', 'payment_not_paid');
  required(session.mode === parameters.mode && idOf(session.customer) === parameters.customer, 'customer_or_mode_mismatch');
  required(session.metadata?.flow === flow && session.metadata?.order_id === group.id &&
    session.metadata?.cart_order_id === order.id && session.client_reference_id === group.id, 'order_mismatch');
  required(session.currency === 'usd' && session.amount_total === group.plan.group.dueToday &&
    session.amount_subtotal === group.plan.group.dueToday, 'amount_mismatch');
  for (const field of ['amount_discount', 'amount_tax', 'amount_shipping'])
    required((session.total_details?.[field] ?? 0) === 0, 'unexpected_adjustment');
  const expected = expectedPrices(group.plan, order, mode.catalog), lines = session.line_items;
  required(lines?.has_more === false && lines.data?.length === expected.size, 'line_items_mismatch');
  const seen = new Set();
  for (const line of lines.data) {
    const price = line.price, want = expected.get(price?.id);
    required(want && !seen.has(price.id), 'price_mismatch');
    seen.add(price.id);
    required(line.quantity === want.quantity && idOf(price.product) === want.product &&
      price.currency === 'usd' && price.unit_amount === want.amount && price.livemode === live, 'price_mismatch');
    required(price.type === (want.recurring ? 'recurring' : 'one_time') &&
      (!want.recurring || (price.recurring?.interval === 'year' && (price.recurring.interval_count ?? 1) === 1)), 'interval_mismatch');
    required(line.amount_total === want.due && (line.amount_subtotal === undefined || line.amount_subtotal === want.due), 'line_amount_mismatch');
  }
  if (parameters.mode === 'subscription') required(idOf(session.subscription)?.startsWith('sub_'), 'subscription_missing');
  else required(!session.subscription, 'unexpected_subscription');
}
export async function verifyEnvironment(stripe, customerId = CUSTOMER, mode = {}) {
  const live = mode.live === true, account = await stripe.accounts.retrieve();
  required(account.id === (mode.accountId ?? ACCOUNT) && (!live || account.charges_enabled === true), 'wrong_stripe_account', 503);
  if (customerId) {
    const customer = await stripe.customers.retrieve(customerId);
    required(customer.id === customerId && !customer.deleted && customer.livemode === live &&
      (live ? customer.metadata?.npower_store_flow === mode.flow : customerId === CUSTOMER || customer.metadata?.npower_lifecycle_test === purchaseFlow),
      live?'checkout_customer_mismatch':'sandbox_customer_required', 503);
  } else required(live, 'sandbox_customer_required', 503);
  const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
  required(!endpoints.has_more, 'webhook_inventory_requires_review', 503);
  required(!endpoints.data.some(e => e.status === 'enabled' && e.url.startsWith('https://api.cryptolens.io/api/Subscription/StripeUrl')),
    'legacy_webhook_must_be_disabled', 503);
}
export function createService({ stripe, store, tokens, baseUrl, sendEmail, createLicense = templateCreator(tokens),
  lifecycle, customerId = CUSTOMER, mode = {}, report = () => {}, clock = () => Math.floor(Date.now() / 1000) }) {
  const live = mode.live === true, flow = mode.flow ?? purchaseFlow, products = mode.catalog ?? catalog;
  const unitTemplate = q => live ? q.cryptolensProductId : templateFor(q);
  const pricesFor = (plan, order) => expectedPrices(plan, order, products);
  const ready = items => items.every(q => tokens.has(unitTemplate(q)));
  async function authorized(id, ownerHash) {
    const order = await store.order(id);
    required(order && order.owner_hash === ownerHash, 'order_not_found', 404);
    required((order.quote.environment ?? 'sandbox') === (live ? 'live' : 'sandbox'), 'order_environment_mismatch', 503);
    return order;
  }
  async function deliver(id) {
    const groups = await store.groups(id);
    if (!groups.every(g => g.status === 'fulfilled')) return;
    const units = (await Promise.all(groups.map(g => store.units(g.id)))).flat();
    await store.queueMail(id, licenseEmail(await store.order(id), units, { live, origin:baseUrl }));
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
    await verifyEnvironment(stripe, group.plan.parameters.customer, mode);
    for (const price of pricesFor(group.plan, order).values()) {
      const actual = await stripe.prices.retrieve(price.id);
      required(actual.active && actual.livemode === live && actual.currency === 'usd' &&
        actual.unit_amount === price.amount && idOf(actual.product) === price.product, 'price_not_ready', 503);
      required(actual.type === (price.recurring ? 'recurring' : 'one_time') &&
        (!price.recurring || (actual.recurring?.interval === 'year' && (actual.recurring.interval_count ?? 1) === 1)), 'price_interval_mismatch', 503);
    }
    const session = await stripe.checkout.sessions.create({
      ...group.plan.parameters,
      ui_mode: 'hosted_page',
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: false },
      automatic_tax: { enabled: false },
      allow_promotion_codes: false,
      ...(group.plan.parameters.mode === 'subscription' ? { payment_method_collection: 'always' } : {}),
      submit_type: 'auto',
      integration_identifier: 'hosted_web_0001',
      origin_context: 'web',
      expires_at: order.created + 7200
    }, { idempotencyKey: group.plan.idempotencyKey });
    required(session.livemode === live && session.id?.startsWith(live ? 'cs_live_' : 'cs_test_'), 'payment_environment_mismatch');
    const url = new URL(session.url);
    required(url.protocol === 'https:' && url.hostname === 'checkout.stripe.com', 'invalid_checkout_url');
    await store.bind(group.id, session.id, session.url);
    return session.url;
  }
  const service = {
    ready,
    async receipt(id, ownerHash) {
      const order = await authorized(id, ownerHash), groups = await store.groups(id);
      return { id, sandbox:!live, quote: order.quote, complete: groups.every(g => g.status === 'fulfilled'),
        groups: await Promise.all(groups.map(async g => {
          const dates = lifecycle ? await lifecycle.state.states(g.id) : [];
          return ({
          id: g.id, position: g.position, status: g.status, dueToday: g.plan.group.dueToday,
          billing: lifecycle ? await lifecycle.state.summary(g.id) : null,
          licenses: (await store.units(g.id)).filter(u => u.status === 'issued').map(u => ({
            product: u.selection.productName, option: u.selection.option, key: u.license_key, ordinal: u.ordinal,
            access: u.selection.access, paidThrough: dates.find(d => d.unit_id === u.id)?.paid_through ?? u.selection.firstRenewal ?? u.selection.includedMaintenanceEnd
          }))
        }); })), email: (await store.mail(id))?.status ?? 'waiting_for_licenses' };
    },
    async start(input, attempt, ownerHash) {
      required(/^[a-zA-Z0-9_-]{16,100}$/.test(attempt ?? ''), 'checkout_attempt_required');
      const now = clock(), quote = quoteCart(input, now, products);
      required(quote.items.length && quote.licenseCount <= (live ? MAX_LIVE_LICENSES : MAX_SANDBOX_LICENSES), live?'license_limit':'sandbox_license_limit');
      required(ready(quote.items), 'issuing_credentials_missing', 503);
      let checkoutCustomer = customerId;
      if (live) {
        const prior = await store.findAttempt(ownerHash, attempt);
        if (prior) checkoutCustomer = (await store.groups(prior.id))[0].plan.parameters.customer;
        else {
          await verifyEnvironment(stripe, null, mode);
          const created = await stripe.customers.create({ metadata:{ npower_store_flow:flow } },
            { idempotencyKey:flow + ':customer:' + ownerHash + ':' + attempt });
          required(created?.livemode === true && /^cus_[A-Za-z0-9]+$/.test(created.id), 'checkout_customer_mismatch', 503);
          checkoutCustomer = created.id;
        }
      }
      const order = await store.open(ownerHash, attempt, quote,
        id => cartCheckoutParameters(input, { orderId: id, customerId:checkoutCustomer, baseUrl, now, catalog:products, flow }), unitTemplate, now);
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
      required(event?.livemode === live, 'payment_environment_mismatch');
      required((!event.account || event.account === (mode.accountId ?? ACCOUNT)) && (!event.context || event.context === (mode.accountId ?? ACCOUNT)), 'account_mismatch');
      const stub = event.data?.object;
      if (['invoice.paid','invoice.payment_failed','customer.subscription.updated','customer.subscription.deleted'].includes(event.type)) {
        if (lifecycle) return lifecycle.event(event);
        const subId = event.type.startsWith('invoice.') ? idOf(stub?.parent?.subscription_details?.subscription ?? stub?.subscription) : stub?.id;
        const group = subId && await store.forSubscription(subId);
        if (!group) return 'ignored';
        const status = event.type === 'invoice.paid' && stub.billing_reason === 'subscription_create' ? 'initial_invoice_recorded' : 'sandbox_lifecycle_review';
        await store.lifecycle(event, subId, status);
        return status;
      }
      if (!['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type) ||
        stub?.metadata?.flow !== flow) return 'ignored';
      required(stub.id?.startsWith(live ? 'cs_live_' : 'cs_test_'), 'payment_environment_mismatch');
      const session = await stripe.checkout.sessions.retrieve(stub.id, { expand: ['line_items'] });
      if (session.payment_status === 'unpaid') return 'awaiting_payment';
      if (session.line_items?.has_more) {
        session.line_items = await stripe.checkout.sessions.listLineItems(session.id, { limit:100 });
      }
      const group = await store.forSession(session.id);
      required(group, 'order_not_found', 503);
      const order = await store.order(group.order_id);
      validatePayment(session, group, order, mode);
      if (live) {
        const email = session.customer_details?.email?.trim().toLowerCase();
        required(validMailbox(email), 'buyer_email_missing', 503);
        await store.saveBuyer(order.id, email, String(session.customer_details?.name || '').slice(0,200));
        order.buyer_email = email;
        order.buyer_name = String(session.customer_details?.name || '').slice(0,200);
      }
      if (group.status === 'fulfilled') {
        if (lifecycle && group.subscription_id) await lifecycle.state.enqueue(group.id);
        await deliver(order.id); return 'already_fulfilled';
      }
      const subscriptionId = idOf(session.subscription);
      if (subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        required(sub.livemode === live && idOf(sub.customer) === group.plan.parameters.customer && ['active','trialing'].includes(sub.status), 'subscription_not_ready');
        required(sub.metadata?.order_id === group.id && sub.metadata?.cart_order_id === order.id &&
          sub.metadata?.flow === flow, 'subscription_mismatch');
        const trial = group.plan.parameters.subscription_data?.trial_end;
        required(trial ? sub.trial_end === trial && !sub.cancel_at_period_end : !sub.trial_end, 'subscription_trial_mismatch');
        const expected = [...pricesFor(group.plan, order).values()].filter(p => p.recurring);
        required(sub.items?.has_more === false && sub.items.data?.length === expected.length, 'subscription_items_mismatch');
        for (const p of expected) required(sub.items.data.some(i => i.price.id === p.id && i.quantity === p.quantity), 'subscription_items_mismatch');
      }
      required(await store.claim(group.id, event.id, subscriptionId), 'fulfillment_requires_review', 503);
      try {
        for (const unit of await store.units(group.id)) {
          if (unit.status === 'issued') continue;
          required(await store.claimUnit(unit.id), 'unit_requires_review', 503);
          try { await store.finishUnit(unit.id, await createLicense(unit, order)); }
          catch (error) {
            const reason = error instanceof CheckoutError ? error.code :
              error?.name === 'TimeoutError' ? 'license_request_timeout' :
              error instanceof SyntaxError ? 'license_response_not_json' : 'license_request_failed';
            await store.reviewUnit(unit.id, reason);
            report({ code: reason, orderId: order.id, templateId: unit.template_id });
            throw error;
          }
        }
        await store.finish(group.id);
      } catch {
        await store.review(group.id, 'license_issuance_requires_review');
        report({ code: 'cart_fulfillment_requires_review', orderId: order.id });
        throw new CheckoutError('fulfillment_requires_review', 503);
      }
      if (lifecycle && subscriptionId) await lifecycle.state.enqueue(group.id);
      // Email/database delivery failures must never reset an already fulfilled license group.
      await deliver(order.id);
      report({ code: 'cart_group_fulfilled', orderId: order.id, groupId: group.id });
      return 'fulfilled';
    }
  };
  return service;
}
