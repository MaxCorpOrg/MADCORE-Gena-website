# MADCORE Gena Live Preview Checkpoint 2026-05-18

## Что завершено на этом этапе

- создан и отделен самостоятельный проект `MADCORE Gena` в `/home/max/MADCORE RF`;
- контакты, CTA и lead-flow переведены на новые значения:
  - `+7-904-244-04-44`
  - `https://t.me/vorgesar`
  - `https://max.ru/u/f9LHodD0cOIXADxaRo9U9W_VHmDuRL5fMKsJO5O9YAs5rg0iZYqYmXKw0dw`
- tracking разведен на `madcore_gena_*`;
- hero, product и wordmark переведены в серебряный стиль без гор;
- создан отдельный счетчик Яндекс.Метрики `109282367` и заведены восемь отдельных JS-целей проекта;
- создан отдельный Matomo сайт `MADCORE Gena preview` с `site id = 2`;
- через Timeweb DNS подняты:
  - `gena.madcore-kavkaz.ru`
  - `www.gena.madcore-kavkaz.ru`
- на сервере создан `/opt/madcore-gena` и развернут отдельный runtime:
  - `madcore_gena_postgres`
  - `madcore_gena_app`
- выпущен TLS для preview-host, действующий до `2026-08-16`;
- общий ingress `madcore_nginx` маршрутизирует preview-host на новый app-контур;
- preview уже живет на `https://gena.madcore-kavkaz.ru`.

## Что подтверждено

- `npm run lint` проходит;
- `npm run build` проходит;
- `bash ./scripts/repo-adtech-audit.sh` проходит;
- `./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru` проходит;
- `METRIKA_COUNTER_ID=109282367 ./scripts/production-adtech-smoke.sh https://gena.madcore-kavkaz.ru` проходит;
- `https://madcore-kavkaz.ru` после включения preview-host остается рабочим.

## Что еще остается внешним шагом

- отдельный Telegram-бот и его токены;
- заполнение `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` в `/opt/madcore-gena/.env`;
- финальный домен проекта;
- финальный cutover с preview-host на постоянный домен.

## Внешние блокеры

- для нового bot-flow пока нет отдельного Telegram bot token;
- после выбора финального домена понадобится отдельный DNS / TLS / ingress шаг под него.
