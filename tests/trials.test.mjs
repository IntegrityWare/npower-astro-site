import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {TrialStore} from '../trials/store.mjs';
import {createTrials} from '../trials/service.mjs';
import {trialLicenses} from '../trials/cryptolens.mjs';
import {handleTrials} from '../trials/http.mjs';
const machine='A'.repeat(64), otherMachine='B'.repeat(64), email='tester@example.test';
const configuration=JSON.parse(readFileSync(new URL('../wrangler.jsonc',import.meta.url),'utf8'));
test('Pages and Worker route trial requests without removing paid-store routing',()=>{
  const pages=JSON.parse(readFileSync(new URL('../public/_routes.json',import.meta.url),'utf8'));
  for(const route of ['/api/trials/*','/api/store/*']) {
    assert.ok(pages.include.includes(route));
    assert.ok(configuration.assets.run_worker_first.includes(route));
  }
  for(const route of ['/api/contact','/SolidWorks/*']) assert.ok(pages.include.includes(route));
  assert.deepEqual(pages.exclude,[]);
});
function httpFixture() {
  const f=fixture(),messages=[];
  const credentials=JSON.stringify(Object.fromEntries([33431,33432,33433].map(id=>[id,'mock-only-trial-token-not-a-real-credential'])));
  const env={...configuration.vars,TRIALS_ENABLED:'true',TRIAL_PUBLIC_SIGNUP:'false',DB:f.db,TRIAL_HASH_KEY:'test-only-hash-key-not-a-real-secret',
    TRIAL_SMTP_PASSWORD:'mock-only-password',
    CRYPTOLENS_TRIAL_CREATE_TOKENS:credentials,CRYPTOLENS_TRIAL_ACTIVATE_TOKENS:credentials,
    EMAIL:{send:async()=>assert.fail('Trial email must not use the paid-store binding')}};
  const createMailTransport=()=>({sendMail:async message=>{messages.push(message);return {accepted:[message.to],rejected:[]};},close(){}});
  const requestOrigin=env.TRIAL_ORIGIN;
  const start=(address=env.TRIAL_TEST_EMAIL)=>handleTrials(new Request(requestOrigin+'/api/trials/start',{
    method:'POST',headers:{'Content-Type':'application/json','Origin':requestOrigin},
    body:JSON.stringify({email:address,machine,edition:2})}),env,{createMailTransport});
  return {f,env,messages,start};
}
function fixture(limits={}) {
  const sql=new DatabaseSync(':memory:');
  sql.exec(readFileSync(new URL('../migrations/0003_trials.sql',import.meta.url),'utf8'));
  const db={withSession:()=>db,prepare(text){return {bind(...args){const statement=sql.prepare(text); return {
    first:async()=>statement.get(...args) ?? null,all:async()=>({results:statement.all(...args)}),
    run:async()=>({meta:{changes:Number(statement.run(...args).changes)}}),execute:()=>statement.run(...args)
  };}};},async batch(statements){sql.exec('BEGIN');try{for(const s of statements)s.execute();sql.exec('COMMIT');}catch(e){sql.exec('ROLLBACK');throw e;}}};
  const f={sql,db,store:new TrialStore(db),time:1792080000,sent:[],issues:[],failEmail:false,failIssue:false};
  f.service=createTrials({...limits,store:f.store,hashKey:'test-only-not-a-real-secret'.repeat(2),now:()=>f.time,
    sendCode:async(address,code)=>{if(f.failEmail)throw Error('mail down');f.sent.push({address,code});},
    licenses:{issue:async(input)=>{f.issues.push(input);if(f.failIssue)throw Error('uncertain timeout');
      return {key:'TEST-KEY-'+f.issues.length,customerId:7,expires:f.time+30*86400};}}});
  f.start=async(overrides={})=>f.service.start({email,machine,edition:2,...overrides},'test-ip');
  f.verify=(pending,overrides={})=>f.service.verify({...pending,code:f.sent.at(-1).code,machine,...overrides},'test-ip');
  return f;
}
for(const edition of [2,4,8]) test('Verified edition '+edition+' automatically issues one license',async()=>{
  const f=fixture(),pending=await f.start({edition});
  assert.equal(f.issues.length,0);assert.equal(f.sent.length,1);assert.equal(JSON.stringify(pending).includes(f.sent[0].code),false);
  const result=await f.verify(pending);assert.equal(result.edition,edition);assert.equal(result.key,'TEST-KEY-1');
  assert.equal(f.issues[0].email,email);assert.equal(f.issues[0].machine,machine);
  assert.equal(f.issues[0].productId,{2:33431,4:33432,8:33433}[edition]);
  assert.equal((await f.verify(pending)).key,result.key);assert.equal(f.issues.length,1);
});
test('Different email on the same machine cannot get another trial or the original key',async()=>{
  const f=fixture();await f.verify(await f.start());
  const p=await f.start({email:'different@example.test',edition:8});
  await assert.rejects(f.verify(p),{code:'trial_already_used'});assert.equal(f.issues.length,1);
});
test('Same email on another machine cannot start again',async()=>{
  const f=fixture();await f.verify(await f.start());const p=await f.start({machine:otherMachine});
  await assert.rejects(f.verify(p,{machine:otherMachine}),{code:'trial_already_used'});assert.equal(f.issues.length,1);
});
test('Switching editions cannot restart the evaluation',async()=>{
  const f=fixture();await f.verify(await f.start());
  await assert.rejects(f.verify(await f.start({edition:4})),{code:'trial_edition_mismatch'});assert.equal(f.issues.length,1);
});
test('Reinstall/retry preserves original key and expiry, including email casing',async()=>{
  const f=fixture(),first=await f.verify(await f.start());f.time+=7*86400;
  assert.deepEqual(await f.verify(await f.start({email:' Tester@Example.Test '})),first);assert.equal(f.issues.length,1);
});
test('Expiry and cleanup never reset eligibility',async()=>{
  const f=fixture();await f.verify(await f.start());f.time+=30*86400;
  await f.store.cleanup(f.time);assert.equal(f.sql.prepare('SELECT count(*) AS n FROM trial_requests').get().n,0);
  await assert.rejects(f.verify(await f.start()),{code:'trial_expired'});assert.equal(f.issues.length,1);
});
test('Invalid or stolen challenge and wrong machine cannot issue a license',async()=>{
  const f=fixture(),p=await f.start();
  for(const overrides of [{secret:'0'.repeat(64)},{machine:otherMachine},{id:'c'.repeat(64)},{code:'invalid'}])
    await assert.rejects(f.verify(p,overrides),{code:'verification_invalid'});
  assert.equal(f.issues.length,0);
});
test('Five incorrect guesses exhaust the challenge',async()=>{
  const f=fixture(),p=await f.start();const wrong=f.sent[0].code==='00000000'?'11111111':'00000000';
  for(let i=0;i<5;i++)await assert.rejects(f.verify(p,{code:wrong}),{code:'verification_invalid'});
  await assert.rejects(f.verify(p),{code:'verification_invalid'});assert.equal(f.issues.length,0);
});
test('Code expires after fifteen minutes',async()=>{
  const f=fixture(),p=await f.start();f.time+=900;
  await assert.rejects(f.verify(p),{code:'verification_invalid'});assert.equal(f.issues.length,0);
});
test('Rate limits persist in the database and apply to different emails on one machine',async()=>{
  const f=fixture();for(let i=0;i<5;i++)await f.start({email:'person'+i+'@example.test'});
  await assert.rejects(f.start({email:'last@example.test'}),{code:'rate_limited'});
});
test('Failed email delivery cannot produce a usable challenge or reserve eligibility',async()=>{
  const f=fixture();f.failEmail=true;await assert.rejects(f.start(),{code:'trial_email_unavailable'});
  assert.equal(f.sql.prepare('SELECT count(*) AS n FROM trial_requests').get().n,0);assert.equal(f.issues.length,0);
});
test('Uncertain vendor issuance is held for review and never retried',async()=>{
  const f=fixture();f.failIssue=true;const p=await f.start();
  await assert.rejects(f.verify(p),{code:'trial_review_required'});f.failIssue=false;
  await assert.rejects(f.verify(p),{code:'trial_review_required'});
  await assert.rejects(f.verify(await f.start()),{code:'trial_review_required'});assert.equal(f.issues.length,1);
});
test('Concurrent verification for one challenge cannot create two licenses',async()=>{
  const f=fixture(),p=await f.start();await Promise.allSettled(Array.from({length:8},()=>f.verify(p)));
  assert.equal(f.issues.length,1);assert.equal((await f.verify(p)).key,'TEST-KEY-1');
});
test('Concurrent different verified emails on one machine still issue at most one license',async()=>{
  const f=fixture(),p1=await f.start(),code1=f.sent[0].code,p2=await f.start({email:'second@example.test'});
  await Promise.allSettled([f.verify(p1,{code:code1}),f.verify(p2)]);
  assert.equal(f.issues.length,1);assert.equal(f.sql.prepare('SELECT count(*) AS n FROM trial_licenses').get().n,1);
});
test('Database contains no raw machine IDs, request credentials or email verification codes',async()=>{
  const f=fixture(),p=await f.start();await f.verify(p);
  const rows=JSON.stringify({requests:f.sql.prepare('SELECT * FROM trial_requests').all(),licenses:f.sql.prepare('SELECT * FROM trial_licenses').all()});
  for(const value of [machine,p.secret,f.sent[0].code])assert.equal(rows.includes(value),false);
});
test('Trial endpoint is disabled until configured and does not affect paid licensing',async()=>{
  const response=await handleTrials(new Request('https://example.test/api/trials/start',{method:'POST'}),{});
  assert.equal(response.status,503);assert.deepEqual(await response.json(),{error:'trial_setup_pending'});
});
test('Public trial configuration keeps support sender and paid checkout Gmail-only',()=>{
  assert.equal(configuration.vars.TRIAL_EMAIL_FROM,'support@npowersoftware.com');
  assert.equal(configuration.vars.TRIALS_ENABLED,'true');
  assert.equal(configuration.vars.TRIAL_PUBLIC_SIGNUP,'true');
  assert.equal(configuration.vars.TRIAL_EMAIL_HOURLY_LIMIT,'100');
  assert.equal(configuration.vars.TRIAL_EMAIL_DAILY_LIMIT,'500');
  assert.equal(configuration.send_email.some(binding=>binding.name==='TRIAL_EMAIL'),false);
  assert.equal(configuration.vars.TRIAL_SMTP_HOST,'mail.npowersoftware.com');
  assert.equal(configuration.vars.TRIAL_SMTP_PORT,'465');
  assert.equal(configuration.vars.TRIAL_SMTP_USER,'dgill@npowersoftware.com');
  assert.equal(configuration.vars.TRIAL_TEST_EMAIL,'gcrocker61@gmail.com');
  assert.equal(configuration.vars.TRIAL_SMTP_PASSWORD,undefined);
  const paid=configuration.send_email.find(binding=>binding.name==='EMAIL');
  assert.equal(configuration.vars.EMAIL_FROM,'licenses@npowersoftwarenew.com');
  assert.deepEqual(paid.allowed_sender_addresses,['licenses@npowersoftwarenew.com']);
  assert.deepEqual(paid.allowed_destination_addresses,['gcrocker61@gmail.com']);
});
test('HTTP verification email uses the requested support sender without issuing a license',async()=>{
  const h=httpFixture();try {
    const response=await h.start();assert.equal(response.status,200);
    assert.equal(h.messages.length,1);const message=h.messages[0];
    assert.deepEqual(message.from,{address:'support@npowersoftware.com',name:'nPower Software'});
    assert.equal(message.to,'gcrocker61@gmail.com');
    const code=message.text.match(/code is (\d{8})\./)?.[1];assert.ok(code);
    assert.ok(message.html.includes(code));assert.equal(JSON.stringify(await response.json()).includes(code),false);
    assert.equal(h.f.sql.prepare('SELECT count(*) AS n FROM trial_licenses').get().n,0);
  }finally{h.f.sql.close();}
});
test('Trial mail never falls back to the paid-store sender or binding',async()=>{
  for(const name of ['TRIAL_SMTP_PASSWORD','TRIAL_SMTP_USER','TRIAL_SMTP_HOST','TRIAL_SMTP_PORT','TRIAL_EMAIL_FROM','TRIAL_TEST_EMAIL']) {
    const h=httpFixture();try {
      delete h.env[name];const response=await h.start();assert.equal(response.status,503);
      assert.deepEqual(await response.json(),{error:'trial_setup_pending'});assert.equal(h.messages.length,0);
    }finally{h.f.sql.close();}
  }
});
test('Trial HTTP start keeps the Gmail-only testing restriction',async()=>{
  const h=httpFixture();try {
    assert.equal((await h.start('not-the-tester@example.test')).status,503);assert.equal(h.messages.length,0);
    assert.equal(h.f.sql.prepare('SELECT count(*) AS n FROM trial_requests').get().n,0);
  }finally{h.f.sql.close();}
});

