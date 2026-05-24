# CHECKPOINT 2026-05-24 LEGACY DOMAIN RETIREMENT

## Что найдено

- Основной рабочий домен проекта уже давно стал `https://madcore.site`, но старый временный домен `https://gena.madcore-kavkaz.ru` все еще оставался в активном контуре.
- Старый домен использовался:
  - в общем ingress `nginx` как полноценный host с proxy на `genaapp:3000`;
  - в Matomo `site id = 2` как дополнительный URL сайта;
  - в project defaults, smoke-скриптах, helper-сценариях и части документации.
- Это создавало лишнюю двусмысленность: сайт уже должен жить только на `madcore.site`, но внутренние defaults все еще допускали старый домен как рабочий.

## Что сделано

- Внутри проекта `/home/max/MADCORE RF` defaults переведены на `madcore.site`:
  - `src/config/site.ts`
  - `.env.preview.example`
  - `scripts/production-smoke.sh`
  - `scripts/production-adtech-smoke.sh`
  - `scripts/print-yandex-direct-campaign-links.sh`
  - `scripts/server-adtech-readiness.sh`
  - `scripts/server-activate-adtech.sh`
  - `scripts/export-production-deliverables.sh`
- Обновлены текущие рабочие документы и agent-файлы, чтобы они больше не описывали `gena.madcore-kavkaz.ru` как рабочий или запасной домен сайта.
- В общем ingress на сервере старый домен выведен из активного контура:
  - `gena.madcore-kavkaz.ru` -> `301` на `https://madcore.site`
  - `www.gena.madcore-kavkaz.ru` -> `301` на `https://madcore.site`
- При этом основной production `madcore.site` и соседний сайт `madcore-kavkaz.ru` не затронуты по содержимому и маршрутизации.
- Из Matomo `site id = 2` удалены legacy URL старого домена, оставлены только:
  - `https://madcore.site`
  - `https://www.madcore.site`

## Что проверено

- `npm run lint`
- `npm run build`
- `bash -n` для измененных shell-сценариев
- `bash ./scripts/repo-adtech-audit.sh`
- `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site`
- `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site`
- `https://gena.madcore-kavkaz.ru` отдает `301` на `https://madcore.site/`
- `https://www.gena.madcore-kavkaz.ru` отдает `301` на `https://madcore.site/`
- `https://madcore.site/api/health` отвечает `200`
- `https://madcore-kavkaz.ru/api/health` отвечает `200`
- `madcore.site` по-прежнему отдает:
  - обычный `X-Frame-Options: SAMEORIGIN`
  - снятие `X-Frame-Options` для referer Яндекс.Метрики

## Что осталось

- Если нужен встроенный session replay и тепловые карты именно в Matomo, нужно отдельно ставить `HeatmapSessionRecording`.
- Если нужно окончательно убрать старый домен уже не только логически, но и на DNS/сертификатном уровне, это отдельная server-side задача и не требуется для текущей рабочей схемы.

## Следующая точка продолжения

1. Считать единственным рабочим доменом проекта `https://madcore.site`.
2. Не возвращать `gena.madcore-kavkaz.ru` в defaults, helper-ссылки и документацию.
3. Если понадобится, отдельно планировать только:
   - расширение Matomo модулем `HeatmapSessionRecording`;
   - либо позднюю инфраструктурную уборку DNS/сертификата legacy-домена.
