#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/madcore-gena}"
REPORT_DIR="${REPORT_DIR:-$APP_DIR/backups/reports}"
DAYS="${DAYS:-30}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env}"

read_env_value() {
  local key="$1"
  if [[ ! -f "$ENV_FILE" ]]; then
    return 1
  fi

  awk -v key="$key" '
    index($0, key "=") == 1 {
      value = substr($0, length(key) + 2)
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", value)
      print value
      exit
    }
  ' "$ENV_FILE"
}

if ! [[ "$DAYS" =~ ^[0-9]+$ ]]; then
  echo "DAYS must be an integer" >&2
  exit 1
fi

TIMESTAMP="$(date -u +%Y%m%d-%H%M%S)"
OUT_FILE="$REPORT_DIR/yandex-qualified-leads-$TIMESTAMP.csv"

mkdir -p "$REPORT_DIR"
cd "$APP_DIR"

POSTGRES_USER="${POSTGRES_USER:-$(read_env_value POSTGRES_USER || true)}"
POSTGRES_DB="${POSTGRES_DB:-$(read_env_value POSTGRES_DB || true)}"

if [[ -z "${POSTGRES_USER:-}" || -z "${POSTGRES_DB:-}" ]]; then
  echo "Не найдены POSTGRES_USER и POSTGRES_DB. Проверьте /opt/madcore-gena/.env или передайте переменные явно." >&2
  exit 1
fi

docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\\copy (
  SELECT
    client_id AS \"ClientID\",
    yclid AS \"yclid\",
    CASE
      WHEN lead_status = 'sale' OR COALESCE(sale_amount, 0) > 0 THEN 'sale'
      ELSE 'qualified_lead'
    END AS \"Target\",
    EXTRACT(EPOCH FROM created_at)::BIGINT AS \"DateTime\",
    COALESCE(sale_amount, 0) AS \"Price\",
    'RUB' AS \"Currency\"
  FROM leads
  WHERE created_at >= now() - ('$DAYS days')::interval
    AND (
      (client_id IS NOT NULL AND client_id <> '')
      OR (yclid IS NOT NULL AND yclid <> '')
    )
    AND (
      lead_status IN ('qualified', 'sale')
      OR COALESCE(sale_amount, 0) > 0
    )
  ORDER BY created_at DESC
) TO STDOUT WITH CSV HEADER" > "$OUT_FILE"

printf 'Экспорт для Яндекса создан: %s\n' "$OUT_FILE"
