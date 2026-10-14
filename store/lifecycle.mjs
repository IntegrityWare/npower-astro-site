import { CheckoutError, required } from './errors.mjs';
import { purchaseFlow, anniversary } from './purchase-options.mjs';
import { LifecycleStore } from './lifecycle-store.mjs';
import { utcDay, paidDay } from './cryptolens-lifecycle.mjs';

const idOf = value => typeof value === 'string' ? value : value?.id;
const invoiceSub = invoice => idOf(invoice.parent?.subscription_details?.subscription ?? invoice.subscription);
const empty = values => !values || values.length === 0;
const supportedEvents = new Set(['invoice.paid','invoice.payment_failed','customer.subscription.updated','customer.subscription.deleted']);

export function validateSubscription(sub, group, order, prices, customer) {
  required(sub?.id === group.subscription_id && sub.livemode === false && idOf(sub.customer) === customer,
    'renewal_subscription_mismatch', 503);
  required(sub.metadata?.flow === purchaseFlow && sub.metadata?.order_id === group.id &&
    sub.metadata?.cart_order_id === order.id, 'renewal_order_mismatch', 503);
  required(['active','trialing','past_due','unpaid','canceled','paused'].includes(sub.status), 'renewal_subscription_state_requires_review', 503);
  const expected = [...prices.values()].filter(p => p.recurring);
  required(sub.items?.has_more === false && sub.items.data?.length === expected.length, 'renewal_items_changed', 503);
  const seen = new Set();
  for (const item of sub.items.data) {
    const p = prices.get(item.price?.id);
    required(p?.recurring && !seen.has(p.id) && item.quantity === p.quantity &&
      item.price.livemode === false && item.price.currency === 'usd' &&
      item.price.unit_amount === p.amount && idOf(item.price.product) === p.product &&
      item.price.recurring?.interval === 'year' && (item.price.recurring.interval_count ?? 1) === 1,
    'renewal_items_changed', 503);
    seen.add(p.id);
  }
  required(!sub.pause_collection, 'renewal_paused_collection_requires_review', 503);
}
export function paidPeriods(invoice, group, prices, customer) {
  required(invoice.livemode === false && invoiceSub(invoice) === group.subscription_id && idOf(invoice.customer) === customer,
    'renewal_invoice_identity_mismatch', 503);
  if (invoice.status !== 'paid') return [];
  required(invoice.currency === 'usd' && invoice.amount_remaining === 0 && invoice.amount_paid === invoice.total &&
    invoice.total > 0 && !invoice.paid_out_of_band &&
    !invoice.pre_payment_credit_notes_amount && !invoice.post_payment_credit_notes_amount &&
    empty(invoice.total_discount_amounts) && empty(invoice.total_taxes) && empty(invoice.total_pretax_credit_amounts),
    'renewal_invoice_adjustment_requires_review', 503);
  const initial = invoice.billing_reason === 'subscription_create';
  required(initial || invoice.billing_reason === 'subscription_cycle', 'renewal_invoice_reason_requires_review', 503);
  const expected = new Map([...prices].filter(([,p]) => initial || p.recurring));
  required(invoice.lines?.has_more === false && invoice.lines.data?.length === expected.size, 'renewal_invoice_lines_mismatch', 503);
  const seen = new Set(), periods = []; let total = 0;
  for (const line of invoice.lines.data) {
    const details = line.pricing?.price_details;
    const priceId = idOf(details?.price ?? line.price);
    const p = expected.get(priceId), parent = line.parent?.subscription_item_details ?? line.parent?.invoice_item_details;
    required(p && !seen.has(priceId), 'renewal_invoice_price_mismatch', 503);
    seen.add(priceId);
    const due = initial ? p.due : p.amount * p.quantity;
    required(line.livemode === false && line.currency === 'usd' && line.quantity === p.quantity &&
      (line.quantity_decimal === undefined || Number(line.quantity_decimal) === p.quantity) &&
      idOf(details?.product ?? line.price?.product) === p.product &&
      line.amount === due && (line.subtotal === undefined || line.subtotal === due) &&
      parent?.proration === false && idOf(parent.subscription) === group.subscription_id &&
      empty(line.discount_amounts) && empty(line.taxes) && empty(line.pretax_credit_amounts),
    'renewal_invoice_line_requires_review', 503);
    total += due;
    if (!p.recurring) continue;
    const { start, end } = line.period || {};
    required(Number.isSafeInteger(start) && Number.isSafeInteger(end) && end > start,
      'renewal_period_invalid', 503);
    if (initial && group.plan.parameters.subscription_data?.trial_end) {
      required(end === group.plan.parameters.subscription_data.trial_end && due === 0, 'renewal_trial_mismatch', 503);
    } else {
      required(end === anniversary(start), 'renewal_period_not_annual', 503);
      const included = group.plan.parameters.subscription_data?.trial_end;
      required(!included || start >= included, 'maintenance_before_included_year', 503);
    }
    periods.push({ price:priceId, start, end });
  }
  required(total === invoice.total, 'renewal_invoice_total_mismatch', 503);
  return periods;
}
export function createLifecycle({ stripe, store, licenses, expectedPrices,
  report = () => {}, clock = () => Math.floor(Date.now()/1000) }) {
  const state = new LifecycleStore(store);
  async function reconcile(groupId, eventInvoiceId) {
    const token = crypto.randomUUID();
    if (!(await state.claim(groupId, token, clock()))) throw new CheckoutError('renewal_sync_busy', 503);
    let sub;
    try {
      const group = await store.group(groupId), order = group && await store.order(group.order_id);
      required(group?.status === 'fulfilled' && group.subscription_id, 'renewal_waiting_for_fulfillment', 503);
      const prices = expectedPrices(group.plan, order), customer = group.plan.parameters.customer;
      required(/^cus_[A-Za-z0-9]+$/.test(customer), 'renewal_customer_missing', 503);
      sub = await stripe.subscriptions.retrieve(group.subscription_id);
      validateSubscription(sub, group, order, prices, customer);
      // Current Stripe state wins over the order in which events are delivered.
      // The newest paid invoice also recovers a missed invoice.paid webhook.
      const latest = await stripe.invoices.list({ subscription:sub.id, status:'paid', limit:1 });
      const invoices = [...latest.data];
      if (eventInvoiceId && !invoices.some(i => i.id === eventInvoiceId)) invoices.push(await stripe.invoices.retrieve(eventInvoiceId));
      for (const invoice of invoices) {
        if (invoice.lines?.has_more) invoice.lines = await stripe.invoices.listLineItems(invoice.id, { limit:100 });
        const periods = paidPeriods(invoice, group, prices, customer);
        await state.periods(groupId, invoice.id, periods);
      }
      const paid = new Map((await state.targets(groupId)).map(p => [p.price_id,p.paid_through]));
      const units = (await store.units(groupId)).filter(u => u.status === 'issued' &&
        (u.selection.access === 'annual' || u.selection.maintenance));
      const targets = new Map(units.map(u => {
        const q = u.selection, price = q.access === 'annual' ? q.stripePriceId : q.maintenancePriceId;
        // Initial paid checkout already proved this entitlement; maintenance is included for a year.
        return [u.id, Math.max(q.firstRenewal, paid.get(price) ?? 0)];
      }));
      await state.initialize(units, targets);
      const states = await state.states(groupId);
      const todo = states.filter(s => s.attempt_id || s.applied_day === null || (paidDay(targets.get(s.unit_id)) > utcDay(clock()) && s.applied_day < paidDay(targets.get(s.unit_id))));
      // Bound D1 queries and vendor requests on the free Worker plan. Cron completes larger groups.
      for (const row of todo.slice(0,3)) {
        await state.owned(groupId, token, clock());
        const unit = units.find(u => u.id === row.unit_id), target = paidDay(targets.get(unit.id));
        const current = await licenses.read(unit);
        if (row.attempt_id) {
          // ExtendLicense is additive and has no idempotency key. Never repeat an uncertain request.
          if (current.day < row.attempt_target) {
            await state.uncertain(unit.id);
            throw new CheckoutError('renewal_outcome_uncertain', 503);
          }
          await state.applied(unit.id, current.day);
          // A newer paid period is handled on the next pass after resolving this attempt.
          continue;
        }
        if (current.day >= target) { await state.applied(unit.id, current.day); continue; }
        const days = target - Math.max(current.day, utcDay(clock()));
        if (days <= 0) { await state.applied(unit.id, current.day); continue; }
        required(await state.begin(unit.id, crypto.randomUUID(), current.day, target), 'renewal_sync_busy', 503);
        try {
          await licenses.extend(unit, days);
          const updated = await licenses.read(unit);
          required(updated.day === target, 'renewal_date_requires_review', 503);
          await state.applied(unit.id, updated.day);
        } catch {
          await state.uncertain(unit.id);
          throw new CheckoutError('renewal_outcome_uncertain', 503);
        }
      }
      const remaining = (await state.states(groupId)).some(s => s.attempt_id || s.applied_day === null || (paidDay(targets.get(s.unit_id)) > utcDay(clock()) && s.applied_day < paidDay(targets.get(s.unit_id))));
      const status = remaining ? 'pending' : 'synced';
      await state.release(groupId, token, status, clock() + (remaining ? 60 : 86400), clock(), sub);
      report({code:'subscription_licenses_' + status, groupId, subscriptionStatus:sub.status});
      return status;
    } catch (error) {
      const reason = error instanceof CheckoutError ? error.code : 'renewal_service_unavailable';
      await state.release(groupId, token, 'review', clock() + 300, clock(), sub, reason);
      report({code:reason,groupId});
      throw error;
    }
  }
  return {
    state, reconcile,
    async event(event) {
      if (!supportedEvents.has(event.type)) return 'ignored';
      const stub = event.data?.object;
      const subId = event.type.startsWith('invoice.') ? invoiceSub(stub) : stub?.id;
      if (!subId) return 'ignored';
      let group = await store.forSubscription(subId);
      if (!group) {
        const canonical = await stripe.subscriptions.retrieve(subId);
        if (canonical.metadata?.flow !== purchaseFlow) return 'ignored';
        group = await store.group(canonical.metadata.order_id);
        // Stripe may send invoice.paid before checkout.session.completed has bound the subscription.
        required(group && group.subscription_id === subId && group.status === 'fulfilled', 'renewal_waiting_for_fulfillment', 503);
      }
      await state.enqueue(group.id);
      const status = await reconcile(group.id, event.type.startsWith('invoice.') ? stub.id : undefined);
      await state.event(event, subId, status);
      return 'lifecycle_' + status;
    },
    async scheduled() {
      await state.seed();
      const due = await state.due(clock());
      return due ? reconcile(due.group_id) : 'idle';
    }
  };
}
