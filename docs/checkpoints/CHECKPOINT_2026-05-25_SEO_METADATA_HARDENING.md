# Checkpoint `2026-05-25` `seo metadata hardening`

## Что сделано

- В отдельной ветке `seo-hardening` выполнен следующий safe-layer SEO без изменения визуала:
  - добавлена поддержка `GOOGLE_SITE_VERIFICATION` через metadata;
  - `.env.example` и `.env.preview.example` расширены переменной `GOOGLE_SITE_VERIFICATION`;
  - `JSON-LD` расширен до схем:
    - `WebSite`
    - `Organization`
    - `Product`
  - в `Product` добавлен `Offer` с ценой в `RUB`;
  - `openGraph` и `twitter` дополнены более явными SEO-значениями.

## Что проверено

- В ветке `seo-hardening` проходят:
  - `npm run lint`
  - `npm run build`

## Важное состояние

- Эти изменения пока существуют только в ветке `seo-hardening`.
- На production `https://madcore.site` они еще не выкатывались.
- Для включения верификации Search Console теперь не нужен новый код: достаточно позже заполнить `GOOGLE_SITE_VERIFICATION`.

## Следующий шаг

- Получить verification token из `Google Search Console`.
- Подставить его в `GOOGLE_SITE_VERIFICATION`.
- После этого уже можно отдельно решать момент merge и выкладки SEO-ветки.
