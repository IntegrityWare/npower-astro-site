
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
  for (const name of ['0001_store.sql','0002_lifecycle.sql','0004_store_live.sql','0005_live_purchase_tests.sql']) sql.exec(fs.readFileSync(new URL('../migrations/' + name, import.meta.url), 'utf8'));
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
  const live=overrides.mode?.live===true, products=overrides.mode?.catalog ?? catalog;
  const db=database(), store=new CartStore(db), sessions=new Map(), subscriptions=new Map(), customers=new Map();
  const counter={ customers:0, created:0, issued:0, mailed:0, paginated:0 };
  const prices=new Map();
  for(const p of products.products) {
    for(const o of p.options) prices.set(o.stripePriceId, {
      id:o.stripePriceId, product:p.stripeProductId, active:true, livemode:live,
      currency:'usd', unit_amount:o.unitAmount, type:o.access==='annual'?'recurring':'one_time',
      recurring:o.access==='annual'?{interval:'year',interval_count:1}:null
    });
    prices.set(p.maintenance.stripePriceId, { id:p.maintenance.stripePriceId,product:p.maintenance.stripeProductId,
      active:true,livemode:live,currency:'usd',unit_amount:p.maintenance.unitAmount,
      type:'recurring',recurring:{interval:'year',interval_count:1} });
  }
  const stripe={
    accounts:{ retrieve:async()=>({ id:overrides.mode?.accountId ?? ACCOUNT,charges_enabled:true }) },
    customers:{ retrieve:async id=>customers.get(id) ?? ({id:CUSTOMER,livemode:false}),
      create:async (p,opts)=>{const prior=[...customers.values()].find(c=>c.idempotency===opts.idempotencyKey);if(prior)return prior;const c={...p,id:'cus_buyer'+(++counter.customers),livemode:true,idempotency:opts.idempotencyKey};customers.set(c.id,c);return c;} },
    webhookEndpoints:{ list:async()=>({ has_more:false,data:[] }) },
    prices:{ retrieve:async id=>prices.get(id) },
    checkout:{ sessions:{
      create:async p=>{
        const id=(live?'cs_live_':'cs_test_')+(++counter.created);
        const s={ ...p,id,livemode:live,url:'https://checkout.stripe.com/c/pay/'+id,status:'open',payment_status:'unpaid' };
        sessions.set(id,s);return s;
      },
      retrieve:async id=>structuredClone(sessions.get(id)),
      listLineItems:async id=>{counter.paginated++;return {...sessions.get(id).line_items,has_more:false};}
    }},
    subscriptions:{ retrieve:async id=>subscriptions.get(id) }
  };
  const dependencies={stripe,store,tokens:new Map(products.products.flatMap(p=>p.options.map(o=>[live?p.cryptolensProductId:o.cryptolensTemplateId,'test-only-token']))),
    baseUrl:live?'https://www.npowersoftware.com':'https://www.npowersoftwarenew.com',clock:()=>1792000000,
    createLicense:async()=>{counter.issued++;return 'AAAAA-BBBBB-CCCCC-'+String(counter.issued).padStart(5,'D');},
    sendEmail:async m=>{counter.mailed++;assert.equal(m.recipient,live?'buyer@example.com':'gcrocker61@gmail.com');return {messageId:'test-message'};},...overrides};
  const service=createService(dependencies);
  const result=await service.start(input,'attempt_abcdefghijklmnop','owner');
  async function payment(groupIndex=0) {
    const order=await store.order(result.orderId), group=(await store.groups(order.id))[groupIndex];
    const session=sessions.get(group.session_id);
    const expected=[...expectedPrices(group.plan,order).values()];
    Object.assign(session,{customer_details:live?{email:'buyer@example.com',name:'Buyer'}:undefined, status:'complete',payment_status:'paid',currency:'usd',
      amount_total:group.plan.group.dueToday,amount_subtotal:group.plan.group.dueToday,
      total_details:{amount_tax:0,amount_shipping:0,amount_discount:0},
      line_items:{has_more:false,data:expected.map(w=>({price:prices.get(w.id),quantity:w.quantity,amount_total:w.due,amount_subtotal:w.due}))}});
    if(session.mode==='subscription') {
      session.subscription='sub_'+groupIndex;
      subscriptions.set(session.subscription,{livemode:live,customer:session.customer,
        status:group.plan.parameters.subscription_data?.trial_end?'trialing':'active',
        metadata:group.plan.parameters.subscription_data.metadata,
        trial_end:group.plan.parameters.subscription_data?.trial_end??null,cancel_at_period_end:false,
        items:{has_more:false,data:expected.filter(p=>p.recurring).map(p=>({price:prices.get(p.id),quantity:p.quantity}))}});
    }
    return {id:'evt_'+groupIndex,type:'checkout.session.completed',livemode:live,data:{object:{id:session.id,metadata:session.metadata}}};
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

async function billingFixture(input = [{product:'viz',option:'annual_node_locked',quantity:1,maintenance:false}], overrides = {}) {
  const live=overrides.mode?.live===true;
  const f = await fixture(input,overrides), checkout = await f.payment();
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
  const dependencies={stripe:f.stripe,store:f.store,licenses,expectedPrices,mode:overrides.mode,customer:CUSTOMER,clock:()=>now};
  const lifecycle=createLifecycle(dependencies);
  const event=(type,object,id='evt_billing')=>({id,type,livemode:live,data:{object:structuredClone(object)}});
  function invoice({id='in_renewal',initial=false,start=order.quote.items[0].firstRenewal,status='paid'}={}) {
    const end=initial && sub.trial_end ? sub.trial_end : anniversary(start);
    const lines=[...prices.values()].filter(p=>initial || p.recurring).map(p=>{
      const amount=initial?p.due:p.amount*p.quantity;
      return {id:'il_'+p.id,livemode:live,currency:'usd',quantity:p.quantity,amount,subtotal:amount,
        pricing:{price_details:{price:p.id,product:p.product}},period:{start,end},
        parent:{[p.recurring?'subscription_item_details':'invoice_item_details']:{subscription:sub.id,proration:false}}};
    });
    const total=lines.reduce((sum,l)=>sum+l.amount,0);
    const inv={id,livemode:live,customer:group.plan.parameters.customer,parent:{subscription_details:{subscription:sub.id}},
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

import { liveCatalog, liveReadiness, storeEnvironment } from '../store/environment.mjs';
import { livePurchaseFlow } from '../store/purchase-options.mjs';
import { liveLicenseCreator } from '../store/live-license.mjs';
import { createStoreMailer } from '../store/email.mjs';
const livePrices=JSON.stringify(Object.fromEntries(catalog.products.map(p=>[p.key,{
  product:'prod_live'+p.key,prices:Object.fromEntries(p.options.map(o=>[o.key,'price_live'+p.key+o.key.replaceAll('_','')])),
  maintenance:{product:'prod_livemaint'+p.key,price:'price_livemaint'+p.key}
}])));
const mode={live:true,flow:livePurchaseFlow,accountId:'acct_liveAccount',catalog:liveCatalog(livePrices,catalog.products.map(p=>p.key).join(','))};
const liveInput=[{product:'viz',option:'perpetual_floating',quantity:2,maintenance:true}];

test('live payment uses its own catalog, customer, keys and email and remains idempotent',async()=>{
  const f=await fixture(liveInput,{mode});
  const order=await f.store.order(f.result.orderId),group=(await f.store.groups(order.id))[0];
  assert.equal(order.quote.environment,'live');
  assert.equal(group.plan.parameters.customer,'cus_buyer1');
  assert.equal(group.plan.parameters.subscription_data.trial_end,anniversary(order.created));
  assert.equal(group.plan.group.dueToday,399000);
  assert.equal(group.plan.group.annualRenewal,59000);
  assert.match(group.plan.idempotencyKey,/npower_hosted_live_v1/);
  await f.service.start(liveInput,'attempt_abcdefghijklmnop','owner');
  assert.equal(f.counter.customers,1);assert.equal(f.counter.created,1);
  const event=await f.payment();
  await f.service.handleEvent(event);await f.service.handleEvent(event);
  assert.equal(f.counter.issued,2);assert.equal(f.counter.mailed,1);
  const saved=await f.store.order(order.id),mail=await f.store.mail(order.id);
  assert.equal(saved.buyer_email,'buyer@example.com');
  assert.equal(mail.recipient,'buyer@example.com');
  assert.doesNotMatch(mail.subject+mail.text,/sandbox|no real money/i);
  assert.match(mail.text,/295.00 per license/);assert.match(mail.text,/first maintenance charge/i);
  assert.equal((await f.service.receipt(order.id,'owner')).sandbox,false);
});
test('live checkout rejects sandbox account data, altered totals, wrong buyers and events before issuing',async()=>{
  for(const change of [
    (f,e)=>{e.livemode=false;},(f,e)=>{e.account='acct_wrong';},
    (f,e)=>{f.sessions.get(e.data.object.id).livemode=false;},
    (f,e)=>{f.sessions.get(e.data.object.id).customer='cus_wrong';},
    (f,e)=>{f.sessions.get(e.data.object.id).amount_total--;},
    (f,e)=>{f.sessions.get(e.data.object.id).line_items.data[0].price.livemode=false;},
    (f,e)=>{f.sessions.get(e.data.object.id).customer_details.email='bad@one.test,other@two.test';}
  ]) {
    const f=await fixture(liveInput,{mode}),e=await f.payment();change(f,e);
    await assert.rejects(f.service.handleEvent(e));assert.equal(f.counter.issued,0);assert.equal(f.counter.mailed,0);
  }
  const f=await fixture(liveInput,{mode});
  f.stripe.accounts.retrieve=async()=>({id:ACCOUNT,charges_enabled:true});
  await assert.rejects(f.service.start(liveInput,'another_attempt_12345','owner'),/wrong_stripe_account/);
  f.stripe.accounts.retrieve=async()=>({id:mode.accountId,charges_enabled:false});
  await assert.rejects(f.service.start(liveInput,'another_attempt_12345','owner'),/wrong_stripe_account/);
  await assert.rejects(f.service.start([{...liveInput[0],quantity:4}],'another_attempt_12345','owner'),/license_limit/);
});
test('live mixed payments share a customer and cannot change the license recipient between groups',async()=>{
  const input=[{product:'viz',option:'annual_node_locked',quantity:1,maintenance:false},{...liveInput[0],quantity:1}];
  const f=await fixture(input,{mode});await f.service.handleEvent(await f.payment(0));
  assert.equal(f.counter.mailed,0);
  await f.service.continue(f.result.orderId,'owner');const second=await f.payment(1);
  const groups=await f.store.groups(f.result.orderId);
  assert.equal(groups[0].plan.parameters.customer,groups[1].plan.parameters.customer);
  f.sessions.get(second.data.object.id).customer_details.email='other@example.com';
  await assert.rejects(f.service.handleEvent(second),/buyer_identity_mismatch/);
  assert.equal(f.counter.issued,1);assert.equal(f.counter.mailed,0);
  f.sessions.get(second.data.object.id).customer_details.email='buyer@example.com';
  await f.service.handleEvent(second);assert.equal(f.counter.issued,2);assert.equal(f.counter.mailed,1);
});
test('live annual and maintenance renewals retain paid access after cancellation and reject sandbox invoices',async()=>{
  for(const input of [[{product:'viz',option:'annual_floating',quantity:1,maintenance:false}],liveInput]) {
    const f=await billingFixture(input,{mode});const inv=f.invoice();
    await f.lifecycle.event(f.event('invoice.paid',inv));const count=f.calls.length;
    assert.equal(count,input[0].quantity);
    f.sub.status='canceled';f.sub.cancel_at_period_end=false;
    await f.lifecycle.event(f.event('customer.subscription.deleted',f.sub));
    await f.lifecycle.event(f.event('invoice.paid',inv));assert.equal(f.calls.length,count);
    const wrong=f.invoice({id:'in_wrong'});wrong.livemode=false;
    await assert.rejects(f.lifecycle.reconcile(f.group.id,wrong.id),/renewal_invoice_identity_mismatch/);
    assert.equal(f.calls.length,count);
  }
});
test('live API stays closed without independent credentials and storage, even when sandbox is configured',async()=>{
  const base='https://npower-astro-site.gcrocker61.workers.dev/api/live-store/';
  const env={DB:database(),STORE_ENABLED:'true',STRIPE_SECRET_KEY:'sk_test_fake',STRIPE_WEBHOOK_SECRET:'whsec_fake'};
  let r=await handle(new Request(base+'status'),env);assert.equal(r.status,200);
  assert.equal((await r.json()).ready,false);
  r=await handle(new Request(base+'session',{method:'POST',headers:{origin:'https://www.npowersoftware.com','content-type':'application/json'},body:'{}'}),env);
  assert.equal(r.status,503);
  const configured={...env,STORE_LIVE_DB:database(),LIVE_STORE_ENABLED:'true',LIVE_LIFECYCLE_ENABLED:'true',STRIPE_LIVE_ACCOUNT_ID:mode.accountId,
    STRIPE_LIVE_SECRET_KEY:'sk_live_fake',STRIPE_LIVE_WEBHOOK_SECRET:'whsec_livefake',STRIPE_LIVE_PRICE_IDS:livePrices,
    CRYPTOLENS_LIVE_ISSUING_TOKENS:JSON.stringify({'33431':'x'.repeat(25)}),CRYPTOLENS_LIVE_RENEWAL_TOKENS:JSON.stringify({'33431':'y'.repeat(25)}),
    TRIAL_SMTP_PASSWORD:'fake',TRIAL_SMTP_HOST:'mail.example.com',TRIAL_SMTP_PORT:'465',TRIAL_SMTP_USER:'user@example.com',STORE_LIVE_EMAIL_FROM:'support@example.com'};
  assert.deepEqual(liveReadiness(configured,storeEnvironment(configured,true)),[]);
  assert.ok(liveReadiness({...configured,STORE_LIVE_DB:env.DB},storeEnvironment({...configured,STORE_LIVE_DB:env.DB},true)).includes('STORE_LIVE_DB'));
  r=await handle(new Request(base+'session',{method:'POST',headers:{origin:'https://www.npowersoftware.com','content-type':'application/json'},body:'{}'}),configured);
  assert.equal(r.status,200);assert.match(r.headers.get('set-cookie'),/^__Host-npower_store=/);
  const cookie=r.headers.get('set-cookie').split(';')[0];
  r=await handle(new Request(base+'status',{headers:{cookie}}),configured);assert.equal((await r.json()).unlocked,true);
  r=await handle(new Request(base+'status',{headers:{cookie:cookie.replace('__Host-npower_store','__Host-npower_sandbox')}}),configured);
  assert.equal((await r.json()).unlocked,false);
  r=await handle(new Request(base+'session',{method:'POST',headers:{origin:'https://foreign.example','content-type':'application/json'},body:'{}'}),configured);
  assert.equal(r.status,503);
  r=await handle(new Request(base+'webhook',{method:'POST',body:'{}'}),configured);assert.equal(r.status,400);
});
test('live Cryptolens creation saves identity before flags, verifies ownership and never retries partial creation',async()=>{
  const f=await fixture(liveInput,{mode}),e=await f.payment(),calls=[],keys=new Map();
  const fake=async(url,options)=>{
    const p=Object.fromEntries(options.body);calls.push({url,p});
    assert.equal(options.redirect,'manual');
    if(url.endsWith('/CreateKey')) {
      assert.equal(p.Email,'buyer@example.com');assert.equal(p.AddOrUseExistingCustomer,'true');assert.equal(p.MaxNoOfMachines,'1');
      const key='AAAAA-BBBBB-CCCCC-'+(keys.size?'EEEEE':'DDDDD');
      keys.set(key,{productId:33431,key,customer:{id:238000,email:p.Email},block:false,trialActivation:false,f1:false,f2:false,
        maxNoOfMachines:1,dataObjects:[],expires:new Date((utcDay(1792000000)+Number(p.Period))*86400000).toISOString()});
      return Response.json({result:0,key,customerId:238000});
    }
    if(url.endsWith('/AddDataObjectToKey')) {
      assert.equal((await f.store.rows('SELECT customer_id FROM cart_units WHERE license_key=?',p.Key))[0].customer_id,238000);
      keys.get(p.Key).dataObjects.push({name:p.Name,intValue:1});return Response.json({result:0});
    }
    return Response.json({result:0,licenseKey:keys.get(p.Key)});
  };
  const issuer=liveLicenseCreator(new Map([[33431,'fake']]),f.store,fake,()=>1792000000);
  await createService({...f.dependencies,createLicense:issuer}).handleEvent(e);
  assert.equal(keys.size,2);assert.equal((await f.store.units((await f.store.groups(f.result.orderId))[0].id))[0].customer_id,238000);
  const g=await fixture(liveInput,{mode}),event=await g.payment();let creates=0;
  const broken=liveLicenseCreator(new Map([[33431,'fake']]),g.store,async url=>{
    if(url.endsWith('/CreateKey')){creates++;return Response.json({result:0,key:'AAAAA-BBBBB-CCCCC-DDDDD',customerId:238000});}
    throw Error('uncertain response');
  },()=>1792000000);
  const svc=createService({...g.dependencies,createLicense:broken});
  await assert.rejects(svc.handleEvent(event),/fulfillment_requires_review/);await assert.rejects(svc.handleEvent(event));
  assert.equal(creates,1);const u=(await g.store.units((await g.store.groups(g.result.orderId))[0].id))[0];
  assert.equal(u.license_key,'AAAAA-BBBBB-CCCCC-DDDDD');assert.equal(u.status,'review');
});
test('live SMTP sends exactly one verified recipient and returns acceptance without leaking provider errors',async()=>{
  let sent,closed=0;
  const env={TRIAL_SMTP_HOST:'mail.example.com',TRIAL_SMTP_PORT:'465',TRIAL_SMTP_USER:'user@example.com',
    TRIAL_SMTP_PASSWORD:'secret',STORE_LIVE_EMAIL_FROM:'support@example.com',LIVE_STORE_ORIGIN:'https://www.npowersoftware.com'};
  const mailer=createStoreMailer(env,options=>{assert.equal(options.disableUrlAccess,true);assert.equal(options.tls.rejectUnauthorized,true);
    return {sendMail:async m=>{sent=m;return {accepted:[m.to],rejected:[],messageId:'message1'};},close:()=>closed++};});
  assert.deepEqual(await mailer({recipient:'buyer@example.com',subject:'Your licenses',text:'body',html:'<p>body</p>'}),{messageId:'message1'});
  assert.deepEqual(sent.envelope.to,['buyer@example.com']);assert.equal(closed,1);
  await assert.rejects(mailer({recipient:'buyer@example.com,other@example.com'}));
});

import { onRequest as proxyStore } from '../functions/api/store/[[path]].js';
test('production proxy selects live backend and overwrites any caller-supplied store origin',async()=>{
  const original=globalThis.fetch,seen=[];
  try {
    globalThis.fetch=async(target,options)=>{seen.push({target:String(target),options});return Response.json({ok:true});};
    for(const host of ['www.npowersoftware.com','npowersoftware.com']) {
      await proxyStore({request:new Request('https://'+host+'/api/store/status',{headers:{'x-store-origin':'https://evil.example'}})});
      const call=seen.at(-1);assert.equal(call.target,'https://npower-astro-site.gcrocker61.workers.dev/api/live-store/status');
      assert.equal(call.options.headers.get('x-store-origin'),'https://'+host);
    }
    await proxyStore({request:new Request('https://www.npowersoftwarenew.com/api/store/status')});
    assert.equal(seen.at(-1).target,'https://npower-astro-site.gcrocker61.workers.dev/api/store/status');
    assert.equal((await proxyStore({request:new Request('https://untrusted.pages.dev/api/store/status')})).status,403);
    assert.equal(seen.length,3);
  } finally {globalThis.fetch=original;}
});

import { authorizePrivateTest, privateTestCart, privateTestMode } from '../store/private-test.mjs';
import { sha256 } from '../store/errors.mjs';

test('private $5 purchase preserves public pricing and uses normal payment verification and delivery',async()=>{
  const testMode=privateTestMode(mode,'price_privateViz');
  assert.equal(mode.catalog.products.find(p=>p.key==='viz').options.find(o=>o.key==='perpetual_node_locked').unitAmount,149500);
  const f=await fixture(privateTestCart,{mode:testMode,purchaseTest:{id:'test_invitation',buyerEmail:'buyer@example.com'}});
  const saved=await f.store.order(f.result.orderId),group=(await f.store.groups(saved.id))[0];
  assert.equal(saved.quote.dueToday,500);assert.equal(saved.quote.annualRenewal,0);
  assert.equal(group.plan.parameters.mode,'payment');
  assert.equal(group.plan.parameters.subscription_data,undefined);
  assert.equal((await f.stripe.customers.retrieve(group.plan.parameters.customer)).email,'buyer@example.com');
  assert.equal(saved.quote.items[0].computersPerLicense,2);
  assert.equal(saved.quote.items[0].includedMaintenanceEnd,anniversary(saved.created));
  const normalService=createService({...f.dependencies,mode,purchaseTest:undefined});
  const event=await f.payment();
  f.sessions.get(event.data.object.id).customer_details.email='wrong@example.com';
  await assert.rejects(normalService.handleEvent(event),/buyer_identity_mismatch/);
  assert.equal(f.counter.issued,0);
  f.sessions.get(event.data.object.id).customer_details.email='buyer@example.com';
  f.sessions.get(event.data.object.id).amount_total=499;
  await assert.rejects(normalService.handleEvent(event),/amount_mismatch/);
  f.sessions.get(event.data.object.id).amount_total=500;
  await normalService.handleEvent(event);await normalService.handleEvent(event);
  assert.equal(f.counter.issued,1);assert.equal(f.counter.mailed,1);
  const retry=await f.service.start(privateTestCart,'attempt_abcdefghijklmnop','owner');
  assert.equal(retry.orderId,saved.id);assert.match(retry.url,/checkout\/receipt/);
  assert.equal(f.counter.created,1);
  await assert.rejects(f.service.start([{...privateTestCart[0],quantity:2}],'another_attempt_12345','owner'),/private_test_invalid/);
  assert.throws(()=>privateTestMode({...mode,live:false},'price_privateViz'));
});

test('private invitation rejects wrong, expired and malformed codes and never stores the clear code',async()=>{
  const store=new CartStore(database()),code='a'.repeat(64),hash=await sha256(code),time=1792000000;
  await store.query('INSERT INTO live_purchase_tests VALUES(?,?,?,?)','invitation1',hash,'buyer@example.com',time+60).run();
  const grant=await authorizePrivateTest(store,code,time);
  assert.equal(grant.ownerHash,hash);assert.equal(grant.attempt,'live-test-invitation1');
  assert.equal(grant.purchaseTest.buyerEmail,'buyer@example.com');
  assert.doesNotMatch(JSON.stringify(await store.rows('SELECT * FROM live_purchase_tests')),new RegExp(code));
  for(const bad of ['','a','b'.repeat(64)]) await assert.rejects(authorizePrivateTest(store,bad,time),/private_test_invalid/);
  await assert.rejects(authorizePrivateTest(store,code,time+60),/private_test_invalid/);
});

test('private API fixes amount, recipient, quantity and retry identity while public checkout stays closed',async()=>{
  const db=database(),store=new CartStore(db),code='c'.repeat(64),hash=await sha256(code);
  await store.query('INSERT INTO live_purchase_tests VALUES(?,?,?,?)','http_invitation',hash,'buyer@example.com',Math.floor(Date.now()/1000)+3600).run();
  const env={DB:database(),STORE_LIVE_DB:db,LIVE_STORE_ENABLED:'false',LIVE_LIFECYCLE_ENABLED:'false',
    LIVE_PURCHASE_TEST_ENABLED:'true',STRIPE_LIVE_TEST_PRICE_ID:'price_privateViz',STRIPE_LIVE_ACCOUNT_ID:mode.accountId,
    STRIPE_LIVE_SECRET_KEY:'rk_live_fake',STRIPE_LIVE_WEBHOOK_SECRET:'whsec_fake',STRIPE_LIVE_PRICE_IDS:livePrices,
    CRYPTOLENS_LIVE_ISSUING_TOKENS:JSON.stringify({'33431':'x'.repeat(25)}),CRYPTOLENS_LIVE_RENEWAL_TOKENS:JSON.stringify({'33431':'y'.repeat(25)}),
    TRIAL_SMTP_PASSWORD:'fake',TRIAL_SMTP_HOST:'mail.example.com',TRIAL_SMTP_PORT:'465',
    TRIAL_SMTP_USER:'user@example.com',STORE_LIVE_EMAIL_FROM:'support@example.com'};
  const base='https://npower-astro-site.gcrocker61.workers.dev/api/live-store/';
  const request=(path,body,origin='https://www.npowersoftware.com')=>new Request(base+path,{method:'POST',
    headers:{origin,'content-type':'application/json'},body:JSON.stringify(body)});
  const original=globalThis.fetch,checkout=[],customers=[];
  try {
    globalThis.fetch=async(url,options)=>{
      const path=new URL(url).pathname;
      if(path==='/v1/account') return Response.json({id:mode.accountId,charges_enabled:true});
      if(path==='/v1/webhook_endpoints') return Response.json({data:[],has_more:false});
      if(path==='/v1/customers') {customers.push(new URLSearchParams(options.body));return Response.json({id:'cus_privateBuyer',livemode:true});}
      if(path==='/v1/customers/cus_privateBuyer') return Response.json({id:'cus_privateBuyer',livemode:true,metadata:{npower_store_flow:mode.flow}});
      if(path==='/v1/prices/price_privateViz') return Response.json({id:'price_privateViz',product:'prod_liveviz',
        active:true,livemode:true,currency:'usd',unit_amount:500,type:'one_time'});
      if(path==='/v1/checkout/sessions') {checkout.push(new URLSearchParams(options.body));return Response.json({
        id:'cs_live_private1',livemode:true,url:'https://checkout.stripe.com/c/pay/cs_live_private1'});}
      throw Error('Unexpected Stripe request: '+path);
    };
    assert.equal((await handle(request('private-test',{code:'d'.repeat(64)}),env)).status,403);
    assert.equal((await handle(request('private-test',{code}),{...env,LIVE_PURCHASE_TEST_ENABLED:'false'})).status,503);
    assert.equal((await handle(request('private-test',{code},'https://foreign.example'),env)).status,503);
    const malicious={code,cart:[{product:'re',quantity:99,maintenance:true}],amount:1,email:'other@example.com',attempt:'arbitrary'};
    const first=await handle(request('private-test',malicious),env);
    assert.equal(first.status,200,await first.clone().text());
    const result=await first.json();
    assert.match(first.headers.get('set-cookie'),/^__Host-npower_store=/);
    assert.equal(await store.sessionValid(hash,Math.floor(Date.now()/1000)),true);
    assert.deepEqual(await (await handle(request('private-test',malicious),env)).json(),result);
    assert.equal(customers.length,1);assert.equal(customers[0].get('email'),'buyer@example.com');
    assert.equal(checkout.length,1);assert.equal(checkout[0].get('mode'),'payment');
    assert.equal(checkout[0].get('line_items[0][price]'),'price_privateViz');
    assert.equal(checkout[0].get('line_items[0][quantity]'),'1');
    assert.equal(checkout[0].has('line_items[1][price]'),false);
    assert.equal((await store.order(result.orderId)).quote.dueToday,500);
    const publicQuote=await (await handle(request('quote',[{...privateTestCart[0],unitAmount:500,stripePriceId:'price_privateViz'}]),env)).json();
    assert.equal(publicQuote.dueToday,149500);assert.equal(publicQuote.checkoutReady,false);
    assert.equal((await handle(request('session',{}),env)).status,503);
  } finally {globalThis.fetch=original;}
});
