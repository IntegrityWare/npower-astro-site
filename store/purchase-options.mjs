import { CheckoutError } from './errors.mjs';
import catalogData from './catalog.sandbox.json' with { type: 'json' };

export const catalog = catalogData;
export const purchaseFlow = 'npower_hosted_sandbox_v1';
export const money = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100);
export function anniversary(seconds) {
  const date = new Date(seconds * 1000);
  const month = date.getUTCMonth();
  date.setUTCFullYear(date.getUTCFullYear() + 1);
  if (date.getUTCMonth() !== month) date.setUTCDate(0);
  return Math.floor(date.getTime() / 1000);
}
export function quotePurchase(input, now = Math.floor(Date.now() / 1000)) {
  if (!input || typeof input !== 'object') throw new CheckoutError('invalid_cart', 400);
  const product = catalog.products.find(p => p.key === input.product);
  if (!product) throw new CheckoutError('invalid_cart', 400);
  const option = product.options.find(o => o.key === input.option);
  if (!option) throw new CheckoutError('invalid_cart', 400);
  if (!/^[1-9][0-9]?$/.test(String(input.quantity ?? ''))) throw new CheckoutError('invalid_cart', 400);
  const quantity = Number(input.quantity);
  if (typeof input.maintenance !== 'boolean') throw new CheckoutError('invalid_cart', 400);
  if (input.maintenance && option.access !== 'perpetual') throw new CheckoutError('invalid_cart', 400);
  const firstRenewal = anniversary(now);
  return {
    product: product.key, productName: product.name, option: option.key,
    licenseType: option.licenseType, access: option.access, quantity,
    maintenance: input.maintenance, currency: 'usd', unitAmount: option.unitAmount,
    dueToday: option.unitAmount * quantity,
    annualRenewal: option.access === 'annual' ? option.unitAmount * quantity :
      input.maintenance ? product.maintenance.unitAmount * quantity : 0,
    firstRenewal: option.access === 'annual' || input.maintenance ? firstRenewal : null,
    includedMaintenanceEnd: option.access === 'perpetual' ? firstRenewal : null,
    computersPerLicense: option.licenseType === 'node_locked' ? product.nodeLockedComputersPerLicense : null,
    concurrentUsers: option.licenseType === 'floating' ? quantity * product.floatingConcurrentUsersPerQuantity : null,
    stripePriceId: option.stripePriceId, stripeProductId: product.stripeProductId,
    maintenancePriceId: input.maintenance ? product.maintenance.stripePriceId : null,
    cryptolensProductId: product.cryptolensProductId,
  };
}

export function quoteCart(input, now = Math.floor(Date.now() / 1000)) {
  if (!Array.isArray(input) || input.length > 20) throw new CheckoutError('invalid_cart', 400);
  const selections = new Map();
  for (const item of input) {
    const q = quotePurchase(item, now);
    const key = [q.product,q.option,q.maintenance ? 'maintenance' : 'license'].join(':');
    const prior = selections.get(key);
    const quantity = q.quantity + (prior?.quantity ?? 0);
    selections.set(key, { ...quotePurchase({ ...q, quantity }, now), key });
  }
  const items = [...selections.values()];
  const deferred = items.some(q => q.maintenance);
  const groups = [];
  const immediateItems = items.filter(q => q.access === 'annual' || !deferred);
  const deferredItems = deferred ? items.filter(q => q.access === 'perpetual') : [];
  for (const [key, groupItems] of [['immediate',immediateItems],['deferred_maintenance',deferredItems]]) {
    if (!groupItems.length) continue;
    groups.push({ key, itemKeys: groupItems.map(q=>q.key),
      dueToday: groupItems.reduce((sum,q)=>sum+q.dueToday,0),
      annualRenewal: groupItems.reduce((sum,q)=>sum+q.annualRenewal,0) });
  }
  return { items, groups, currency:'usd', licenseCount:items.reduce((s,q)=>s+q.quantity,0),
    dueToday:items.reduce((s,q)=>s+q.dueToday,0),annualRenewal:items.reduce((s,q)=>s+q.annualRenewal,0) };
}

