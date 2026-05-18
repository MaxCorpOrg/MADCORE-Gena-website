# CHANGELOG

## 2026-05-17

### Яндекс.Директ: точный список минус-слов и сильные тексты

- Проведено дополнительное исследование живых подсказок Яндекса по широким и более прямым семенам:
  - `жиросжигание`
  - `снижение веса`
  - `сушка тела`
  - `коррекция фигуры`
  - `проблемные зоны`
  - `сухая мышечная масса`
  - `восстановление после тренировок`
  - `madcore 2.0`
  - `похудение`
  - `убрать живот`
  - `сжечь жир`
- Исследование подтвердило:
  - по широким темам много информационного спроса;
  - коммерческий спрос лучше собирать не одиночными широкими словами, а связкой пользы, коммерческого модификатора и продукта;
  - минус-слова должны отдельно срезать домашние, обучающие, медицинские и сервисно-чужие хвосты.
- Добавлены документы:
  - `docs/YANDEX_DIRECT_NEGATIVE_KEYWORDS.md`
  - `docs/YANDEX_DIRECT_SELLING_TEXTS.md`
- В них зафиксированы:
  - точный базовый список минус-слов для загрузки
  - осторожный второй слой после ручной проверки
  - самые сильные безопасные тексты первой волны
  - короткий основной набор для старта
  - запасной более резкий набор без первой загрузки
- `docs/YANDEX_DIRECT_SEMANTICS.md` обновлен как master-документ и теперь ссылается на отдельные файлы по минус-словам и сильным текстам.

### Яндекс.Директ: расширена семантика и группы по намерению

- Для трех обычных кампаний собрана и загружена расширенная семантика по 7 смысловым корзинам:
  - бренд и написания
  - покупка и намерение
  - снижение веса
  - коррекция формы и проблемные зоны
  - сухая масса, восстановление и тренировки
  - география Северного Кавказа
  - консультация и контакт
- В Яндекс.Директе через API переименованы и расширены группы:
  - `709948992` теперь содержит `6` групп
  - `709948993` теперь содержит `4` группы
  - `709948994` теперь содержит `4` группы
- В три обычные кампании дополнительно загружены:
  - `162` ручные ключевые фразы
  - `28` текстовых объявления
  - `28` объявлений с быстрыми ссылками
  - `28` объявлений с графическим расширением
  - `14` автоматических `---autotargeting`
- Итоговая структура по трем обычным кампаниям теперь такая:
  - `709948992` — `72` ручные фразы, `12` объявлений
  - `709948993` — `45` ручных фраз, `8` объявлений
  - `709948994` — `45` ручных фраз, `8` объявлений
- Загруженные тексты и фразы построены в безопасной подаче `модерация first`:
  - без обещаний гарантированного результата
  - без формулировок `лучший`, `№1`, `мгновенно`, `без усилий`
- Добавлен новый документ:
  - `docs/YANDEX_DIRECT_SEMANTICS.md`
- В нем зафиксированы:
  - полный загруженный набор фраз по группам
  - тематические слова
  - стартовый список минус-слов
  - продающие углы для объявлений
  - крючки для кампании `Телеграм-каналы`
  - рекомендации по ограничению средней цены клика
- Следующий шаг после этого этапа:
  - ручная бизнес-проверка новых фраз и текстов
  - ручная проверка минус-слов перед модерацией
  - без запуска показов и без расхода бюджета

### Яндекс.Директ: расширенный черновик обычных кампаний

- В трех обычных группах Директа вручную перепроверен автоматический `---autotargeting`:
  - `205751240688` — `Включено`
  - `205751240721` — `Включено`
  - `205751240722` — `Включено`
- Через API к трем обычным кампаниям добавлены вторые текстовые объявления:
  - для `709948992` — `17720220805`
  - для `709948993` — `17720221034`
  - для `709948994` — `17720220807`
- Для всех шести объявлений добавлены:
  - быстрые ссылки `1478617121`
  - графическое расширение `rzQTG8b_zerHcC2_MMYVDg`
- Под рекламный креатив добавлен локальный файл:
  - `public/images/direct-ad-product-1200x1000.jpg`
