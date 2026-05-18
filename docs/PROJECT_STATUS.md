# MADCORE Gena Project Status

Обновлено: `2026-05-18`

## Контрольная точка

- проект: `MADCORE Gena`
- локальный путь: `/home/max/MADCORE RF`
- целевой репозиторий: `MaxCorpOrg/MADCORE-Gena-website`
- live preview текущего этапа: `https://gena.madcore-kavkaz.ru`
- `www`: `https://www.gena.madcore-kavkaz.ru`
- отдельная точка развёртывания: `/opt/madcore-gena`
- отдельный счетчик Яндекс.Метрики: `109282367`
- отдельный `MATOMO_SITE_ID`: `2`

## Что уже сделано

- создана самостоятельная копия проекта на базе `MADCORE-website`;
- проект переименован в `MADCORE Gena`;
- контент, CTA и runtime-конфиг переведены на новые контакты и новый бренд;
- добавлен отдельный канал `MaX`;
- lead-flow научен принимать `max` как способ связи;
- client tracking переведен на отдельные cookie и localStorage ключи `madcore_gena_*`;
- dev-store переведен на `.data/madcore-gena-dev-store.json`;
- локальный `git` инициализирован и подключен к `git@github.com:MaxCorpOrg/MADCORE-Gena-website.git`;
- подготовлены отдельные deployment defaults:
  - `madcore_gena_postgres`
  - `madcore_gena_app`
  - `madcore_gena_nginx`
  - `/opt/madcore-gena`
- подготовлены отдельные рекламные `cmp`-шаблоны:
  - `madcore_gena_site`
  - `madcore_gena_telegram`
  - `madcore_gena_whatsapp`
  - `madcore_gena_max`
  - `madcore_gena_tg_channels`
- визуальный слой переведен в серебряное направление;
- hero, product и wordmark переведены на серебряные ассеты без гор;
- активная документация нового проекта отделена от legacy-контекста, архив исходных материалов вынесен в `docs/archive-origin/`;
- добавлен отдельный preview-шаблон окружения `.env.preview.example`;
- через API Яндекс.Метрики создан отдельный счетчик `109282367` для `gena.madcore-kavkaz.ru`;
- в счетчике `109282367` заведены отдельные JS-цели:
  - `telegram_click`
  - `whatsapp_click`
  - `max_click`
  - `call_click`
  - `consultation_click`
  - `form_start`
  - `form_submit`
  - `lead`
- в общей инсталляции Matomo создан отдельный сайт `MADCORE Gena preview` с `site id = 2`;
- через Timeweb DNS заведены preview-записи:
  - `gena.madcore-kavkaz.ru -> 151.247.197.153`
  - `www.gena.madcore-kavkaz.ru -> 151.247.197.153`
- на сервере создана отдельная директория `/opt/madcore-gena`;
- в `/opt/madcore-gena/.env` заполнены отдельные preview-настройки:
  - `MATOMO_SITE_ID=2`
  - `NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID=109282367`
  - отдельные пароли для нового runtime-контура
- в `/opt/madcore-gena` подняты отдельные контейнеры:
  - `madcore_gena_postgres`
  - `madcore_gena_app`
- `madcore_gena_app` опубликован на `127.0.0.1:3001` и подключен к сети `madcore_default` c alias `genaapp`;
- общий ingress основного сайта расширен под preview-host без изменения бизнес-логики основного `MADCORE`;
- выпущен отдельный Let's Encrypt сертификат для:
  - `gena.madcore-kavkaz.ru`
  - `www.gena.madcore-kavkaz.ru`
- сертификат preview-контура действует до `2026-08-16`;
- успешно пройдены:
  - `npm run lint`
  - `npm run build`
  - `bash ./scripts/repo-adtech-audit.sh`
  - `./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru`
  - `METRIKA_COUNTER_ID=109282367 ./scripts/production-adtech-smoke.sh https://gena.madcore-kavkaz.ru`
- подтверждено, что основной сайт `https://madcore-kavkaz.ru` после добавления preview-host остается живым.

## Что еще не завершено

- отдельный Telegram-бот еще не создан;
- `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` в preview `.env` пока пустые, поэтому live preview принимает лиды, но Telegram notify path пропускается;
- финальный домен проекта еще не задан;
- финальный cutover с preview-host на постоянный домен еще не выполнен;
- после выбора финального домена нужно обновить доменные привязки:
  - `SITE_DOMAIN` / `SITE_WWW_DOMAIN` / `PUBLIC_BASE_URL`
  - TLS
  - host-routing ingress
  - при необходимости host в Яндекс.Метрике и URL сайта в Matomo.

## На чем остановились

- публичный silver-preview уже живет на `https://gena.madcore-kavkaz.ru`;
- кодовая база, отдельный runtime, DNS, SSL, Matomo и Метрика уже разведены;
- следующий приоритет теперь внешний:
  - отдельный Telegram-бот;
  - выбор финального домена;
  - финальный доменный cutover.

## Что делать дальше

1. Создать отдельного Telegram-бота и заполнить `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` в `/opt/madcore-gena/.env`.
2. Перезапустить `madcore_gena_app` и проверить реальную отправку test lead в новый bot-flow.
3. После выбора финального домена заменить preview-host в DNS, TLS, ingress и `.env`.
4. Обновить host/URL в Метрике и Matomo под финальный домен, если проект не остается на текущем preview-поддомене.
