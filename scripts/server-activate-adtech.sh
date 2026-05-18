#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/madcore-gena}"
BASE_URL="${BASE_URL:-${PUBLIC_BASE_URL:-https://gena.madcore-kavkaz.ru}}"
METRIKA_COUNTER_ID="${METRIKA_COUNTER_ID:-}"
DIRECT_CLIENT_LOGIN="${DIRECT_CLIENT_LOGIN:-Max.Corp.Org}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env}"
ENV_BACKUP_DIR="${ENV_BACKUP_DIR:-$APP_DIR/backups/env}"
TIMESTAMP="$(date -u +%Y%m%d-%H%M%S)"

require_file() {
  local path="$1"
  if [[ ! -f "$path" ]]; then
    printf 'Required file not found: %s\n' "$path" >&2
    exit 1
  fi
}

require_non_empty() {
  local label="$1"
  local value="$2"
  if [[ -z "$value" ]]; then
    printf 'Required value is empty: %s\n' "$label" >&2
    exit 1
  fi
}

upsert_env_value() {
  local key="$1"
  local value="$2"
  local file="$3"

  if grep -q "^${key}=" "$file"; then
    perl -0pi -e "s/^${key}=.*\$/${key}=${value}/m" "$file"
  else
    printf '\n%s=%s\n' "$key" "$value" >> "$file"
  fi
}

mkdir -p "$ENV_BACKUP_DIR"
require_file "$ENV_FILE"
require_non_empty "METRIKA_COUNTER_ID" "$METRIKA_COUNTER_ID"
require_non_empty "DIRECT_CLIENT_LOGIN" "$DIRECT_CLIENT_LOGIN"

cp "$ENV_FILE" "$ENV_BACKUP_DIR/.env-$TIMESTAMP.bak"
printf 'Backup created: %s\n' "$ENV_BACKUP_DIR/.env-$TIMESTAMP.bak"

upsert_env_value "NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID" "$METRIKA_COUNTER_ID" "$ENV_FILE"
upsert_env_value "YANDEX_DIRECT_CLIENT_LOGIN" "$DIRECT_CLIENT_LOGIN" "$ENV_FILE"

cd "$APP_DIR"

docker compose up -d --build postgres app nginx
docker compose exec -T app npx prisma migrate deploy

./scripts/production-smoke.sh "$BASE_URL"

if [[ -n "${ADMIN_USERNAME:-}" && -n "${ADMIN_PASSWORD:-}" ]]; then
  ADMIN_USERNAME="$ADMIN_USERNAME" \
  ADMIN_PASSWORD="$ADMIN_PASSWORD" \
  METRIKA_COUNTER_ID="$METRIKA_COUNTER_ID" \
  ./scripts/production-adtech-smoke.sh "$BASE_URL"
else
  METRIKA_COUNTER_ID="$METRIKA_COUNTER_ID" ./scripts/production-adtech-smoke.sh "$BASE_URL"
fi

printf 'Adtech activation completed for %s with counter %s\n' "$BASE_URL" "$METRIKA_COUNTER_ID"