test('Public HTTP signup sends to unknown valid addresses but issues nothing before verification',async()=>{
  const h=httpFixture();try {
    h.env.TRIAL_PUBLIC_SIGNUP='true';delete h.env.TRIAL_TEST_EMAIL;
    for(const address of ['new.person@example.test','another+pilot@example.test']) {
      const response=await h.start(address);assert.equal(response.status,200);
      const data=await response.json();assert.equal(data.key,undefined);assert.equal(data.code,undefined);
    }
    assert.deepEqual(h.messages.map(message=>message.to),['new.person@example.test','another+pilot@example.test']);
    assert.equal(h.f.sql.prepare('SELECT count(*) AS n FROM trial_licenses').get().n,0);
    for(const address of ['bad address', 'a@example.test,b@example.test', 42]) {
      const response=await h.start(address);assert.equal(response.status,400);
      assert.deepEqual(await response.json(),{error:'invalid_email'});
    }
    assert.equal(h.messages.length,2);
  }finally{h.f.sql.close();}
});

test('Public signup still requires complete server configuration and the master enable switch',async()=>{
  for(const missing of ['TRIAL_SMTP_PASSWORD','TRIAL_HASH_KEY','CRYPTOLENS_TRIAL_CREATE_TOKENS',
    'CRYPTOLENS_TRIAL_ACTIVATE_TOKENS','DB','TRIAL_ORIGIN']) {
    const h=httpFixture();try {
      h.env.TRIAL_PUBLIC_SIGNUP='true';delete h.env[missing];
      assert.equal((await h.start('new@example.test')).status,503);assert.equal(h.messages.length,0);
    }finally{h.f.sql.close();}
  }
  const h=httpFixture();try {
    h.env.TRIAL_PUBLIC_SIGNUP='true';h.env.TRIALS_ENABLED='false';
    assert.equal((await h.start('new@example.test')).status,503);assert.equal(h.messages.length,0);
  }finally{h.f.sql.close();}
});