- Итоговая безопасная черновая конфигурация трех обычных кампаний теперь такая:
  - `3` группы
  - `6` текстовых объявлений
  - `18` ручных брендовых фраз
  - `6` объявлений с быстрыми ссылками
  - `6` объявлений с графическим расширением
- Бюджет и показы по-прежнему не запускались.

### Метрика: экран установки кода и Яндекс.Директ: первичное наполнение

- Через интерфейс Метрики в разделе настроек и помощника настроек подтверждено:
  - счетчик находится в состоянии `Active`
  - фрагмент кода в интерфейсе соответствует live-сайту
  - отдельное диагностическое поле `code_status` на этом экране явно не показано
- Зафиксирован вывод:
  - live-сбор данных Метрики работает
  - `code_status=CS_ERR_UNKNOWN` из API нужно трактовать как диагностическую особенность Яндекса, а не как блокер рабочего счетчика
- Через API Яндекс.Директа без запуска бюджета дополнительно наполнены три обычные кампании:
  - `709948992`
    - группа `5751240688`
    - объявление `17720204954`
    - `6` ручных брендовых фраз
  - `709948993`
    - группа `5751240721`
    - объявление `17720205066`
    - `6` ручных брендовых фраз
  - `709948994`
    - группа `5751240722`
    - объявление `17720205067`
    - `6` ручных брендовых фраз
- Для этих объявлений подтверждены ссылки на `/go` с сегментами:
  - `madcore_site`
  - `madcore_telegram`
  - `madcore_whatsapp`
- Через интерфейс Директа дополнительно подтверждено, что в кампании `709960424`:
  - остается группа `5751221174`
  - остается объявление `1910192951925954641`
  - ссылка уже содержит `cmp=madcore_tg_channels`, `utm_medium=telegram`, `yclid={yclid}`
- В трех обычных группах Яндекс автоматически создал `---autotargeting`;
- попытка штатно отключить или удалить этот автотаргетинг через текущее API-обращение не дала рабочего результата, поэтому он вынесен как отдельная ручная проверка перед реальным запуском.

### Matomo: production-подъем и отдельная перепроверка Метрики

- Для `analytics.madcore-kavkaz.ru` создан DNS `A -> 151.247.197.153`.
- В production `.env` заполнены:
  - `MATOMO_URL`
  - `MATOMO_HOST`
  - `MATOMO_DB_NAME`
  - `MATOMO_DB_USER`
  - `MATOMO_DB_PASSWORD`
  - `MATOMO_DB_ROOT_PASSWORD`
  - `MATOMO_SITE_ID=1`
- На сервере подняты:
  - `matomo_db`
  - `matomo`
- Выпущен SSL для `analytics.madcore-kavkaz.ru`.
- Завершен установщик Matomo:
  - создан суперпользователь
  - создан первый сайт `madcore-kavkaz.ru`
  - подтвержден `site id = 1`
- Исправлен реальный инфраструктурный дефект:
  - в `docker-compose.yml` healthcheck Matomo переведен с отсутствующего `wget` на `php + fsockopen`
- Production-приложение пересобрано с `MATOMO_SITE_ID=1`.
- На live подтвержден первый Matomo-визит:
  - в панели видна кампания `matomo_live_check`
  - в базе Matomo есть минимум `1` визит и `1` действие
- Клиентская загрузка Метрики выровнена под официальный фрагмент Яндекса:
  - внешний тег теперь грузится как `https://mc.yandex.ru/metrika/tag.js?id=109236645`
  - в `init` добавлен `ssr: true`
- После отдельной перепроверки подтверждено:
  - код Метрики есть в DOM
  - live-визиты и цели идут
  - `code_status` по API пока еще остается `CS_ERR_UNKNOWN`

### Live-цикл качества лида, выгрузка в Яндекс и кнопка телефона

- На главной странице и на `/thanks` обновлен видимый номер в CTA-кнопке звонка:
  - теперь отображается `+7-999-55-66-777`
  - `tel:+79995566777` сохранен без изменений
- На production подтвержден новый live test lead `id=16`:
  - вход через `/go` с `cmp=madcore_site`
  - сохранены `clickId`, `yclid`, `clientId`
  - записаны `form_submit`, `lead`, `lead_notify`
  - после обновления статуса лид стал `qualified`
  - `scoreOut` вырос до `100`
  - записаны `manager_status` и `qualified_lead`
