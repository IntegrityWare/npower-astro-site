-- One evaluation per verified email AND computer across all Power Surfacing editions.
CREATE TABLE trial_requests (
  id TEXT PRIMARY KEY, secret_hash TEXT NOT NULL, code_hash TEXT NOT NULL,
  email TEXT NOT NULL, email_hash TEXT NOT NULL, machine_hash TEXT NOT NULL,
  edition INTEGER NOT NULL CHECK (edition IN (2,4,8)),
  expires INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, verified INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX trial_requests_expiry ON trial_requests(expires);
CREATE TABLE trial_licenses (
  id TEXT PRIMARY KEY, email_hash TEXT NOT NULL UNIQUE, machine_hash TEXT NOT NULL UNIQUE,
  edition INTEGER NOT NULL CHECK (edition IN (2,4,8)),
  state TEXT NOT NULL CHECK (state IN ('issuing','issued','review')),
  license_key TEXT, created INTEGER NOT NULL, expires INTEGER,
  customer_id INTEGER, reason TEXT
);
CREATE TABLE trial_limits (
  id TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL
);