export function cartCheckoutParameters(input, context) {
  const cart = quoteCart(input, context.now);
  if (!cart.items.length) throw new CheckoutError('invalid_cart', 400);
  return cart.groups.map(group => {
    const items=cart.items.filter(q=>group.itemKeys.includes(q.key));
    const seed=items.find(q=>q.maintenance) ?? items.find(q=>q.access==='annual') ?? items[0];
    const orderId=context.orderId+'-'+group.key;
    const result=checkoutParameters(seed,{...context,orderId});
    const lines=new Map();
    const add=(price,quantity)=>lines.set(price,(lines.get(price)??0)+quantity);
    for(const q of items){add(q.stripePriceId,q.quantity);if(q.maintenance)add(q.maintenancePriceId,q.quantity);}
    result.parameters.line_items=[...lines].map(([price,quantity])=>({price,quantity}));
    result.parameters.metadata={flow:purchaseFlow,order_id:orderId,cart_order_id:context.orderId,billing_group:group.key};
    result.parameters.cancel_url=context.baseUrl+'/cart';
    if(result.parameters.subscription_data) result.parameters.subscription_data.metadata={...result.parameters.metadata,
      purpose:group.key==='deferred_maintenance'?'maintenance':'annual_license'};
    return {group,...result};
  });
}

// Only a trusted server calls this builder after saving and authorizing an order.
// Submitted totals, Stripe IDs, customer IDs and license flags are never accepted.
export function checkoutParameters(input, { orderId, customerId, baseUrl, now = Math.floor(Date.now() / 1000) }) {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(orderId ?? '') || !customerId?.startsWith('cus_')) throw new CheckoutError('invalid_cart', 400);
  const quote = quotePurchase(input, now);
  const recurring = quote.access === 'annual' || quote.maintenance;
  const metadata = { flow: purchaseFlow, order_id: orderId, product: quote.product,
    option: quote.option, quantity: String(quote.quantity), maintenance: String(quote.maintenance) };
  const result = {
    mode: recurring ? 'subscription' : 'payment', ui_mode: 'hosted_page',
    customer: customerId, client_reference_id: orderId, metadata,
    line_items: [{ price: quote.stripePriceId, quantity: quote.quantity }],
    allowed_payment_method_types: ['card'], automatic_tax: { enabled: false },
    allow_promotion_codes: false, adaptive_pricing: { enabled: false },
    success_url: baseUrl + '/checkout/receipt/?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: baseUrl + '/buy/' + quote.product,
  };
  if (recurring) {
    result.subscription_data = { metadata: { ...metadata, purpose: quote.maintenance ? 'maintenance' : 'annual_license' } };
    if (quote.maintenance) {
      result.line_items.push({ price: quote.maintenancePriceId, quantity: quote.quantity });
      result.subscription_data.trial_end = quote.firstRenewal;
      result.subscription_data.trial_settings = { end_behavior: { missing_payment_method: 'cancel' } };
      result.payment_method_collection = 'always';
    }
  }
  return { quote, parameters: result, idempotencyKey: purchaseFlow + ':' + orderId };
}

export function licenseTemplate(product, option) {
  const parameters = { ProductId: product.cryptolensProductId, Period: 365,
    F1: option.access === 'annual', F2: false, Block: false, CustomerId: 237012,
    TrialActivation: false, MaxNoOfMachines: option.licenseType === 'floating' ? 1 : 2,
    Notes: 'Sandbox-only ' + product.name + ' ' + option.key + '. Fixed test customer. One key per purchased license. Perpetual Expires records maintenance only.' };
  const actions = [{ APIMethodName: 'CreateKey', Parameters: parameters }];
  for (const name of [option.access === 'perpetual' ? 'PowerSurfacingPerpetual' : null,
    option.licenseType === 'floating' ? 'PowerSurfacingFloating' : null].filter(Boolean))
    actions.push({ APIMethodName: 'AddDataObjectToKey', Parameters: { Name: name, IntValue: 1,
      StringValue: '', CheckForDuplicates: true, ProductId: product.cryptolensProductId, Key: '[key]' } });
  return actions;
}
