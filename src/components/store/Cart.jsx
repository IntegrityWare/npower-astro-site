import React, { useEffect, useState, useCallback } from 'react';
import { readCart, writeCart, itemKey, money, optionLabel, storeRequest } from './cart-state';
import { IMAGES } from '@/lib/siteData';

const productImages = { viz:IMAGES.visualize, studio:IMAGES.studio, studio_re:IMAGES.reStudio };

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const refresh = useCallback(() => setCart(readCart()), []);
  useEffect(() => {
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('npower-cart-change', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('npower-cart-change', refresh); };
  }, [refresh]);
  useEffect(() => {
    let cancelled = false; setQuote(null); setError('');
    storeRequest('quote', cart).then(data => { if (!cancelled) { setQuote(data); setUnlocked(data.unlocked); } })
      .catch(e => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [cart]);
  async function unlock(event) {
    event.preventDefault(); setBusy(true); setError('');
    try { await storeRequest('unlock', { code:accessCode }); setAccessCode(''); refresh(); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  function quantity(item, value) {
    if (!/^[1-9][0-9]?$/.test(value)) { setError('Choose a whole number from 1 to 99.'); return; }
    writeCart(cart.map(q => itemKey(q) === item.key ? { ...q, quantity:Number(value) } : q));
  }
  async function checkout() {
    setBusy(true); setError('');
    try {
      if(quote?.sandbox===false && !unlocked) { await storeRequest('session',{}); setUnlocked(true); }
      const fingerprint = JSON.stringify(cart);
      let attempt;
      try { attempt = JSON.parse(sessionStorage.getItem('npower.cart.checkoutAttempt')); } catch {}
      if (!attempt || attempt.fingerprint !== fingerprint) attempt = { fingerprint, id:crypto.randomUUID() };
      sessionStorage.setItem('npower.cart.checkoutAttempt', JSON.stringify(attempt));
      const result = await storeRequest('checkout', { cart, attempt:attempt.id });
      window.location.assign(result.url);
    } catch (e) { setError(e.message); setBusy(false); }
  }
  return <div className="grid lg:grid-cols-[1fr_360px] gap-8">
    <div className="space-y-4">
      {!cart.length && <div className="p-8 bg-white rounded-xl border"><h2 className="text-xl font-bold">Your cart is empty</h2><a href="/store/" className="inline-block text-red-600 underline mt-3">Choose a product</a></div>}
      {quote?.items.map(item => <article key={item.key} className="p-6 bg-white rounded-xl border border-slate-200">
        <div className="flex items-start gap-4 sm:gap-5">
          {productImages[item.product] && <img src={productImages[item.product]} alt={item.productName + ' product box'} width="96" height="128"
            className="h-24 w-[72px] sm:h-32 sm:w-24 object-contain shrink-0" decoding="async" />}
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold">{item.productName}</h2><p className="text-slate-600 mt-1">{optionLabel(item)}</p>
            <p className="text-sm text-slate-500 mt-3">{item.access === 'annual' ? 'Maintenance and updates included.' : item.maintenance ? 'First maintenance year included; then ' + money(item.annualRenewal) + '/year for this selection.' : 'First maintenance year included. No automatic maintenance renewal.'}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-5">
          <label className="text-sm">Quantity <input aria-label={'Quantity for ' + item.productName + ' ' + item.option} type="number" min="1" max="99" value={item.quantity}
            onChange={e => quantity(item, e.target.value)} className="w-20 ml-2 p-2 border rounded-lg" /></label>
          <button type="button" onClick={() => writeCart(cart.filter(q => itemKey(q) !== item.key))} className="text-red-600 underline text-sm">Remove</button>
          <strong className="ml-auto text-xl">{money(item.dueToday)}</strong>
        </div>
      </article>)}
      {cart.length>0 && !quote && error && <button type="button" onClick={()=>writeCart([])} className="text-red-600 underline">Clear unavailable cart selections</button>}
      <a href="/store/" className="inline-block text-red-600 font-semibold mt-4">Continue shopping</a>
    </div>
    <aside><div className="bg-white border border-slate-200 rounded-2xl p-7 sticky top-28">
      <h2 className="text-2xl font-bold">Order summary</h2>
      <div className="flex justify-between mt-5"><span>Licenses</span><strong>{quote?.licenseCount ?? '—'}</strong></div>
      <div className="flex justify-between items-center border-t mt-5 pt-5"><span>Due today</span><strong className="text-3xl">{quote ? money(quote.dueToday) : '—'}</strong></div>
      <p className="text-sm text-slate-500 mt-4">{quote?.annualRenewal ? 'Yearly renewals: ' + money(quote.annualRenewal) + ', starting one year after purchase.' : 'No automatic renewals.'}</p>
      {quote?.groups.length > 1 && <p className="mt-4 text-sm text-slate-600">This cart has two Stripe payment steps: annual licenses, then perpetual licenses with deferred maintenance. The total includes both.</p>}
      <p className="text-xs text-slate-500 mt-4">Up to {quote?.licenseLimit ?? '—'} licenses per online order. Contact sales for larger orders.</p>
      {quote && quote.licenseCount > quote.licenseLimit && <p role="alert" className="text-amber-800 mt-3">Reduce your cart to {quote.licenseLimit} licenses before checkout.</p>}
      {quote?.sandbox && !unlocked && <form onSubmit={unlock} className="border-t mt-6 pt-5">
        <label htmlFor="sandbox-code" className="block text-sm font-semibold">Sandbox access code</label>
        <input id="sandbox-code" type="password" value={accessCode} onChange={e => setAccessCode(e.target.value)} autoComplete="off" required className="w-full border rounded-lg p-3 mt-2" />
        <button disabled={busy} className="w-full border border-slate-300 rounded-lg p-3 mt-2 font-semibold">Unlock test checkout</button>
      </form>}
      {quote && (unlocked || !quote.sandbox) && !quote.checkoutReady && cart.length > 0 && <p className="text-sm mt-5 text-amber-800">Checkout setup is still in progress for this selection.</p>}
      {error && <p role="alert" className="text-red-700 mt-4">{error}</p>}
      <button type="button" onClick={checkout} disabled={busy || !quote?.checkoutReady} className="w-full bg-red-600 text-white rounded-lg p-3 font-semibold mt-5 disabled:opacity-40">{busy ? 'Please wait…' : quote?.sandbox?'Continue to Stripe test checkout':'Continue to Stripe checkout'}</button>
      <p className="text-xs text-slate-500 mt-3">{quote?.sandbox?'Use a Stripe test card. License emails are delivered to the designated sandbox tester.':'Secure payment through Stripe. License keys and activation instructions are emailed after payment.'}</p>
    </div></aside>
  </div>;
}
