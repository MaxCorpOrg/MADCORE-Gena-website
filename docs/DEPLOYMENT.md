# MADCORE Gena Deployment

Обновлено: `2026-05-18`

## Кратко

- сервер: `151.247.197.153`
- server directory проекта: `/opt/madcore-gena`
- live preview:
  - `https://gena.madcore-kavkaz.ru`
  - `https://www.gena.madcore-kavkaz.ru`
- preview TLS выпущен до `2026-08-16`

Этот адрес нужен как текущий публичный preview для проверки сайта. Финальный домен проекта должен быть заменен позже через `.env`, DNS, SSL и ingress.

## Текущая схема выкладки

Новый проект не забирает себе `80/443` напрямую. Реальная рабочая схема на `2026-05-18` такая:

- в `/opt/madcore-gena` живет отдельный runtime нового проекта;
- `docker compose` проекта поднимает:
  - `madcore_gena_postgres`
  - `madcore_gena_app`
- `madcore_gena_app` опубликован на `127.0.0.1:3001`;
- контейнер `madcore_gena_app` дополнительно подключен к сети `madcore_default` с alias `genaapp`;
- публичный host-routing и TLS выполняет общий ingress основного сайта:
  - файл `/opt/madcore/nginx.conf`
  - контейнер `madcore_nginx`
- preview-host `gena.madcore-kavkaz.ru` проксируется из общего ingress на `http://genaapp:3000`.

Важно: проектный `madcore_gena_nginx` и порты `8081/8444` в кодовой базе остаются подготовленной опцией, но в текущем live preview не используются как публичная входная точка.

## Что уже сделано на сервере

- создан `/opt/madcore-gena`;
- загружен код проекта;
- создан отдельный `/opt/madcore-gena/.env`;
- в `.env` выставлены:
  - `MATOMO_SITE_ID=2`
  - `NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID=109282367`
  - preview-host значения `SITE_DOMAIN`, `SITE_WWW_DOMAIN`, `PUBLIC_BASE_URL`
- `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` пока оставлены пустыми;
- выполнена сборка и запущены `postgres + app`;
- через Timeweb DNS подняты:
  - `gena.madcore-kavkaz.ru`
  - `www.gena.madcore-kavkaz.ru`
- через Certbot выпущен сертификат `gena.madcore-kavkaz.ru`;
- общий `madcore_nginx` расширен под новый preview-host.

## Что заполнять в `/opt/madcore-gena/.env`

- отдельные DB-пароли для нового контура;
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID=109282367`
- `MATOMO_SITE_ID=2`
- `SITE_DOMAIN=gena.madcore-kavkaz.ru`
- `SITE_WWW_DOMAIN=www.gena.madcore-kavkaz.ru`
- `PUBLIC_BASE_URL=https://gena.madcore-kavkaz.ru`

## Текущие команды обслуживания

Пересборка app после обновления кода:

```bash
ssh root@151.247.197.153
cd /opt/madcore-gena
docker compose build app
docker compose up -d app
```

Проверка контейнеров:

```bash
ssh root@151.247.197.153
cd /opt/madcore-gena
docker compose ps
docker logs --tail=100 madcore_gena_app
docker logs --tail=100 madcore_gena_postgres
```

Проверка публичного preview:

```bash
cd /home/max/MADCORE RF
./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru
METRIKA_COUNTER_ID=109282367 ./scripts/production-adtech-smoke.sh https://gena.madcore-kavkaz.ru
```

Проверка общего ingress:

```bash
ssh root@151.247.197.153
docker exec madcore_nginx nginx -t
docker exec madcore_nginx nginx -s reload
```

## Что осталось до финального домена

1. Выбрать финальный домен проекта.
2. Обновить `SITE_DOMAIN`, `SITE_WWW_DOMAIN` и `PUBLIC_BASE_URL` в `/opt/madcore-gena/.env`.
3. Создать новые DNS-записи под финальный домен.
4. Выпустить новый сертификат.
5. Обновить host-routing в `/opt/madcore/nginx.conf`.
6. При необходимости обновить host/URL в Метрике и Matomo.
7. Заполнить токены отдельного Telegram-бота и перепроверить live lead notify.
