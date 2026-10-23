import React, { useState } from 'react';
import { storeRequest } from './cart-state';
export default function LivePurchaseTest() {
  const [code,setCode]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
  async function checkout(event) {
    event.preventDefault();setBusy(true);setError('');
    try {
      const result=await storeRequest('private-test',{code:code.trim()});
      window.location.assign(result.url);
    } catch(e) {setError(e.message);setBusy(false);}
  }
  return <div className="max-w-xl mx-auto bg-white border rounded-xl p-7 space-y-5">
    <p className="text-sm font-semibold text-red-700">Private purchase test</p>
    <h1 className="text-3xl font-bold">Power Surfacing VIZ</h1>
    <p className="text-2xl font-semibold">$5.00 USD once</p>
    <p>One perpetual node-locked license for two computers. Includes the first year of maintenance. No automatic maintenance renewal is included in this test.</p>
    <p className="bg-amber-50 border border-amber-200 rounded-lg p-4">This is a live payment. Stripe will charge your real card $5.00. Your license and activation instructions will be emailed to the address assigned to your invitation.</p>
    <form onSubmit={checkout} className="space-y-4">
      <label className="block font-medium" htmlFor="test-code">Private test code</label>
      <input id="test-code" type="password" value={code} onChange={e=>setCode(e.target.value)} required autoComplete="off" spellCheck={false} maxLength={64}
        className="w-full rounded-lg border border-slate-300 p-3" />
      {error && <p role="alert" className="text-red-700">{error}</p>}
      <button type="submit" disabled={busy || code.trim().length!==64} className="w-full bg-red-600 text-white rounded-lg p-3 font-semibold disabled:opacity-50">
        {busy?'Opening checkout...':'Continue to Stripe - $5.00'}
      </button>
    </form>
    <p className="text-sm text-slate-600">Each invitation is for one order. Using the same code again reopens that order or its receipt.</p>
  </div>;
}
