import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { ContactInbox, deliverPending } from '../worker/contact-inbox.mjs';
import { handleContact } from '../worker/contact.mjs';
import { onRequest as contactProxy } from '../functions/api/contact.js';
import { onRequest as downloadsProxy } from '../functions/SolidWorks/[[path]].js';

const original = { kind:'sales', name:'Website Test', email:'tester@example.com', company:'Example', interest:'Product demo', message:'A product question.' };
const request = (data = original, headers = {}, method = 'POST') => new Request('https://www.npowersoftware.com/api/contact', {
  method, headers: { origin:'https://www.npowersoftware.com', 'content-type':'application/json', 'cf-connecting-ip':'192.0.2.1', ...headers },
  ...(method === 'POST' ? { body: typeof data === 'string' ? data : JSON.stringify(data) } : {}),
});
function database() {
  const sql = new DatabaseSync(':memory:');
  sql.exec(readFileSync(new URL('../contact-migrations/0001_inquiries.sql', import.meta.url), 'utf8'));
  return { prepare(query) {
    const stmt = sql.prepare(query);
    const bound = args => ({
      bind(...values) { return bound(values); },
      async first() { return stmt.all(...args)[0] ?? null; },
      async all() { return { results:stmt.all(...args) }; },
      async run() { return { meta:stmt.run(...args) }; },
    });
    return bound([]);
  } };
}
function setup(overrides = {}) {
  const messages = [];
  return { messages, env: { CONTACT_DB:database(), CONTACT_FROM:'website@npowersoftwarenew.com',
    CONTACT_LIMITER:{ limit:async () => ({ success:true }) },
    CONTACT_EMAIL:{ send:async message => { messages.push(message); return { messageId:'test-only' }; } },
    ...overrides } };
}
test('sales reaches the fixed mailbox and replies address the visitor', async () => {
  const { messages, env } = setup();
  const response = await handleContact(request(), env);
  assert.equal(response.status, 202);
  assert.equal(messages.length, 0);
  await deliverPending(env);
  assert.equal(messages.length, 1);
  assert.equal(messages[0].to, 'sales@npowersoftware.com');
  assert.equal(messages[0].replyTo.email, original.email);
  assert.equal(messages[0].from.email, env.CONTACT_FROM);
  assert.match(messages[0].text, /Company: Example/);
});
test('support includes product and subject and escapes customer HTML', async () => {
  const { messages, env } = setup();
  const response = await handleContact(request({ ...original, kind:'support', subject:'Install issue', product:'Power Shell', message:'<script>example</script>' }), env);
  assert.equal(response.status, 202);
  await deliverPending(env);
  assert.equal(messages[0].to, 'support@npowersoftware.com');
  assert.match(messages[0].html, /&lt;script&gt;/);
  assert.match(messages[0].subject, /Install issue/);
});
test('untrusted origins and wrong content types cannot send', async () => {
  const { messages, env } = setup();
  assert.equal((await handleContact(request(original, { origin:'https://evil.example' }), env)).status, 403);
  assert.equal((await handleContact(request(original, { 'content-type':'text/plain' }), env)).status, 415);
  assert.equal(messages.length, 0);
});
test('missing required fields and header injection are rejected', async () => {
  const { messages, env } = setup();
  for (const data of [{ ...original, name:'' }, { ...original, email:'test@example.com\r\nBcc:other@example.com' }, { ...original, kind:'support', subject:'' }, { ...original, message:'' }]) {
    assert.equal((await handleContact(request(data), env)).status, 400);
  }
  assert.equal(messages.length, 0);
});
test('caller cannot select arbitrary recipient or prototype kind', async () => {
  const { messages, env } = setup();
  assert.equal((await handleContact(request({ ...original, kind:'__proto__' }), env)).status, 400);
  await handleContact(request({ ...original, to:'other@example.com' }), env);
  await deliverPending(env);
  assert.equal(messages[0].to, 'sales@npowersoftware.com');
});
test('oversize unannounced bodies stop before email', async () => {
  const { messages, env } = setup();
  assert.equal((await handleContact(request(JSON.stringify({ ...original, message:'x'.repeat(20000) })), env)).status, 413);
  assert.equal(messages.length, 0);
});
test('invalid JSON and arrays fail cleanly', async () => {
  const { env } = setup();
  assert.equal((await handleContact(request('{broken'), env)).status, 400);
  assert.equal((await handleContact(request([]), env)).status, 400);
});
test('honeypot requests are discarded', async () => {
  const { messages, env } = setup();
  assert.equal((await handleContact(request({ ...original, website:'https://spam.example' }), env)).status, 200);
  assert.equal(messages.length, 0);
});
test('rate limits stop delivery and return a retry interval', async () => {
  const { messages, env } = setup({ CONTACT_LIMITER:{ limit:async () => ({ success:false }) } });
  const response = await handleContact(request(), env);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '60');
  assert.equal(messages.length, 0);
});
test('provider failure retains the received inquiry without retrying an uncertain send', async () => {
  let attempts = 0;
  const { env } = setup({ CONTACT_EMAIL:{ send:async () => { attempts++; throw new Error('provider failure'); } } });
  const response = await handleContact(request(), env);
  assert.equal(response.status, 202);
  await deliverPending(env);
  await deliverPending(env);
  assert.equal(attempts, 1);
  const record = await env.CONTACT_DB.prepare('SELECT state, payload FROM contact_inquiries').first();
  assert.equal(record.state, 'review');
  assert.match(record.payload, /A product question/);
});
test('missing bindings fail closed and GET cannot send', async () => {
  const { env } = setup();
  assert.equal((await handleContact(request(), {})).status, 503);
  assert.equal((await handleContact(request(null, {}, 'GET'), env)).status, 405);
  assert.equal((await contactProxy({ request:request(), env:{} })).status, 503);
});
test('Pages forwards the original download URL, method, and range', async () => {
  const download = new Request('https://www.npowersoftware.com/SolidWorks/PowerSurfacing_11_0_SW2026.exe?download=1', { headers:{ Range:'bytes=0-15' } });
  const expected = new Response('MZ', { status:206, headers:{ 'Content-Range':'bytes 0-1/100' } });
  const response = await downloadsProxy({ request:download, env:{ DOWNLOADS_SERVICE:{ fetch:async received => {
    assert.equal(received.url, download.url);
    assert.equal(received.headers.get('range'), 'bytes=0-15');
    return expected;
  } } } });
  assert.equal(response, expected);
});
test('unknown help paths retain normal Pages handling', async () => {
  let fellThrough = false;
  await downloadsProxy({ request:new Request('https://www.npowersoftware.com/SolidWorks/help/index.html'), env:{}, next:() => { fellThrough=true; return new Response('page'); } });
  assert.equal(fellThrough, true);
});

