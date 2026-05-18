#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/madcore-gena}"
REPORT_DIR="${REPORT_DIR:-$APP_DIR/backups/reports}"
DAYS="${DAYS:-7}"

if ! [[ "$DAYS" =~ ^[0-9]+$ ]]; then
  echo "DAYS must be an integer" >&2
  exit 1
fi

TIMESTAMP="$(date -u +%Y%m%d-%H%M%S)"
OUT_FILE="$REPORT_DIR/madcore-gena-leads-quality-$TIMESTAMP.csv"

mkdir -p "$REPORT_DIR"
cd "$APP_DIR"

docker compose exec -T postgres psql \
  -U "${POSTGRES_USER:-madcore_gena}" \
  -d "${POSTGRES_DB:-madcore_gena}" -c "\\copy (
  SELECT
    id,
    created_at,
    name,
    phone,
    city,
    contact_method,
    COALESCE(comment, '') AS comment,
    COALESCE(src, '') AS src,
    COALESCE(cmp, '') AS cmp,
    COALESCE(cr, '') AS cr,
    COALESCE(click_id, '') AS click_id,
    COALESCE(utm_source, '') AS utm_source,
    COALESCE(utm_medium, '') AS utm_medium,
    COALESCE(utm_campaign, '') AS utm_campaign,
    COALESCE(utm_content, '') AS utm_content,
    COALESCE(utm_term, '') AS utm_term,
    COALESCE(ip, '') AS ip,
    COUNT(*) OVER (PARTITION BY phone) AS same_phone_total,
    COUNT(*) OVER (PARTITION BY ip) AS same_ip_total
  FROM leads
  WHERE created_at >= now() - ('$DAYS days')::interval
  ORDER BY created_at DESC
) TO STDOUT WITH CSV HEADER" > "$OUT_FILE"

printf 'Lead quality report created: %s\n' "$OUT_FILE"
