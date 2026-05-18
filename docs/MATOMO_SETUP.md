# MADCORE Gena Matomo Setup

## Текущее состояние

`MADCORE Gena` использует общий хост аналитики `https://analytics.madcore-kavkaz.ru`, но уже имеет отдельный сайт внутри общей инсталляции Matomo.

Актуальная точка:

- название сайта: `MADCORE Gena preview`
- `MATOMO_SITE_ID=2`
- URL сайта: `https://gena.madcore-kavkaz.ru`

## Как это было сделано

- admin-логин в Matomo подтвержден;
- API-вызов `SitesManager.addSite` возвращал `401 superuser required`;
- поэтому новый сайт был создан не через API, а напрямую в существующей базе Matomo на сервере;
- после вставки записи cache Matomo был очищен.

Важно: сессия Matomo по-прежнему не подходит для автоматического создания новых сайтов через `SitesManager.addSite`, но для текущего preview это уже не блокер, потому что `site id = 2` создан.

## Что выставлять в `.env`

```env
MATOMO_URL=https://analytics.madcore-kavkaz.ru
MATOMO_SITE_ID=2
MATOMO_HOST=analytics.madcore-kavkaz.ru
MATOMO_DIMENSION_CLICK_ID=<optional_dimension_id>
MATOMO_DIMENSION_YCLID=<optional_dimension_id>
MATOMO_DIMENSION_UTM_SOURCE=<optional_dimension_id>
MATOMO_DIMENSION_UTM_CAMPAIGN=<optional_dimension_id>
MATOMO_DIMENSION_UTM_CONTENT=<optional_dimension_id>
MATOMO_DIMENSION_UTM_TERM=<optional_dimension_id>
```

## Что еще может понадобиться

- при выборе финального домена:
  - либо обновить URL сайта для `site id = 2`,
  - либо создать отдельный финальный сайт в Matomo, если нужен чистый разрез без preview-истории;
- при необходимости позже можно отдельно завести custom dimensions для:
  - `click_id`
  - `yclid`
  - `utm_source`
  - `utm_campaign`
  - `utm_content`
  - `utm_term`

## Что проверить

- page view приходят в Matomo отдельно от исходного `MADCORE`;
- события `telegram_click`, `whatsapp_click`, `max_click`, `call_click`, `form_submit`, `lead` приходят отдельно;
- после финального доменного cutover URL сайта в Matomo не остался на preview-host.