test('Switching public mode off restores the Gmail restriction without deleting trial history',async()=>{
  const h=httpFixture();try {
    h.env.TRIAL_PUBLIC_SIGNUP='true';
    assert.equal((await h.start('new@example.test')).status,200);
    const requests=h.f.sql.prepare('SELECT count(*) AS n FROM trial_requests').get().n;
    h.env.TRIAL_PUBLIC_SIGNUP='false';
    assert.equal((await h.start('new@example.test')).status,503);
    assert.equal(h.f.sql.prepare('SELECT count(*) AS n FROM trial_requests').get().n,requests);
    assert.equal(h.messages.length,1);
    assert.equal((await h.start()).status,200);
  }finally{h.f.sql.close();}
});

test('Aggregate hourly and daily mail budgets survive changing users and time windows',async()=>{
  for(const limits of [{emailHourlyLimit:2,emailDailyLimit:10},{emailHourlyLimit:10,emailDailyLimit:2}]) {
    const f=fixture(limits);try {
      await f.start();await f.start({email:'second@example.test',machine:otherMachine});
      await assert.rejects(f.start({email:'third@example.test',machine:'C'.repeat(64)}),{code:'rate_limited'});
      assert.equal(f.sent.length,2);assert.equal(f.issues.length,0);
      f.time+=3600;
      if(limits.emailDailyLimit===2) {
        await assert.rejects(f.start({email:'fourth@example.test',machine:'D'.repeat(64)}),{code:'rate_limited'});
        f.time+=86400;
      }
      await f.start({email:'fifth@example.test',machine:'E'.repeat(64)});
      assert.equal(f.sent.length,3);
    }finally{f.sql.close();}
  }
});

