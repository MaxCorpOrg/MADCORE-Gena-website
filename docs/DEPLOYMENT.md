# MADCORE Gena Deployment

Обновлено: `2026-05-24` `chat CTA live deploy`

## Кратко

- сервер: `151.247.197.153`
- server directory проекта: `/opt/madcore-gena`
- production:
  - `https://madcore.site`
  - `https://www.madcore.site`
- legacy preview:
  - `https://gena.madcore-kavkaz.ru`
  - `https://www.gena.madcore-kavkaz.ru`
- production TLS для `madcore.site` выпущен до `2026-08-21`
- preview TLS выпущен до `2026-08-16`

`madcore.site` является текущим production-доменом проекта. Preview-host оставлен живым как запасной адрес проверки.

## Текущая схема выкладки

Новый проект не забирает себе `80/443` напрямую. Реальная рабочая схема после cutover `2026-05-23` такая:

- в `/opt/madcore-gena` живет отдельный runtime нового проекта;
- `docker compose` проекта поднимает:
  - `madcore_gena_postgres`
  - `madcore_gena_app`
- `madcore_gena_app` опубликован на `127.0.0.1:3001`;
- контейнер `madcore_gena_app` дополнительно подключен к сети `madcore_default` с alias `genaapp`;
- это подключение теперь описано прямо в `docker-compose.yml`, а не держится на ручном `docker network connect`;
- публичный host-routing и TLS выполняет общий ingress основного сайта:
  - файл `/opt/madcore/nginx.conf`
  - контейнер `madcore_nginx`
- production-host `madcore.site` проксируется из общего ingress на `http://genaapp:3000`;
- legacy preview-host `gena.madcore-kavkaz.ru` также проксируется на `http://genaapp:3000`.

Важно: проектный `madcore_gena_nginx` и порты `8081/8444` в кодовой базе остаются подготовленной опцией, но в текущем production не используются как публичная входная точка.

## Что уже сделано на сервере

- создан `/opt/madcore-gena`;
- загружен код проекта;
- создан отдельный `/opt/madcore-gena/.env`;
- в `.env` выставлены:
  - `MATOMO_SITE_ID=2`
  - `NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID=109282367`
  - preview-host значения `SITE_DOMAIN`, `SITE_WWW_DOMAIN`, `PUBLIC_BASE_URL`
- `2026-05-19` в live `.env` обновлены публичные значения:
  - `PRODUCT_NAME=MADCORE 2.0`
  - `PUBLIC_ADDRESS=Наш офис находится в Нальчике, на улице Тарчокова 50, в офисном здании, 2-ой этаж, офис 24.`
- `2026-05-19` на preview выкачен новый metallic visual pack и source-copy с `madcore-kavkaz.ru` без изменения отдельных `Gena`-контактов и аналитики;
- `2026-05-19 round 2` в live `.env` добавлен `SITE_DISPLAY_DOMAIN=madcore.site`;
- `2026-05-19 round 2` на preview выкачены:
  - `public/images/product-metallic-card-v2.png`
  - `public/images/favicon-metallic-round-v1.png`
  - `public/images/madcore-logo-metallic-v2.png`
- `2026-05-20 round 3` на preview выкачены:
  - `public/images/madcore-logo-metallic-v3.png`
  - `public/images/background-metallic-mobile-v1.png`
  - более контрастный текст WhatsApp CTA без изменения layout
- `2026-05-23` выполнен cutover на финальный домен `madcore.site`:
  - DNS `madcore.site` и `www.madcore.site` указывают на `151.247.197.153`;
  - выпущен Let's Encrypt сертификат для `madcore.site` и `www.madcore.site`;
  - общий `madcore_nginx` проксирует `madcore.site` на `genaapp:3000`;
  - `www.madcore.site` редиректит на `https://madcore.site/`;
  - в `/opt/madcore-gena/.env` выставлены финальные `SITE_DOMAIN`, `SITE_WWW_DOMAIN`, `SITE_CERT_NAME` и `PUBLIC_BASE_URL`;
  - `madcore_gena_app` пересобран с финальным `PUBLIC_BASE_URL`, чтобы статические metadata, `robots.txt` и `sitemap.xml` использовали `madcore.site`.
- `2026-05-24` live-выкладка hero chat CTA выполнена точечно без массовой синхронизации всего каталога:
  - перед заменой создан backup `/opt/madcore-gena/.backup/20260524-122052`;
  - на сервер переданы только:
    - `src/components/CtaButtons.tsx`
    - `src/config/site.ts`
    - `src/app/page.tsx`
    - `src/app/thanks/page.tsx`
    - `src/app/globals.css`
  - после синхронизации выполнены:
    - `docker compose build app`
    - `docker compose up -d app`
  - `madcore_gena_app` после пересоздания перешел в `healthy`;
  - live `https://madcore.site` начал отдавать CTA:
    - `Перейти в чат Telegram`
    - `Перейти в чат Max`
- через `BotFather` создан отдельный бот `@MadcoreGenaLeadsBot`;
- в `.env` заполнены `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` для текущей рабочей лички Telegram-аккаунта `AK5`;
- `2026-05-23` добавлен второй получатель Telegram-уведомлений по профилю `@M_a_x_i_m_M_i_k_h_a_i_l_o_v` через `TELEGRAM_EXTRA_CHAT_IDS`;
- `src/lib/telegram.ts` теперь отправляет уведомление во все chat id из `TELEGRAM_CHAT_ID` и `TELEGRAM_EXTRA_CHAT_IDS`;
- выполнена сборка и запущены `postgres + app`;
- `madcore_gena_app` пересоздан с новым Telegram-конфигом;
- через Timeweb DNS подняты:
  - `gena.madcore-kavkaz.ru`
  - `www.gena.madcore-kavkaz.ru`
