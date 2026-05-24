# MADCORE Gena Checkpoint `2026-05-23` Select Dropdown Contrast

## Что изменено

- исправлен контраст раскрывающегося списка в форме консультации;
- для `select.field` включен `color-scheme: dark`;
- для `select.field option` задан темный фон и светлый текст;
- для выбранного и hover-состояния option задан темный синий highlight.

## Что проверено

- локально:
  - `npm run lint`
  - `npm run build`
- на production:
  - `madcore_gena_app` пересобран и пересоздан;
  - live CSS на `https://madcore.site` содержит правила `select.field option`;
  - `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site` проходит.
