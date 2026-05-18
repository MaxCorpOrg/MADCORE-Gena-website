#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="$ROOT_DIR/.tmp/dev.pid"

if [[ ! -f "$PID_FILE" ]]; then
  if pgrep -f 'next dev --turbopack --hostname 127.0.0.1 --port 3000|next dev --hostname 127.0.0.1 --port 3000' >/dev/null 2>&1; then
    pkill -TERM -f 'next dev --turbopack --hostname 127.0.0.1 --port 3000|next dev --hostname 127.0.0.1 --port 3000' || true
    sleep 1
    pkill -KILL -f 'next dev --turbopack --hostname 127.0.0.1 --port 3000|next dev --hostname 127.0.0.1 --port 3000' || true
    echo "Stopped MADCORE dev server via fallback process lookup."
    exit 0
  fi

  echo "No MADCORE dev PID file found."
  exit 0
fi

PID="$(cat "$PID_FILE" 2>/dev/null || true)"
if [[ -z "${PID:-}" ]]; then
  rm -f "$PID_FILE"
  echo "Empty PID file removed."
  exit 0
fi

if kill -0 "$PID" 2>/dev/null; then
  kill -- "-$PID" 2>/dev/null || kill "$PID" 2>/dev/null || true
  sleep 1
  pkill -TERM -f 'next dev --turbopack --hostname 127.0.0.1 --port 3000|next dev --hostname 127.0.0.1 --port 3000' || true
  sleep 1
  pkill -KILL -f 'next dev --turbopack --hostname 127.0.0.1 --port 3000|next dev --hostname 127.0.0.1 --port 3000' || true
  echo "Stopped MADCORE dev server (group/pid $PID)."
else
  echo "Process $PID was not running."
fi

rm -f "$PID_FILE"
