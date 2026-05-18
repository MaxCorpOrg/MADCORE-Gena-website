# MADCORE Gena Final Checkpoint 2026-05-18

## Что завершено на этом этапе

- создан и отделен самостоятельный проект `MADCORE Gena` в `/home/max/MADCORE RF`;
- контакты, CTA и lead-flow переведены на новые значения:
  - `+7-904-244-04-44`
  - `https://t.me/vorgesar`
  - `https://max.ru/u/f9LHodD0cOIXADxaRo9U9W_VHmDuRL5fMKsJO5O9YAs5rg0iZYqYmXKw0dw`
- tracking разведен на `madcore_gena_*`;
- подготовлены отдельные deployment defaults и container names;
- hero, product и wordmark переведены в серебряный стиль без гор;
- активные документы нового проекта очищены, legacy-материалы убраны в `docs/archive-origin/`;
- локальный `git` инициализирован и подключен к `git@github.com:MaxCorpOrg/MADCORE-Gena-website.git`.

## Что подтверждено

- `npm run lint` проходит;
- `npm run build` проходит;
- `bash ./scripts/repo-adtech-audit.sh` проходит;
- локальный production-preview через `next start` и браузерный скриншот подтверждают:
  - серебряный visual;
  - кнопки `Telegram`, `WhatsApp`, `MaX`, `Позвонить`;
  - отсутствие горных ассетов на первом экране.

## Что еще остается внешним шагом

- отдельный Telegram-бот и его токены;
- отдельный счетчик Яндекс.Метрики;
- отдельный `MATOMO_SITE_ID`;
- production `.env`;
- server-side deployment в `/opt/madcore-gena`;
- публичный доменный proxy для `gena.madcore-kavkaz.ru`.
