
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { CartStore } from '../store/d1-store.mjs';
import { catalog, quoteCart, purchaseFlow, anniversary } from '../store/purchase-options.mjs';
import { ACCOUNT, CUSTOMER, createService, expectedPrices, templateCreator } from '../store/service.mjs';
import { handle, limitedBody } from '../worker/index.mjs';

// Runs the real migration and queries against SQLite, matching D1's statement contract.
export function database() {
  const sql = new DatabaseSync(':memory:');
  for (const name of ['0001_store.sql','0002_lifecycle.sql']) sql.exec(fs.readFileSync(new URL('../migrations/' + name, import.meta.url), 'utf8'));
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
export async function fixture(input = cart, overrides = {}) {
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
  return {db,store,stripe,service,dependencies,counter,sessions,subscriptions,prices,result,payment};
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
  assert.equal(sent.request.redirect,'manual'); // workerd rejects redirect:error; never forward tokens.
  const redirect=templateCreator(new Map([[4250,'fake']]),async()=>new Response(null,{status:302,headers:{Location:'https://example.com'}}));
  await assert.rejects(redirect({template_id:4250}),/license_response_http_302/);
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

import { createLifecycle } from '../store/lifecycle.mjs';
import { cryptolensLifecycle, utcDay, paidDay } from '../store/cryptolens-lifecycle.mjs';

async function billingFixture(input = [{product:'viz',option:'annual_node_locked',quantity:1,maintenance:false}]) {
  const f = await fixture(input), checkout = await f.payment();
  await f.service.handleEvent(checkout);
  const group = (await f.store.groups(f.result.orderId))[0], order = await f.store.order(f.result.orderId);
  const sub = f.subscriptions.get(group.subscription_id); sub.id = group.subscription_id;
  const invoiceMap = new Map(), keyDays = new Map(), calls = [];
  let now = order.created;
  const units = await f.store.units(group.id);
  for (const u of units) keyDays.set(u.id, paidDay(u.selection.firstRenewal));
  const prices = expectedPrices(group.plan,order);
  f.stripe.invoices = {
    list:async()=>({data:[...invoiceMap.values()].filter(i=>i.status==='paid').sort((a,b)=>b.created-a.created).slice(0,1)}),
    retrieve:async id=>structuredClone(invoiceMap.get(id)),
    listLineItems:async id=>({...invoiceMap.get(id).lines,has_more:false})
  };
  const licenses = {
    read:async u=>({day:keyDays.get(u.id)}),
    extend:async(u,days)=>{calls.push({id:u.id,days});keyDays.set(u.id,Math.max(utcDay(now),keyDays.get(u.id))+days);}
  };
  const dependencies={stripe:f.stripe,store:f.store,licenses,expectedPrices,customer:CUSTOMER,clock:()=>now};
  const lifecycle=createLifecycle(dependencies);
  const event=(type,object,id='evt_billing')=>({id,type,livemode:false,data:{object:structuredClone(object)}});
  function invoice({id='in_renewal',initial=false,start=order.quote.items[0].firstRenewal,status='paid'}={}) {
    const end=initial && sub.trial_end ? sub.trial_end : anniversary(start);
    const lines=[...prices.values()].filter(p=>initial || p.recurring).map(p=>{
      const amount=initial?p.due:p.amount*p.quantity;
      return {id:'il_'+p.id,livemode:false,currency:'usd',quantity:p.quantity,amount,subtotal:amount,
        pricing:{price_details:{price:p.id,product:p.product}},period:{start,end},
        parent:{[p.recurring?'subscription_item_details':'invoice_item_details']:{subscription:sub.id,proration:false}}};
    });
    const total=lines.reduce((sum,l)=>sum+l.amount,0);
    const inv={id,livemode:false,customer:CUSTOMER,parent:{subscription_details:{subscription:sub.id}},
      status,currency:'usd',amount_remaining:status==='paid'?0:total,amount_paid:status==='paid'?total:0,
      total,created:start,billing_reason:initial?'subscription_create':'subscription_cycle',lines:{has_more:false,data:lines}};
    invoiceMap.set(id,inv);return inv;
  }
  invoice({id:'in_initial',initial:true,start:order.created});
  return {...f,group,order,sub,units,invoice,invoiceMap,keyDays,calls,lifecycle,dependencies,licenses,event,setNow:n=>{now=n;}};
}

test('paid annual renewals extend every purchased key once across duplicate and out-of-order events',async()=>{
  const f=await billingFixture([{product:'viz',option:'annual_floating',quantity:2,maintenance:false}]);
  const inv=f.invoice(), e=f.event('invoice.paid',inv);
  assert.equal(await f.lifecycle.event(e),'lifecycle_synced');
  assert.equal(f.calls.length,2);
  const end=inv.lines.data[0].period.end;
  assert.ok([...f.keyDays.values()].every(d=>d===paidDay(end)));
  await createLifecycle(f.dependencies).event(e);
  await f.lifecycle.event(f.event('invoice.paid',f.invoiceMap.get('in_initial'),'evt_old'));
  assert.equal(f.calls.length,2); assert.equal(f.counter.issued,2); assert.equal(f.counter.mailed,1);
});

test('scheduled and immediate cancellations preserve the paid-through date; stale events cannot restart renewal',async()=>{
  const f=await billingFixture(), inv=f.invoice();
  await f.lifecycle.event(f.event('invoice.paid',inv));
  const dates=[...f.keyDays.values()];
  const old=f.event('customer.subscription.updated',f.sub,'evt_active_old');
  Object.assign(f.sub,{cancel_at_period_end:true,cancel_at:inv.lines.data[0].period.end});
  await f.lifecycle.event(f.event('customer.subscription.updated',f.sub));
  assert.equal((await f.lifecycle.state.summary(f.group.id)).cancel_at,f.sub.cancel_at);
  Object.assign(f.sub,{status:'canceled',ended_at:f.order.created+100});
  await f.lifecycle.event(f.event('customer.subscription.deleted',f.sub,'evt_deleted'));
  await f.lifecycle.event(old);
  assert.equal((await f.lifecycle.state.summary(f.group.id)).subscription_status,'canceled');
  assert.deepEqual([...f.keyDays.values()],dates); assert.equal(f.calls.length,1);
});

test('failed payment never extends access; subsequent paid recovery extends from the invoice period',async()=>{
  const f=await billingFixture(), failed=f.invoice({id:'in_renewal',status:'open'});
  f.sub.status='past_due';
  await f.lifecycle.event(f.event('invoice.payment_failed',failed));
  assert.equal(f.calls.length,0);
  f.setNow(failed.lines.data[0].period.start+86400*12);
  f.sub.status='active'; const paid=f.invoice({id:'in_renewal'});
  await f.lifecycle.event(f.event('invoice.paid',paid,'evt_recovered'));
  assert.equal(f.calls[0].days,paidDay(paid.lines.data[0].period.end)-utcDay(failed.lines.data[0].period.start+86400*12));
  assert.equal([...f.keyDays.values()][0],paidDay(paid.lines.data[0].period.end));
});

test('maintenance renewal updates the same perpetual keys and cancellation keeps lifetime access',async()=>{
  const f=await billingFixture([{product:'studio_re',option:'perpetual_floating',quantity:2,maintenance:true}]);
  await f.lifecycle.event(f.event('customer.subscription.updated',f.sub));
  assert.equal(f.calls.length,0);
  f.sub.status='active'; const invoice=f.invoice();
  await f.lifecycle.event(f.event('invoice.paid',invoice));
  assert.equal(f.calls.length,2);
  f.sub.status='canceled';
  await f.lifecycle.event(f.event('customer.subscription.deleted',f.sub,'evt_cancel'));
  assert.equal(f.calls.length,2); assert.equal(f.counter.issued,2);
  assert.ok(f.units.every(u=>u.selection.access==='perpetual' && u.selection.licenseType==='floating'));
});

test('cron recovers missed payment events and completes quantities in bounded batches',async()=>{
  const f=await billingFixture([{product:'studio',option:'annual_node_locked',quantity:7,maintenance:false}]);
  f.invoice();
  assert.equal(await f.lifecycle.scheduled(),'pending'); assert.equal(f.calls.length,3);
  f.setNow(f.order.created+61);
  assert.equal(await f.lifecycle.scheduled(),'pending'); assert.equal(f.calls.length,6);
  f.setNow(f.order.created+122);
  assert.equal(await f.lifecycle.scheduled(),'synced'); assert.equal(f.calls.length,7);
});

test('concurrent workers cannot both extend a key',async()=>{
  const f=await billingFixture(), inv=f.invoice();
  const results=await Promise.allSettled([f.lifecycle.event(f.event('invoice.paid',inv)),
    createLifecycle(f.dependencies).event(f.event('invoice.paid',inv,'evt_duplicate'))]);
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
  assert.equal(f.calls.length,1);
});

test('uncertain extension is reconciled by reading; a request that may still be in flight is never repeated',async()=>{
  for (const accepted of [true,false]) {
    const f=await billingFixture(), inv=f.invoice(); let attempts=0;
    f.licenses.extend=async(u,days)=>{attempts++;if(accepted)f.keyDays.set(u.id,f.keyDays.get(u.id)+days);throw Error('timeout');};
    const e=f.event('invoice.paid',inv);
    await assert.rejects(f.lifecycle.event(e),/renewal_outcome_uncertain/);
    if(accepted) assert.equal(await createLifecycle(f.dependencies).event(e),'lifecycle_synced');
    else await assert.rejects(createLifecycle(f.dependencies).event(e),/renewal_outcome_uncertain/);
    assert.equal(attempts,1);
  }
});

test('changed quantities, foreign invoices, prorations, credits and premature maintenance charges require review',async()=>{
  for (const change of [
    f=>{f.sub.items.data[0].quantity++;},
    (_f,i)=>{i.customer='cus_other';},
    (_f,i)=>{i.livemode=true;},
    (_f,i)=>{i.lines.data[0].parent.subscription_item_details.proration=true;},
    (_f,i)=>{i.post_payment_credit_notes_amount=100;},
    (_f,i)=>{i.lines.data[0].period.end+=86400;},
    (_f,i)=>{i.total++;},
    (_f,i)=>{i.lines.data[0].pricing.price_details.price='price_other';}
  ]) {
    const f=await billingFixture(), inv=f.invoice();
    change(f,inv);
    await assert.rejects(f.lifecycle.event(f.event('invoice.paid',inv)));
    assert.equal(f.calls.length,0);
  }
  const f=await billingFixture([{product:'viz',option:'perpetual_node_locked',quantity:1,maintenance:true}]);
  const early=f.invoice({id:'in_early',start:f.order.created+1});
  await assert.rejects(f.lifecycle.event(f.event('invoice.paid',early)),/maintenance_before_included_year/);
  assert.equal(f.calls.length,0);
});

test('invoice event arriving before checkout fulfillment is retried instead of discarded',async()=>{
  const f=await billingFixture(), inv=f.invoice();
  await f.store.query("UPDATE cart_groups SET subscription_id=NULL,status='pending' WHERE id=?",f.group.id).run();
  await assert.rejects(f.lifecycle.event(f.event('invoice.paid',inv)),/renewal_waiting_for_fulfillment/);
  assert.equal(f.calls.length,0);
});

test('renewal adapter validates customer, perpetual flags and seat limits without altering them',async()=>{
  const unit={selection:{cryptolensProductId:33431,access:'perpetual',licenseType:'floating'},license_key:'AAAAA-BBBBB-CCCCC-DDDDD'};
  const key={productId:33431,key:unit.license_key,customer:{id:237012},block:false,f1:false,maxNoOfMachines:1,
    expires:'2027-10-14T00:00:00',dataObjects:[{name:'PowerSurfacingPerpetual',intValue:1},{name:'PowerSurfacingFloating',intValue:1}]};
  const calls=[];
  const api=cryptolensLifecycle(new Map([[33431,'test-token']]),async(url,request)=>{
    calls.push({url,request});return new Response(JSON.stringify({result:0,licenseKey:key}));
  });
  assert.equal((await api.read(unit)).day,utcDay(Date.UTC(2027,9,14)/1000));
  await api.extend(unit,366);
  assert.equal(new URLSearchParams(calls[1].request.body).get('NoOfDays'),'366');
  assert.ok(calls.every(c=>c.request.redirect==='manual'));
  key.customer.id=0;await assert.rejects(api.read(unit),/identity_mismatch/);
  assert.ok(calls.every(c=>!c.url.includes('Block') && !c.url.includes('Feature')));
});

test('initial synchronization covers the entire paid UTC day and handles leap-year renewal periods',async()=>{
  const f=await billingFixture();
  for(const u of f.units)f.keyDays.set(u.id,utcDay(u.selection.firstRenewal));
  await f.lifecycle.event(f.event('customer.subscription.updated',f.sub));
  assert.equal(f.calls[0].days,1);
  const start=Date.UTC(2027,9,14,12)/1000, invoice=f.invoice({id:'in_leap',start});
  await f.lifecycle.event(f.event('invoice.paid',invoice,'evt_leap'));
  assert.equal((invoice.lines.data[0].period.end-start)/86400,366);
  assert.equal([...f.keyDays.values()][0],paidDay(invoice.lines.data[0].period.end));
});
test('a configured test-clock customer is checked server-side and retained per order',async()=>{
  const f=await fixture(), id='cus_simulation';
  f.stripe.customers.retrieve=async requested=>({id:requested,livemode:false,metadata:{npower_lifecycle_test:purchaseFlow}});
  const s=createService({...f.dependencies,customerId:id});
  const r=await s.start([{product:'viz',option:'annual_node_locked',quantity:1,maintenance:false}],'attempt_clock_12345678','owner');
  assert.equal((await f.store.groups(r.orderId))[0].plan.parameters.customer,id);
  f.stripe.customers.retrieve=async requested=>({id:requested,livemode:false,metadata:{}});
  await assert.rejects(s.start([{product:'viz',option:'annual_node_locked',quantity:1,maintenance:false}],'attempt_clock_87654321','owner'),/sandbox_customer_required/);
});
