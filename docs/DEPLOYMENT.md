# MADCORE Gena Deployment

Обновлено: `2026-05-30` `live ready gena image deploy`

## Кратко

- сервер: `151.247.197.153`
- server directory проекта: `/opt/madcore-gena`
- production:
  - `https://madcore.site`
  - `https://www.madcore.site`
- legacy redirect:
  - `https://gena.madcore-kavkaz.ru` -> `https://madcore.site`
  - `https://www.gena.madcore-kavkaz.ru` -> `https://madcore.site`
- production TLS для `madcore.site` выпущен до `2026-08-21`
- preview TLS выпущен до `2026-08-16`

`madcore.site` является текущим production-доменом проекта. Старый временный домен `gena.madcore-kavkaz.ru` больше не используется как рабочий адрес сайта и должен только переводить трафик на `madcore.site`.

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
- старый временный домен `gena.madcore-kavkaz.ru` должен редиректить на `https://madcore.site`.

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
- `2026-05-25` live-правка мобильного ряда chat CTA выполнена точечно:
  - перед заменой создан backup `/opt/madcore-gena/.backup/20260525-132139-mobile-chat-cta-row`;
  - на сервер передан только `src/app/globals.css`;
  - затем выполнены:
    - `docker compose build app`
    - `docker compose up -d app`
  - `madcore_gena_app` после пересоздания снова перешел в `healthy`;
  - боевой CSS-бандл `madcore.site` уже содержит мобильные правила для:
    - компактного ряда `Перейти в чат Telegram` и `Перейти в чат Max`
    - скрытия `Открытый чат` внутри этих двух мобильных CTA;
- `2026-05-25` выполнена точечная performance-выкладка:
  - перед заменой создан backup `/opt/madcore-gena/.backup/20260525-140649-performance-and-webvisor-review`;
  - на сервер точечно переданы:
    - `next.config.ts`
    - `src/app/page.tsx`
    - `src/app/globals.css`
    - `src/components/MadcoreWordmark.tsx`
    - `public/images/background-metallic-brushed-v1.webp`
    - `public/images/background-metallic-mobile-v1.webp`
  - затем выполнены:
    - `docker compose build app`
    - `docker compose up -d app`
  - `madcore_gena_app` после пересоздания снова перешел в `healthy`;
  - live HTML `madcore.site` после этой правки preload-ит только hero-image, а тяжелые background-assets отдаются уже как `.webp`;
- `2026-05-25` выполнена точечная metadata-выкладка:
  - перед заменой создан backup `/opt/madcore-gena/.backup/20260525-141309-metadata-title-fix`;
  - на сервер передан только `src/config/site.ts`;
  - затем выполнены:
    - `docker compose build app`
    - `docker compose up -d app`
  - `madcore_gena_app` после пересоздания снова перешел в `healthy`;
  - live `https://madcore.site` уже отдает `<title>MADCORE 2.0 - консультация и заказ</title>`;
- `2026-05-28` выполнена точечная live-выкладка обновленных hero/product изображений:
  - перед заменой создан backup `/opt/madcore-gena/.backup/20260528-115831-hero-product-image-refresh`;
  - на сервер точечно переданы:
    - `src/app/layout.tsx`
    - `src/app/page.tsx`
    - `src/config/site.ts`
    - `public/images/hero-metallic-premium-v1.png`
    - `public/images/hero-metallic-premium-v1.avif`
    - `public/images/product-metallic-card-v2.png`
    - `public/images/product-metallic-card-v2.avif`
  - затем выполнены:
    - `docker compose build app`
    - `docker compose up -d app`
  - `madcore_gena_app` после пересоздания снова перешел в `healthy`;
  - live `https://madcore.site` preload-ит `hero-metallic-premium-v1.avif`;
  - live `https://madcore.site` держит `og:image` и `twitter:image` на `hero-metallic-premium-v1.png`;
  - live product-card использует `product-metallic-card-v2.avif`;
