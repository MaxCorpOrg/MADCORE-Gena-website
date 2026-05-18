#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="${ROOT_DIR}/docs/deliverables"
TARGET_URL="${1:-${PUBLIC_BASE_URL:-https://gena.madcore-kavkaz.ru}}"
STAMP="${2:-$(date +%F)}"
SCREENSHOT_WIDTH="${SCREENSHOT_WIDTH:-1440}"
SCREENSHOT_HEIGHT="${SCREENSHOT_HEIGHT:-4200}"

CHROME_BIN="${CHROME_BIN:-}"
if [[ -z "${CHROME_BIN}" ]]; then
  CHROME_BIN="$(command -v google-chrome || command -v chromium || command -v chromium-browser || true)"
fi

if [[ -z "${CHROME_BIN}" ]]; then
  echo "Chrome/Chromium not found. Set CHROME_BIN or install google-chrome/chromium." >&2
  exit 1
fi

mkdir -p "${OUTPUT_DIR}"

PNG_PATH="${OUTPUT_DIR}/MADCORE-Gena-site-highres-review-${STAMP}.png"
PDF_PATH="${OUTPUT_DIR}/MADCORE-Gena-site-client-review-${STAMP}.pdf"
PROFILE_DIR="$(mktemp -d)"
trap 'rm -rf "${PROFILE_DIR}"' EXIT

COMMON_FLAGS=(
  --headless=new
  --disable-gpu
  --no-sandbox
  --hide-scrollbars
  --user-data-dir="${PROFILE_DIR}"
  --virtual-time-budget=8000
)

echo "Exporting PNG to ${PNG_PATH}"
"${CHROME_BIN}" \
  "${COMMON_FLAGS[@]}" \
  --window-size="${SCREENSHOT_WIDTH},${SCREENSHOT_HEIGHT}" \
  --screenshot="${PNG_PATH}" \
  "${TARGET_URL}"

python3 - "${PNG_PATH}" <<'PY'
from pathlib import Path
from PIL import Image
import sys

png_path = Path(sys.argv[1])
image = Image.open(png_path).convert("RGB")
width, height = image.size
pixels = image.load()

bottom = height
threshold = 245

while bottom > 0:
    row_is_blank = True
    y = bottom - 1
    for x in range(width):
        r, g, b = pixels[x, y]
        if not (r >= threshold and g >= threshold and b >= threshold):
            row_is_blank = False
            break
    if not row_is_blank:
        break
    bottom -= 1

if bottom != height and bottom > 0:
    image.crop((0, 0, width, bottom)).save(png_path)
PY

echo "Exporting PDF to ${PDF_PATH}"
"${CHROME_BIN}" \
  "${COMMON_FLAGS[@]}" \
  --print-to-pdf="${PDF_PATH}" \
  --print-to-pdf-no-header \
  "${TARGET_URL}"

echo "Done:"
echo "  ${PNG_PATH}"
echo "  ${PDF_PATH}"
