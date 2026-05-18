# MADCORE Gena Architecture

## Кратко

`MADCORE Gena` — это самостоятельный продуктовый сайт на базе исходного `MADCORE-website`, выделенный в отдельный контур без вмешательства в рабочий production исходного проекта.

## Приложение

- framework: `Next.js App Router + React + TypeScript`
- стили: `Tailwind + globals.css`
- контент и runtime-конфиг: `src/config/site.ts`
- ключевые маршруты:
  - `/`
  - `/thanks`
  - `/privacy`
  - `/safe`
  - `/go`
- API:
  - `POST /api/lead`
  - `POST /api/event`
  - `/api/admin/*`

## Lead-flow

1. Пользователь приходит через `/go` с рекламными метками.
2. Входной фильтр считает `scoreIn` и решает:
   - `good`
   - `watch`
   - `suspicious`
   - `blocked`
3. При нормальном сценарии пользователь попадает на лендинг.
4. CTA ведут в:
   - Telegram
   - WhatsApp
   - MaX
   - звонок
   - форму консультации
5. Форма отправляет заявку на `POST /api/lead`.
6. Сервер валидирует, пишет лид, создает события и отправляет уведомление в Telegram-бот.

## Отделение от исходного сайта

- отдельный product name: `MADCORE Gena`
- отдельные контакты
- отдельные tracking keys:
  - `madcore_gena_tracking`
  - `madcore_gena_session_id`
- отдельные `cmp`-сегменты `madcore_gena_*`
- отдельный dev file-store: `.data/madcore-gena-dev-store.json`
- отдельная точка развертывания: `/opt/madcore-gena`

## Аналитика и реклама

- Matomo:
  - использовать общий хост `https://analytics.madcore-kavkaz.ru`
  - создать отдельный `site id`
- Яндекс.Метрика:
  - нужен отдельный счетчик
  - нужны отдельные цели под `MADCORE Gena`
- Яндекс.Директ:
  - использовать отдельные `cmp`-метки
  - отдельные кампании и отдельную UTM-разметку

## Серверная схема по текущему checkpoint

- app:
  - контейнер `madcore_gena_app`
  - локальная публикация `127.0.0.1:3001 -> 3000`
- postgres:
  - контейнер `madcore_gena_postgres`
  - отдельная база `madcore_gena`
- nginx:
  - контейнер `madcore_gena_nginx`
  - технические порты `8081/8444`
- certbot:
  - отдельный контейнер для проекта

Эта схема позволяет держать новый проект рядом на том же сервере без конфликта по `80/443` с основным сайтом. Для публичного ввода домена нужен отдельный proxy-маршрут на сервере.
