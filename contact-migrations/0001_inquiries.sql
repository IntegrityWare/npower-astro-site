CREATE TABLE contact_inquiries (
  id TEXT PRIMARY KEY,
  fingerprint TEXT NOT NULL,
  payload TEXT,
  state TEXT NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','sending','sent','review')),
  created_at INTEGER NOT NULL,
  attempted_at INTEGER,
  provider_id TEXT,
  error_code TEXT
);
CREATE INDEX contact_inquiries_pending ON contact_inquiries(state, created_at);
CREATE INDEX contact_inquiries_retention ON contact_inquiries(created_at);