- через Certbot выпущен сертификат `gena.madcore-kavkaz.ru`;
- общий `madcore_nginx` расширен под новый preview-host.
- live test `2026-05-18` подтвердил:
  - `POST http://127.0.0.1:3001/api/lead` возвращает `200`;
  - notify о заявке приходит в `@MadcoreGenaLeadsBot`.
- live test `2026-05-23` после добавления второго получателя подтвердил:
  - `POST https://madcore.site/api/lead` вернул `200` и создал `lead id = 4`;
  - Telegram notify вернул `ok: true` для настроенного списка получателей.
- `2026-05-19` после обновления frontend-визуала повторно подтверждены:
  - `./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru`
  - `METRIKA_COUNTER_ID=109282367 ./scripts/production-adtech-smoke.sh https://gena.madcore-kavkaz.ru`
  - live desktop/mobile screenshots с preview-host
- `2026-05-19 round 2` дополнительно подтверждены:
  - hero-chip `madcore.site`
  - отсутствие блока `Наш адрес`
  - live round favicon
- `2026-05-20 round 3` дополнительно подтверждены:
  - `./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru`
  - `METRIKA_COUNTER_ID=109282367 ./scripts/production-adtech-smoke.sh https://gena.madcore-kavkaz.ru`
  - live HTML с `madcore-logo-metallic-v3.png`
  - live desktop screenshot с новым chrome-wordmark
  - live mobile screenshot без яркой правой полосы
- `2026-05-23 domain cutover` дополнительно подтверждены:
  - `https://madcore.site/` отвечает `200`;
  - `https://www.madcore.site/` отдает `301` на `https://madcore.site/`;
  - `https://madcore.site/api/health` отвечает `200`;
  - `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site` проходит;
  - `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site` проходит;
  - `robots.txt`, `sitemap.xml`, `og:image` и `twitter:image` отдают `https://madcore.site`;
  - preview-host `https://gena.madcore-kavkaz.ru` и основной `https://madcore-kavkaz.ru` продолжают отвечать.
- `2026-05-24 chat CTA live deploy` дополнительно подтверждены:
  - `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site` проходит;
  - `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site` проходит;
  - `https://madcore.site/api/health` отвечает `200`;
  - `https://gena.madcore-kavkaz.ru/api/health` отвечает `200`;
  - live HTML `https://madcore.site` отдает `Перейти в чат Telegram` и `Перейти в чат Max`;
  - основной соседний сайт `https://madcore-kavkaz.ru` по-прежнему отдает отдельный счетчик `109236645`.

## Что заполнять в `/opt/madcore-gena/.env`

- отдельные DB-пароли для нового контура;
- `TELEGRAM_BOT_TOKEN` уже задан для `@MadcoreGenaLeadsBot`
- `TELEGRAM_CHAT_ID` уже задан для текущего preview-inbox
- `TELEGRAM_EXTRA_CHAT_IDS` уже задан для дополнительного получателя `@M_a_x_i_m_M_i_k_h_a_i_l_o_v`
- `NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID=109282367`
- `MATOMO_SITE_ID=2`
- `SITE_DOMAIN=madcore.site`
- `SITE_WWW_DOMAIN=www.madcore.site`
- `SITE_CERT_NAME=madcore.site`
- `PUBLIC_BASE_URL=https://madcore.site`

## Текущие команды обслуживания

Пересборка app после обновления кода:

```bash
ssh root@151.247.197.153
cd /opt/madcore-gena
docker compose build app
docker compose up -d app
```

Пересоздание app после смены Telegram-переменных без rebuild:

```bash
ssh root@151.247.197.153
cd /opt/madcore-gena
docker compose up -d --force-recreate app
```

Проверка контейнеров:

```bash
ssh root@151.247.197.153
cd /opt/madcore-gena
docker compose ps
docker logs --tail=100 madcore_gena_app
docker logs --tail=100 madcore_gena_postgres
```

Проверка production:

```bash
cd /home/max/MADCORE RF
SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site
METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site
```

Проверка legacy preview:

```bash
cd /home/max/MADCORE RF
./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru
METRIKA_COUNTER_ID=109282367 ./scripts/production-adtech-smoke.sh https://gena.madcore-kavkaz.ru
```

Важно: после production cutover и повторной пересборки app маршрут `https://gena.madcore-kavkaz.ru/go?...` сейчас редиректит на `https://madcore.site/safe`. Поэтому полный preview smoke больше не является надежной проверкой на совпадение host redirect. Для legacy preview сейчас корректнее отдельно проверять:

```bash
curl -Iks https://gena.madcore-kavkaz.ru
curl -Iks https://gena.madcore-kavkaz.ru/api/health
curl -Iks https://www.gena.madcore-kavkaz.ru
```

Проверка общего ingress:

```bash
ssh root@151.247.197.153
docker exec madcore_nginx nginx -t
docker exec madcore_nginx nginx -s reload
```

## Что осталось после cutover

1. При необходимости обновить host/URL в Метрике и Matomo с preview-host на `madcore.site`.
2. Если legacy preview должен остаться полностью автономным, вернуть ему собственный `/go`-redirect без ухода на `madcore.site`.
3. Если receiving-chat будет меняться, обновить `TELEGRAM_CHAT_ID` и повторно проверить live lead notify.
