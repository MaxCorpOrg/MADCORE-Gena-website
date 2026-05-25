# CHECKPOINT 2026-05-25 MOBILE CHAT CTA LIVE DEPLOY

## Что найдено

- Локальная мобильная правка для `Перейти в чат Telegram` и `Перейти в чат Max` уже была готова и подтверждена в браузере.
- Пользователь подтвердил внешний вид и дал команду выкатить правку на боевой домен `https://madcore.site`.

## Что сделано

- Перед заменой создана резервная копия:
  - `/opt/madcore-gena/.backup/20260525-132139-mobile-chat-cta-row`
- На сервер в `/opt/madcore-gena/src/app/globals.css` передан только один измененный файл:
  - `src/app/globals.css`
- После замены выполнены:
  - `docker compose build app`
  - `docker compose up -d app`
- Контейнер `madcore_gena_app` успешно пересоздан.

## Что проверено

- `docker inspect --format "{{.State.Health.Status}}" madcore_gena_app` вернул `healthy`.
- `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site` проходит.
- `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site` проходит.
- В боевом CSS-бандле `https://madcore.site/_next/static/css/867178918cbefdda.css` найдены правила для:
  - двухколоночного мобильного ряда `cta-grid--with-chat-links`;
  - скрытия `Открытый чат` внутри `cta-telegram-chat` и `cta-max-chat`;
  - уменьшенного `font-size` заголовка этих двух мобильных CTA.

## Что осталось

- Отдельные следующие приоритеты проекта не меняются:
  - прикладные воронки Яндекс.Метрики;
  - при необходимости установка `HeatmapSessionRecording` для Matomo.

## Следующая точка продолжения

1. Если понадобится еще мобильная полировка hero-блока, начинать с live-проверки на `https://madcore.site`, потому что текущая компактная раскладка уже выкачена.
2. Если будут новые точечные UI-правки, по возможности сохранять тот же подход:
   - резервная копия;
   - передача только затронутых файлов;
   - `docker compose build app`;
   - `docker compose up -d app`;
   - smoke-проверки.
