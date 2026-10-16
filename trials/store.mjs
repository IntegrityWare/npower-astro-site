export class TrialStore {
  constructor(db) { this.db = db; }
  async limit(id, maximum, seconds, now) {
    const row = await this.db.prepare(`INSERT INTO trial_limits(id,count,expires) VALUES (?,1,?)
      ON CONFLICT(id) DO UPDATE SET count=CASE WHEN expires<=? THEN 1 ELSE count+1 END,
      expires=CASE WHEN expires<=? THEN excluded.expires ELSE expires END RETURNING count`)
      .bind(id,now+seconds,now,now).first();
    return row.count <= maximum;
  }
  async saveRequest(r) {
    await this.db.prepare(`INSERT INTO trial_requests
      (id,secret_hash,code_hash,email,email_hash,machine_hash,edition,expires) VALUES (?,?,?,?,?,?,?,?)`)
      .bind(r.id,r.secret_hash,r.code_hash,r.email,r.email_hash,r.machine_hash,r.edition,r.expires).run();
  }
  request(id) { return this.db.prepare('SELECT * FROM trial_requests WHERE id=?').bind(id).first(); }
  async attempt(id,now) {
    const result=await this.db.prepare(`UPDATE trial_requests SET attempts=attempts+1
      WHERE id=? AND expires>? AND verified=0 AND attempts<5`).bind(id,now).run();
    return result.meta.changes === 1;
  }
  async verify(id) { await this.db.prepare('UPDATE trial_requests SET verified=1 WHERE id=?').bind(id).run(); }
  async removeRequest(id) { await this.db.prepare('DELETE FROM trial_requests WHERE id=?').bind(id).run(); }
  async reserve(r,id,now) {
    const result=await this.db.prepare(`INSERT OR IGNORE INTO trial_licenses
      (id,email_hash,machine_hash,edition,state,created) VALUES (?,?,?,?,'issuing',?)`)
      .bind(id,r.email_hash,r.machine_hash,r.edition,now).run();
    return result.meta.changes === 1;
  }
  async existing(r) {
    return (await this.db.prepare('SELECT * FROM trial_licenses WHERE email_hash=? OR machine_hash=?')
      .bind(r.email_hash,r.machine_hash).all()).results;
  }
  async issued(id,license) {
    const result=await this.db.prepare(`UPDATE trial_licenses SET state='issued',license_key=?,expires=?,customer_id=?
      WHERE id=? AND state='issuing'`).bind(license.key,license.expires,license.customerId,id).run();
    if(result.meta.changes !== 1) throw Error('trial_ledger_update_failed');
  }
  async review(id) {
    await this.db.prepare(`UPDATE trial_licenses SET state='review',reason='issuance_unconfirmed' WHERE id=? AND state='issuing'`).bind(id).run();
  }
  async cleanup(now) {
    await this.db.batch([this.db.prepare('DELETE FROM trial_requests WHERE expires<=?').bind(now),
      this.db.prepare('DELETE FROM trial_limits WHERE expires<=?').bind(now)]);
    // Retain expired evaluation history: removing it would reset trial eligibility.
  }
}