- `2026-05-30` выполнена точечная live-выкладка самого свежего набора `1Г/2Г`:
  - перед заменой создан backup `/opt/madcore-gena/.backup/20260530-131905-ready-gena-image-refresh`;
  - на сервер точечно переданы:
    - `src/app/layout.tsx`
    - `src/app/page.tsx`
    - `src/config/site.ts`
    - `public/images/hero-metallic-premium-v1.png`
    - `public/images/hero-metallic-premium-v1.avif`
    - `public/images/product-metallic-card-v2.png`
    - `public/images/product-metallic-card-v2.avif`
  - затем выполнены:
    - `docker compose build app`
    - `docker compose up -d app`
  - `madcore_gena_app` после пересоздания снова перешел в `healthy`;
  - live `https://madcore.site` использует `hero-metallic-premium-v1.avif` с `quality=44`;
  - live product-card использует `product-metallic-card-v2.avif` после ресайза исходника до `1024x1024`;
  - live metadata сохраняют `hero-metallic-premium-v1.png` как `og:image` и `twitter:image`;
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
- `2026-05-24 analytics hardening` дополнительно подтверждены:
  - счетчик Яндекс.Метрики `109282367` переименован в `MADCORE Gena` и переведен на `madcore.site`;
  - на стороне счетчика включены `webvisor`, `clickmap`, архивирование Вебвизора и `measurement_enabled`;
  - для `madcore.site` в общем ingress добавлено условное снятие `X-Frame-Options` только для referer Яндекс.Метрики;
  - в Matomo `site id = 2` переведен на `madcore.site` и дополнен URL-алиасами для production и legacy preview;
  - в Matomo для `site id = 2` созданы visit custom dimensions `Click ID`, `YCLID`, `UTM Source`, `UTM Medium`, `UTM Campaign`;
  - в Matomo для `site id = 2` созданы manual goals `telegram_click`, `whatsapp_click`, `max_click`, `call_click`, `form_submit`, `lead`;
  - в `/opt/madcore-gena/.env` заполнены `MATOMO_DIMENSION_UTM_MEDIUM=4` и `MATOMO_GOAL_*`;
  - `madcore_gena_app` пересобран и пересоздан с новым analytics runtime.
- `2026-05-24 legacy domain retirement` дополнительно подтверждены:
  - project defaults внутри `/home/max/MADCORE RF` переведены на `madcore.site`;
  - `gena.madcore-kavkaz.ru` и `www.gena.madcore-kavkaz.ru` в общем ingress отдают `301` на `https://madcore.site`;
  - из Matomo `site id = 2` удалены legacy URL старого домена.
- `2026-05-25 mobile chat CTA live deploy` дополнительно подтверждены:
  - `docker inspect` для `madcore_gena_app` вернул `healthy`;
  - `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site` проходит;
  - `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site` проходит;
  - live CSS `/_next/static/css/867178918cbefdda.css` содержит:
    - `grid-template-columns:repeat(2,minmax(0,1fr))`
    - `display:none` для верхней подписи `cta-telegram-chat` и `cta-max-chat`
    - `font-size:.86rem` для их заголовка на мобильной версии;
- `2026-05-25 performance review` дополнительно подтверждены:
  - `npm run lint`;
  - `npm run build`;
  - `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site`;
  - `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site`;
  - home HTML ускорился по `curl`: примерно `0.55s -> 0.42s` по `time_starttransfer`;
  - Lighthouse performance улучшился примерно `0.60 -> 0.83`;
  - LCP улучшился примерно `4.9s -> 2.7s`;
  - `interactive` улучшился примерно `24.4s -> 5.0s`;
  - суммарный сетевой вес страницы в Lighthouse снизился примерно `7.38 MB -> 0.47 MB`;
- `2026-05-28 live hero + product image deploy` дополнительно подтверждены:
  - `docker inspect` для `madcore_gena_app` вернул `healthy`;
  - `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site` проходит;
  - `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site` проходит;
  - live HTML `https://madcore.site` preload-ит `/_next/image?...hero-metallic-premium-v1.avif...`;
  - live HTML `https://madcore.site` отдает:
    - `og:image` -> `https://madcore.site/images/hero-metallic-premium-v1.png`
    - `twitter:image` -> `https://madcore.site/images/hero-metallic-premium-v1.png`
    - product-card -> `/images/product-metallic-card-v2.avif`
  - `https://madcore.site/images/hero-metallic-premium-v1.avif` отвечает `200` и `content-length: 45969`;
  - `https://madcore.site/images/product-metallic-card-v2.avif` отвечает `200` и `content-length: 123892`;
