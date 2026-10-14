import { CheckoutError, required, sha256 } from './errors.mjs';

export class CartStore {
  constructor(database) {
    // Always read the primary first; subsequent reads must see this request's writes.
    this.db = database.withSession('first-primary');
  }
  query(sql, ...values) { return this.db.prepare(sql).bind(...values); }
  async rows(sql, ...values) { return (await this.query(sql, ...values).all()).results; }
  async order(id) {
    const row = await this.query('SELECT * FROM cart_orders WHERE id=?', id).first();
    return row && { ...row, quote: JSON.parse(row.quote) };
  }
  async group(id) {
    const row = await this.query('SELECT * FROM cart_groups WHERE id=?', id).first();
    return row && { ...row, plan: JSON.parse(row.plan) };
  }
  async groups(id) {
    return Promise.all((await this.rows('SELECT id FROM cart_groups WHERE order_id=? ORDER BY position', id)).map(r => this.group(r.id)));
  }
  async units(id) {
    return (await this.rows('SELECT * FROM cart_units WHERE group_id=? ORDER BY id', id)).map(r => ({ ...r, selection: JSON.parse(r.selection) }));
  }
  async forSession(id) {
    const row = await this.query('SELECT id FROM cart_groups WHERE session_id=?', id).first();
    return row && this.group(row.id);
  }
  async forSubscription(id) {
    const row = await this.query('SELECT id FROM cart_groups WHERE subscription_id=?', id).first();
    return row && this.group(row.id);
  }
  async open(ownerHash, attempt, quote, makePlans, templateFor, now) {
    const fingerprint = await sha256(JSON.stringify(quote.items.map(q => [q.product, q.option, q.quantity, q.maintenance])));
    const existing = async () => {
      const row = await this.query('SELECT id,fingerprint FROM cart_orders WHERE owner_hash=? AND attempt=?', ownerHash, attempt).first();
      if (!row) return null;
      required(row.fingerprint === fingerprint, 'cart_changed_start_again', 409);
      return this.order(row.id);
    };
    const prior = await existing();
    if (prior) return prior;
    const id = crypto.randomUUID();
    const statements = [this.query('INSERT INTO cart_orders(id,owner_hash,attempt,fingerprint,created,quote) VALUES(?,?,?,?,?,?)',
      id, ownerHash, attempt, fingerprint, now, JSON.stringify(quote))];
    const plans = makePlans(id);
    for (let position = 0; position < plans.length; position++) {
      const plan = plans[position], groupId = plan.parameters.metadata.order_id;
      statements.push(this.query('INSERT INTO cart_groups(id,order_id,position,plan) VALUES(?,?,?,?)', groupId, id, position, JSON.stringify(plan)));
      for (const q of quote.items.filter(q => plan.group.itemKeys.includes(q.key))) {
        for (let n = 0; n < q.quantity; n++) statements.push(this.query(
          'INSERT INTO cart_units(id,group_id,selection,ordinal,template_id) VALUES(?,?,?,?,?)',
          crypto.randomUUID(), groupId, JSON.stringify(q), n + 1, templateFor(q)));
      }
    }
    try { await this.db.batch(statements); }
    catch (error) {
      // A concurrent identical request may win the UNIQUE(owner_hash,attempt) constraint.
      const winner = await existing();
      if (winner) return winner;
      throw error;
    }
    return this.order(id);
  }
  async bind(id, sessionId, url) {
    const result = await this.query('UPDATE cart_groups SET session_id=?,checkout_url=? WHERE id=? AND (session_id IS NULL OR session_id=?)',
      sessionId, url, id, sessionId).run();
    required(result.meta.changes === 1, 'session_binding_conflict', 503);
  }
  async claim(id, eventId, subscriptionId) {
    return (await this.query("UPDATE cart_groups SET status='issuing',event_id=?,subscription_id=? WHERE id=? AND status='pending'",
      eventId, subscriptionId ?? null, id).run()).meta.changes === 1;
  }
  async claimUnit(id) {
    return (await this.query("UPDATE cart_units SET status='issuing' WHERE id=? AND status='pending'", id).run()).meta.changes === 1;
  }
  async finishUnit(id, key) {
    const result = await this.query("UPDATE cart_units SET status='issued',license_key=? WHERE id=? AND status='issuing'", key, id).run();
    required(result.meta.changes === 1, 'unit_conflict', 503);
  }
  async reviewUnit(id) {
    await this.query("UPDATE cart_units SET status='review',reason='issuance_outcome_uncertain' WHERE id=? AND status='issuing'", id).run();
  }
  async review(id, reason) {
    await this.query("UPDATE cart_groups SET status='review',reason=? WHERE id=?", reason, id).run();
  }
  async finish(id) {
    required((await this.units(id)).every(u => u.status === 'issued'), 'units_incomplete', 503);
    await this.query("UPDATE cart_groups SET status='fulfilled',reason=NULL WHERE id=? AND status='issuing'", id).run();
  }
  async queueMail(id, message) {
    await this.query('INSERT OR IGNORE INTO cart_mail(order_id,recipient,subject,html,text) VALUES(?,?,?,?,?)',
      id, message.to, message.subject, message.html, message.text).run();
  }
  mail(id) { return this.query('SELECT * FROM cart_mail WHERE order_id=?', id).first(); }
  async claimMail(id) {
    return (await this.query("UPDATE cart_mail SET status='sending' WHERE order_id=? AND status='pending'", id).run()).meta.changes === 1;
  }
  async finishMail(id, messageId) {
    required(typeof messageId === 'string' && messageId.length > 0, 'email_result_uncertain', 503);
    const result = await this.query("UPDATE cart_mail SET status='sent',message_id=? WHERE order_id=? AND status='sending'", messageId, id).run();
    required(result.meta.changes === 1, 'email_state_conflict', 503);
  }
  async reviewMail(id) {
    await this.query("UPDATE cart_mail SET status='review' WHERE order_id=? AND status='sending'", id).run();
  }
  async lifecycle(event, subscriptionId, status) {
    await this.query('INSERT OR IGNORE INTO cart_lifecycle(event_id,subscription_id,event_type,object_id,status) VALUES(?,?,?,?,?)',
      event.id, subscriptionId, event.type, event.data.object.id, status).run();
  }
  async saveSession(ownerHash, now) {
    await this.query('INSERT INTO sandbox_sessions(owner_hash,expires) VALUES(?,?)', ownerHash, now + 172800).run();
  }
  async sessionValid(hash, now) {
    return Boolean(await this.query('SELECT owner_hash FROM sandbox_sessions WHERE owner_hash=? AND expires>?', hash, now).first());
  }
  async limit(identity, max, windowSeconds, now) {
    const key = identity + ':' + Math.floor(now / windowSeconds);
    const result = await this.query(
      'INSERT INTO sandbox_attempts(identity,count,expires) VALUES(?,1,?) ON CONFLICT(identity) DO UPDATE SET count=count+1 RETURNING count',
      key, now + windowSeconds).first();
    if (result.count > max) throw new CheckoutError('please_wait_before_retrying', 429);
  }
}
