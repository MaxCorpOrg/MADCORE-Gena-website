# Входной фильтр TrafficGate

## Назначение

`TrafficGate` встроен в маршрут `GET /go` и нужен для:

- записи рекламного клика
- сохранения UTM и `yclid`
- сохранения служебных меток `decision_in` и `score_in_bucket` для аналитики
- технической фильтрации мусорного трафика
- безопасного перенаправления на `/` или `/safe`

Это не скрытый показ разного содержимого и не инструмент обхода модерации.

## Какие параметры принимает `/go`

- `src`
- `cmp`
- `cr`
- `click_id`
- `yclid`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

Пример:

```text
https://madcore-kavkaz.ru/go?src=yandex&cmp=123&cr=456&click_id=gbid123&yclid=yclid123&utm_source=yandex&utm_medium=cpc&utm_campaign=123&utm_content=456&utm_term=keyword
```

## Что сохраняется в `clicks`

- идентификаторы клика и кампании
- UTM-метки
- `yclid`
- IP
- `User-Agent`
- `referrer`
- тип устройства
- регион и город по локальной IP-базе
- `scoreIn`
- `decisionIn`
- итоговый `targetUrl`
- признак подозрительности

## Как считается `scoreIn`

Базовое значение: `50`.

Надбавки:

- `+20`, если есть `yclid`
- `+10`, если `utm_source=yandex`
- `+10`, если `User-Agent` выглядит нормально
- `+10`, если устройство мобильное
- `+10`, если `referrer` или источник выглядят ожидаемо
- `+10`, если это первый клик с IP за контрольное окно

Штрафы:

- `-30`, если `User-Agent` похож на робота или служебную утилиту
- `-25`, если `User-Agent` пустой или аномальный
- `-20`, если с IP слишком много повторов
- `-20`, если `click_id` повторяется подозрительно
- `-15`, если источник похож на Яндекс, но нет `yclid`
- `-15`, если `src` и `utm_source` расходятся

## Решение фильтра

- `80–100` → `good` → перенаправление на `/`
- `50–79` → `watch` → перенаправление на `/` с пометкой наблюдения
- `20–49` → `suspicious` → перенаправление на `/safe`
- `0–19` → `blocked` → перенаправление на `/safe`

Если решение `good` или `watch`, маршрут `/go` дополнительно прокидывает на лендинг:

- `decision_in`
- `score_in_bucket`

Эти поля не меняют содержимое страницы и используются только как обезличенные параметры визита для Яндекс.Метрики.

## Что еще пишет система

После каждого прохождения через `/go` создается серверное событие `traffic_gate` в таблице `events`.

В `payload` этого события сохраняются:

- `score_in`
- `decision_in`
- `reasons`
- `target_url`
- `device_type`
- `region`
- `city`

## Как проверить

### Нормальный сценарий

Обычный мобильный `User-Agent` с `yclid` и `utm_source=yandex` должен вести на `/`.

### Подозрительный сценарий

`curl`, пустой `User-Agent` или частые повторы должны вести на `/safe`.

### Команды

```bash
curl -I "https://madcore-kavkaz.ru/go?src=smoke&cmp=test&cr=test&click_id=test1"
curl -I -A "Mozilla/5.0 (Linux; Android 14)" "https://madcore-kavkaz.ru/go?src=yandex&utm_source=yandex&click_id=test2&yclid=test3"
curl -I -A "curl/8.0.0" "https://madcore-kavkaz.ru/go?src=yandex&utm_source=yandex&click_id=test4"
```