- Через API Метрики подтверждено состояние за `2026-05-17`:
  - `6` визитов
  - `9` просмотров страниц
  - `1` достижение цели `form_submit`
  - `1` достижение цели `lead`
  - подтверждена UTM-пятерка тестового визита `yandex / cpc / campaign_test_20260517 / ad_test_20260517 / madcore_test`
- Выполнена первая реальная выгрузка офлайн-конверсий:
  - получен CSV с `ClientID`, `yclid`, `qualified_lead`, Unix timestamp и `RUB`
- Исправлен operational-дефект `scripts/export-qualified-leads-for-yandex.sh`:
  - сценарий больше не требует вручную экспортировать `POSTGRES_USER` и `POSTGRES_DB`
  - теперь он сам читает эти значения из `/opt/madcore-gena/.env`

### Яндекс.Директ: подтверждена схема из 4 кампаний

- Через интерфейс Директа завершено создание 4-й кампании:
  - `709960424` — `MADCORE | Телеграм-каналы | Сайт | НЕ ЗАПУСКАТЬ`
- Для нее подтверждены:
  - место показа `Телеграм-каналы`
  - группа `5751221174`
  - объявление `1910192951925954641`
  - недельный бюджет `300 ₽`
  - отсутствие показов и кликов
- Заполнен безопасный черновик объявления с ссылкой на `/go` через сегмент `madcore_tg_channels`.
- В документации зафиксировано важное различие:
  - первые три кампании `MADCORE` подтверждаются через API как обычные `TEXT_CAMPAIGN`
  - 4-я кампания надежно подтверждена через интерфейс Директа как отдельное место показа `Телеграм-каналы`
  - `WhatsApp` по-прежнему трактуется только как точка перехода, а не как место показа.

### Яндекс.Директ: уточнение мест показа

- В Яндекс.Директе переименованы три черновые кампании без запуска и без расхода бюджета:
  - `709948992` → `MADCORE | Сайт | Поиск+РСЯ | НЕ ЗАПУСКАТЬ`
  - `709948993` → `MADCORE | Переход в Telegram | Поиск+РСЯ | НЕ ЗАПУСКАТЬ`
  - `709948994` → `MADCORE | Переход в WhatsApp | Поиск+РСЯ | НЕ ЗАПУСКАТЬ`
- Через API дополнительно подтверждено:
  - это обычные `TEXT_CAMPAIGN`;
  - отдельного места показа `WhatsApp` в Яндекс.Директе нет;
  - настоящее размещение в Telegram требует отдельной кампании с местом показа `Телеграм-каналы`.
- Добавлен helper-сценарий `scripts/print-yandex-direct-campaign-links.sh` с 4 готовыми шаблонами ссылок:
  - `madcore_site`
  - `madcore_telegram`
  - `madcore_whatsapp`
  - `madcore_tg_channels`
- `docs/UTM_YANDEX_DIRECT.md`, `docs/CHECKLIST_BEFORE_ADS.md`, `docs/RUNBOOK.md` и `docs/REPORTING.md` синхронизированы под эту схему.

### Безопасность и служебный доступ

- Усилена защита служебных маршрутов `/admin/*` и `/api/admin/*`.
- В `src/lib/admin-auth.ts` декодирование Basic Auth переведено на runtime-safe схему:
  - сначала используется `atob` + `TextDecoder`, если они доступны в middleware-окружении;
  - fallback на `Buffer` сохранен для обычного Node.js runtime.
- Это снижает риск расхождения между локальной проверкой и фактической работой авторизации в `Next.js middleware`.
- `.gitignore` и `.dockerignore` усилены правилом `.env*` с исключением только для `.env.example`.
- Дополнительно подтверждено, что локальный `.env.local` существует, но не отслеживается в git.
- Добавлен `scripts/production-adtech-smoke.sh` для live-проверки Метрики, `/go` и защиты `/admin/leads`.
- Добавлен `scripts/repo-adtech-audit.sh` для локальной проверки ключевых частей рекламного контура в коде и документации.
- Добавлен `scripts/server-activate-adtech.sh` для безопасной server-side активации Метрики, миграций и smoke-проверок.
- Добавлен `scripts/server-adtech-readiness.sh` для безопасной проверки production `.env` без вывода секретов.

