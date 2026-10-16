import { createHmac,randomBytes,randomInt,timingSafeEqual } from 'node:crypto';
export class TrialError extends Error {
  constructor(code,status=400) { super(code); this.code=code; this.status=status; }
}
export const requireTrial=(condition,code,status=400)=>{if(!condition) throw new TrialError(code,status);};
export const products=Object.freeze({2:33431,4:33432,8:33433});
const secret=()=>randomBytes(32).toString('hex');
const equal=(a,b)=>/^[a-f0-9]{64}$/.test(a || '') && /^[a-f0-9]{64}$/.test(b || '') && timingSafeEqual(Buffer.from(a,'hex'),Buffer.from(b,'hex'));
export function createTrials({store,hashKey,sendCode,licenses,now=()=>Math.floor(Date.now()/1000),
  emailHourlyLimit=100,emailDailyLimit=500}) {
  requireTrial(typeof hashKey === 'string' && hashKey.length>=32,'trial_setup_pending',503);
  requireTrial(Number.isSafeInteger(emailHourlyLimit) && emailHourlyLimit>0 && emailHourlyLimit<=10000 &&
    Number.isSafeInteger(emailDailyLimit) && emailDailyLimit>0 && emailDailyLimit<=100000,'trial_setup_pending',503);
  const hash=(type,value)=>createHmac('sha256',hashKey).update(type+':'+value).digest('hex');
  function machineHash(machine) {
    requireTrial(typeof machine === 'string' && /^[A-Fa-f0-9]{64}$/.test(machine),'invalid_machine');
    return hash('machine',machine.toUpperCase());
  }
  function emailAddress(value) {
    requireTrial(typeof value === 'string','invalid_email');
    const email=value.trim().toLowerCase();
    requireTrial(email.length<=254 && /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,63}$/.test(email),'invalid_email');
    return email;
  }
  return {
    async start(input,ip) {
      requireTrial(Number.isInteger(input.edition) && Object.hasOwn(products,input.edition),'invalid_edition');
      const email=emailAddress(input.email), emailHash=hash('email',email), machine=machineHash(input.machine);
      for(const [key,maximum,duration] of [[hash('ip',ip),20,3600],[emailHash,3,3600],[machine,5,3600]])
        requireTrial(await store.limit(key,maximum,duration,now()),'rate_limited',429);
      // Persist aggregate send budgets across requests, machines, Worker instances and deploys.
      // Count attempts, including uncertain SMTP delivery; never refund/retry an ambiguous send.
      for(const [key,maximum,duration] of [[hash('mail-budget','hour'),emailHourlyLimit,3600],
        [hash('mail-budget','day'),emailDailyLimit,86400]])
        requireTrial(await store.limit(key,maximum,duration,now()),'rate_limited',429);
      const id=secret(), credential=secret(), code=randomInt(0,100000000).toString().padStart(8,'0'), expires=now()+900;
      await store.saveRequest({id,secret_hash:hash('request',credential),code_hash:hash('code',id+':'+code),
        email,email_hash:emailHash,machine_hash:machine,edition:input.edition,expires});
      try { await sendCode(email,code); }
      catch { await store.removeRequest(id); throw new TrialError('trial_email_unavailable',503); }
      // Same response for existing trials; never disclose another customer's license.
      return {id,secret:credential,expiresUtc:new Date(expires*1000).toISOString()};
    },
    async verify(input,ip) {
      requireTrial(await store.limit(hash('verify-ip',ip),60,600,now()),'rate_limited',429);
      requireTrial(typeof input.id === 'string' && /^[a-f0-9]{64}$/.test(input.id) &&
        typeof input.secret === 'string' && /^[a-f0-9]{64}$/.test(input.secret),'verification_invalid',401);
      const r=await store.request(input.id);
      requireTrial(r && r.expires>now() && equal(r.secret_hash,hash('request',input.secret)) &&
        equal(r.machine_hash,machineHash(input.machine)),'verification_invalid',401);
      if(!r.verified) {
        requireTrial(await store.attempt(r.id,now()),'verification_invalid',401);
        requireTrial(typeof input.code === 'string' && /^\d{8}$/.test(input.code) &&
          equal(r.code_hash,hash('code',r.id+':'+input.code)),'verification_invalid',401);
        await store.verify(r.id);
      }
      // Unique email AND machine, across editions. Reserve atomically only AFTER verification.
      const claim=secret();
      if(await store.reserve(r,claim,now())) {
        try {
          const license=await licenses.issue({email:r.email,machine:input.machine.toUpperCase(),productId:products[r.edition],reference:claim});
          requireTrial(typeof license.key === 'string' && license.key.length>=4 && Number.isSafeInteger(license.expires) &&
            license.expires>now() && license.expires<=now()+30*86400,'trial_review_required',503);
          await store.issued(claim,license);
        } catch {
          // Vendor CreateKey has no idempotency key. Never retry uncertain issuance.
          await store.review(claim);
          throw new TrialError('trial_review_required',503);
        }
      }
      const rows=await store.existing(r);
      requireTrial(rows.length===1 && equal(rows[0].email_hash,r.email_hash) && equal(rows[0].machine_hash,r.machine_hash),'trial_already_used',409);
      const trial=rows[0];
      requireTrial(trial.edition===r.edition,'trial_edition_mismatch',409);
      requireTrial(trial.state==='issued' && trial.license_key,'trial_review_required',503);
      requireTrial(trial.expires>now(),'trial_expired',403);
      return {key:trial.license_key,edition:trial.edition,expiresUtc:new Date(trial.expires*1000).toISOString()};
    }
  };
}
