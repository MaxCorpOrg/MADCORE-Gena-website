#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-3000}"
TMP_DIR="$ROOT_DIR/.tmp"
PID_FILE="$TMP_DIR/dev.pid"
LOG_FILE="$TMP_DIR/dev.log"

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

mkdir -p "$TMP_DIR"

if [[ -d "$HOME/.local/bin" ]]; then
  export PATH="$HOME/.local/bin:$PATH"
fi

if [[ -f "$PID_FILE" ]]; then
  EXISTING_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "${EXISTING_PID:-}" ]] && kill -0 "$EXISTING_PID" 2>/dev/null; then
    STATUS_CODE="$(http_status)"
    if is_healthy_status "$STATUS_CODE"; then
      echo "MADCORE dev server already running on http://$HOST:$PORT (pid $EXISTING_PID)"
      exit 0
    fi

    echo "MADCORE dev server process exists (pid $EXISTING_PID), but HTTP health check returned ${STATUS_CODE:-unreachable}. Restarting..."
    bash "$ROOT_DIR/scripts/dev-stop.sh" >/dev/null 2>&1 || true
  fi
  rm -f "$PID_FILE"
fi

cd "$ROOT_DIR"
echo "Starting MADCORE dev server on http://$HOST:$PORT ..."

if command -v setsid >/dev/null 2>&1; then
  setsid npm run dev -- --hostname "$HOST" --port "$PORT" >"$LOG_FILE" 2>&1 < /dev/null &
  SERVER_PID=$!
else
  nohup npm run dev -- --hostname "$HOST" --port "$PORT" >"$LOG_FILE" 2>&1 < /dev/null &
  SERVER_PID=$!
fi

echo "$SERVER_PID" >"$PID_FILE"

READY=0
echo "Waiting for server to accept connections ..."
for _ in $(seq 1 45); do
  STATUS_CODE="$(http_status)"
  if is_healthy_status "$STATUS_CODE"; then
    READY=1
    break
  fi
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    break
  fi
  sleep 1
done

if [[ "$READY" -ne 1 ]]; then
  echo "MADCORE dev server did not become ready. Recent log:"
  tail -n 60 "$LOG_FILE" 2>/dev/null || true
  exit 1
fi

for route in / /thanks /privacy; do
  echo "Warming $route ..."
  curl -fsS -o /dev/null "http://$HOST:$PORT$route" 2>/dev/null || true
done

echo "MADCORE dev server is ready: http://$HOST:$PORT"
echo "PID: $SERVER_PID"
echo "Log: $LOG_FILE"
