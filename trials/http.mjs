import {TrialStore} from './store.mjs';
import {createTrials,TrialError,requireTrial} from './service.mjs';
import {credentialMap,trialLicenses,boundedJson} from './cryptolens.mjs';
import {createTrialMailer} from './email.mjs';
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'}});
export async function handleTrials(request,env,{createMailTransport}={}) {
  try {
    requireTrial(env.TRIALS_ENABLED==='true' && env.DB && env.TRIAL_HASH_KEY?.length>=32,'trial_setup_pending',503);
    const sendCode=createTrialMailer(env,createMailTransport);
    const create=credentialMap(env.CRYPTOLENS_TRIAL_CREATE_TOKENS), activate=credentialMap(env.CRYPTOLENS_TRIAL_ACTIVATE_TOKENS);
    requireTrial(create && activate,'trial_setup_pending',503);
    const url=new URL(request.url), origin=request.headers.get('origin');
    requireTrial(url.protocol==='https:' || ['localhost','127.0.0.1'].includes(url.hostname),'https_required',403);
    requireTrial(!origin || origin===env.TRIAL_ORIGIN || (env.TRIAL_LEGACY_ORIGIN && origin===env.TRIAL_LEGACY_ORIGIN),'origin_not_allowed',403);
    requireTrial(request.method==='POST','method_not_allowed',405);
    requireTrial(request.headers.get('content-type')?.startsWith('application/json'),'json_required',415);
    const input=await boundedJson(request,4096);
    requireTrial(input && typeof input==='object' && !Array.isArray(input),'invalid_request');
    // Public signup is explicit and affects trials only, never paid checkout.
    if(env.TRIAL_PUBLIC_SIGNUP!=='true') requireTrial(url.pathname.endsWith('/verify') ||
      (typeof input.email==='string' && input.email.trim().toLowerCase()===env.TRIAL_TEST_EMAIL.toLowerCase()),'trial_setup_pending',503);
    const service=createTrials({store:new TrialStore(env.DB.withSession('first-primary')),hashKey:env.TRIAL_HASH_KEY,
      licenses:trialLicenses(create,activate),sendCode,
      emailHourlyLimit:Number(env.TRIAL_EMAIL_HOURLY_LIMIT ?? 100),
      emailDailyLimit:Number(env.TRIAL_EMAIL_DAILY_LIMIT ?? 500)});
    const ip=request.headers.get('cf-connecting-ip') || 'unknown';
    if(url.pathname==='/api/trials/start') return json(await service.start(input,ip));
    if(url.pathname==='/api/trials/verify') return json(await service.verify(input,ip));
    return json({error:'not_found'},404);
  } catch(error) {
    const known=error instanceof TrialError;
    if(!known && !(error instanceof SyntaxError)) console.error(JSON.stringify({code:'trial_request_failed',type:error?.name || 'Error'}));
    return json({error:known ? error.code : error instanceof SyntaxError ? 'invalid_request' : 'trial_temporarily_unavailable'},known ? error.status : error instanceof SyntaxError ? 400 : 503);
  }
}