### Server-side активация рекламного слоя

- Подтвержден прямой shell-доступ к VPS `151.247.197.153`.
- Для `root` установлен вход по ключу.
- Подтверждено, что `/opt/madcore-gena` развернут как snapshot, а не как git clone.
- На сервере перед изменениями созданы backup-файлы приложения, базы и `.env`.
- В production `.env` добавлены и исправлены:
  - `NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID=109236645`
  - `YANDEX_DIRECT_CLIENT_LOGIN=Max.Corp.Org`
  - `ADMIN_USERNAME`
  - `ADMIN_PASSWORD`
  - `POSTGRES_DB`
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
- `nginx.conf` исправлен так, чтобы analytics upstream не ломал живой прокси до отдельного запуска Matomo.
- `Dockerfile` и `docker-compose.yml` обновлены так, чтобы client-side env реально попадали в production build.
- `middleware.ts` перенесен в `src/middleware.ts`, после чего live-защита `/admin/*` и `/api/admin/*` реально вошла в build.
- На live подтверждены:
  - код Метрики и счетчик `109236645`
  - redirect `/go` для нормального и подозрительного трафика
  - `noindex` на `/safe`
  - `401/200` для `/admin/leads`
  - `401/200` для `/api/admin/reports/traffic-quality`
- `production-smoke` и `production-adtech-smoke` прошли на боевом домене.
- Повторно через API подтверждены:
  - счетчик Метрики `109236645`
  - все 7 целей Метрики
  - три кампании Директа `709948992`, `709948993`, `709948994` в `OFF/DRAFT`.
- Отправлен новый live test lead `id=15` с `src=yandex`, `clickId`, `yclid` и `clientId`; в production БД подтверждены:
  - lead row
  - `form_submit`
  - `lead`
  - `lead_notify`.
- Исправлен `500` у `/api/admin/reports/traffic-quality`:
  - добавлен helper `src/lib/serialize.ts`
  - BigInt теперь сериализуется безопасно
  - после пересчета `traffic_sources_quality` live-API отдает `200` и реальные строки.

## 2026-05-16

### Внешние рекламные сервисы

- Через API Яндекс.Метрики подтвержден реальный счетчик `109236645` для `madcore-kavkaz.ru`.
- В этом счетчике созданы цели:
  - `telegram_click`
  - `whatsapp_click`
  - `call_click`
  - `consultation_click`
  - `form_start`
  - `form_submit`
  - `lead`
- Через API Яндекс.Директа подтвержден рабочий `Client-Login` `Max.Corp.Org`.
- В Яндекс.Директе созданы три черновые кампании без запуска и без расхода бюджета:
  - `MADCORE | Сайт | НЕ ЗАПУСКАТЬ`
  - `MADCORE | Telegram | НЕ ЗАПУСКАТЬ`
  - `MADCORE | WhatsApp | НЕ ЗАПУСКАТЬ`
- Для всех трех кампаний подтверждено состояние `OFF` и статус `DRAFT`.

### Документация

- `docs/YANDEX_METRIKA_SETUP.md` обновлен под реальный счетчик и фактически созданные цели.
- `docs/YANDEX_DIRECT_API.md` обновлен под реальный доступ к API и созданные черновые кампании.
- `docs/FINAL_REPORT.md` обновлен фактическим состоянием внешнего рекламного контура.
- `.env.example`, `docs/DEPLOYMENT.md`, `docs/DEPLOY_UBUNTU_VPS.md` и `docs/CHECKLIST_BEFORE_ADS.md` синхронизированы с реальными безопасными значениями:
  - `NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID=109236645`
  - `YANDEX_DIRECT_CLIENT_LOGIN=Max.Corp.Org`

## 2026-05-15

### Рекламная инфраструктура

- В `Prisma` добавлены поля и сущности для рекламной аналитики:
  - `yclid`
  - `scoreIn`
  - `scoreOut`
  - статусы лидов
  - `traffic_sources_quality`
