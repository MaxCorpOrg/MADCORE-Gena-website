# MADCORE Gena Yandex Metrika Setup

## Для этого проекта уже создан отдельный счетчик

Нельзя использовать счетчик исходного сайта. Для `MADCORE Gena` уже создан отдельный preview-счетчик:

- `109282367` — `MADCORE Gena preview`
- host: `gena.madcore-kavkaz.ru`

## Что уже заведено

- отдельный счетчик `109282367`;
- отдельные цели:
  - `telegram_click`
  - `whatsapp_click`
  - `max_click`
  - `call_click`
  - `consultation_click`
  - `form_start`
  - `form_submit`
  - `lead`
- live preview реально отдает клиентский код Метрики с этим counter id;
- `production-adtech-smoke.sh` на `https://gena.madcore-kavkaz.ru` прошел `2026-05-18`.

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
- после финального доменного cutover counter id и доменная привязка не остались на preview-host.
