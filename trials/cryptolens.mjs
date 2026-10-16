import {requireTrial} from './service.mjs';
export function credentialMap(value) {
  try {
    const map=JSON.parse(value || '{}');
    requireTrial([33431,33432,33433].every(id=>typeof map[id]==='string' && map[id].length>20),'trial_setup_pending',503);
    return map;
  } catch {return null;}
}
export async function boundedJson(response,limit=65536) {
  const reader=response.body?.getReader(); requireTrial(reader,'invalid_response',503);
  const chunks=[]; let size=0;
  for(;;) {
    const {value,done}=await reader.read(); if(done) break;
    size+=value.length;
    if(size>limit) {await reader.cancel(); throw Error('response_too_large');}
    chunks.push(value);
  }
  const bytes=new Uint8Array(size); let offset=0;
  for(const chunk of chunks) {bytes.set(chunk,offset); offset+=chunk.length;}
  return JSON.parse(new TextDecoder().decode(bytes));
}
export function trialLicenses(createTokens,activateTokens,fetchImpl=fetch) {
  async function call(method,token,input) {
    const response=await fetchImpl('https://api.cryptolens.io/api/key/'+method,{
      method:'POST',redirect:'manual',signal:AbortSignal.timeout(15000),
      headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({token,v:'1',...input})});
    requireTrial(response.ok,'trial_review_required',503);
    const data=await boundedJson(response); requireTrial(data.result===0,'trial_review_required',503); return data;
  }
  return {
    async issue({email,machine,productId,reference}) {
      requireTrial(createTokens?.[productId] && activateTokens?.[productId],'trial_setup_pending',503);
      // Product-locked CreateKey + AddCustomer SERVER token. Never use paid templates.
      const created=await call('CreateKey',createTokens[productId],{ProductId:String(productId),Period:'30',F1:'true',F2:'true',
        F3:'false',F4:'false',F5:'false',F6:'false',F7:'false',F8:'false',MaxNoOfMachines:'1',TrialActivation:'false',Block:'false',
        AddOrUseExistingCustomer:'true',Email:email,Name:email,Notes:'Power Surfacing verified evaluation '+reference});
      requireTrial(typeof created.key==='string' && created.key.length>=4 && Number.isSafeInteger(created.customerId) && created.customerId>0,'trial_review_required',503);
      // Bind before handing out the key; desktop independently verifies signed activation.
      const activated=await call('Activate',activateTokens[productId],{ProductId:String(productId),Key:created.key,MachineCode:machine,Sign:'false',OSInfo:''});
      const key=activated.licenseKey;
      const date=value=>Math.floor(Date.parse(/Z$|[+-]\d\d:\d\d$/.test(value || '') ? value : value+'Z')/1000);
      const expires=date(key?.expires), start=date(key?.created);
      requireTrial(key && (key.productId ?? activated.productId)===productId && key.key===created.key && key.customer?.id===created.customerId &&
        key.block===false && key.f1===true && key.f2===true && key.period===30 && key.maxNoOfMachines===1 &&
        Number.isSafeInteger(expires) && expires>start && expires-start<=30*86400 && key.activatedMachines?.some(m=>m.mid===machine) &&
        !(key.dataObjects || []).some(d=>['PowerSurfacingPerpetual','PowerSurfacingFloating'].includes(d.name) && d.intValue!==0),'trial_review_required',503);
      return {key:created.key,customerId:created.customerId,expires};
    }
  };
}
