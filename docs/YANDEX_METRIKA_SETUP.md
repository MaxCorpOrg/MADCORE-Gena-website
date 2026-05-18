# MADCORE Gena Yandex Metrika Setup

## Для этого проекта нужен отдельный счетчик

Нельзя использовать счетчик исходного сайта. Для `MADCORE Gena` требуется отдельный счетчик под новый домен или поддомен.

## Что создать

- новый счетчик для `gena.madcore-kavkaz.ru`
- отдельные цели:
  - `telegram_click`
  - `whatsapp_click`
  - `max_click`
  - `call_click`
  - `consultation_click`
  - `form_start`
  - `form_submit`
  - `lead`

## Что записать в `.env`

```env
NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID=<новый_id_счетчика>
YANDEX_METRIKA_TOKEN=<токен_если_нужен_для_api>
```

## Что проверить

- счетчик подключен на новом домене;
- SPA `hit` работает;
- `reachGoal` срабатывает по всем CTA и отправке формы;
- `client_id` сохраняется в tracking;
- тестовый клик через `/go` сохраняет `yclid` и UTM.
