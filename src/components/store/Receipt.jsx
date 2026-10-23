import React, { useEffect, useState } from 'react';
import { storeRequest, completeCart, money } from './cart-state';
export default function Receipt() {
  const [order, setOrder] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => {
    let stopped = false, timer, attempts = 0;
    const query = new URLSearchParams(window.location.search);
    const args = new URLSearchParams();
    if (query.has('session_id')) args.set('session_id', query.get('session_id'));
    else if (query.has('order')) args.set('order', query.get('order'));
    async function refresh() {
      try {
        const data = await storeRequest('receipt?' + args);
        if (stopped) return;
        setOrder(data); setError('');
        if (data.complete) completeCart(data);
        if ((!data.complete || data.email === 'pending' || data.email === 'sending') && ++attempts < 60) timer = setTimeout(refresh, 3000);
      } catch (e) { if (!stopped) setError(e.message); }
    }
    refresh();
    return () => { stopped = true; clearTimeout(timer); };
  }, []);
  async function next() {
    setBusy(true);
    try { const result = await storeRequest('continue', { order:order.id }); window.location.assign(result.url); }
    catch (e) { setError(e.message); setBusy(false); }
  }
  const pending = order?.groups.find(g => g.status !== 'fulfilled');
  return <div className="max-w-3xl mx-auto space-y-5">
    <div className="bg-white border rounded-xl p-7">
      <h1 className="text-3xl font-bold">{order?.complete ? 'Your licenses are ready' : 'Your order'}</h1>
      {order?.sandbox && <p className="text-slate-500 mt-3">Sandbox purchase. No real money was charged.</p>}
      {order && <p className="text-sm text-slate-500 mt-3 break-all">Order {order.id}</p>}
      {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
      {!order && !error && <p className="mt-4">Checking payment and license delivery…</p>}
      {pending && pending.status === 'pending' && pending.position > 0 && <div className="mt-5">
        <p>Complete the remaining payment step: {money(pending.dueToday)}.</p>
        <button type="button" disabled={busy} onClick={next} className="bg-red-600 text-white rounded-lg p-3 mt-3 font-semibold">Continue to the next Stripe checkout</button>
      </div>}
      {pending && ['issuing','pending'].includes(pending.status) && pending.position === 0 && <p className="mt-4">Waiting for Stripe confirmation and license delivery. This page updates automatically.</p>}
      {pending?.status === 'review' && <p className="mt-4 text-amber-900">Your payment is recorded, but license delivery needs review. Keep your order number and do not purchase again.</p>}
      {order?.complete && <p className="mt-4">{order.email === 'sent' ? (order.sandbox?'The activation email has been sent to the sandbox tester.':'Your activation email has been sent to the address used at checkout.') : order.email === 'review' ? 'Your keys are ready below. Email delivery needs review; do not purchase again.' : 'Your activation email is being prepared.'}</p>}
    </div>
    {order?.groups.flatMap(g => g.licenses).map(license => <article key={license.key} className="bg-white border rounded-xl p-6">
      <h2 className="text-xl font-bold">{license.product}</h2>
      <p className="text-slate-500 text-sm mt-1">{license.option.replaceAll('_',' ')}</p>
      <p className="font-mono text-lg bg-slate-100 rounded-lg p-4 mt-4 break-all select-all">{license.key}</p>
      {license.paidThrough && <p className="text-slate-600 mt-3">{license.access === 'perpetual' ? 'Maintenance paid through' : 'Access paid through'} {new Date(license.paidThrough * 1000).toLocaleDateString('en-US', {timeZone:'UTC'})}.</p>}
      {license.access === 'perpetual' && <p className="text-slate-600 mt-2">Your product license is perpetual. Ending maintenance stops future renewals and preserves your existing product access.</p>}
    </article>)}
    {order?.complete && <div className="bg-white border rounded-xl p-7">
      <h2 className="text-xl font-bold mb-4">Activate your license</h2>
      <ol className="list-decimal pl-5 space-y-3 text-slate-600">
        <li>{order.sandbox?'Open the sandbox-enabled Power Surfacing build.':'Open Power Surfacing.'}</li>
        <li>Open Settings → License → Edit Power Surfacing Studio License, and choose the matching Edition.</li>
        <li>Paste the key. For a floating license, select “Floating license (requires an online seat).”</li>
        <li>Choose Activate while connected to the internet.</li>
      </ol>
      {order.sandbox && <p className="text-sm text-slate-500 mt-4">This test build keeps enforcement passive. Activation and seat limits are still validated.</p>}
    </div>}
    <a href="/store/" className="inline-block font-semibold text-red-600">Return to the store</a>
  </div>;
}
