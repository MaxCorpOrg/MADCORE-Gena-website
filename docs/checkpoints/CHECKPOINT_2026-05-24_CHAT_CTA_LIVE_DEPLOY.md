# MADCORE Gena Checkpoint `2026-05-24` Chat CTA Live Deploy

## Что найдено

- локальная hero CTA-правка была готова, но в live на `https://madcore.site` еще не была выкачена;
- текущий production до выкладки продолжал отдавать старую hero-кнопку `Получить консультацию`;
- основной соседний сайт `https://madcore-kavkaz.ru` оставался отдельным и до выкладки отдавал свой счетчик `109236645`.

## Что сделано

- перед заменой файлов на сервере создана резервная копия:
  - `/opt/madcore-gena/.backup/20260524-122052`
- на сервер в `/opt/madcore-gena` точечно переданы только файлы, нужные для hero CTA:
  - `src/components/CtaButtons.tsx`
  - `src/config/site.ts`
  - `src/app/page.tsx`
  - `src/app/thanks/page.tsx`
  - `src/app/globals.css`
- `madcore_gena_app` пересобран:
  - `docker compose build app`
  - `docker compose up -d app`
- после выкладки live `https://madcore.site` начал отдавать две новые hero-кнопки:
  - `Перейти в чат Telegram`
  - `Перейти в чат Max`

## Что проверено

- `madcore_gena_app` после пересоздания перешел в `healthy`;
- `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site` проходит;
- `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site` проходит;
- `https://madcore.site/api/health` отвечает `200`;
- `https://gena.madcore-kavkaz.ru/api/health` отвечает `200`;
- live HTML `https://madcore.site` содержит:
  - `Перейти в чат Telegram`
  - `Перейти в чат Max`
- `https://madcore.site` отдает отдельный счетчик `109282367`;
- `https://madcore-kavkaz.ru` продолжает отдавать свой отдельный счетчик `109236645`.

## Важное наблюдение

- legacy preview `https://gena.madcore-kavkaz.ru` остается доступен для просмотра страниц и `api/health`;
- но его маршрут `/go` сейчас редиректит на `https://madcore.site/safe`;
- поэтому полный `./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru` теперь падает на проверке redirect host и не должен использоваться как единственный индикатор исправности preview-контура.

## Что дальше

1. При необходимости обновить host/URL в Метрике и Matomo под финальный домен `madcore.site`.
2. Если legacy preview нужен как полностью самостоятельный запасной контур, отдельно вернуть ему собственный `/go`-redirect без ухода на `madcore.site`.
3. Если нужно, отдельной задачей убрать текст `Получить консультацию` уже не только из hero, но и из формы ниже по странице.
