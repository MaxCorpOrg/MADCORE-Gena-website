# Рекламная архитектура MADCORE

## Назначение

Этот документ описывает целевую техническую схему сайта `MADCORE` для приема рекламного трафика, записи кликов, обработки лидов, оценки качества и подготовки данных для Яндекс.Директа.

## Общая схема

- Вход рекламного трафика: `GET /go`
- Входной фильтр: `TrafficGate`
- Лендинг: `/`
- Служебная безопасная страница: `/safe`
- События поведения: `POST /api/event`
- Заявки: `POST /api/lead`
- Уведомления: Telegram
- Хранилище: PostgreSQL через Prisma
- Аналитика:
  - внутренние серверные события
  - Matomo
  - Яндекс.Метрика
- Оценка качества:
  - `scoreIn` для клика
  - `scoreOut` для лида
- Отчеты:
  - `traffic_sources_quality`
  - CSV-выгрузки
  - закрытая служебная страница `/admin/leads`

## Потоки данных

### 1. Входящий клик

1. Яндекс.Директ ведет на `https://madcore-kavkaz.ru/go?...`
2. `/go` принимает UTM, `click_id`, `yclid`, источник и технические признаки запроса.
3. Входной фильтр считает `scoreIn`.
4. Клик сохраняется в таблицу `clicks`.
5. Записывается серверное событие `traffic_gate`.
6. Пользователь перенаправляется:
   - на `/`, если трафик нормальный или под наблюдением;
   - на `/safe`, если трафик подозрительный или заблокированный.
7. На лендинге Яндекс.Метрика получает параметры визита и выдает `ClientID`.

### 2. Поведение на сайте

На сайте фиксируются обезличенные события:

- `page_view`
- `time_15_sec`
- `scroll_50`
- `scroll_90`
- `offer_view`
- `product_view`
- `telegram_click`
- `whatsapp_click`
- `call_click`
- `consultation_click`
- `form_start`

Эти события попадают:

- во внутреннюю таблицу `events`
- в Matomo
- в Яндекс.Метрику как обычные JavaScript-цели, если задан счетчик

Отдельно от целей Метрика получает:

- ручной `hit` для просмотра страницы
- `params` с рекламными метками визита
- `ClientID`, который потом сохраняется в проектные tracking-данные

## 3. Заявка

1. Клиент отправляет форму на `POST /api/lead`.
2. Сервер проверяет антиспам, скорость заполнения, дубли и корректность телефона.
3. Успешная заявка сохраняется в `leads`.
4. Вместе с заявкой сохраняются `yclid` и `client_id`, если они уже известны.
4. Записываются серверные события:
   - `form_submit`
   - `lead`
   - `lead_notify`
5. Менеджеру уходит сообщение в Telegram.

## 4. Оценка качества лида

После накопления событий и после действий менеджера лид получает `scoreOut`.

Статусы лида:

- `new`
- `in_progress`
- `qualified`
- `bad`
- `duplicate`
- `sale`

При смене статуса создаются дополнительные события:

- `manager_status`
- `qualified_lead`
- `bad_lead`
- `sale`

Для Яндекс.Директа важно различать:

- обычные JavaScript-цели сайта: `telegram_click`, `whatsapp_click`, `call_click`, `consultation_click`, `form_start`, `form_submit`, `lead`
- офлайн-конверсии после проверки менеджером: `qualified_lead`, `sale`

## 5. Служебный интерфейс

Закрытая страница `/admin/leads` показывает:

- сводку по кликам и лидам
- подозрительные клики
- среднюю входную оценку
- лиды по статусам
- источники и кампании
- агрегированные рекомендации из `traffic_sources_quality`

## 6. Production-инфраструктура

Production-сайт работает через:

- `nginx`
- `app`
- `postgres`

Дополнительно подготовлена аналитическая часть:

- `matomo`
- `matomo_db`

Развертывание Matomo на сервере и выпуск сертификата для `analytics.madcore-kavkaz.ru` требуют отдельного server-side шага.

## 7. Автоматическая проверка и выкладка

В репозитории подготовлены:

- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`

Схема:

1. проверка кода
2. сборка
3. проверка утечек секретов
4. отправка снимка проекта на сервер через `rsync`
5. `docker compose up -d --build`
6. `prisma migrate deploy`
7. production smoke-check

## Диаграммы

- [adtech-architecture.mmd](/home/max/MADCORE RF/docs/diagrams/adtech-architecture.mmd)
- [adtech-architecture.svg](/home/max/MADCORE RF/docs/diagrams/adtech-architecture.svg)
- [traffic-flow.mmd](/home/max/MADCORE RF/docs/diagrams/traffic-flow.mmd)
- [traffic-flow.svg](/home/max/MADCORE RF/docs/diagrams/traffic-flow.svg)
- [deploy-flow.mmd](/home/max/MADCORE RF/docs/diagrams/deploy-flow.mmd)
- [deploy-flow.svg](/home/max/MADCORE RF/docs/diagrams/deploy-flow.svg)
