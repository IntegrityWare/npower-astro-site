import { required } from './errors.mjs';

export class LifecycleStore {
  constructor(store) { this.store = store; }
  query(sql, ...args) { return this.store.query(sql, ...args); }
  async enqueue(groupId) {
    await this.query("INSERT INTO cart_subscription_sync(group_id) VALUES(?) ON CONFLICT(group_id) DO UPDATE SET next_sync=0", groupId).run();
  }
  async seed() {
    await this.query("INSERT OR IGNORE INTO cart_subscription_sync(group_id) SELECT id FROM cart_groups WHERE subscription_id IS NOT NULL AND status='fulfilled'").run();
  }
  async due(now) {
    return this.query('SELECT group_id FROM cart_subscription_sync WHERE next_sync<=? AND lock_until<=? ORDER BY next_sync,group_id LIMIT 1', now, now).first();
  }
  async claim(id, token, now) {
    return (await this.query('UPDATE cart_subscription_sync SET lock_token=?,lock_until=? WHERE group_id=? AND lock_until<=?',
      token, now + 600, id, now).run()).meta.changes === 1;
  }
  async owned(id, token, now) {
    required(await this.query('SELECT group_id FROM cart_subscription_sync WHERE group_id=? AND lock_token=? AND lock_until>?', id, token, now).first(),
      'renewal_sync_busy', 503);
  }
  async release(id, token, status, next, now, sub, reason = null) {
    await this.query('UPDATE cart_subscription_sync SET lock_token=NULL,lock_until=0,status=?,next_sync=?,updated=?,subscription_status=COALESCE(?,subscription_status),cancel_at=?,reason=? WHERE group_id=? AND lock_token=?',
      status, next, now, sub?.status ?? null, sub?.cancel_at ?? sub?.ended_at ?? null, reason, id, token).run();
  }
  async periods(group, invoice, periods) {
    if (!periods.length) return;
    await this.store.db.batch(periods.map(p => this.query(
      'INSERT OR IGNORE INTO cart_paid_periods(invoice_id,price_id,group_id,period_start,period_end) VALUES(?,?,?,?,?)',
      invoice, p.price, group, p.start, p.end)));
  }
  async targets(groupId) {
    return this.store.rows('SELECT price_id,MAX(period_end) AS paid_through FROM cart_paid_periods WHERE group_id=? GROUP BY price_id', groupId);
  }
  async initialize(units, targets) {
    if (!units.length) return;
    await this.store.db.batch(units.map(unit => this.query(
      'INSERT INTO cart_license_sync(unit_id,paid_through) VALUES(?,?) ON CONFLICT(unit_id) DO UPDATE SET paid_through=MAX(paid_through,excluded.paid_through)',
      unit.id, targets.get(unit.id))));
  }
  async states(groupId) {
    return this.store.rows('SELECT s.* FROM cart_license_sync s JOIN cart_units u ON u.id=s.unit_id WHERE u.group_id=?', groupId);
  }
  async begin(unit, attempt, before, target) {
    return (await this.query("UPDATE cart_license_sync SET status='applying',attempt_id=?,attempt_before=?,attempt_target=?,reason=NULL WHERE unit_id=? AND attempt_id IS NULL",
      attempt, before, target, unit).run()).meta.changes === 1;
  }
  async applied(unit, day) {
    await this.query("UPDATE cart_license_sync SET applied_day=?,status='synced',attempt_id=NULL,attempt_target=NULL,attempt_before=NULL,reason=NULL WHERE unit_id=?",
      day, unit).run();
  }
  async uncertain(unit) {
    await this.query("UPDATE cart_license_sync SET status='review',reason='renewal_outcome_uncertain' WHERE unit_id=? AND attempt_id IS NOT NULL", unit).run();
  }
  async event(event, subId, status) {
    await this.query('INSERT INTO cart_lifecycle(event_id,subscription_id,event_type,object_id,status) VALUES(?,?,?,?,?) ON CONFLICT(event_id) DO UPDATE SET status=excluded.status',
      event.id, subId, event.type, event.data.object.id, status).run();
  }
  summary(id) { return this.query('SELECT status,subscription_status,cancel_at,updated,reason FROM cart_subscription_sync WHERE group_id=?', id).first(); }
}
