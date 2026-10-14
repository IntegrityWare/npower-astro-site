
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { CartStore } from '../store/d1-store.mjs';
import { catalog, quoteCart, purchaseFlow, anniversary } from '../store/purchase-options.mjs';
import { ACCOUNT, CUSTOMER, createService, expectedPrices, templateCreator } from '../store/service.mjs';
import { handle, limitedBody } from '../worker/index.mjs';

// Runs the real migration and queries against SQLite, matching D1's statement contract.
function database() {
  const sql = new DatabaseSync(':memory:');
  sql.exec(fs.readFileSync(new URL('../migrations/0001_store.sql', import.meta.url), 'utf8'));
  const db = {
    withSession: () => db,
    prepare(text) {
      return { bind(...values) {
        const stmt = sql.prepare(text);
        return {
          first: async () => stmt.get(...values) ?? null,
          all: async () => ({ results:stmt.all(...values) }),
          run: async () => ({ meta:{ changes:Number(stmt.run(...values).changes) } }),
          execute: () => stmt.run(...values)
        };
      }};
    },
    async batch(statements) {
      sql.exec('BEGIN');
      try { for (const statement of statements) statement.execute(); sql.exec('COMMIT'); }
      catch (e) { sql.exec('ROLLBACK'); throw e; }
    }
  };
  return db;
}
const cart = [
  { product:'studio', option:'perpetual_floating', quantity:2, maintenance:true }
];
async function fixture(input = cart, overrides = {}) {
  const db=database(), store=new CartStore(db), sessions=new Map(), subscriptions=new Map();
  const counter={ created:0, issued:0, mailed:0, paginated:0 };
  const prices=new Map();
  for(const p of catalog.products) {
    for(const o of p.options) prices.set(o.stripePriceId, {
      id:o.stripePriceId, product:p.stripeProductId, active:true, livemode:false,
      currency:'usd', unit_amount:o.unitAmount, type:o.access==='annual'?'recurring':'one_time',
      recurring:o.access==='annual'?{interval:'year',interval_count:1}:null
    });
    prices.set(p.maintenance.stripePriceId, { id:p.maintenance.stripePriceId,product:p.maintenance.stripeProductId,
      active:true,livemode:false,currency:'usd',unit_amount:p.maintenance.unitAmount,
      type:'recurring',recurring:{interval:'year',interval_count:1} });
  }
  const stripe={
    accounts:{ retrieve:async()=>({ id:ACCOUNT }) },
    customers:{ retrieve:async()=>({ id:CUSTOMER,livemode:false }) },
    webhookEndpoints:{ list:async()=>({ has_more:false,data:[] }) },
    prices:{ retrieve:async id=>prices.get(id) },
    checkout:{ sessions:{
      create:async p=>{
        const id='cs_test_'+(++counter.created);
        const s={ ...p,id,livemode:false,url:'https://checkout.stripe.com/c/pay/'+id,status:'open',payment_status:'unpaid' };
        sessions.set(id,s);return s;
      },
      retrieve:async id=>structuredClone(sessions.get(id)),
      listLineItems:async id=>{counter.paginated++;return {...sessions.get(id).line_items,has_more:false};}
    }},
    subscriptions:{ retrieve:async id=>subscriptions.get(id) }
  };
  const dependencies={stripe,store,tokens:new Map(catalog.products.flatMap(p=>p.options.map(o=>[o.cryptolensTemplateId,'test-only-token']))),
    baseUrl:'https://www.npowersoftwarenew.com',clock:()=>1792000000,
    createLicense:async()=>{counter.issued++;return 'AAAAA-BBBBB-CCCCC-'+String(counter.issued).padStart(5,'D');},
    sendEmail:async m=>{counter.mailed++;assert.equal(m.recipient,'gcrocker61@gmail.com');return {messageId:'test-message'};},...overrides};
  const service=createService(dependencies);
  const result=await service.start(input,'attempt_abcdefghijklmnop','owner');
  async function payment(groupIndex=0) {
    const order=await store.order(result.orderId), group=(await store.groups(order.id))[groupIndex];
    const session=sessions.get(group.session_id);
    const expected=[...expectedPrices(group.plan,order).values()];
    Object.assign(session,{ status:'complete',payment_status:'paid',currency:'usd',
      amount_total:group.plan.group.dueToday,amount_subtotal:group.plan.group.dueToday,
      total_details:{amount_tax:0,amount_shipping:0,amount_discount:0},
      line_items:{has_more:false,data:expected.map(w=>({price:prices.get(w.id),quantity:w.quantity,amount_total:w.due,amount_subtotal:w.due}))}});
    if(session.mode==='subscription') {
      session.subscription='sub_'+groupIndex;
      subscriptions.set(session.subscription,{livemode:false,customer:CUSTOMER,
        status:group.plan.parameters.subscription_data?.trial_end?'trialing':'active',
        metadata:group.plan.parameters.subscription_data.metadata,
        trial_end:group.plan.parameters.subscription_data?.trial_end??null,cancel_at_period_end:false,
        items:{has_more:false,data:expected.filter(p=>p.recurring).map(p=>({price:prices.get(p.id),quantity:p.quantity}))}});
    }
    return {id:'evt_'+groupIndex,type:'checkout.session.completed',livemode:false,data:{object:{id:session.id,metadata:session.metadata}}};
  }
  return {db,store,stripe,service,dependencies,counter,sessions,result,payment};
}
test('quantities, floating prices and one-year maintenance deferral are server-calculated',()=>{
  const quote=quoteCart(cart,1792000000);
  assert.equal(quote.dueToday,599000);assert.equal(quote.annualRenewal,139000);
  assert.equal(quote.licenseCount,2);assert.equal(quote.items[0].concurrentUsers,2);
  assert.equal(quote.items[0].firstRenewal,anniversary(1792000000));
  assert.equal(anniversary(Date.UTC(2024,1,29)/1000),Date.UTC(2025,1,28)/1000);
  assert.throws(()=>quoteCart([{...cart[0],quantity:0}]),/invalid_cart/);
  assert.throws(()=>quoteCart([{...cart[0],option:'invented'}]),/invalid_cart/);
});
test('durable order retries preserve the original purchase and prevent changed-cart reuse',async()=>{
  const f=await fixture();
  const same=await f.service.start(cart,'attempt_abcdefghijklmnop','owner');
  assert.equal(same.orderId,f.result.orderId);assert.equal(f.counter.created,1);
  await assert.rejects(f.service.start([{...cart[0],quantity:3}],'attempt_abcdefghijklmnop','owner'),/cart_changed/);
  await assert.rejects(f.service.receipt(f.result.orderId,'someone_else'),/order_not_found/);
  const restored=new CartStore(f.db);
  assert.equal((await restored.units((await restored.groups(f.result.orderId))[0].id)).length,2);
});
test('a verified purchase issues one key per unit and sends one activation email across retries',async()=>{
  const f=await fixture(), event=await f.payment();
  assert.equal(await f.service.handleEvent(event),'fulfilled');
  const restarted=createService({...f.dependencies,store:new CartStore(f.db)});
  assert.equal(await restarted.handleEvent(event),'already_fulfilled');
  assert.equal(f.counter.issued,2);assert.equal(f.counter.mailed,1);
  const receipt=await restarted.receipt(f.result.orderId,'owner');
  assert.equal(receipt.complete,true);assert.equal(receipt.email,'sent');
  assert.equal(receipt.groups[0].licenses.length,2);
});
test('mixed annual and deferred maintenance orders require both payments before email',async()=>{
  const f=await fixture([{product:'viz',option:'annual_node_locked',quantity:1,maintenance:false},...cart]);
  const order=await f.store.order(f.result.orderId), groups=await f.store.groups(order.id);
  assert.equal(groups.length,2);
  assert.equal(groups[0].plan.parameters.subscription_data.trial_end,undefined);
  assert.ok(groups[1].plan.parameters.subscription_data.trial_end);
  await f.service.handleEvent(await f.payment(0));
  assert.equal(f.counter.mailed,0);
  await f.service.continue(order.id,'owner');
  await f.service.handleEvent(await f.payment(1));
  assert.equal(f.counter.issued,3);assert.equal(f.counter.mailed,1);
});
test('unpaid, live, wrong-customer and modified-price payments never create licenses',async()=>{
  for(const change of [
    s=>{s.livemode=true;},s=>{s.customer='cus_wrong';},
    s=>{s.amount_total++;},s=>{s.line_items.data[0].price={...s.line_items.data[0].price,id:'price_forged'};}
  ]) {
    const f=await fixture(), event=await f.payment();change(f.sessions.get(event.data.object.id));
    await assert.rejects(f.service.handleEvent(event));
    assert.equal(f.counter.issued,0);assert.equal(f.counter.mailed,0);
  }
  const f=await fixture(), e=await f.payment();f.sessions.get(e.data.object.id).payment_status='unpaid';
  assert.equal(await f.service.handleEvent(e),'awaiting_payment');assert.equal(f.counter.issued,0);
});
test('uncertain issuance is held for review and never repeated by webhook retries',async()=>{
  let attempts=0;
  const f=await fixture(cart,{createLicense:async()=>{attempts++;throw Error('timeout');}});
  const e=await f.payment();
  await assert.rejects(f.service.handleEvent(e),/fulfillment_requires_review/);
  await assert.rejects(f.service.handleEvent(e),/fulfillment_requires_review/);
  assert.equal(attempts,1);assert.equal(f.counter.mailed,0);
  assert.equal((await f.store.groups(f.result.orderId))[0].status,'review');
});
test('uncertain email does not undo issued licenses or automatically resend',async()=>{
  let sends=0;
  const f=await fixture(cart,{sendEmail:async()=>{sends++;throw Error('timeout');}});
  const e=await f.payment();
  await f.service.handleEvent(e);await f.service.handleEvent(e);
  const receipt=await f.service.receipt(f.result.orderId,'owner');
  assert.equal(receipt.complete,true);assert.equal(receipt.email,'review');
  assert.equal(sends,1);assert.equal(f.counter.issued,2);
});
test('D1 claims allow only one license issuer and enforce rate limits',async()=>{
  const f=await fixture(), group=(await f.store.groups(f.result.orderId))[0];
  const results=await Promise.all([f.store.claim(group.id,'evt_a',null),new CartStore(f.db).claim(group.id,'evt_b',null)]);
  assert.deepEqual(results.sort(),[false,true]);
  await f.store.limit('test',1,60,100);
  await assert.rejects(f.store.limit('test',1,60,100),/please_wait/);
  await f.store.limit('test',1,60,180);
});
test('expanded line-item pagination is fetched before validation',async()=>{
  const f=await fixture(), e=await f.payment();
  f.sessions.get(e.data.object.id).line_items.has_more=true;
  await f.service.handleEvent(e);assert.equal(f.counter.paginated,1);
});
test('Cryptolens responses are bounded and restricted to a configured template',async()=>{
  let sent;
  const create=templateCreator(new Map([[4250,'not-a-real-token']]),async(url,request)=>{
    sent={url,request};return new Response(JSON.stringify({result:0,key:'AAAAA-BBBBB-CCCCC-DDDDD'}));
  });
  assert.equal(await create({template_id:4250}),'AAAAA-BBBBB-CCCCC-DDDDD');
  assert.equal(new URLSearchParams(sent.request.body).get('LicenseTemplateId'),'4250');
  await assert.rejects(create({template_id:999}),/issuing_credential_missing/);
  const oversized=templateCreator(new Map([[4250,'fake']]),async()=>new Response('x'.repeat(65537)));
  await assert.rejects(oversized({template_id:4250}),/license_response_invalid/);
});
test('HTTP API rejects foreign origins, oversized bodies and unsigned webhooks',async()=>{
  const env={STORE_ORIGIN:'https://www.npowersoftwarenew.com',DB:database(),STORE_ENABLED:'true',
    STRIPE_SECRET_KEY:'sk_test_fake',STRIPE_WEBHOOK_SECRET:'whsec_fake',SANDBOX_ACCESS_CODE:'a'.repeat(24),
    EMAIL_ENABLED:'true',EMAIL_FROM:'licenses@npowersoftwarenew.com',SANDBOX_EMAIL:'gcrocker61@gmail.com',EMAIL:{}};
  const endpoint='https://www.npowersoftwarenew.com/api/store/';
  const foreign=await handle(new Request(endpoint+'checkout',{method:'POST',headers:{origin:'https://foreign.example','content-type':'application/json'},body:'{}'}),env);
  assert.equal(foreign.status,403);
  const unsigned=await handle(new Request(endpoint+'webhook',{method:'POST',body:'{}'}),env);
  assert.equal(unsigned.status,400);assert.equal((await unsigned.json()).error,'invalid_webhook_signature');
  await assert.rejects(limitedBody(new Request(endpoint,{method:'POST',body:'12345'}),4),/request_too_large/);
  const closed=await handle(new Request(endpoint+'status'),{...env,STORE_ENABLED:'false'});
  assert.equal((await closed.json()).ready,false);
});

test('oversized sandbox orders are rejected before Stripe checkout is created',async()=>{
  const f=await fixture();
  await assert.rejects(f.service.start([{...cart[0],quantity:11}],'attempt_oversized12345','owner'),/sandbox_license_limit/);
  assert.equal(f.counter.created,1);
});
