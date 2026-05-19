# MADCORE Gena Project Status

Обновлено: `2026-05-19`

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
- отдельные CTA и runtime-конфиг переведены на новые контакты `Gena`:
  - `+7-904-244-04-44`
  - `https://t.me/vorgesar`
  - `MaX`
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
- публичный контент целевого preview теперь синхронизирован с `https://madcore-kavkaz.ru/` без изменения фронтенд-архитектуры блоков;
- фраза про самостоятельный контур заменена на:
  - `Мы являемся официальным представителем Madcore`
- сохранен текст:
  - `Премиальный продукт`
  - `Аналогов нет во всем мире`
- через OpenAI Image2 сгенерирован и подключен новый metallic-набор ассетов:
  - `public/images/hero-metallic-premium-v1.png`
  - `public/images/product-metallic-card-v1.png`
  - `public/images/background-metallic-brushed-v1.png`
  - `public/images/favicon-metallic-loop-v1.png`
- точный фирменный wordmark `MADCORE 2.0` сохранен через исходный logo-asset, а металлический вид собран CSS-обработкой без риска испортить написание бренда;
- hero и product-карточка переведены на новый premium metallic visual без гор и без изменения структуры страницы;
- favicon, `icon.png` и `apple-icon.png` заменены на новый металлический знак;
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
- `2026-05-19` в live preview `.env` обновлены публичные overrides:
  - `PRODUCT_NAME=MADCORE 2.0`
  - `PUBLIC_ADDRESS=Наш офис находится в Нальчике, на улице Тарчокова 50, в офисном здании, 2-ой этаж, офис 24.`
- в `/opt/madcore-gena` подняты отдельные контейнеры:
  - `madcore_gena_postgres`
  - `madcore_gena_app`
- `madcore_gena_app` опубликован на `127.0.0.1:3001` и подключен к сети `madcore_default` c alias `genaapp`;
- `docker-compose.yml` теперь явно закрепляет подключение `madcore_gena_app` к внешней сети `madcore_default` с alias `genaapp`, чтобы preview-host не терял routing после `app recreate`;
- через `BotFather` создан отдельный Telegram-бот `@MadcoreGenaLeadsBot`;
- в `/opt/madcore-gena/.env` заполнены `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` для текущей рабочей лички Telegram-аккаунта `AK5`;
- `madcore_gena_app` на VPS пересоздан с новым Telegram-конфигом;
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
- дополнительно для visual refresh `2026-05-19` подтверждены:
  - локальный desktop screenshot после сборки
  - локальный mobile full-page screenshot после сборки
  - live desktop screenshot `https://gena.madcore-kavkaz.ru`
  - live mobile full-page screenshot `https://gena.madcore-kavkaz.ru`
  - `curl` подтвердил отдачу новых `icon.png`, `apple-icon.png` и `favicon.ico`
- live test `2026-05-18` подтвердил полный bot-flow:
  - внутренний `POST http://127.0.0.1:3001/api/lead` на VPS вернул `200` и создал `lead id = 1`;
  - уведомление о новой заявке дошло в `@MadcoreGenaLeadsBot`;
- после обновления Telegram-переменных и фикса сети `genaapp` повторный `./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru` снова проходит;
- дополнительный post-fix live test `2026-05-18` после пересоздания `app` на обновленном `docker-compose.yml` тоже прошел:
  - внутренний `POST http://127.0.0.1:3001/api/lead` вернул `200` и создал `lead id = 2`;
  - уведомление снова пришло в `@MadcoreGenaLeadsBot`;
- подтверждено, что основной сайт `https://madcore-kavkaz.ru` после добавления preview-host остается живым.

## Что еще не завершено

- финальный домен проекта еще не задан;
- финальный cutover с preview-host на постоянный домен еще не выполнен;
- после выбора финального домена нужно обновить доменные привязки:
  - `SITE_DOMAIN` / `SITE_WWW_DOMAIN` / `PUBLIC_BASE_URL`
  - TLS
  - host-routing ingress
  - при необходимости host в Яндекс.Метрике и URL сайта в Matomo.

## На чем остановились

- публичный silver-preview уже живет на `https://gena.madcore-kavkaz.ru`;
- public copy целевого preview теперь совпадает по смыслу с основным `madcore-kavkaz.ru`, но контакты, аналитика и прием заявок остаются отдельными;
- кодовая база, отдельный runtime, DNS, SSL, Matomo, Метрика и Telegram bot-flow уже разведены;
- следующий приоритет теперь внешний:
  - выбор финального домена;
  - финальный доменный cutover.

## Что делать дальше

1. Выбрать финальный домен проекта.
2. После выбора финального домена заменить preview-host в DNS, TLS, ingress и `.env`.
3. Обновить host/URL в Метрике и Matomo под финальный домен, если проект не остается на текущем preview-поддомене.
4. Если receiving-chat для лидов должен быть не текущая личка `AK5`, запустить нового бота из нужного чата и обновить только `TELEGRAM_CHAT_ID` в `/opt/madcore-gena/.env`.
5. Если понадобится следующий creative-step, собрать в той же metallic-системе отдельные рекламные баннеры и квадратные performance-visuals под Директ/Telegram.
