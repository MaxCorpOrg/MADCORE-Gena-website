#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/madcore-gena}"
DAYS="${DAYS:-30}"

if ! [[ "$DAYS" =~ ^[0-9]+$ ]]; then
  echo "DAYS must be an integer" >&2
  exit 1
fi

cd "$APP_DIR"

docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<SQL
TRUNCATE TABLE traffic_sources_quality RESTART IDENTITY;

INSERT INTO traffic_sources_quality (
  utm_campaign,
  utm_content,
  utm_term,
  clicks,
  leads,
  qualified_leads,
  sales,
  avg_score_in,
  avg_score_out,
  recommendation,
  updated_at
)
WITH click_stats AS (
  SELECT
    COALESCE(utm_campaign, '') AS utm_campaign,
    COALESCE(utm_content, '') AS utm_content,
    COALESCE(utm_term, '') AS utm_term,
    COUNT(*) AS clicks,
    AVG(score_in)::float AS avg_score_in
  FROM clicks
  WHERE created_at >= now() - ('${DAYS} days')::interval
  GROUP BY 1, 2, 3
),
lead_stats AS (
  SELECT
    COALESCE(utm_campaign, '') AS utm_campaign,
    COALESCE(utm_content, '') AS utm_content,
    COALESCE(utm_term, '') AS utm_term,
    COUNT(*) AS leads,
    COUNT(*) FILTER (WHERE lead_status = 'qualified') AS qualified_leads,
    COUNT(*) FILTER (WHERE lead_status = 'sale' OR COALESCE(sale_amount, 0) > 0) AS sales,
    AVG(score_out)::float AS avg_score_out
  FROM leads
  WHERE created_at >= now() - ('${DAYS} days')::interval
  GROUP BY 1, 2, 3
)
SELECT
  NULLIF(COALESCE(c.utm_campaign, l.utm_campaign), '') AS utm_campaign,
  NULLIF(COALESCE(c.utm_content, l.utm_content), '') AS utm_content,
  NULLIF(COALESCE(c.utm_term, l.utm_term), '') AS utm_term,
  COALESCE(c.clicks, 0) AS clicks,
  COALESCE(l.leads, 0) AS leads,
  COALESCE(l.qualified_leads, 0) AS qualified_leads,
  COALESCE(l.sales, 0) AS sales,
  COALESCE(c.avg_score_in, 0) AS avg_score_in,
  COALESCE(l.avg_score_out, 0) AS avg_score_out,
  CASE
    WHEN COALESCE(l.sales, 0) > 0 THEN 'усилить'
    WHEN COALESCE(l.qualified_leads, 0) >= 3 AND COALESCE(l.avg_score_out, 0) >= 60 THEN 'усилить'
    WHEN COALESCE(c.clicks, 0) >= 20 AND COALESCE(l.leads, 0) = 0 THEN 'отключить'
    WHEN COALESCE(c.clicks, 0) >= 20 AND COALESCE(l.qualified_leads, 0) = 0 AND COALESCE(c.avg_score_in, 0) < 45 THEN 'снизить'
    WHEN COALESCE(l.leads, 0) > 0 AND COALESCE(l.qualified_leads, 0) = 0 THEN 'проверить вручную'
    WHEN COALESCE(c.avg_score_in, 0) >= 70 AND COALESCE(l.avg_score_out, 0) >= 40 THEN 'оставить'
    ELSE 'проверить вручную'
  END AS recommendation,
  now() AS updated_at
FROM click_stats c
FULL OUTER JOIN lead_stats l
  ON c.utm_campaign = l.utm_campaign
 AND c.utm_content = l.utm_content
 AND c.utm_term = l.utm_term;
SQL

echo "Таблица traffic_sources_quality обновлена."
