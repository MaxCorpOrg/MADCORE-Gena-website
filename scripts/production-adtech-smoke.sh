#!/usr/bin/env bash
set -euo pipefail

DEFAULT_BASE_URL="${PUBLIC_BASE_URL:-https://madcore.site}"
BASE_URL="${1:-$DEFAULT_BASE_URL}"
BASE_URL="${BASE_URL%/}"
CURL_UA="${CURL_UA:-Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36 MADCOREGenaAdtechSmoke/1.0}"
METRIKA_COUNTER_ID="${METRIKA_COUNTER_ID:-}"
ADMIN_USERNAME="${ADMIN_USERNAME:-}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-}"
SMOKE_ID="adtech_$(date -u +%Y%m%d%H%M%S)"
TEST_YCLID="yclid_${SMOKE_ID}"
SUSPICIOUS_CLICK_ID="blocked_${SMOKE_ID}"

check_admin() {
  local url="$1"
  local code

  code="$(curl -A "$CURL_UA" -sS -o /dev/null -w "%{http_code}" "$url")"
  if [[ "$code" != "401" ]]; then
    printf 'FAIL %s expected 401 without auth got %s\n' "$url" "$code" >&2
    return 1
  fi
  printf 'OK   %s -> %s without auth\n' "$url" "$code"

  if [[ -n "$ADMIN_USERNAME" && -n "$ADMIN_PASSWORD" ]]; then
    code="$(curl -A "$CURL_UA" -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" -sS -o /dev/null -w "%{http_code}" "$url")"
    if [[ "$code" != "200" ]]; then
      printf 'FAIL %s expected 200 with auth got %s\n' "$url" "$code" >&2
      return 1
    fi
    printf 'OK   %s -> %s with auth\n' "$url" "$code"
  else
    printf 'INFO %s auth check skipped: ADMIN_USERNAME/ADMIN_PASSWORD not provided\n' "$url"
  fi
}

check_metrika_presence() {
  local html="$1"

  if [[ -z "$METRIKA_COUNTER_ID" ]]; then
    printf 'INFO Metrika counter id is not provided, presence check skipped\n'
    return 0
  fi

  local has_html_mc=0
  local has_html_id=0

  if printf '%s' "$html" | grep -q "mc\\.yandex\\.ru"; then
    has_html_mc=1
  fi

  if printf '%s' "$html" | grep -q "$METRIKA_COUNTER_ID"; then
    has_html_id=1
  fi

  if [[ "$has_html_mc" == "1" && "$has_html_id" == "1" ]]; then
    printf 'OK   main page contains mc.yandex.ru and counter id %s in HTML\n' "$METRIKA_COUNTER_ID"
    return 0
  fi

  local urls
  urls="$(printf '%s' "$html" | grep -oE '/_next/static/[^" ]+\.js' | sort -u || true)"
  if [[ -z "$urls" ]]; then
    printf 'FAIL could not find client bundles in page HTML to verify Metrika\n' >&2
    return 1
  fi

  local has_bundle_mc=0
  local has_bundle_id=0
  local url
  for url in $urls; do
    local body
    body="$(curl -A "$CURL_UA" -sS "$BASE_URL$url")"
    if printf '%s' "$body" | grep -q "mc\\.yandex\\.ru"; then
      has_bundle_mc=1
    fi
    if printf '%s' "$body" | grep -q "$METRIKA_COUNTER_ID"; then
      has_bundle_id=1
    fi
  done

  if [[ "$has_bundle_mc" == "1" && "$has_bundle_id" == "1" ]]; then
    printf 'OK   Metrika code and counter id %s found in client bundle\n' "$METRIKA_COUNTER_ID"
    return 0
  fi

  printf 'FAIL Metrika code or counter id %s not found in HTML or client bundles\n' "$METRIKA_COUNTER_ID" >&2
  return 1
}

main_html="$(curl -A "$CURL_UA" -sS "$BASE_URL/")"
check_metrika_presence "$main_html"

redirect_url="$(
  curl -A "$CURL_UA" -sS -o /dev/null -w "%{redirect_url}" \
    "$BASE_URL/go?src=yandex&cmp=adtech_smoke&cr=script&click_id=$SMOKE_ID&yclid=$TEST_YCLID&utm_source=yandex&utm_medium=cpc&utm_campaign=adtech_smoke&utm_content=script&utm_term=madcore"
)"

if [[ "$redirect_url" != "$BASE_URL/"* ]]; then
  printf 'FAIL /go redirect target %s does not start with %s/\n' "$redirect_url" "$BASE_URL" >&2
  exit 1
fi
printf 'OK   /go redirected to %s\n' "$redirect_url"

if [[ "$redirect_url" != *"yclid=$TEST_YCLID"* ]]; then
  printf 'FAIL /go redirect does not keep yclid in query\n' >&2
  exit 1
fi
printf 'OK   /go redirect keeps yclid\n'

if [[ "$redirect_url" != *"decision_in="* ]]; then
  printf 'FAIL /go redirect does not include decision_in\n' >&2
  exit 1
fi
printf 'OK   /go redirect includes decision_in\n'

if [[ "$redirect_url" != *"score_in_bucket="* ]]; then
  printf 'FAIL /go redirect does not include score_in_bucket\n' >&2
  exit 1
fi
printf 'OK   /go redirect includes score_in_bucket\n'

suspicious_redirect_url="$(
  curl -A "curl/8.0" -sS -o /dev/null -w "%{redirect_url}" \
    "$BASE_URL/go?src=yandex&cmp=adtech_smoke_gena&cr=blocked&click_id=$SUSPICIOUS_CLICK_ID&utm_source=yandex&utm_medium=cpc&utm_campaign=adtech_smoke_gena&utm_content=blocked"
)"

if [[ "$suspicious_redirect_url" != "$BASE_URL/safe"* ]]; then
  printf 'FAIL suspicious /go redirect target %s does not start with %s/safe\n' "$suspicious_redirect_url" "$BASE_URL" >&2
  exit 1
fi
printf 'OK   suspicious /go redirected to %s\n' "$suspicious_redirect_url"

safe_html="$(curl -A "$CURL_UA" -sS "$BASE_URL/safe")"
if ! printf '%s' "$safe_html" | grep -qi "noindex"; then
  printf 'FAIL /safe page does not contain noindex marker\n' >&2
  exit 1
fi
printf 'OK   /safe page contains noindex marker\n'

check_admin "$BASE_URL/admin/leads"
check_admin "$BASE_URL/api/admin/reports/traffic-quality"

printf 'Adtech smoke passed. click_id=%s yclid=%s suspicious_click_id=%s\n' "$SMOKE_ID" "$TEST_YCLID" "$SUSPICIOUS_CLICK_ID"
