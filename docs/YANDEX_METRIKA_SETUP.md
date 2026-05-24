# MADCORE Gena Yandex Metrika Setup

## Для этого проекта уже создан отдельный счетчик

Нельзя использовать счетчик исходного сайта. Для `MADCORE Gena` уже создан отдельный счетчик:

- `109282367` — `MADCORE Gena preview`
- текущий production-host: `madcore.site`
- legacy preview-host: `gena.madcore-kavkaz.ru`

## Что уже заведено

- отдельный счетчик `109282367`;
- отдельные цели:
  - `telegram_click`
  - `whatsapp_click`
  - `max_click`
  - `call_click`
  - `form_start`
  - `form_submit`
  - `lead`
- live production реально отдает клиентский код Метрики с этим counter id;
- `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site` проходит.

Текущий hero CTA больше не использует отдельное событие `consultation_click`. Вместо него работают:

- `telegram_click`
- `max_click`

Если legacy-цель `consultation_click` уже создана в самой Метрике, ее можно оставить для исторических данных, но текущий интерфейс на нее больше не опирается.

## Что записывать в `.env`

```env
NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID=109282367
YANDEX_METRIKA_TOKEN=<токен_если_нужен_для_api>
```

## Что делать после выбора финального домена

Есть два нормальных варианта:

1. Оставить счетчик `109282367` и просто обновить у него доменную привязку на финальный домен.
2. Создать отдельный финальный счетчик и заменить `NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID` в runtime.

Выбор зависит от того, нужно ли сохранить preview-историю вместе с финальным трафиком или полностью отделить финальный запуск от этапа проверки.

## Что проверить

- счетчик подключен на текущем домене;
- `reachGoal` срабатывает по всем CTA и отправке формы;
- `client_id` сохраняется в tracking;
- тестовый клик через `/go` сохраняет `yclid` и UTM;
- после финального доменного cutover counter id и доменная привязка не остались только на preview-host;
- production HTML `https://madcore.site` отдает актуальный counter id `109282367`.