- Добавлена миграция `20260515113000_adtech_foundation`.
- `/go` расширен до `TrafficGate` с оценкой трафика и записью `traffic_gate`.
- Добавлена закрытая служебная страница `/admin/leads`.
- Добавлен read-only модуль Яндекс.Директа.
- Подготовлены сценарии:
  - `scripts/export-qualified-leads-for-yandex.sh`
  - `scripts/server-refresh-traffic-sources-quality.sh`

### Аналитика и события

- Исправлен `call_click`: `POST /api/event` теперь принимает событие без `invalid_payload`.
- В клиенте добавлена Яндекс.Метрика.
- Компонент Matomo расширен пользовательскими измерениями для `click_id`, `yclid` и UTM-меток.
- Privacy page обновлена под Matomo, Яндекс.Метрику и хранение `yclid`.

### Инфраструктура и документация

- В `docker-compose.yml` добавлены `matomo` и `matomo_db`.
- В `nginx.conf` добавлен `analytics.madcore-kavkaz.ru`.
- Добавлены GitHub Actions:
  - `.github/workflows/ci.yml`
  - `.github/workflows/deploy.yml`
- Добавлены документы:
  - `docs/ADTECH_ARCHITECTURE.md`
  - `docs/TRAFFIC_GATE.md`
  - `docs/LEAD_QUALITY_GATE.md`
  - `docs/MATOMO_PRODUCTION_SETUP.md`
  - `docs/YANDEX_METRIKA_SETUP.md`
  - `docs/YANDEX_DIRECT_API.md`
  - `docs/OFFLINE_CONVERSIONS.md`
  - `docs/CI_CD_DEPLOYMENT.md`
  - `docs/SECURITY.md`
  - `docs/RUNBOOK.md`
  - `docs/REPORTING.md`
  - `docs/FINAL_REPORT.md`
- Добавлены Mermaid-диаграммы и SVG по архитектуре, потоку трафика и выкладке.
- Во входных документах агента закреплен единый русский технический язык без суржика.

## 2026-05-14

### Call CTA и production deploy

- На первом экране и на `/thanks` добавлена отдельная CTA-кнопка `Позвонить / +79995566777` с `tel:`-ссылкой для мобильного вызова.
- CTA-сетка перегруппирована так, чтобы кнопка звонка не ломала текущую композицию hero и thanks-страницы.
- Изменения выложены на production `https://madcore-kavkaz.ru` и подтверждены по live HTML.

### Server safety и SSL recovery

- Во время первого `rsync --delete` были затронуты server-директории `/opt/madcore-gena/certbot` и `/opt/madcore-gena/backups`; это зафиксировано как operational incident.
- Перед восстановлением создан новый backup БД: `/opt/madcore-gena/backups/db/madcore-db-20260514-125205.sql.gz`.
- SSL на сервере восстановлен через повторный `certbot certonly`, после чего renewal-lineage снова подтвержден как `webroot`.
- Успешно пройден явный dry-run через `webroot`:
  - `docker compose --profile manual run --rm certbot certonly --dry-run --webroot -w /var/www/certbot -d madcore-kavkaz.ru -d www.madcore-kavkaz.ru ...`
- Пересобран и проверен production `app`, smoke для `https://madcore-kavkaz.ru` снова проходит.
- Обновлен server script `scripts/server-certbot-renew.sh`: renewal теперь запускается с явным `--webroot -w /var/www/certbot`.

### Документация и правила входа агента

- Для задач по Hostkey/VPS/API теперь обязательно сначала читать локальный файл `/home/max/SERVWER 2/api.txt`.
- Содержимое этого файла считается чувствительным и не должно копироваться в git, docs, checkpoint-файлы и desktop prompt.
- Deployment docs усилены safe-rsync правилами и запретом синхронизировать server-side `certbot/` и `backups/`.
- Добавлен новый dated checkpoint `docs/checkpoints/CHECKPOINT_2026-05-14.md` и он должен использоваться как следующая точка входа.

## 2026-05-11

### Closeout checkpoint

