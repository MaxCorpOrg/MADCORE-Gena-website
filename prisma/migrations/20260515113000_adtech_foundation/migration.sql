DO $$
BEGIN
  CREATE TYPE "LeadStatus" AS ENUM ('new', 'in_progress', 'qualified', 'bad', 'duplicate', 'sale');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE TYPE "TrafficDecision" AS ENUM ('good', 'watch', 'suspicious', 'blocked');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS product_interest TEXT,
  ADD COLUMN IF NOT EXISTS yclid TEXT,
  ADD COLUMN IF NOT EXISTS lead_status "LeadStatus" NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS manager_comment TEXT,
  ADD COLUMN IF NOT EXISTS score_out INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sale_amount INTEGER;

CREATE INDEX IF NOT EXISTS idx_leads_updated_at ON leads(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_yclid ON leads(yclid);

ALTER TABLE clicks
  ADD COLUMN IF NOT EXISTS yclid TEXT,
  ADD COLUMN IF NOT EXISTS device_type TEXT,
  ADD COLUMN IF NOT EXISTS region TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS score_in INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS decision_in "TrafficDecision",
  ADD COLUMN IF NOT EXISTS target_url TEXT;

CREATE INDEX IF NOT EXISTS idx_clicks_decision_in ON clicks(decision_in);
CREATE INDEX IF NOT EXISTS idx_clicks_yclid ON clicks(yclid);

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS lead_id BIGINT,
  ADD COLUMN IF NOT EXISTS event_value TEXT,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_content TEXT,
  ADD COLUMN IF NOT EXISTS utm_term TEXT,
  ADD COLUMN IF NOT EXISTS yclid TEXT;

CREATE INDEX IF NOT EXISTS idx_events_lead_id ON events(lead_id);

CREATE TABLE IF NOT EXISTS traffic_sources_quality (
  id BIGSERIAL PRIMARY KEY,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  clicks INTEGER NOT NULL DEFAULT 0,
  leads INTEGER NOT NULL DEFAULT 0,
  qualified_leads INTEGER NOT NULL DEFAULT 0,
  sales INTEGER NOT NULL DEFAULT 0,
  avg_score_in DOUBLE PRECISION NOT NULL DEFAULT 0,
  avg_score_out DOUBLE PRECISION NOT NULL DEFAULT 0,
  recommendation TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_traffic_quality_campaign ON traffic_sources_quality(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_traffic_quality_content ON traffic_sources_quality(utm_content);
CREATE INDEX IF NOT EXISTS idx_traffic_quality_term ON traffic_sources_quality(utm_term);
