ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS client_id TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_client_id ON leads(client_id);

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS client_id TEXT;

CREATE INDEX IF NOT EXISTS idx_events_client_id ON events(client_id);
