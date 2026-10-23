-- Invitations authorize one fixed $5 live Viz order; only hashes are stored.
CREATE TABLE live_purchase_tests (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  buyer_email TEXT NOT NULL,
  expires INTEGER NOT NULL
);
