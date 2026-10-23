import { catalog, purchaseFlow, livePurchaseFlow } from './purchase-options.mjs';
import { required } from './errors.mjs';

export const LIVE_ORIGINS = new Set(['https://www.npowersoftware.com', 'https://npowersoftware.com']);
export const validMailbox = value => typeof value === 'string' && value.length <= 254 &&
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(value);
export function productTokens(raw) {
  try {
    return new Map(Object.entries(JSON.parse(raw || '{}')).filter(([id, token]) =>
      catalog.products.some(p => String(p.cryptolensProductId) === id) && typeof token === 'string' &&
      token.length > 20 && !/[\r\n]/.test(token)).map(([id, token]) => [Number(id), token]));
  } catch { return new Map(); }
}
export function liveCatalog(raw, enabled = 'viz') {
  let prices = {}; try { prices = JSON.parse(raw || '{}'); } catch { /* Closed until configured. */ }
  const selected = enabled.split(',').map(s => s.trim());
  required(selected.length && selected.every(key => catalog.products.some(p => p.key === key)), 'live_products_invalid', 503);
  const validId = (id, prefix) => typeof id === 'string' && new RegExp('^' + prefix + '_[A-Za-z0-9]+$').test(id);
  return { ...catalog, environment:'live', stripeAccountId:null, products:catalog.products.filter(p => selected.includes(p.key)).map(p => {
    const config = prices[p.key] || {};
    return { ...p, stripeProductId:validId(config.product, 'prod') ? config.product : null,
      options:p.options.map(o => ({ ...o, stripePriceId:validId(config.prices?.[o.key], 'price') ? config.prices[o.key] : null })),
      maintenance:{ ...p.maintenance, stripeProductId:validId(config.maintenance?.product, 'prod') ? config.maintenance.product : null,
        stripePriceId:validId(config.maintenance?.price, 'price') ? config.maintenance.price : null }
    };
  }) };
}
export function storeEnvironment(env, live = false, origin) {
  if (!live) return { live:false, flow:purchaseFlow, catalog, accountId:catalog.stripeAccountId,
    origin:'https://www.npowersoftwarenew.com', cookie:'__Host-npower_sandbox', database:env.DB };
  const base = origin || env.LIVE_STORE_ORIGIN || 'https://www.npowersoftware.com';
  required(LIVE_ORIGINS.has(base), 'store_origin_invalid', 503);
  return { live:true, flow:livePurchaseFlow, catalog:liveCatalog(env.STRIPE_LIVE_PRICE_IDS, env.LIVE_STORE_PRODUCTS || 'viz'),
    accountId:env.STRIPE_LIVE_ACCOUNT_ID, origin:base, cookie:'__Host-npower_store', database:env.STORE_LIVE_DB };
}
export function liveReadiness(env, mode) {
  const missing = [];
  if (env.LIVE_STORE_ENABLED !== 'true') missing.push('LIVE_STORE_ENABLED');
  if (env.LIVE_LIFECYCLE_ENABLED !== 'true') missing.push('LIVE_LIFECYCLE_ENABLED');
  if (!mode.database || mode.database === env.DB) missing.push('STORE_LIVE_DB');
  if (!/^acct_[A-Za-z0-9]+$/.test(mode.accountId || '')) missing.push('STRIPE_LIVE_ACCOUNT_ID');
  if (!/^(sk|rk)_live_[A-Za-z0-9]+$/.test(env.STRIPE_LIVE_SECRET_KEY || '')) missing.push('STRIPE_LIVE_SECRET_KEY');
  if (!/^whsec_[A-Za-z0-9]+$/.test(env.STRIPE_LIVE_WEBHOOK_SECRET || '')) missing.push('STRIPE_LIVE_WEBHOOK_SECRET');
  const create = productTokens(env.CRYPTOLENS_LIVE_ISSUING_TOKENS), renewal = productTokens(env.CRYPTOLENS_LIVE_RENEWAL_TOKENS);
  if (mode.catalog.products.some(p => !create.has(p.cryptolensProductId))) missing.push('CRYPTOLENS_LIVE_ISSUING_TOKENS');
  if (mode.catalog.products.some(p => !renewal.has(p.cryptolensProductId))) missing.push('CRYPTOLENS_LIVE_RENEWAL_TOKENS');
  if (mode.catalog.products.some(p => !p.stripeProductId || p.options.some(o => !o.stripePriceId) ||
    !p.maintenance.stripeProductId || !p.maintenance.stripePriceId)) missing.push('STRIPE_LIVE_PRICE_IDS');
  if (!env.TRIAL_SMTP_PASSWORD || !/^[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(env.TRIAL_SMTP_HOST || '') || !validMailbox(env.TRIAL_SMTP_USER) ||
    !validMailbox(env.STORE_LIVE_EMAIL_FROM) || Number(env.TRIAL_SMTP_PORT) !== 465) missing.push('STORE_LIVE_EMAIL');
  return missing;
}
