#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-3000}"
PID_FILE="$ROOT_DIR/.tmp/dev.pid"
LOG_FILE="$ROOT_DIR/.tmp/dev.log"

http_status() {
  curl -sS -o /dev/null -w "%{http_code}" --max-time 5 "http://$HOST:$PORT" 2>/dev/null || true
}

is_healthy_status() {
  case "$1" in
    200|204|301|302|307|308)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

if [[ ! -f "$PID_FILE" ]]; then
  FALLBACK_PIDS="$(pgrep -f 'next dev --turbopack --hostname 127.0.0.1 --port 3000|next dev --hostname 127.0.0.1 --port 3000' || true)"
  if [[ -n "${FALLBACK_PIDS:-}" ]]; then
    echo "MADCORE dev server is running without a PID file."
    echo "$FALLBACK_PIDS"
    exit 0
  fi

  echo "MADCORE dev server is not running."
  exit 0
fi

PID="$(cat "$PID_FILE" 2>/dev/null || true)"
if [[ -z "${PID:-}" ]]; then
  echo "PID file exists but is empty."
  exit 1
fi

if kill -0 "$PID" 2>/dev/null; then
  STATUS_CODE="$(http_status)"
  if is_healthy_status "$STATUS_CODE"; then
    echo "MADCORE dev server is running and healthy (pid $PID)."
    echo "URL: http://$HOST:$PORT"
    echo "Log: $LOG_FILE"
    exit 0
  fi

  echo "MADCORE dev server process is running (pid $PID), but HTTP health check returned ${STATUS_CODE:-unreachable}."
  echo "Log: $LOG_FILE"
  exit 1
fi

echo "PID file exists, but process $PID is not running."
exit 1
