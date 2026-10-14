-- Durable reconciliation and at-most-once Cryptolens extension attempts.
CREATE TABLE cart_subscription_sync (
  group_id TEXT PRIMARY KEY REFERENCES cart_groups(id),
  lock_token TEXT,
  lock_until INTEGER NOT NULL DEFAULT 0,
  next_sync INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  subscription_status TEXT,
  cancel_at INTEGER,
  updated INTEGER,
  reason TEXT
);
CREATE TABLE cart_paid_periods (
  invoice_id TEXT NOT NULL,
  price_id TEXT NOT NULL,
  group_id TEXT NOT NULL REFERENCES cart_groups(id),
  period_start INTEGER NOT NULL,
  period_end INTEGER NOT NULL,
  PRIMARY KEY(invoice_id, price_id)
);
CREATE INDEX cart_paid_group ON cart_paid_periods(group_id, price_id, period_end);
CREATE TABLE cart_license_sync (
  unit_id TEXT PRIMARY KEY REFERENCES cart_units(id),
  paid_through INTEGER NOT NULL,
  applied_day INTEGER,
  attempt_id TEXT,
  attempt_target INTEGER,
  attempt_before INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  reason TEXT
);
CREATE INDEX cart_sync_due ON cart_subscription_sync(next_sync);
INSERT INTO cart_subscription_sync(group_id)
SELECT id FROM cart_groups WHERE subscription_id IS NOT NULL AND status='fulfilled';
