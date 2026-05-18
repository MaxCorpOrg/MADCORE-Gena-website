#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FAILURES=0

check_file() {
  local path="$1"
  if [[ -f "$ROOT_DIR/$path" ]]; then
    printf 'OK   file %s\n' "$path"
  else
    printf 'FAIL missing file %s\n' "$path" >&2
    FAILURES=$((FAILURES + 1))
  fi
}

check_match() {
  local path="$1"
  local pattern="$2"
  local label="$3"

  if rg -q "$pattern" "$ROOT_DIR/$path"; then
    printf 'OK   %s\n' "$label"
  else
    printf 'FAIL %s\n' "$label" >&2
    FAILURES=$((FAILURES + 1))
  fi
}

check_file "src/components/YandexMetrika.tsx"
check_file "src/app/go/route.ts"
check_file "src/app/admin/leads/page.tsx"
check_file "src/lib/yandex-direct.ts"
check_file "scripts/export-qualified-leads-for-yandex.sh"
check_file "scripts/production-adtech-smoke.sh"
check_file "scripts/print-yandex-direct-campaign-links.sh"
check_file "docs/YANDEX_METRIKA_SETUP.md"
check_file "docs/YANDEX_DIRECT_API.md"
check_file "docs/MATOMO_SETUP.md"
check_file "docs/UTM_YANDEX_DIRECT.md"
check_file "docs/RUNBOOK.md"
check_file "docs/FINAL_REPORT.md"

check_match "src/components/YandexMetrika.tsx" 'getClientID' 'Метрика получает ClientID'
check_match "src/components/YandexMetrika.tsx" 'defer: true' 'Метрика инициализируется с defer: true'
check_match "src/components/YandexMetrika.tsx" 'mc\.yandex\.ru' 'Код Метрики использует mc.yandex.ru'

check_match "src/lib/client-tracking.ts" 'client_id' 'Tracking-модель содержит client_id'
check_match "src/lib/client-tracking.ts" 'yclid' 'Tracking-модель содержит yclid'
check_match "src/lib/client-tracking.ts" 'score_in_bucket' 'Tracking-модель содержит score_in_bucket'
check_match "src/lib/client-tracking.ts" 'reachGoal' 'Клиентская аналитика отправляет reachGoal'

check_match "src/components/TrackClient.tsx" 'sendEvent\("page_view"' 'TrackClient отправляет page_view'
check_match "src/components/TrackClient.tsx" 'sendEvent\("thanks_view"' 'TrackClient отправляет thanks_view'
check_match "src/components/TrackClient.tsx" 'sendEvent\("safe_view"' 'TrackClient отправляет safe_view'
check_match "src/components/TrackClient.tsx" 'sendEvent\("time_15_sec"' 'TrackClient отправляет time_15_sec'
check_match "src/components/TrackClient.tsx" 'sendEvent\("scroll_50"' 'TrackClient отправляет scroll_50'
check_match "src/components/TrackClient.tsx" 'sendEvent\("scroll_90"' 'TrackClient отправляет scroll_90'
check_match "src/components/TrackClient.tsx" 'sendEvent\("offer_view"' 'TrackClient отправляет offer_view'
check_match "src/components/TrackClient.tsx" 'sendEvent\("product_view"' 'TrackClient отправляет product_view'

check_match "src/components/CtaButtons.tsx" 'sendEvent\("telegram_click"' 'CTA отправляет telegram_click'
check_match "src/components/CtaButtons.tsx" 'sendEvent\("whatsapp_click"' 'CTA отправляет whatsapp_click'
check_match "src/components/CtaButtons.tsx" 'sendEvent\("max_click"' 'CTA отправляет max_click'
check_match "src/components/CtaButtons.tsx" 'sendEvent\("call_click"' 'CTA отправляет call_click'
check_match "src/components/CtaButtons.tsx" 'sendEvent\("consultation_click"' 'CTA отправляет consultation_click'

check_match "src/components/LeadForm.tsx" 'sendEvent\("form_start"' 'Форма отправляет form_start'
check_match "src/components/LeadForm.tsx" 'trackExternalAnalyticsGoal\("form_submit"' 'Форма отправляет form_submit в клиентскую аналитику'
check_match "src/components/LeadForm.tsx" 'trackExternalAnalyticsGoal\("lead"' 'Форма отправляет lead в клиентскую аналитику'
check_match "src/components/LeadForm.tsx" 'value="max"' 'Форма поддерживает MaX как способ связи'

check_match "src/app/go/route.ts" 'traffic_gate' 'Маршрут /go пишет событие traffic_gate'
check_match "src/app/go/route.ts" 'decision_in' 'Маршрут /go прокидывает decision_in'
check_match "src/app/go/route.ts" 'score_in_bucket' 'Маршрут /go прокидывает score_in_bucket'
check_match "src/app/go/route.ts" 'yclid' 'Маршрут /go сохраняет yclid'

check_match "src/app/api/lead/route.ts" 'eventName: "form_submit"' 'Серверный lead route пишет form_submit'
check_match "src/app/api/lead/route.ts" 'eventName: "lead"' 'Серверный lead route пишет lead'
check_match "src/app/api/lead/route.ts" 'eventName: "lead_notify"' 'Серверный lead route пишет lead_notify'

