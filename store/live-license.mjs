import { CheckoutError, required } from './errors.mjs';
import { paidDay, utcDay, expiryDay } from './cryptolens-lifecycle.mjs';
import { validMailbox } from './environment.mjs';

// These product-scoped tokens need CreateKey, AddCustomer, AddDataObject and GetKey.
// An uncertain issuance is held for review by the service; it is never retried blindly.
export function liveLicenseCreator(tokens, store, fetchImpl = fetch, clock = () => Math.floor(Date.now()/1000)) {
  async function call(method, token, parameters) {
    const response = await fetchImpl('https://api.cryptolens.io/api/' + method, {
      method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams({token, v:'1', ...parameters}), redirect:'manual', signal:AbortSignal.timeout(15000)
    });
    required(response.ok, 'license_response_http_' + response.status, 503);
    const reader = response.body?.getReader();
    required(reader, 'license_response_invalid', 503);
    const chunks=[]; let size=0;
    for (;;) {
      const {value,done}=await reader.read(); if(done) break;
      size+=value.length;
      if(size>65536) { await reader.cancel(); throw new CheckoutError('license_response_invalid',503); }
      chunks.push(value);
    }
    const bytes=new Uint8Array(size); let offset=0;
    for(const chunk of chunks) {bytes.set(chunk,offset);offset+=chunk.length;}
    const result=JSON.parse(new TextDecoder().decode(bytes));
    required(result.result===0,'license_api_rejected',503);
    return result;
  }
  return async (unit, order) => {
    const q=unit.selection, token=tokens.get(q.cryptolensProductId);
    required(order.quote.environment==='live' && validMailbox(order.buyer_email),'buyer_identity_missing',503);
    required(token,'issuing_credential_missing',503);
    const target=paidDay(q.firstRenewal ?? q.includedMaintenanceEnd), period=target-utcDay(clock());
    required(Number.isSafeInteger(period) && period>0 && period<=367,'license_period_requires_review',503);
    const result=await call('key/CreateKey',token,{
      ProductId:String(q.cryptolensProductId),Period:String(period),NoOfKeys:'1',
      F1:String(q.access==='annual'),F2:'false',F3:'false',F4:'false',F5:'false',F6:'false',F7:'false',F8:'false',
      MaxNoOfMachines:q.licenseType==='floating'?'1':'2',TrialActivation:'false',Block:'false',
      AddOrUseExistingCustomer:'true',Email:order.buyer_email,Name:order.buyer_name || order.buyer_email,
      Notes:'Paid store order '+order.id+' unit '+unit.id+'. Perpetual expiry records maintenance eligibility only.'
    });
    required(/^[A-Z]{5}(?:-[A-Z]{5}){3}$/.test(result.key ?? '') &&
      Number.isSafeInteger(result.customerId) && result.customerId>0,'license_response_requires_review',503);
    // Save the issued identity before any additional call can fail.
    await store.recordUnitKey(unit.id,result.key,result.customerId);
    const identity={ProductId:String(q.cryptolensProductId),Key:result.key};
    for(const name of [q.access==='perpetual'?'PowerSurfacingPerpetual':null,
      q.licenseType==='floating'?'PowerSurfacingFloating':null].filter(Boolean)) {
      await call('data/AddDataObjectToKey',token,{...identity,Name:name,IntValue:'1',StringValue:'',CheckForDuplicates:'true'});
    }
    const checked=await call('key/GetKey',token,identity), key=checked.licenseKey;
    required((key?.productId ?? checked.productId)===q.cryptolensProductId && key?.key===result.key &&
      key.customer?.id===result.customerId && key.customer?.email?.toLowerCase()===order.buyer_email &&
      key.block===false && key.trialActivation===false && key.f1===(q.access==='annual') && key.f2===false &&
      key.maxNoOfMachines===(q.licenseType==='floating'?1:2),'license_identity_requires_review',503);
    for(const [name,enabled] of [['PowerSurfacingPerpetual',q.access==='perpetual'],['PowerSurfacingFloating',q.licenseType==='floating']]) {
      const flags=(key.dataObjects || []).filter(d=>d.name===name);
      required(flags.length<2 && (flags[0]?.intValue===1)===enabled,'license_flags_require_review',503);
    }
    required(expiryDay(key.expires)===target,'license_expiry_requires_review',503);
    return result.key;
  };
}
