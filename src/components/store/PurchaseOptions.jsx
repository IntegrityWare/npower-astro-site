import React, { useState, useEffect } from 'react';
import { addItem, money, optionLabel, storeRequest } from './cart-state';
export default function PurchaseOptions({ product }) {
  const [optionKey, setOptionKey] = useState(product.options[0].key);
  const [quantity, setQuantity] = useState(1);
  const [maintenance, setMaintenance] = useState(false);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [status,setStatus]=useState(null);
  useEffect(()=>{let stopped=false;storeRequest('status').then(s=>{if(!stopped)setStatus(s);}).catch(()=>{});return()=>{stopped=true;};},[]);
  const limit=status?.licenseLimit ?? 3;
  const available=status?.options.some(o=>o.product===product.key && o.option===optionKey && o.ready);
  const option = product.options.find(o => o.key === optionKey);
  const perpetual = option.access === 'perpetual';
  const count = Number(quantity), valid = Number.isInteger(count) && count >= 1 && count <= limit;
  const renewal = valid ? (perpetual ? maintenance ? product.maintenance.unitAmount * count : 0 : option.unitAmount * count) : 0;
  function add() {
    setError('');
    try {
      if (!valid) throw Error('Choose a whole number of licenses from 1 to '+limit+'.');
      addItem({ product:product.key, option:option.key, quantity:count, maintenance:perpetual && maintenance });
      setAdded(true);
    } catch (e) { setError(e.message); }
  }
  return <div className="grid lg:grid-cols-[1fr_360px] gap-8">
    <div className="space-y-8">
      <fieldset className="space-y-3">
        <legend className="text-xl font-bold text-slate-900 mb-4">Choose your license</legend>
        {product.options.map(o => <label key={o.key} className={'flex items-start gap-3 p-5 rounded-xl border-2 bg-white cursor-pointer ' + (o.key === optionKey ? 'border-red-600' : 'border-slate-200')}>
          <input type="radio" name="license-option" value={o.key} checked={o.key === optionKey}
            onChange={() => { setOptionKey(o.key); setAdded(false); }} className="mt-1 accent-red-600" />
          <span className="flex-1"><strong className="block">{optionLabel(o)}</strong>
            <span className="block text-sm text-slate-500 mt-1">{o.licenseType === 'floating' ? 'One concurrent user per license' : 'Activate each license on two computers'}</span></span>
          <span className="text-right font-bold">{money(o.unitAmount)}<small className="block font-normal text-slate-500">{o.access === 'annual' ? '/ year' : 'one time'}</small></span>
        </label>)}
      </fieldset>
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <label htmlFor="license-quantity" className="block text-xl font-bold mb-3">Number of licenses</label>
        <input id="license-quantity" type="number" min="1" max={limit} step="1" value={quantity}
          onChange={e => { setQuantity(e.target.value); setAdded(false); }} className="w-28 rounded-lg border border-slate-300 p-3" />
        <p className="text-sm text-slate-500 mt-3">Each license purchased receives its own activation key.</p>
      </section>
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-3">Maintenance &amp; updates</h2>
        <p className="text-slate-600">{perpetual ? 'Your first year of maintenance is included. Your licensed version remains yours permanently.' : 'Maintenance and updates are included throughout your annual subscription.'}</p>
        {perpetual && <label className="flex gap-3 mt-5">
          <input type="checkbox" checked={maintenance} onChange={e => { setMaintenance(e.target.checked); setAdded(false); }} className="mt-1 accent-red-600" />
          <span><strong>Enroll in automatic maintenance renewal</strong><small className="block text-slate-500 mt-1">{money(product.maintenance.unitAmount)} per license per year. First charge after the included year. Cancel future renewals without losing perpetual access.</small></span>
        </label>}
      </section>
    </div>
    <aside><div className="sticky top-28 bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
      <p className="text-xs uppercase tracking-widest text-red-600 font-bold">Your selection</p>
      <h2 className="text-2xl font-bold mt-3">{product.name}</h2>
      <p className="text-slate-500 mt-2">{optionLabel(option)}</p>
      <div className="border-t mt-6 pt-5 flex justify-between"><span>Licenses</span><strong>{valid ? count : '—'}</strong></div>
      <div className="flex justify-between items-center mt-6"><span>Due today</span><strong className="text-3xl">{valid ? money(option.unitAmount * count) : '—'}</strong></div>
      <p className="text-xs text-slate-500 text-right mt-1">USD</p>
      <p className="text-sm text-slate-600 mt-4">{renewal ? money(renewal) + '/year, starting one year after purchase.' : 'No automatic renewal.'}</p>
      {error && <p role="alert" className="text-red-700 mt-4">{error}</p>}
      <button type="button" onClick={add} disabled={!available || !valid} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-lg px-5 py-3 font-semibold mt-6">Add to cart</button>
      {added && <div role="status" className="mt-4 rounded-lg bg-green-50 text-green-900 p-4">Added to your cart. <a href="/cart/" className="font-semibold underline">Review cart &amp; checkout</a></div>}
      <p className="text-xs text-slate-500 mt-4">{status?.sandbox?'Stripe sandbox only. No real money is charged.':available?'Secure checkout through Stripe. Your license will be emailed after payment.':'Online checkout is being prepared. Please contact sales to order.'}</p>
    </div></aside>
  </div>;
}