check_match "src/app/api/admin/leads/[id]/route.ts" 'eventName: "manager_status"' 'Admin route пишет manager_status'
check_match "src/app/api/admin/leads/[id]/route.ts" 'eventName: "qualified_lead"' 'Admin route пишет qualified_lead'
check_match "src/app/api/admin/leads/[id]/route.ts" 'eventName: "bad_lead"' 'Admin route пишет bad_lead'
check_match "src/app/api/admin/leads/[id]/route.ts" 'eventName: "sale"' 'Admin route пишет sale'

check_match "src/middleware.ts" '/admin/:path\*' 'middleware защищает /admin/*'
check_match "src/middleware.ts" '/api/admin/:path\*' 'middleware защищает /api/admin/*'
check_match "src/lib/admin-auth.ts" 'TextDecoder' 'Basic Auth поддерживает runtime-safe декодирование'

check_match "src/lib/yandex-direct.ts" 'getDirectCampaigns' 'Модуль Директа умеет читать кампании'
check_match "src/lib/yandex-direct.ts" 'getDirectReportTSV' 'Модуль Директа умеет читать отчеты'
check_match "src/lib/yandex-direct.ts" 'buildTrafficRecommendation' 'Модуль Директа строит рекомендации локально'
check_match "src/lib/client-tracking.ts" 'madcore_gena_tracking_v1' 'Tracking использует отдельный localStorage key MADCORE Gena'
check_match "src/lib/client-tracking.ts" 'madcore_gena_tracking' 'Tracking использует отдельный cookie key MADCORE Gena'
check_match "src/lib/client-tracking.ts" 'madcore_gena_session_id' 'Tracking использует отдельный session id MADCORE Gena'
check_match "src/lib/analytics.ts" '"max_click"' 'Список аналитических событий содержит max_click'
check_match "src/lib/validation.ts" '"max"' 'Валидация контактного метода содержит max'
check_match "src/lib/lead-message.ts" 'MaX' 'Lead notification умеет описывать канал MaX'

check_match "scripts/export-qualified-leads-for-yandex.sh" 'ClientID' 'Выгрузка для Яндекса использует ClientID'
check_match "scripts/export-qualified-leads-for-yandex.sh" 'yclid' 'Выгрузка для Яндекса использует yclid'
check_match "scripts/print-yandex-direct-campaign-links.sh" 'madcore_gena_tg_channels' 'Helper для Директа содержит сегмент madcore_gena_tg_channels'
check_match "scripts/print-yandex-direct-campaign-links.sh" 'madcore_gena_max' 'Helper для Директа содержит сегмент madcore_gena_max'
check_match "scripts/print-yandex-direct-campaign-links.sh" 'utm_medium=telegram' 'Helper для Директа помечает Телеграм-каналы как utm_medium=telegram'

check_match ".env.example" '^NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID=$' 'Шаблон env оставляет отдельный счетчик Метрики незаполненным'
check_match ".env.example" '^MATOMO_SITE_ID=$' 'Шаблон env оставляет отдельный Matomo site id незаполненным'
check_match ".env.example" '^TELEGRAM_BOT_TOKEN=$' 'Шаблон env требует отдельный Telegram bot token'
check_match ".env.example" 'MAX_URL=https://max\.ru/' 'Шаблон env содержит ссылку MaX'
check_match ".env.example" 'PUBLIC_PHONE=\+7-904-244-04-44' 'Шаблон env содержит новый телефон'

check_match "src/app/privacy/page.tsx" 'yclid' 'Privacy page упоминает yclid'
check_match "src/app/privacy/page.tsx" 'Яндекс\.Метрику' 'Privacy page упоминает Яндекс.Метрику'
check_match "src/app/privacy/page.tsx" 'MaX' 'Privacy page упоминает MaX'
check_match "src/app/safe/page.tsx" 'index: false' 'Safe page помечена как noindex'

check_match "docs/YANDEX_METRIKA_SETUP.md" 'gena\.madcore-kavkaz\.ru' 'Документ Метрики указывает новый домен'
check_match "docs/YANDEX_METRIKA_SETUP.md" 'max_click' 'Документ Метрики содержит цель max_click'
check_match "docs/YANDEX_DIRECT_API.md" 'madcore_gena_max' 'Документ Директа содержит сегмент madcore_gena_max'
check_match "docs/YANDEX_DIRECT_API.md" 'madcore_gena_tg_channels' 'Документ Директа содержит сегмент madcore_gena_tg_channels'
check_match "docs/MATOMO_SETUP.md" 'MATOMO_SITE_ID' 'Документ Matomo описывает отдельный site id'
check_match "docs/MATOMO_SETUP.md" 'analytics\.madcore-kavkaz\.ru' 'Документ Matomo указывает общий analytics host'
check_match "docs/UTM_YANDEX_DIRECT.md" 'madcore_gena_site' 'Документ UTM содержит сегмент madcore_gena_site'
check_match "docs/UTM_YANDEX_DIRECT.md" 'madcore_gena_max' 'Документ UTM содержит сегмент madcore_gena_max'
check_match "docs/RUNBOOK.md" 'production-smoke\.sh' 'Runbook содержит production smoke'
check_match "docs/RUNBOOK.md" 'production-adtech-smoke\.sh' 'Runbook содержит adtech smoke'
check_match "docs/FINAL_REPORT.md" 'самостоятельный' 'Финальный отчет фиксирует самостоятельный контур'

if [[ "$FAILURES" -gt 0 ]]; then
  printf 'Repo adtech audit failed. failures=%s\n' "$FAILURES" >&2
  exit 1
fi

printf 'Repo adtech audit passed.\n'
