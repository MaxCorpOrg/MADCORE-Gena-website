#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${ENV_FILE:-/opt/madcore-gena/.env}"
EXPECTED_BASE_URL="${EXPECTED_BASE_URL:-${PUBLIC_BASE_URL:-https://madcore.site}}"
EXPECTED_METRIKA_COUNTER_ID="${EXPECTED_METRIKA_COUNTER_ID:-}"
EXPECTED_DIRECT_CLIENT_LOGIN="${EXPECTED_DIRECT_CLIENT_LOGIN:-Max.Corp.Org}"
FAILURES=0

require_file() {
  local path="$1"
  if [[ ! -f "$path" ]]; then
    printf 'FAIL missing env file %s\n' "$path" >&2
    exit 1
  fi
}

get_value() {
  local key="$1"
  local raw
  raw="$(sed -n "s/^${key}=//p" "$ENV_FILE" | tail -n 1)"
  printf '%s' "$raw"
}

check_non_empty() {
  local key="$1"
  local value
  value="$(get_value "$key")"

  if [[ -z "$value" ]]; then
    printf 'FAIL %s is missing or empty\n' "$key" >&2
    FAILURES=$((FAILURES + 1))
    return
  fi

  if [[ "$value" == "change_me" ]]; then
    printf 'FAIL %s still contains placeholder value\n' "$key" >&2
    FAILURES=$((FAILURES + 1))
    return
  fi

  printf 'OK   %s is set\n' "$key"
}

check_expected() {
  local key="$1"
  local expected="$2"
  local value
  value="$(get_value "$key")"

  if [[ "$value" != "$expected" ]]; then
    printf 'FAIL %s expected %s\n' "$key" "$expected" >&2
    FAILURES=$((FAILURES + 1))
    return
  fi

  printf 'OK   %s matches expected value\n' "$key"
}

check_expected_if_set() {
  local key="$1"
  local expected="$2"
  if [[ -z "$expected" ]]; then
    check_non_empty "$key"
    return
  fi
  check_expected "$key" "$expected"
}

require_file "$ENV_FILE"

check_non_empty "POSTGRES_DB"
check_non_empty "POSTGRES_USER"
check_non_empty "POSTGRES_PASSWORD"
check_non_empty "DATABASE_URL"
check_non_empty "TELEGRAM_BOT_TOKEN"
check_non_empty "TELEGRAM_CHAT_ID"
check_non_empty "ADMIN_USERNAME"
check_non_empty "ADMIN_PASSWORD"

check_expected "PUBLIC_BASE_URL" "$EXPECTED_BASE_URL"
check_expected_if_set "NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID" "$EXPECTED_METRIKA_COUNTER_ID"
check_expected_if_set "YANDEX_DIRECT_CLIENT_LOGIN" "$EXPECTED_DIRECT_CLIENT_LOGIN"

if [[ "$FAILURES" -gt 0 ]]; then
  printf 'Server adtech readiness failed. failures=%s\n' "$FAILURES" >&2
  exit 1
fi

printf 'Server adtech readiness passed.\n'