test('Concurrent requests cannot overshoot the aggregate mail budget',async()=>{
  const f=fixture({emailHourlyLimit:2,emailDailyLimit:2});try {
    const results=await Promise.allSettled(Array.from({length:12},(_,i)=>f.start({
      email:'person'+i+'@example.test',machine:i.toString(16).padStart(64,'0')})));
    assert.equal(results.filter(result=>result.status==='fulfilled').length,2);
    assert.equal(f.sent.length,2);assert.equal(f.issues.length,0);
  }finally{f.sql.close();}
});

test('Invalid aggregate limits fail closed before email or database writes',async()=>{
  for(const value of ['', '0', '-1', 'unlimited', '1.5', '100001']) {
    const h=httpFixture();try {
      h.env.TRIAL_PUBLIC_SIGNUP='true';h.env.TRIAL_EMAIL_DAILY_LIMIT=value;
      assert.equal((await h.start('new@example.test')).status,503);assert.equal(h.messages.length,0);
      assert.equal(h.f.sql.prepare('SELECT count(*) AS n FROM trial_limits').get().n,0);
    }finally{h.f.sql.close();}
  }
});
test('Vendor adapter creates customer trial and binds machine before returning key',async()=>{
  const calls=[];const start=Date.UTC(2026,9,15)/1000;
  const api=trialLicenses({33431:'server-create-secret'},{33431:'activate-only-secret'},async(url,init)=>{
    const data=Object.fromEntries(init.body);calls.push({url,init,data});
    if(url.endsWith('/CreateKey'))return Response.json({result:0,key:'VENDOR-TEST',customerId:7});
    return Response.json({result:0,productId:33431,licenseKey:{key:'VENDOR-TEST',customer:{id:7},block:false,f1:true,f2:true,
      period:30,maxNoOfMachines:1,created:new Date(start*1000).toISOString(),expires:new Date((start+30*86400)*1000).toISOString(),activatedMachines:[{mid:machine}],dataObjects:[]}});
  });
  assert.equal((await api.issue({email,machine,productId:33431,reference:'test'})).key,'VENDOR-TEST');
  assert.equal(calls.length,2);assert.equal(calls[0].data.Period,'30');assert.equal(calls[0].data.AddOrUseExistingCustomer,'true');
  assert.equal(calls[0].data.MaxNoOfMachines,'1');assert.equal(calls[0].data.TrialActivation,'false');
  assert.equal(calls[1].data.MachineCode,machine);assert.equal(calls[0].init.redirect,'manual');
});
test('Vendor timeout does not retry CreateKey',async()=>{
  let calls=0;const api=trialLicenses({33431:'test'},{33431:'test'},async()=>{calls++;throw Error('timeout');});
  await assert.rejects(api.issue({email,machine,productId:33431,reference:'test'}));assert.equal(calls,1);
});


test('Production and legacy desktop routing rejects unsafe origins without side effects',async()=>{
  const {f,env,messages}=httpFixture();
  for(const [host,origin,status,error] of [
    ['www.npowersoftware.com','https://www.npowersoftware.com',405,'method_not_allowed'],
    ['www.npowersoftwarenew.com',undefined,405,'method_not_allowed'],
    ['www.npowersoftwarenew.com','https://www.npowersoftwarenew.com',405,'method_not_allowed'],
    ['www.npowersoftware.com','https://foreign.example',403,'origin_not_allowed'],
  ]) {
    const response=await handleTrials(new Request('https://'+host+'/api/trials/start',{
      headers:origin ? {Origin:origin} : {},
    }),env);
    assert.equal(response.status,status);assert.equal((await response.json()).error,error);
  }
  assert.equal(messages.length,0);
  for(const table of ['trial_requests','trial_licenses','trial_limits'])
    assert.equal(f.sql.prepare('SELECT count(*) AS n FROM '+table).get().n,0);
});