- Добавлены root-документы `ARCHITECTURE.md` и `NEXT_STEPS.md`.
- Добавлен dated checkpoint `docs/checkpoints/CHECKPOINT_2026-05-11.md` и копия на рабочем столе пользователя.
- Обновлены agent-entry rules в `AGENTS.md`: новые сессии должны читать root architecture/next steps и последний checkpoint.
- Перед commit выполнены проверки git status, remote, secret-scan, lint, typecheck/build и production smoke.

### Traffic readiness и архитектурная ревизия

- Исправлен адрес на сайте: `улица Тарчокова 50, офисное здание, 2-ой этаж, офис 24`.
- Успешный lead-flow теперь фиксирует `form_submit`, `lead` и `lead_notify`.
- `lead_notify` сохраняет результат Telegram-уведомления: `lead_id`, `ok`, `channel`, `reason`.
- Добавлен production smoke script `scripts/production-smoke.sh`.
- `/go` теперь строит редиректы от публичного `PUBLIC_BASE_URL`, чтобы за nginx не раскрывать внутренний `localhost:3000`.
- Добавлены server scripts для backup БД и CSV-отчета качества заявок:
  - `scripts/server-db-backup.sh`
  - `scripts/server-export-lead-quality-report.sh`
- Добавлены документы:
  - `docs/ARCHITECTURE_REVIEW.md`
  - `docs/TRAFFIC_READINESS.md`
- Чек-листы рекламы, аналитики и UTM обновлены под Яндекс.Директ и PostgreSQL/CSV-контроль качества.
- Прямой `postcss` закреплен на `8.5.14`; `npm audit fix --force` не использовать.
- Docker build переведен на `package-lock.json` и `npm ci`, чтобы production-сборка была воспроизводимой.
- Production обновлен и проверен: smoke passed, адрес обновлен в HTML, test lead `id=13` создал `form_submit`, `lead`, `lead_notify`.
- На сервере проверены `server-db-backup.sh` и `server-export-lead-quality-report.sh`.

### Telegram-only notify

- Server-обработка заявок переведена на стабильную схему: все лиды уходят в один Telegram-чат менеджера.
- Внутренний dispatcher упрощен до Telegram-only notify без активной попытки отправки в WhatsApp API.
- В Telegram-сообщении теперь явно разделены:
  - выбранный клиентом канал связи
  - действие менеджера: написать в Telegram / написать в WhatsApp / связаться звонком
- WhatsApp Cloud API код оставлен в проекте как неактивная заготовка на будущее.
- Production `.env` обновлен `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` для текущей лички бота.
- Live test подтвердил новую схему на production для `telegram`, `whatsapp` и `call`.
- Документация и checkpoint обновлены под новую архитектуру обработки заявок.

## 2026-05-10

### Production cutover

- Домен `madcore-kavkaz.ru` переведен на Hostkey VPS `151.247.197.153` через TimeWeb DNS без переноса домена.
- Apex `A` обновлен на `151.247.197.153`, для `www` создана отдельная `A`-запись на тот же IP.
- Перед изменениями сохранены backup DNS-зоны, server `nginx.conf` и server `.env`.
- `MX` и `TXT` записи в TimeWeb не изменялись.
- На сервере изменен только `PUBLIC_BASE_URL=https://madcore-kavkaz.ru`; `TELEGRAM_GROUP_URL`, `WHATSAPP_URL` и `PUBLIC_PHONE` сохранены как production source of truth.
- Preview override на `:3000` остановлен как публичный entrypoint.
- Выпущен Let's Encrypt сертификат для `madcore-kavkaz.ru` и `www.madcore-kavkaz.ru`.
- `nginx` настроен на:
  - `http -> https`
  - `www -> apex`
  - proxy в `app:3000`
- Production smoke-check подтвержден:
  - `https://madcore-kavkaz.ru`
  - `https://madcore-kavkaz.ru/privacy`
  - `https://madcore-kavkaz.ru/thanks`
  - валидный `POST /api/lead`

### Документация

- `README.md`, `docs/START_HERE_FOR_NEW_CHAT.md`, `docs/AGENT_CHECKPOINT.md`, `docs/PROJECT_STATUS.md`, `docs/PROJECT_CHECKPOINT.md`, `docs/DEPLOYMENT.md`, `docs/DEPLOY_UBUNTU_VPS.md` обновлены под новый production-state.

