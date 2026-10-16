// Pages-to-Worker private service binding; no hardcoded third-party destination.
export async function onRequest({request,env}) {
  if(!env.TRIAL_SERVICE) return Response.json({error:'trial_setup_pending'}, {status:503,headers:{'Cache-Control':'no-store'}});
  return env.TRIAL_SERVICE.fetch(request);
}
