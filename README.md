# MADCORE Gena

Локальный путь проекта: `/home/max/MADCORE RF`

Целевой репозиторий: `git@github.com:MaxCorpOrg/MADCORE-Gena-website.git`

Временный preview-адрес текущего этапа:

- preview: `https://gena.madcore-kavkaz.ru`
- `www`: `https://www.gena.madcore-kavkaz.ru`

Это текущий адрес для проверки сайта. Финальный домен для `MADCORE Gena` будет другим и должен задаваться через окружение, а не считаться зафиксированным в проекте.

## Кратко

`MADCORE Gena` — это отдельный сайт на базе `MADCORE-website`, собранный как независимый контур:

- отдельный брендовый слой;
- серебряный визуальный стиль;
- отдельные контакты;
- отдельный lead-flow;
- отдельные cookie/local storage ключи;
- отдельные UTM-сегменты;
- отдельная точка развёртывания на сервере.

Текущий основной сайт в `/home/max/MADCORE` при этом не должен ломаться и не является рабочей директорияй этого проекта.

## Стек

- `Next.js + TypeScript + Tailwind + Prisma + PostgreSQL`
- страницы: `/`, `/thanks`, `/privacy`, `/safe`
- маршруты API: `POST /api/lead`, `POST /api/event`, `GET /go`
- аналитика: Matomo + Яндекс.Метрика + собственные серверные события
- server notify: Telegram bot

## Что уже отделено

- проект переименован в `MADCORE Gena`;
- в runtime-конфиг вынесены новые контакты:
  - Telegram: `https://t.me/vorgesar`
  - WhatsApp: `https://wa.me/79042440444`
  - MaX: `https://max.ru/u/f9LHodD0cOIXADxaRo9U9W_VHmDuRL5fMKsJO5O9YAs5rg0iZYqYmXKw0dw`
  - телефон: `+7-904-244-04-44`
- client tracking переведен на отдельные ключи `madcore_gena_*`;
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

## Что еще требуется до production

- удаленный GitHub-репозиторий уже создан и подключен: `MaxCorpOrg/MADCORE-Gena-website`;
- создать отдельный счетчик Яндекс.Метрики и цели;
- создать отдельный `site id` в Matomo;
- создать отдельного Telegram-бота и заполнить `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`;
- заполнить production `.env` для нового проекта;
- развернуть проект в `/opt/madcore-gena`;
- заменить временный preview-host на финальный домен и добавить под него доменный proxy-маршрут;
- выполнить smoke-проверки.

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
- UTM: `docs/UTM_YANDEX_DIRECT.md`
- архитектура: `ARCHITECTURE.md`
- следующие шаги: `NEXT_STEPS.md`
- архив исходного проекта: `docs/archive-origin/`
