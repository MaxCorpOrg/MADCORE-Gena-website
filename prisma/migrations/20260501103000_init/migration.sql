CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  contact_method TEXT NOT NULL,
  comment TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  src TEXT,
  cmp TEXT,
  cr TEXT,
  click_id TEXT,
  ip TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_ip ON leads(ip);
CREATE INDEX IF NOT EXISTS idx_leads_click_id ON leads(click_id);

CREATE TABLE IF NOT EXISTS clicks (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip TEXT,
  user_agent TEXT,
  referer TEXT,
  src TEXT,
  cmp TEXT,
  cr TEXT,
  click_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  is_suspicious BOOLEAN NOT NULL DEFAULT FALSE,
  suspicious_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON clicks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clicks_ip ON clicks(ip);
CREATE INDEX IF NOT EXISTS idx_clicks_click_id ON clicks(click_id);
CREATE INDEX IF NOT EXISTS idx_clicks_suspicious ON clicks(is_suspicious);

CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_id TEXT,
  event_name TEXT NOT NULL,
  page TEXT,
  payload JSONB,
  src TEXT,
  cmp TEXT,
  cr TEXT,
  click_id TEXT,
  ip TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_event_name ON events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_click_id ON events(click_id);
