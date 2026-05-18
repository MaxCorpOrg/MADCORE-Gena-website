#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-https://gena.madcore-kavkaz.ru}"
WWW_URL="${WWW_URL:-https://www.gena.madcore-kavkaz.ru}"
CURL_UA="${CURL_UA:-Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36 MADCOREGenaSmoke/1.0}"
BASE_URL="${BASE_URL%/}"
SMOKE_ID="smoke_$(date -u +%Y%m%d%H%M%S)"

check_status() {
  local url="$1"
  local expected="$2"
  local code
  code="$(curl -A "$CURL_UA" -sS -o /dev/null -w "%{http_code}" "$url")"

  if [[ "$code" != "$expected" ]]; then
    printf 'FAIL %s expected %s got %s\n' "$url" "$expected" "$code" >&2
    return 1
  fi

  printf 'OK   %s -> %s\n' "$url" "$code"
}

check_redirect() {
  local url="$1"
  local expected_prefix="$2"
  local code redirect_url
  code="$(curl -A "$CURL_UA" -sS -o /dev/null -w "%{http_code}" "$url")"
  redirect_url="$(curl -A "$CURL_UA" -sS -o /dev/null -w "%{redirect_url}" "$url")"

  if [[ "$code" != "301" && "$code" != "302" ]]; then
    printf 'FAIL %s expected redirect got %s\n' "$url" "$code" >&2
    return 1
  fi

  if [[ "$redirect_url" != "$expected_prefix"* ]]; then
    printf 'FAIL %s redirect target %s does not start with %s\n' "$url" "$redirect_url" "$expected_prefix" >&2
    return 1
  fi

  printf 'OK   %s -> %s %s\n' "$url" "$code" "$redirect_url"
}

check_status "$BASE_URL/" "200"
check_status "$BASE_URL/privacy" "200"
check_status "$BASE_URL/thanks" "200"
check_status "$BASE_URL/robots.txt" "200"
check_status "$BASE_URL/sitemap.xml" "200"
check_redirect "$WWW_URL/" "$BASE_URL/"

# This intentionally records one smoke click with src=smoke.
check_redirect \
  "$BASE_URL/go?src=smoke&cmp=production_smoke_gena&cr=script&click_id=$SMOKE_ID&utm_source=smoke&utm_medium=qa&utm_campaign=production_smoke_gena" \
  "$BASE_URL/"

printf 'Production smoke passed. smoke_click_id=%s\n' "$SMOKE_ID"
