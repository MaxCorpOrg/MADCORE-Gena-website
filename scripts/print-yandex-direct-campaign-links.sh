#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${1:-https://gena.madcore-kavkaz.ru}"

base="${BASE_URL%/}/go"

cat <<EOF
# Готовые шаблоны ссылок для Яндекс.Директа

[1] Сайт | Поиск+РСЯ
${base}?src=yandex&cmp=madcore_gena_site&cr={ad_id}&click_id={gbid}&utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_id}&utm_content={ad_id}&utm_term={keyword}&yclid={yclid}

[2] Переход в Telegram | Поиск+РСЯ
${base}?src=yandex&cmp=madcore_gena_telegram&cr={ad_id}&click_id={gbid}&utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_id}&utm_content={ad_id}&utm_term={keyword}&yclid={yclid}

[3] Переход в WhatsApp | Поиск+РСЯ
${base}?src=yandex&cmp=madcore_gena_whatsapp&cr={ad_id}&click_id={gbid}&utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_id}&utm_content={ad_id}&utm_term={keyword}&yclid={yclid}

[4] Переход в MaX | Поиск+РСЯ
${base}?src=yandex&cmp=madcore_gena_max&cr={ad_id}&click_id={gbid}&utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_id}&utm_content={ad_id}&utm_term={keyword}&yclid={yclid}

[5] Телеграм-каналы | Сайт
${base}?src=yandex&cmp=madcore_gena_tg_channels&cr={ad_id}&click_id={gbid}&utm_source=yandex&utm_medium=telegram&utm_campaign={campaign_id}&utm_content={ad_id}&utm_term={keyword}&yclid={yclid}
EOF
