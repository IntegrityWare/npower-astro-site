CREATE TABLE IF NOT EXISTS sandbox_sessions (
  owner_hash TEXT PRIMARY KEY, expires INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sandbox_attempts (
  identity TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS cart_orders (
  id TEXT PRIMARY KEY, owner_hash TEXT NOT NULL, attempt TEXT NOT NULL,
  fingerprint TEXT NOT NULL, created INTEGER NOT NULL, quote TEXT NOT NULL,
  UNIQUE(owner_hash, attempt)
);
CREATE TABLE IF NOT EXISTS cart_groups (
  id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES cart_orders(id),
  position INTEGER NOT NULL, plan TEXT NOT NULL, session_id TEXT UNIQUE,
  checkout_url TEXT, subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending', event_id TEXT, reason TEXT
);
CREATE TABLE IF NOT EXISTS cart_units (
  id TEXT PRIMARY KEY, group_id TEXT NOT NULL REFERENCES cart_groups(id),
  selection TEXT NOT NULL, ordinal INTEGER NOT NULL, template_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', license_key TEXT, reason TEXT
);
CREATE TABLE IF NOT EXISTS cart_mail (
  order_id TEXT PRIMARY KEY REFERENCES cart_orders(id), recipient TEXT NOT NULL,
  subject TEXT NOT NULL, html TEXT NOT NULL, text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', message_id TEXT
);
CREATE TABLE IF NOT EXISTS cart_lifecycle (
  event_id TEXT PRIMARY KEY, subscription_id TEXT NOT NULL,
  event_type TEXT NOT NULL, object_id TEXT NOT NULL, status TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS cart_group_order ON cart_groups(order_id);
CREATE INDEX IF NOT EXISTS cart_unit_group ON cart_units(group_id);
