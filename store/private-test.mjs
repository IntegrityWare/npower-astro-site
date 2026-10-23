import { required, sha256 } from './errors.mjs';
import { validMailbox } from './environment.mjs';

export const privateTestCart = [{product:'viz',option:'perpetual_node_locked',quantity:1,maintenance:false}];
export function privateTestMode(mode, priceId) {
  required(mode.live && /^price_[A-Za-z0-9]+$/.test(priceId || ''), 'store_setup_pending', 503);
  const product=mode.catalog.products.find(p=>p.key==='viz');
  const option=product?.options.find(o=>o.key==='perpetual_node_locked');
  required(product?.stripeProductId && option && priceId!==option.stripePriceId, 'store_setup_pending', 503);
  return {...mode,catalog:{...mode.catalog,products:[{...product,options:[{...option,unitAmount:500,stripePriceId:priceId}]}]}};
}
export async function authorizePrivateTest(store, code, now) {
  required(typeof code==='string' && /^[a-f0-9]{64}$/.test(code), 'private_test_invalid', 403);
  const hash=await sha256(code);
  const grant=await store.query('SELECT id,buyer_email,expires FROM live_purchase_tests WHERE token_hash=? AND expires>?',hash,now).first();
  required(grant && /^[a-zA-Z0-9_-]{8,60}$/.test(grant.id) && validMailbox(grant.buyer_email), 'private_test_invalid', 403);
  return {ownerHash:hash,attempt:'live-test-'+grant.id,purchaseTest:{id:grant.id,buyerEmail:grant.buyer_email}};
}
