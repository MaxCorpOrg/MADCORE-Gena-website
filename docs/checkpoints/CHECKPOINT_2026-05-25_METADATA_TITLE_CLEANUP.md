# Checkpoint `2026-05-25` `metadata title cleanup`

## Что исправлено

- Найден источник поискового title с лишней фразой `на Северном Кавказе`.
- Проблема была в `src/config/site.ts`, где `siteTitle` был задан как:
  - `MADCORE 2.0 - консультация и заказ на Северном Кавказе`
- `siteTitle` изменен на:
  - `MADCORE 2.0 - консультация и заказ`

## Что сделано на live

- Перед заменой создан backup:
  - `/opt/madcore-gena/.backup/20260525-141309-metadata-title-fix`
- На сервер точечно передан только:
  - `src/config/site.ts`
- После этого выполнены:
  - `docker compose build app`
  - `docker compose up -d app`

## Что подтверждено

- `npm run lint` проходит.
- `npm run build` проходит.
- `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site` проходит.
- `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site` проходит.
- `madcore_gena_app` после пересборки имеет статус `healthy`.
- Live HTML `https://madcore.site` уже отдает:
  - `<title>MADCORE 2.0 - консультация и заказ</title>`

## Важное замечание

- Google и другие поисковики могут еще какое-то время показывать старый заголовок в выдаче из-за собственного кеша и переобхода.
- Текущий сайт уже исправлен; теперь обновление выдачи зависит от следующей переиндексации страницы.
