import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContact } from '../worker/contact.mjs';
import { onRequest as contactProxy } from '../functions/api/contact.js';
import { onRequest as downloadsProxy } from '../functions/SolidWorks/[[path]].js';

const original = { kind:'sales', name:'Website Test', email:'tester@example.com', company:'Example', interest:'Product demo', message:'A product question.' };
const request = (data = original, headers = {}, method = 'POST') => new Request('https://www.npowersoftware.com/api/contact', {
  method, headers: { origin:'https://www.npowersoftware.com', 'content-type':'application/json', 'cf-connecting-ip':'192.0.2.1', ...headers },
  ...(method === 'POST' ? { body: typeof data === 'string' ? data : JSON.stringify(data) } : {}),
});
function setup(overrides = {}) {
  const messages = [];
  return { messages, env: { CONTACT_FROM:'website@npowersoftwarenew.com',
    CONTACT_LIMITER:{ limit:async () => ({ success:true }) },
    CONTACT_EMAIL:{ send:async message => { messages.push(message); return { messageId:'test-only' }; } },
    ...overrides } };
}
test('sales reaches the fixed mailbox and replies address the visitor', async () => {
  const { messages, env } = setup();
  const response = await handleContact(request(), env);
  assert.equal(response.status, 200);
  assert.equal(messages.length, 1);
  assert.equal(messages[0].to, 'sales@npowersoftware.com');
  assert.equal(messages[0].replyTo.email, original.email);
  assert.equal(messages[0].from.email, env.CONTACT_FROM);
  assert.match(messages[0].text, /Company: Example/);
});
test('support includes product and subject and escapes customer HTML', async () => {
  const { messages, env } = setup();
  const response = await handleContact(request({ ...original, kind:'support', subject:'Install issue', product:'Power Shell', message:'<script>example</script>' }), env);
  assert.equal(response.status, 200);
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
test('provider failures never become success and are not retried', async () => {
  let attempts = 0;
  const { env } = setup({ CONTACT_EMAIL:{ send:async () => { attempts++; throw new Error('provider failure'); } } });
  const response = await handleContact(request(), env);
  assert.equal(response.status, 502);
  assert.equal((await response.json()).ok, undefined);
  assert.equal(attempts, 1);
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
