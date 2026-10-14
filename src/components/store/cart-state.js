export const CART_KEY = 'npower.store.cart.v1';
export const itemKey = item => [item.product, item.option, item.maintenance ? 'maintenance' : 'license'].join(':');
export function readCart() {
  try { const value = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); return Array.isArray(value) && value.length <= 20 ? value : []; }
  catch { return []; }
}
export function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('npower-cart-change'));
}
export function addItem(item) {
  const items = readCart(), match = items.find(q => itemKey(q) === itemKey(item));
  const quantity = item.quantity + (match?.quantity || 0);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw Error('Choose 1–99 licenses per option.');
  if (match) match.quantity = quantity;
  else {
    if (items.length >= 20) throw Error('Your cart can contain up to 20 selections.');
    items.push({ product:item.product, option:item.option, quantity, maintenance:item.maintenance });
  }
  writeCart(items);
}
export function completeCart(order) {
  const key = 'npower.completed.' + order.id;
  if (sessionStorage.getItem(key)) return;
  const items = readCart().flatMap(item => {
    const bought = order.quote.items.find(q => q.key === itemKey(item));
    const quantity = item.quantity - (bought?.quantity || 0);
    return quantity > 0 ? [{ ...item, quantity }] : [];
  });
  writeCart(items);
  sessionStorage.setItem(key, '1');
  sessionStorage.removeItem('npower.cart.checkoutAttempt');
}
export const money = cents => new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 }).format(cents / 100);
export const optionLabel = option => (option.access === 'annual' ? 'Annual subscription' : 'Perpetual license') + ' · ' + (option.licenseType === 'floating' ? 'Floating' : 'Node-locked');
export async function storeRequest(path, body) {
  const response = await fetch('/api/store/' + path, body === undefined ? { credentials:'same-origin', cache:'no-store' } : {
    method:'POST', credentials:'same-origin', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify(body)
  });
  let result;
  try { result = await response.json(); } catch { throw Error('The sandbox store is being prepared. Please try again shortly.'); }
  if (!response.ok) {
    const messages = {
      invalid_cart:'Choose valid license options and quantities from 1 to 99.',
      cart_requires_one_to_99_licenses:'A checkout supports up to 99 licenses in total.',
      sandbox_access_required:'Enter the sandbox access code first.',
      access_code_incorrect:'The access code is incorrect.',
      store_setup_pending:'Sandbox checkout is being configured. Please try again shortly.',
      issuing_credentials_missing:'This license option is still being connected. Please try again shortly.',
      fulfillment_requires_review:'Your payment needs a license-delivery review. Please keep your order number; do not pay again.',
      checkout_expired_start_again:'This checkout expired. Return to your cart and start a new checkout.',
      please_wait_before_retrying:'Please wait a few minutes before trying again.',
      order_not_found:'Open this receipt in the same browser used to make the purchase.'
    };
    throw Error(messages[result.error] || 'The request could not be completed. Your existing order is preserved; please try again.');
  }
  return result;
}
