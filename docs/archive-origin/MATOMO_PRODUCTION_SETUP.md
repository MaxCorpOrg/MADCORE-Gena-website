# Matomo в production

## Цель

Подготовить self-hosted Matomo для `MADCORE` без передачи персональных данных клиента в стороннюю аналитику.

## Целевой домен

- `analytics.madcore-kavkaz.ru`

## Что уже подготовлено в коде

- в `docker-compose.yml` добавлены сервисы:
  - `matomo`
  - `matomo_db`
- в `nginx.conf` добавлен отдельный блок для `analytics.madcore-kavkaz.ru`
- в layout подключен компонент `Matomo`
- в `.env.example` добавлены:
  - `MATOMO_URL`
  - `MATOMO_SITE_ID`
  - `MATOMO_HOST`
  - `MATOMO_DIMENSION_*`

## Что уже сделано на сервере

1. Добавлена DNS-запись:
   - `A analytics.madcore-kavkaz.ru -> 151.247.197.153`
2. В production `.env` заполнены:
   - `MATOMO_URL=https://analytics.madcore-kavkaz.ru`
   - `MATOMO_HOST=analytics.madcore-kavkaz.ru`
   - `MATOMO_DB_NAME`
   - `MATOMO_DB_USER`
   - `MATOMO_DB_PASSWORD`
   - `MATOMO_DB_ROOT_PASSWORD`
   - `MATOMO_SITE_ID=1`
3. Подняты сервисы:

```bash
docker compose --profile analytics up -d matomo_db matomo
```

4. Выпущен SSL для:
   - `madcore-kavkaz.ru`
   - `www.madcore-kavkaz.ru`
   - `analytics.madcore-kavkaz.ru`
5. `nginx` и `app` пересобраны и подтверждены в healthy-состоянии.
6. Установщик Matomo завершен:
   - создан суперпользователь
   - создан первый сайт `madcore-kavkaz.ru`
   - присвоен `site id = 1`

## Какие события должны идти в Matomo

- `page_view`
- `scroll_50`
- `scroll_90`
- `telegram_click`
- `whatsapp_click`
- `call_click`
- `consultation_click`
- `form_start`
- `form_submit`
- `lead`
- `thanks_view`
- `safe_view`

## Какие данные можно передавать

- `click_id`
- `yclid`
- `utm_source`
- `utm_campaign`
- `utm_content`
- `utm_term`

## Какие данные передавать нельзя

- имя
- телефон
- комментарий клиента
- Telegram username
- любые персональные данные

## Что подтверждено

- `https://analytics.madcore-kavkaz.ru` отвечает по HTTPS.
- `matomo` и `matomo_db` healthy в `docker compose ps`.
- Live-сайт `https://madcore-kavkaz.ru` отдает:
  - preload `https://analytics.madcore-kavkaz.ru/matomo.js`
- После включения `MATOMO_SITE_ID=1` Matomo уже принял первый live-визит:
  - в панели виден визит с кампанией `matomo_live_check`
  - в базе Matomo подтверждены минимум `1` визит и `1` действие

## Текущее наблюдение

- `Matomo` поднят и работает.
- Отдельно от него у Яндекс.Метрики `code_status` пока еще остается `CS_ERR_UNKNOWN`, несмотря на:
  - наличие кода счетчика в DOM
  - реальные визиты
  - реальные цели
