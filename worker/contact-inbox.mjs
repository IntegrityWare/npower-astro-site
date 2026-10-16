const RETENTION_SECONDS = 30 * 24 * 60 * 60;
export async function fingerprint(value) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
}
export class ContactInbox {
  constructor(db) { this.db = db; }
  async save(id, payload, now) {
    const serialized = JSON.stringify(payload);
    const hash = await fingerprint(serialized);
    await this.db.prepare('INSERT INTO contact_inquiries (id, fingerprint, payload, created_at) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(id) DO NOTHING').bind(id, hash, serialized, now).run();
    const record = await this.db.prepare('SELECT fingerprint FROM contact_inquiries WHERE id = ?1').bind(id).first();
    if (!record) throw new Error('contact_save_not_confirmed');
    return record.fingerprint === hash;
  }
  async claim(id, now) {
    return this.db.prepare("UPDATE contact_inquiries SET state = 'sending', attempted_at = ?2 WHERE id = ?1 AND state = 'pending' RETURNING id, payload").bind(id, now).first();
  }
  async sent(id, providerId) {
    await this.db.prepare("UPDATE contact_inquiries SET state = 'sent', payload = NULL, provider_id = ?2, error_code = NULL WHERE id = ?1 AND state = 'sending'").bind(id, providerId || null).run();
  }
  async review(id, code) {
    await this.db.prepare("UPDATE contact_inquiries SET state = 'review', error_code = ?2 WHERE id = ?1 AND state = 'sending'").bind(id, code).run();
  }
  async maintain(now) {
    // A stopped invocation may already have sent the email. Never claim it again.
    await this.db.prepare("UPDATE contact_inquiries SET state = 'review', error_code = 'interrupted_send' WHERE state = 'sending' AND attempted_at < ?1").bind(now - 300).run();
    const removed = await this.db.prepare('DELETE FROM contact_inquiries WHERE created_at < ?1').bind(now - RETENTION_SECONDS).run();
    if (removed.meta.changes) console.log(JSON.stringify({ event:'contact_retention_expired', count:removed.meta.changes }));
  }
  async pending() {
    return (await this.db.prepare("SELECT id FROM contact_inquiries WHERE state = 'pending' ORDER BY created_at LIMIT 3").all()).results;
  }
  async reviewCount() {
    return (await this.db.prepare("SELECT COUNT(*) AS count FROM contact_inquiries WHERE state = 'review'").first()).count;
  }
}
export function deliveryError(error) {
  const code = typeof error?.code === 'string' && /^E_[A-Z_]{1,64}$/.test(error.code) ? error.code : 'unknown';
  const reason = /timeout|timed out|deadline/i.test(String(error?.message || '')) ? 'timeout' : 'provider_error';
  return { code, reason };
}
export async function deliverPending(env, now = Math.floor(Date.now()/1000)) {
  const inbox = new ContactInbox(env.CONTACT_DB);
  await inbox.maintain(now);
  const pending = await inbox.pending();
  // Keep one invocation below free-plan D1/subrequest limits.
  for (const { id } of pending) {
    const record = await inbox.claim(id, now);
    if (!record) continue;
    const startedAt = Date.now();
    try {
      const message = JSON.parse(record.payload);
      const result = await env.CONTACT_EMAIL.send(message);
      await inbox.sent(id, result?.messageId);
      console.log(JSON.stringify({ event:'contact_email_accepted', inquiryId:id, elapsedMs:Date.now()-startedAt }));
    } catch (error) {
      const diagnostic = deliveryError(error);
      // Cloudflare can report an error and still deliver. Retain the saved inquiry
      // for review instead of sending duplicates or discarding customer content.
      await inbox.review(id, diagnostic.code);
      console.error(JSON.stringify({ event:'contact_delivery_review', inquiryId:id, ...diagnostic, elapsedMs:Date.now()-startedAt }));
    }
  }
  const count = await inbox.reviewCount();
  if (count) console.warn(JSON.stringify({ event:'contact_inquiries_need_review', count }));
}
