# MADCORE Gena Agent Checkpoint

Новая сессия должна стартовать не с нуля, а с последней сохраненной контрольной точки по `MADCORE Gena`.

## Последняя рабочая точка

- локальная самостоятельная копия проекта уже создана в `/home/max/MADCORE RF`;
- проектный бренд переведен в `MADCORE Gena`;
- серебряный UI-контур, новые контакты и `MaX` заведены в кодовую базу;
- tracking разведен на `madcore_gena_*`;
- production уже живет на `https://madcore.site`;
- legacy preview остается доступен на `https://gena.madcore-kavkaz.ru`;
- hero CTA на production уже выкачен в live:
  - вместо широкой кнопки `Получить консультацию` в hero стоят две отдельные кнопки:
    - `Перейти в чат Telegram`
    - `Перейти в чат Max`
  - мобильный порядок CTA зафиксирован как:
    - `WhatsApp -> Telegram -> MaX -> чат Telegram -> чат Max -> звонок`;
- на сервере уже есть отдельная точка развёртывания `/opt/madcore-gena`;
- в Метрике уже существует отдельный счетчик `109282367`;
- в Matomo уже существует отдельный `site id = 2`;
- TLS для `madcore.site` уже выпущен до `2026-08-21`;
- TLS для `gena.madcore-kavkaz.ru` уже выпущен.
- отдельный бот `@MadcoreGenaLeadsBot` уже создан;
- live notify до нового Telegram-бота подтвержден тестовой заявкой.
- `2026-05-23` добавлен дополнительный получатель Telegram-уведомлений `@M_a_x_i_m_M_i_k_h_a_i_l_o_v` через `TELEGRAM_EXTRA_CHAT_IDS`;
- `2026-05-24` live deploy hero CTA подтвержден:
  - `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site` проходит;
  - `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site` проходит;
  - `https://madcore-kavkaz.ru` остался отдельным и не подменился.

## Ключевые незавершенные задачи

- при необходимости перенос receiving-chat на другую личку или группу и обновление `TELEGRAM_CHAT_ID`;
- при необходимости обновление доменных привязок Метрики и Matomo под финальный домен.
- если legacy preview должен оставаться полностью самостоятельным запасным контуром, нужно отдельно вернуть ему собственный `/go`-redirect без ухода на `https://madcore.site/safe`.

## Ограничения

- исходный сайт `/home/max/MADCORE` не ломать;
- не использовать старый production-домен `madcore-kavkaz.ru` как финальный домен нового сайта;
- не переиспользовать старый номер телефона, старые `cmp` и старые client tracking keys;
- не коммитить секреты.
- помнить, что `https://gena.madcore-kavkaz.ru` сейчас жив как запасной адрес просмотра, но его `/go` уже не является независимым от production-домена.