### Operational hardening

- Certbot renewal lineage переведен с `standalone` на `webroot`.
- Добавлен versioned renewal-script `scripts/server-certbot-renew.sh`.
- Добавлены versioned systemd unit/timer:
  - `ops/systemd/madcore-certbot-renew.service`
  - `ops/systemd/madcore-certbot-renew.timer`
- На сервере включен `madcore-certbot-renew.timer`.
- `certbot renew --dry-run` подтверждает, что продление больше не зависит от освобождения `80`.

### Deliverables

- Добавлен reproducible export-script `scripts/export-production-deliverables.sh`.
- С production-домена `https://madcore-kavkaz.ru` пересобраны новые клиентские артефакты:
  - `docs/deliverables/MADCORE-Gena-site-client-review-2026-05-10.pdf`
  - `docs/deliverables/MADCORE-Gena-site-highres-review-2026-05-10.png`

### Mobile QA

- Получены пользовательские мобильные скриншоты production-домена.
- По итогам просмотра блокирующих проблем верстки не найдено.
- Отдельных UI-правок по mobile pass не потребовалось.

### GitHub publication

- Локальный remote `origin` настроен на `git@github.com:MaxCorpOrg/MADCORE-website.git`.
- Ветка `main` опубликована в `origin/main` без `force push`.

## 2026-05-09

### Контрольная точка проекта

- Зафиксирован текущий working state проекта как новая документированная контрольная точка.
- Добавлены документы `docs/PROJECT_STATUS.md`, `docs/DEPLOYMENT.md`, `docs/CHANGELOG.md`, `docs/AGENT_CHECKPOINT.md`.
- Обновлены `AGENTS.md`, `README.md`, `docs/START_HERE_FOR_NEW_CHAT.md`, `docs/PROJECT_CHECKPOINT.md` под новый порядок входа агента и handoff.

### Hero и визуал

- Активным hero-ассетом стал `public/images/hero-img-kavkaz-v12-user-provided.png`.
- Предыдущая active-версия hero сохранена как `public/images/hero-img-kavkaz-v11-rounded-a.png`.
- В `v11` локально скруглен выступающий угол на букве `a` на коробке hero-изображения.
- Сохранена прошлая sharpened-версия `public/images/hero-img-kavkaz-v9-user-approved-sharpened.png` для отката и сравнения.
- Главный hero-heading переразложен и укрупнен внутри левой текстовой области без изменений CTA, stats и product-card.
- Длинный hero-heading заменен на отдельный 3-пунктный feature block с видимыми тире и управляемыми переносами строк.
- Из hero удалена строка `Оставить заявку на консультацию`, чтобы mobile-композиция не проваливалась в stats.
- В блоке `Как сделать заказ` шаг 2 изменен на `Или оформите заявку на консультацию`.
- Для подбора пропорций текстового блока использован reference-pass через OpenAI Image 2; финальная реализация осталась в HTML/CSS без нового bitmap-ассета.

### Лиды и уведомления

- На production подтверждено, что `POST /api/lead` пишет в PostgreSQL таблицу `leads` через Prisma.
- В коде выделен единый formatter lead-сообщения.
- Добавлен Telegram-path для server-уведомлений.
- Добавлен WhatsApp Cloud API path с Telegram-fallback, если production env для WhatsApp еще не заполнен.
- Live test `2026-05-10` создал новые строки в `leads`, но также показал, что на production сейчас пусты `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`, поэтому server-уведомления пока пропускаются с `missing_telegram_config`.
- После замены первого hero-изображения на `public/images/hero-img-kavkaz-v12-user-provided.png` production `PDF + PNG` deliverables от `2026-05-10` пересобраны повторно.

### Инфраструктура и preview

- Для preview-режима используются `.dockerignore` и `docker-compose.preview.yml`.
- Серверный preview на `151.247.197.153:3000` пересобран и подтвержден после последних изменений hero.

### Проверки

- `npm run lint`
- `npm run build`
- локальный viewport-check на `360/390/768/1024/1440`
- Docker/HTTP-check preview на VPS