- `2026-05-30 live ready gena image deploy` дополнительно подтверждены:
  - `docker inspect` для `madcore_gena_app` вернул `healthy`;
  - `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site` проходит;
  - `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site` проходит;
  - live HTML `https://madcore.site` использует:
    - hero-image -> `hero-metallic-premium-v1.avif`
    - product-card -> `product-metallic-card-v2.avif`
    - `og:image` -> `https://madcore.site/images/hero-metallic-premium-v1.png`
    - `twitter:image` -> `https://madcore.site/images/hero-metallic-premium-v1.png`
  - `https://madcore.site/images/hero-metallic-premium-v1.avif` отвечает `200` и `content-length: 57826`;
  - `https://madcore.site/images/product-metallic-card-v2.avif` отвечает `200` и `content-length: 51238`;

## Что заполнять в `/opt/madcore-gena/.env`

- отдельные DB-пароли для нового контура;
- `TELEGRAM_BOT_TOKEN` уже задан для `@MadcoreGenaLeadsBot`
- `TELEGRAM_CHAT_ID` уже задан для текущего preview-inbox
- `TELEGRAM_EXTRA_CHAT_IDS` уже задан для дополнительного получателя `@M_a_x_i_m_M_i_k_h_a_i_l_o_v`
- `NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID=109282367`
- `MATOMO_SITE_ID=2`
- `MATOMO_DIMENSION_CLICK_ID=1`
- `MATOMO_DIMENSION_YCLID=2`
- `MATOMO_DIMENSION_UTM_SOURCE=3`
- `MATOMO_DIMENSION_UTM_MEDIUM=4`
- `MATOMO_DIMENSION_UTM_CAMPAIGN=5`
- `MATOMO_GOAL_TELEGRAM_CLICK_ID=1`
- `MATOMO_GOAL_WHATSAPP_CLICK_ID=2`
- `MATOMO_GOAL_MAX_CLICK_ID=3`
- `MATOMO_GOAL_CALL_CLICK_ID=4`
- `MATOMO_GOAL_FORM_SUBMIT_ID=5`
- `MATOMO_GOAL_LEAD_ID=6`
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

Проверка legacy redirect:

```bash
cd /home/max/MADCORE RF
curl -Iks https://gena.madcore-kavkaz.ru
curl -Iks https://www.gena.madcore-kavkaz.ru
```

Ожидаемое поведение:

- оба legacy-адреса должны отдавать `301` на `https://madcore.site`.

Проверка Вебвизора:

```bash
curl -Iks https://madcore.site
curl -Iks -e https://metrika.yandex.ru/ https://madcore.site
```

Ожидаемое поведение:

- без referer Метрики сайт отдает `X-Frame-Options: SAMEORIGIN`;
- с referer Метрики заголовок снимается, чтобы Вебвизор мог открыть страницу.

Важно:

- это снимает текущую iframe-блокировку, но не решает проблему исторических replay после deploy;
- наиболее вероятный оставшийся риск Вебвизора: старые hashed-файлы `/_next/static/*` не сохраняются между сборками, поэтому старые записи после rebuild могут открываться без прежнего CSS/JS.

Проверка общего ingress:

```bash
ssh root@151.247.197.153
docker exec madcore_nginx nginx -t
docker exec madcore_nginx nginx -s reload
```

## Что осталось после cutover

1. Если в Matomo нужны session replay и тепловые карты внутри самой Matomo, отдельно решить установку `HeatmapSessionRecording`.
2. Если receiving-chat будет меняться, обновить `TELEGRAM_CHAT_ID` и повторно проверить live lead notify.
3. Если нужно, чтобы старые replay Яндекс.Вебвизора переживали новые deploy, отдельно внедрить хранение и отдачу прошлых `/_next/static/*` из persistent storage или через fallback ingress-слой.
