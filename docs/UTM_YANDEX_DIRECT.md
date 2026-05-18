# MADCORE Gena UTM для Яндекс.Директа

## Отдельные сегменты проекта

- `madcore_gena_site` — базовая кампания с переходом на сайт
- `madcore_gena_telegram` — коммуникационный акцент на Telegram
- `madcore_gena_whatsapp` — коммуникационный акцент на WhatsApp
- `madcore_gena_max` — коммуникационный акцент на MaX
- `madcore_gena_tg_channels` — отдельный сегмент для площадки `Телеграм-каналы`

## Базовые правила

- весь рекламный трафик идет только через `/go`;
- нельзя использовать старые `cmp` от исходного сайта;
- домен в ссылках нового проекта: `https://gena.madcore-kavkaz.ru`;
- `yclid` и `click_id` должны передаваться без потерь;
- `utm_medium=telegram` использовать только для отдельной кампании `Телеграм-каналы`.

## Шаблоны

Готовые ссылки печатает сценарий:

```bash
./scripts/print-yandex-direct-campaign-links.sh
```

Примеры:

```text
https://gena.madcore-kavkaz.ru/go?src=yandex&cmp=madcore_gena_site&cr={ad_id}&click_id={gbid}&utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_id}&utm_content={ad_id}&utm_term={keyword}&yclid={yclid}

https://gena.madcore-kavkaz.ru/go?src=yandex&cmp=madcore_gena_max&cr={ad_id}&click_id={gbid}&utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_id}&utm_content={ad_id}&utm_term={keyword}&yclid={yclid}

https://gena.madcore-kavkaz.ru/go?src=yandex&cmp=madcore_gena_tg_channels&cr={ad_id}&click_id={gbid}&utm_source=yandex&utm_medium=telegram&utm_campaign={campaign_id}&utm_content={ad_id}&utm_term={keyword}&yclid={yclid}
```

## Что проверить

- после редиректа на сайт сохраняются `src`, `cmp`, `cr`, `click_id`, `yclid`, UTM;
- в лидах и server events видно, из какого именно сегмента пришел трафик;
- для `madcore_gena_max` можно отдельно анализировать переходы и лиды из MaX.
