# MADCORE Gena Matomo Setup

## Что требуется

`MADCORE Gena` использует общий хост аналитики `https://analytics.madcore-kavkaz.ru`, но для него нужен отдельный сайт внутри Matomo.

Нельзя подключать новый сайт к `site id` исходного `MADCORE-website`.

## Что создать в Matomo

1. Новый сайт для `https://gena.madcore-kavkaz.ru`.
2. Отдельный `MATOMO_SITE_ID`.
3. При необходимости отдельные custom dimensions для:
   - `click_id`
   - `yclid`
   - `utm_source`
   - `utm_campaign`
   - `utm_content`
   - `utm_term`

## Что заполнить в `.env`

```env
MATOMO_URL=https://analytics.madcore-kavkaz.ru
MATOMO_SITE_ID=<new_site_id>
MATOMO_HOST=analytics.madcore-kavkaz.ru
MATOMO_DIMENSION_CLICK_ID=<optional_dimension_id>
MATOMO_DIMENSION_YCLID=<optional_dimension_id>
MATOMO_DIMENSION_UTM_SOURCE=<optional_dimension_id>
MATOMO_DIMENSION_UTM_CAMPAIGN=<optional_dimension_id>
MATOMO_DIMENSION_UTM_CONTENT=<optional_dimension_id>
MATOMO_DIMENSION_UTM_TERM=<optional_dimension_id>
```

## Что проверить

- новый сайт виден отдельно от исходного `MADCORE`;
- page view идут по домену `gena.madcore-kavkaz.ru`;
- события `telegram_click`, `whatsapp_click`, `max_click`, `call_click`, `form_submit`, `lead` приходят отдельно;
- `/go` сохраняет в Matomo значения `click_id`, `yclid` и UTM-параметров, если включены соответствующие измерения.
