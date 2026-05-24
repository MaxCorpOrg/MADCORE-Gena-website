# CHECKPOINT 2026-05-24 ANALYTICS HARDENING

## Что найдено

- `MADCORE Gena` уже имел отдельный счетчик Яндекс.Метрики `109282367` и отдельный Matomo `site id = 2`, но они были доведены не до конца.
- В коде сайта уже были включены `webvisor: true`, `clickmap: true` и клиентская отправка событий в обе системы аналитики.
- На стороне самого счетчика Метрики Вебвизор был не полностью активирован.
- В общем ingress `nginx` сайт `madcore.site` отдавал `X-Frame-Options: SAMEORIGIN`, из-за чего Вебвизор не мог штатно открывать страницу.
- В Matomo `site id = 2` еще жил как preview-site и не имел настроенных custom dimensions и manual goals.
- В текущей Matomo-инсталляции нет плагина `HeatmapSessionRecording`, поэтому встроенный session replay там недоступен.

## Что сделано

- В Яндекс.Метрике счетчик `109282367` переведен в рабочее состояние для `madcore.site`:
  - имя обновлено до `MADCORE Gena`;
  - доменная привязка переведена на `madcore.site`;
  - включены `webvisor`, `clickmap`, архивирование Вебвизора и `measurement_enabled`.
- В общем ingress `/opt/madcore/nginx.conf` добавлено условное снятие `X-Frame-Options` только для referer Яндекс.Метрики на хостах:
  - `madcore.site`
  - `gena.madcore-kavkaz.ru`
- Перед server-side правками сделаны резервные копии:
  - `/opt/madcore/.backup/nginx.conf.analytics-before-20260524-141341`
  - `/opt/madcore-gena/.backup/matomo-analytics-before-20260524-141928.sql`
- В Matomo для `site id = 2` обновлены URL сайта:
  - `https://madcore.site`
  - `https://www.madcore.site`
  - `https://gena.madcore-kavkaz.ru`
  - `https://www.gena.madcore-kavkaz.ru`
- В Matomo настроены visit custom dimensions:
  - `1` -> `Click ID`
  - `2` -> `YCLID`
  - `3` -> `UTM Source`
  - `4` -> `UTM Medium`
  - `5` -> `UTM Campaign`
- В Matomo настроены manual goals:
  - `1` -> `telegram_click`
  - `2` -> `whatsapp_click`
  - `3` -> `max_click`
  - `4` -> `call_click`
  - `5` -> `form_submit`
  - `6` -> `lead`
- Код проекта расширен под Matomo analytics runtime:
  - добавлен `MATOMO_DIMENSION_UTM_MEDIUM`;
  - добавлены `MATOMO_GOAL_*`;
  - client-side tracking теперь делает не только `trackEvent`, но и `trackGoal` для ключевых действий.
- В `/opt/madcore-gena/.env` заполнены актуальные analytics env и после этого `madcore_gena_app` пересобран и пересоздан.

## Что проверено

- `npm run lint`
- `npm run build`
- `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site`
- `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site`
- `https://madcore.site/api/health` отвечает `200`
- `https://madcore-kavkaz.ru/api/health` отвечает `200`
- `madcore.site` для обычного запроса отдает `X-Frame-Options: SAMEORIGIN`
- `madcore.site` для referer Яндекс.Метрики отдает страницу без `X-Frame-Options`
- в контейнере `madcore_gena_app` подтверждено наличие `__madcoreMatomoGoals` и client-side `trackGoal`
- в Matomo `site id = 2` подтверждены новые custom dimensions и manual goals

## Что осталось

- Если legacy preview `https://gena.madcore-kavkaz.ru` должен оставаться полностью самостоятельным запасным контуром, нужно вернуть ему собственный `/go`-redirect без ухода на `madcore.site`.
- Если нужен session replay и тепловые карты внутри самой Matomo, нужно отдельно ставить `HeatmapSessionRecording`.

## Следующая точка продолжения

1. Решить судьбу legacy preview `/go`.
2. Если Matomo должен уметь replay/heatmap сам по себе, отдельно планировать установку `HeatmapSessionRecording`.
3. При следующих выкладках не терять:
   - `MATOMO_DIMENSION_UTM_MEDIUM`
   - `MATOMO_GOAL_*`
   - условное поведение `X-Frame-Options` для referer Яндекс.Метрики
