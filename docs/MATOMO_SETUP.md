# MADCORE Gena Matomo Setup

## Текущее состояние

`MADCORE Gena` использует общий хост аналитики `https://analytics.madcore-kavkaz.ru`, но уже имеет отдельный сайт внутри общей инсталляции Matomo.

Актуальная точка:

- название сайта: `MADCORE Gena`
- `MATOMO_SITE_ID=2`
- основной URL сайта: `https://madcore.site`
- дополнительные URL сайта:
  - `https://www.madcore.site`
- для `site id = 2` уже настроены visit custom dimensions:
  - `1` -> `Click ID`
  - `2` -> `YCLID`
  - `3` -> `UTM Source`
  - `4` -> `UTM Medium`
  - `5` -> `UTM Campaign`
- для `site id = 2` уже настроены manual goals:
  - `1` -> `telegram_click`
  - `2` -> `whatsapp_click`
  - `3` -> `max_click`
  - `4` -> `call_click`
  - `5` -> `form_submit`
  - `6` -> `lead`

## Как это было сделано

- admin-логин в Matomo подтвержден;
- API-вызов `SitesManager.addSite` возвращал `401 superuser required`;
- поэтому новый сайт был создан не через API, а напрямую в существующей базе Matomo на сервере;
- после вставки записи cache Matomo был очищен;
- `2026-05-24` сайт `site id = 2` переведен с preview-host на production-host `madcore.site`;
- `2026-05-24` старые URL `gena.madcore-kavkaz.ru` и `www.gena.madcore-kavkaz.ru` больше не нужны как рабочие URL Matomo-сайта;
- `2026-05-24` в Matomo добавлены отдельные custom dimensions и manual goals под текущий tracking-контур сайта.

Важно: сессия Matomo по-прежнему не подходит для автоматического создания новых сайтов через `SitesManager.addSite`, но для текущего preview это уже не блокер, потому что `site id = 2` создан.

## Что выставлять в `.env`

```env
MATOMO_URL=https://analytics.madcore-kavkaz.ru
MATOMO_SITE_ID=2
MATOMO_HOST=analytics.madcore-kavkaz.ru
MATOMO_DIMENSION_CLICK_ID=1
MATOMO_DIMENSION_YCLID=2
MATOMO_DIMENSION_UTM_SOURCE=3
MATOMO_DIMENSION_UTM_MEDIUM=4
MATOMO_DIMENSION_UTM_CAMPAIGN=5
MATOMO_DIMENSION_UTM_CONTENT=
MATOMO_DIMENSION_UTM_TERM=
MATOMO_GOAL_TELEGRAM_CLICK_ID=1
MATOMO_GOAL_WHATSAPP_CLICK_ID=2
MATOMO_GOAL_MAX_CLICK_ID=3
MATOMO_GOAL_CALL_CLICK_ID=4
MATOMO_GOAL_FORM_SUBMIT_ID=5
MATOMO_GOAL_LEAD_ID=6
```

`utm_content` и `utm_term` сознательно не заняты отдельными Matomo visit-dimension слотами, потому что бесплатный контур дает только пять visit custom dimensions. Для текущей боевой аналитики приоритет отдан:

- `click_id`
- `yclid`
- `utm_source`
- `utm_medium`
- `utm_campaign`

## Что реально доступно в Matomo сейчас

- Live visitor log по сайту `MADCORE Gena`;
- page view и переходы по страницам;
- события `trackEvent` по CTA и форме;
- manual goals-конверсии по ключевым действиям;
- `Transitions`, `Overlay`, `Events`, `Goals`, `Live`, `CustomDimensions`.

## Ограничение

В текущей инсталляции **не установлен** плагин `HeatmapSessionRecording`. Поэтому в Matomo сейчас нет полноценного session replay и тепловых карт кликов уровня Вебвизора. Для этого потребуется отдельная установка соответствующего плагина и, при необходимости, лицензия Matomo.

## Что еще может понадобиться

- если понадобится тепловая карта и запись сессий внутри самого Matomo, отдельно решить установку `HeatmapSessionRecording`;
- если нужно отдельное сравнение creative/keyword прямо внутри Matomo, подумать о перестановке приоритета dimension-слотов между `utm_medium`, `utm_content` и `utm_term`.

## Что проверить

- page view приходят в Matomo отдельно от исходного `MADCORE`;
- события `telegram_click`, `whatsapp_click`, `max_click`, `call_click`, `form_submit`, `lead` приходят отдельно;
- manual goals для этих действий доступны в отчетах `Goals`;
- `site id = 2` в Matomo не остался только на preview-host;
- в `.env` и build args проекта не потеряны:
  - `MATOMO_DIMENSION_UTM_MEDIUM`
  - `MATOMO_GOAL_*`
