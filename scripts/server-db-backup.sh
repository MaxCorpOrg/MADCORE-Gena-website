#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/madcore-gena}"
BACKUP_DIR="${BACKUP_DIR:-$APP_DIR/backups/db}"
TIMESTAMP="$(date -u +%Y%m%d-%H%M%S)"
OUT_FILE="$BACKUP_DIR/madcore-gena-db-$TIMESTAMP.sql.gz"

mkdir -p "$BACKUP_DIR"
cd "$APP_DIR"

docker compose exec -T postgres pg_dump \
  -U "${POSTGRES_USER:-madcore_gena}" \
  -d "${POSTGRES_DB:-madcore_gena}" | gzip -9 > "$OUT_FILE"

printf 'Database backup created: %s\n' "$OUT_FILE"
