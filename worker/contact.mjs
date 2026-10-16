const ORIGINS = new Set(['https://www.npowersoftware.com', 'https://npowersoftware.com', 'https://www.npowersoftwarenew.com']);
const RECIPIENTS = { sales: 'sales@npowersoftware.com', support: 'support@npowersoftware.com' };
const MAX_BYTES = 16384;
const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', ...extra },
});
class InputError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
async function readBody(request) {
  if (Number(request.headers.get('content-length')) > MAX_BYTES) throw new InputError('Your message is too long.', 413);
  if (!request.body) throw new InputError('Please complete the form.');
  const reader = request.body.getReader();
  const chunks = []; let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); throw new InputError('Your message is too long.', 413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new InputError('Please complete the form and try again.'); }
}
function field(input, key, max, required = false, multiline = false) {
  const value = input[key] ?? '';
  if (typeof value !== 'string') throw new InputError('Please check the ' + key + ' field.');
  const clean = value.trim();
  if ((required && !clean) || clean.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(clean) ||
      (!multiline && /[\r\n]/.test(clean))) throw new InputError('Please check the ' + key + ' field.');
  return clean;
}
const escape = value => value.replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
export async function handleContact(request, env) {
  if (request.method !== 'POST') return json({ error: 'Use the contact form to send a message.' }, 405, { Allow: 'POST' });
  const origin = request.headers.get('origin');
  if (!ORIGINS.has(origin) || !ORIGINS.has(new URL(request.url).origin)) return json({ error: 'Please open the contact form on our website.' }, 403);
  if (!/^application\/json(?:;|$)/i.test(request.headers.get('content-type') || '')) return json({ error: 'Invalid request format.' }, 415);
  try {
    const input = await readBody(request);
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new InputError('Please complete the form.');
    if (typeof input.kind !== 'string' || !Object.hasOwn(RECIPIENTS, input.kind)) throw new InputError('Please select a valid contact form.');
    if (field(input, 'website', 300)) return json({ ok: true });
    const name = field(input, 'name', 120, true);
    const email = field(input, 'email', 254, true);
    if (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email)) throw new InputError('Please enter a valid email address.');
    const message = field(input, 'message', 5000, true, true);
    const company = field(input, 'company', 160);
    const interest = field(input, 'interest', 160);
    const product = field(input, 'product', 160);
    const subject = field(input, 'subject', 160, input.kind === 'support');
    if (!env.CONTACT_EMAIL || !env.CONTACT_LIMITER || !env.CONTACT_FROM) return json({ error: 'The contact form is temporarily unavailable. Please email us directly.' }, 503);
    // Pages supplies Cloudflare's client IP. The Worker has no public URL.
    const client = request.headers.get('cf-connecting-ip') || 'unknown';
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(client));
    const key = Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
    const { success } = await env.CONTACT_LIMITER.limit({ key });
    if (!success) return json({ error: 'Please wait a minute before sending another message.' }, 429, { 'Retry-After': '60' });
    const lines = [
      'New ' + input.kind + ' inquiry from the nPower Software website.',
      '', 'Name: ' + name, 'Email: ' + email,
      ...(company ? ['Company: ' + company] : []),
      ...(interest ? ['Interest: ' + interest] : []),
      ...(product ? ['Product: ' + product] : []),
      ...(subject ? ['Subject: ' + subject] : []),
      '', 'Message:', message,
    ];
    await env.CONTACT_EMAIL.send({
      to: RECIPIENTS[input.kind],
      from: { email: env.CONTACT_FROM, name: 'nPower Software Website' },
      replyTo: { email, name },
      subject: '[nPower ' + (input.kind === 'sales' ? 'Sales' : 'Support') + '] ' + (subject || interest || 'Website inquiry'),
      text: lines.join('\r\n'),
      html: '<div style="white-space:pre-wrap;font-family:Arial,sans-serif">' + escape(lines.join('\n')) + '</div>',
    });
    return json({ ok: true });
  } catch (error) {
    if (error instanceof InputError) return json({ error: error.message }, error.status);
    // Do not log customer content or automatically retry an uncertain email send.
    console.error(JSON.stringify({ event: 'contact_delivery_failed' }));
    return json({ error: 'We could not confirm delivery. Please email us directly so your message reaches our team.' }, 502);
  }
}
export default { fetch: handleContact };
