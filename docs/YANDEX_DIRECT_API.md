# MADCORE Gena Yandex Direct API

## Статус

Для `MADCORE Gena` еще не созданы отдельные live-кампании и отдельные ID кампаний. Этот документ фиксирует только новую схему сегментов и разметки.

## Отдельные сегменты

- `madcore_gena_site`
- `madcore_gena_telegram`
- `madcore_gena_whatsapp`
- `madcore_gena_max`
- `madcore_gena_tg_channels`

## Правила

- не использовать старые `cmp` от исходного сайта;
- не смешивать `MADCORE Gena` с кампаниями `MADCORE-website`;
- для `Телеграм-каналов` использовать отдельный сегмент `madcore_gena_tg_channels`;
- для `MaX` использовать отдельный сегмент `madcore_gena_max`.
- не хранить старые live ID кампаний в коде нового репозитория.

## Источник шаблонов ссылок

```bash
./scripts/print-yandex-direct-campaign-links.sh
```

## Конфигурация сценария минус-слов

Сценарий `scripts/sync-yandex-direct-base-negative-keywords.mjs` больше не содержит hardcoded live-ID кампаний. Для работы нужно передать кампании явно через `.env`:

```env
YANDEX_DIRECT_CAMPAIGNS=site:123456789,telegram:123456790,whatsapp:123456791,max:123456792,tg_channels:123456793
```

или через аргументы командной строки:

```bash
node ./scripts/sync-yandex-direct-base-negative-keywords.mjs \
  --campaign site:123456789 \
  --campaign telegram:123456790 \
  --campaign whatsapp:123456791 \
  --campaign max:123456792 \
  --campaign tg_channels:123456793
```
