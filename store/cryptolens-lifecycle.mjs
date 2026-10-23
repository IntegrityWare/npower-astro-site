import { CheckoutError, required } from './errors.mjs';

export const utcDay = seconds => Math.floor(seconds / 86400);
// Cryptolens dates have day precision. Cover the complete paid-through UTC day.
export const paidDay = seconds => Math.ceil(seconds / 86400);
export function expiryDay(value) {
  required(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value), 'license_expiry_invalid', 503);
  const seconds = Date.parse(value.endsWith('Z') || /[+-]\d\d:\d\d$/.test(value) ? value : value + 'Z') / 1000;
  required(Number.isFinite(seconds), 'license_expiry_invalid', 503);
  return utcDay(seconds);
}
export function renewalTokenMap(env) {
  try {
    const values = JSON.parse(env.CRYPTOLENS_RENEWAL_TOKENS || '{}');
    return new Map(Object.entries(values).filter(([id, token]) =>
      ['33431','33432','33433'].includes(id) && typeof token === 'string' && token.length > 20 && !/[\r\n]/.test(token))
      .map(([id, token]) => [Number(id), token]));
  } catch { return new Map(); }
}
export function cryptolensLifecycle(tokens, fetchImpl = fetch, live = false) {
  async function call(method, unit, extra = {}) {
    const product = unit.selection.cryptolensProductId, token = tokens.get(product);
    required(token, 'renewal_credential_missing', 503);
    const response = await fetchImpl('https://api.cryptolens.io/api/key/' + method, {
      method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded' },
      body:new URLSearchParams({ token, ProductId:String(product), Key:unit.license_key, v:'1', ...extra }),
      signal:AbortSignal.timeout(15000), redirect:'manual'
    });
    required(response.ok, 'renewal_response_http_' + response.status, 503);
    const reader = response.body?.getReader();
    required(reader, 'renewal_response_invalid', 503);
    const chunks = []; let length = 0;
    for (;;) {
      const {value, done} = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 65536) { await reader.cancel(); throw new CheckoutError('renewal_response_invalid', 503); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const result = JSON.parse(new TextDecoder().decode(bytes));
    required(result.result === 0, 'renewal_api_rejected', 503);
    return result;
  }
  return {
    async read(unit) {
      const result = await call('GetKey', unit), key = result.licenseKey, q = unit.selection;
      required((key?.productId ?? result.productId) === q.cryptolensProductId && key?.key === unit.license_key &&
        key.customer?.id === (live ? unit.customer_id : 237012) && (!live || Number.isSafeInteger(unit.customer_id) && unit.customer_id > 0) && key.block === false, 'renewal_license_identity_mismatch', 503);
      const flag = name => {
        const matches = (key.dataObjects || []).filter(d => d.name === name);
        required(matches.length <= 1, 'renewal_license_flags_invalid', 503);
        return matches[0]?.intValue === 1;
      };
      required(flag('PowerSurfacingPerpetual') === (q.access === 'perpetual') &&
        flag('PowerSurfacingFloating') === (q.licenseType === 'floating') &&
        key.f1 === (q.access === 'annual') &&
        key.maxNoOfMachines === (q.licenseType === 'floating' ? 1 : 2), 'renewal_license_flags_invalid', 503);
      return { day:expiryDay(key.expires) };
    },
    async extend(unit, days) {
      required(Number.isSafeInteger(days) && days > 0 && days <= 3660, 'renewal_days_invalid', 503);
      // Only date extension: never change perpetual/floating flags, seat counts, or block a key.
      await call('ExtendLicense', unit, { NoOfDays:String(days) });
    }
  };
}
