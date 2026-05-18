# MADCORE Gena Yandex Metrika Setup

## Для этого проекта нужен отдельный счетчик

Нельзя использовать счетчик исходного сайта. Для `MADCORE Gena` требуется отдельный счетчик под новый домен или поддомен.

На текущем этапе уже создан отдельный preview-счетчик:

- `109282367` — `MADCORE Gena preview`
- host: `gena.madcore-kavkaz.ru`

## Что создать

- новый счетчик для текущего preview-адреса `gena.madcore-kavkaz.ru` или сразу для финального домена, если он уже известен
- отдельные цели:
  - `telegram_click`
  - `whatsapp_click`
  - `max_click`
  - `call_click`
  - `consultation_click`
  - `form_start`
  - `form_submit`
  - `lead`

Эти цели уже заведены в счетчике `109282367`.

## Что записать в `.env`

```env
NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID=109282367
YANDEX_METRIKA_TOKEN=<токен_если_нужен_для_api>
```

## Что проверить

- счетчик подключен на новом домене;
- SPA `hit` работает;
- `reachGoal` срабатывает по всем CTA и отправке формы;
- `client_id` сохраняется в tracking;
- тестовый клик через `/go` сохраняет `yclid` и UTM.