test('delivery diagnostics identify timeout without logging visitor or provider content', async () => {
  const events = [];
  const previous = console.error;
  console.error = entry => events.push(JSON.parse(entry));
  try {
    const { env } = setup({ CONTACT_EMAIL:{ send:async () => {
      const error = new Error('Timed out for secret@example.com: confidential message');
      error.code = 'E_DELIVERY_FAILED';
      throw error;
    } } });
    assert.equal((await handleContact(request(), env)).status, 202);
    await deliverPending(env);
    assert.equal(events[0].event, 'contact_delivery_review');
    assert.equal(events[0].code, 'E_DELIVERY_FAILED');
    assert.equal(events[0].reason, 'timeout');
    assert.equal(typeof events[0].elapsedMs, 'number');
    assert.doesNotMatch(JSON.stringify(events), /secret|confidential|tester@example/);
  } finally { console.error = previous; }
});

const stableId = '7dd4eef0-78e5-4c38-b137-7ef2a4170087';
test('a failed durable save cannot produce a receipt or send an email', async () => {
  const { env, messages } = setup({ CONTACT_DB:{ prepare() { throw new Error('unavailable'); } } });
  const response = await handleContact(request(), env);
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, undefined);
  assert.equal(messages.length, 0);
});
test('retrying the same submission saves and sends only once, including concurrent senders', async () => {
  const { env, messages } = setup();
  const data = { ...original, submissionId:stableId };
  const responses = await Promise.all([handleContact(request(data), env), handleContact(request(data), env)]);
  for (const response of responses) assert.equal(response.status, 202);
  assert.equal((await env.CONTACT_DB.prepare('SELECT COUNT(*) AS count FROM contact_inquiries').first()).count, 1);
  await Promise.all([deliverPending(env), deliverPending(env)]);
  assert.equal(messages.length, 1);
  assert.equal((await handleContact(request(data), env)).status, 202);
  await deliverPending(env);
  assert.equal(messages.length, 1);
});
test('reusing a submission ID with different content is rejected', async () => {
  const { env } = setup();
  await handleContact(request({ ...original, submissionId:stableId }), env);
  assert.equal((await handleContact(request({ ...original, submissionId:stableId, message:'Changed' }), env)).status, 409);
});
test('invalid submission IDs are rejected before storage', async () => {
  const { env } = setup();
  assert.equal((await handleContact(request({ ...original, submissionId:'broken' }), env)).status, 400);
  assert.equal((await env.CONTACT_DB.prepare('SELECT COUNT(*) AS count FROM contact_inquiries').first()).count, 0);
});
test('receipt returns before a stalled email and saved content survives uncertain delivery', async () => {
  let release;
  const { env } = setup({ CONTACT_EMAIL:{ send:() => new Promise(resolve => { release=resolve; }) } });
  const response = await handleContact(request(), env);
  assert.equal(response.status, 202);
  assert.equal(release, undefined);
  const sending = deliverPending(env);
  while (!release) await new Promise(resolve => setImmediate(resolve));
  const during = await env.CONTACT_DB.prepare('SELECT state, payload FROM contact_inquiries').first();
  assert.equal(during.state, 'sending');
  assert.match(during.payload, /A product question/);
  release({ messageId:'accepted' });
  await sending;
  const after = await env.CONTACT_DB.prepare('SELECT state, payload FROM contact_inquiries').first();
  assert.equal(after.state, 'sent');
  assert.equal(after.payload, null);
});
test('interrupted sends go to review, and retention removes content after thirty days', async () => {
  const { env, messages } = setup();
  const now = Math.floor(Date.now()/1000);
  const inbox = new ContactInbox(env.CONTACT_DB);
  await inbox.save(stableId, { text:'retained' }, now-400);
  await inbox.claim(stableId, now-400);
  await deliverPending(env, now);
  assert.equal((await env.CONTACT_DB.prepare('SELECT state FROM contact_inquiries').first()).state, 'review');
  assert.equal(messages.length, 0);
  await inbox.maintain(now+30*24*60*60);
  assert.equal(await env.CONTACT_DB.prepare('SELECT id FROM contact_inquiries').first(), null);
});
