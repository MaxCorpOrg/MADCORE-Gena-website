# MADCORE Gena

Локальный путь проекта: `/home/max/MADCORE RF`

Целевой репозиторий: `git@github.com:MaxCorpOrg/MADCORE-Gena-website.git`

Текущий production:

- `https://madcore.site`
- `https://www.madcore.site`

Legacy preview сохранен как запасной адрес:

- `https://gena.madcore-kavkaz.ru`
- `https://www.gena.madcore-kavkaz.ru`

## Кратко

`MADCORE Gena` — это отдельный сайт на базе `MADCORE-website`, собранный как независимый контур:

- отдельный брендовый слой;
- серебряный визуальный стиль;
- отдельные контакты;
- отдельный lead-flow;
- отдельные cookie и localStorage ключи;
- отдельные UTM-сегменты;
- отдельная точка развёртывания на сервере.

Текущий основной сайт в `/home/max/MADCORE` при этом не должен ломаться и не является рабочей директорией этого проекта.

## Стек

- `Next.js + TypeScript + Tailwind + Prisma + PostgreSQL`
- страницы: `/`, `/thanks`, `/privacy`, `/safe`
- маршруты API: `POST /api/lead`, `POST /api/event`, `GET /go`
- аналитика: Matomo + Яндекс.Метрика + собственные серверные события
- server notify: Telegram bot

## Что уже отделено и заведено

- проект переименован в `MADCORE Gena`;
- в runtime-конфиг вынесены новые контакты:
  - Telegram: `https://t.me/vorgesar`
  - WhatsApp: `https://wa.me/79042440444`
  - MaX: `https://max.ru/u/f9LHodD0cOIXADxaRo9U9W_VHmDuRL5fMKsJO5O9YAs5rg0iZYqYmXKw0dw`
  - телефон: `+7-904-244-04-44`
- client tracking переведен на `madcore_gena_*`;
- добавлен новый CTA-канал `MaX`;
- подготовлены отдельные deployment defaults:
  - `/opt/madcore-gena`
  - `app` на `127.0.0.1:3001`
  - `nginx` на `8081/8444`
- подготовлены отдельные рекламные шаблоны `cmp`:
  - `madcore_gena_site`
  - `madcore_gena_telegram`
  - `madcore_gena_whatsapp`
  - `madcore_gena_max`
  - `madcore_gena_tg_channels`
- создан отдельный счетчик Яндекс.Метрики `109282367`;
- создан отдельный Matomo сайт `site id = 2`;
- production-контур уже выложен на сервер и отвечает по HTTPS на `madcore.site`.
- отдельный Telegram-бот `@MadcoreGenaLeadsBot` уже подключен и подтвержден live-тестом;
- в hero production уже выкачены отдельные кнопки:
  - `Перейти в чат Telegram`
  - `Перейти в чат Max`

## Что еще осталось

- при необходимости обновить доменные привязки Метрики и Matomo;
- если legacy preview должен оставаться полностью автономным, вернуть ему собственный `/go`-redirect без ухода на `madcore.site`;
- при необходимости перевести лиды с текущей рабочей лички `AK5` на другой receiving-chat.

## Команды

```bash
npm install
npx prisma generate
npm run lint
npm run build
```

Локальный запуск:

```bash
npm run dev:start
npm run dev:status
npm run dev:stop
```

Для временного preview-контура можно стартовать от отдельного шаблона окружения:

```bash
cp .env.preview.example .env
```

## Важные файлы

- вход для нового агента: `docs/START_HERE_FOR_NEW_CHAT.md`
- краткий статус: `docs/PROJECT_STATUS.md`
- подробный checkpoint: `docs/PROJECT_CHECKPOINT.md`
- выкладка: `docs/DEPLOYMENT.md`
- runbook: `docs/RUNBOOK.md`
- Matomo: `docs/MATOMO_SETUP.md`
- Метрика: `docs/YANDEX_METRIKA_SETUP.md`
- UTM: `docs/UTM_YANDEX_DIRECT.md`
- архитектура: `ARCHITECTURE.md`
- следующие шаги: `NEXT_STEPS.md`
- архив исходного проекта: `docs/archive-origin/`
