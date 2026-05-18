# Матрица аудита рекламно-аналитического контура

Обновлено: `2026-05-17`

Документ нужен как короткая доказательная матрица: что подтверждено локально, что подтверждено через внешние API, что уже доказано на live и что еще остается отдельным этапом.

## Легенда статусов

- `Подтверждено локально` — есть прямое подтверждение по коду, локальной сборке или локальному сценарию.
- `Подтверждено через API` — есть прямое подтверждение через API Яндекса.
- `Подтверждено на live` — боевой сайт уже доказал реальную работу.
- `Подтверждено на VPS` — server-side шаг выполнен на боевом сервере.
- `Не закрыто` — работа еще нужна, но это уже не блокер доступа.

## Матрица

| Область | Требование | Статус | Подтверждение | Что еще нужно |
|---|---|---|---|---|
| Яндекс.Метрика | Счетчик существует | Подтверждено через API | счетчик `109236645` | нет |
| Яндекс.Метрика | JavaScript-цели созданы | Подтверждено через API | цели `560146801`–`560146807` | нет |
| Яндекс.Метрика | Код счетчика встроен в проект | Подтверждено локально | `src/components/YandexMetrika.tsx`, `scripts/repo-adtech-audit.sh` | нет |
| Яндекс.Метрика | Сайт реально отдает код Метрики | Подтверждено на live | `scripts/production-adtech-smoke.sh`, поиск `mc.yandex.ru` и `109236645` в client bundle | дождаться обновления `code_status` в интерфейсе Метрики |
| Яндекс.Метрика | `ClientID` сохраняется в tracking-цепочке | Подтверждено локально | `src/components/YandexMetrika.tsx`, `src/lib/client-tracking.ts` | дополнительно проверить реальные live-хиты в интерфейсе Метрики |
| Tracking | `yclid` хранится в клиентской tracking-модели | Подтверждено локально | `src/types/tracking.ts`, `src/lib/client-tracking.ts` | нет |
| Tracking | `/go` сохраняет `yclid`, `decision_in`, `score_in_bucket` | Подтверждено локально | `src/app/go/route.ts`, `scripts/repo-adtech-audit.sh` | нет |
| Tracking | `/go` на live корректно редиректит хороший трафик | Подтверждено на live | `scripts/production-adtech-smoke.sh` | нет |
| Tracking | `/go` на live уводит подозрительный трафик на `/safe` | Подтверждено на live | `scripts/production-adtech-smoke.sh` | нет |
| Safe page | `/safe` нейтральна и помечена `noindex` | Подтверждено на live | `scripts/production-adtech-smoke.sh` | нет |
| События | Клиентские события страницы и поведения существуют | Подтверждено локально | `TrackClient`, `scripts/repo-adtech-audit.sh` | нет |
| События | CTA-события существуют | Подтверждено локально | `CtaButtons`, `scripts/repo-adtech-audit.sh` | нет |
| События | Форма пишет `form_start`, `form_submit`, `lead` | Подтверждено локально | `LeadForm`, `POST /api/lead`, `scripts/repo-adtech-audit.sh` | нет |
| События | Сервер пишет `traffic_gate`, `lead_notify`, `manager_status`, `qualified_lead`, `bad_lead`, `sale` | Подтверждено локально | `scripts/repo-adtech-audit.sh` | нет |
| Admin | `/admin/leads` существует в приложении | Подтверждено локально | `src/app/admin/leads/page.tsx`, `npm run build` | нет |
| Admin | `/admin/*` и `/api/admin/*` защищены | Подтверждено на live | `src/middleware.ts`, `src/lib/admin-auth.ts`, `scripts/production-adtech-smoke.sh` | нет |
| Admin | `/admin/leads` реально доступен после авторизации | Подтверждено на live | `401` без auth и `200` с auth | нет |
| Admin | `/api/admin/reports/traffic-quality` реально доступен после авторизации | Подтверждено на live | `401` без auth и `200` с auth | нет |
| Яндекс.Директ | API-доступ подтвержден | Подтверждено через API | `docs/YANDEX_DIRECT_API.md` | нет |
| Яндекс.Директ | Подтвержден `Client-Login` `Max.Corp.Org` | Подтверждено через API | API и `.env.example` | нет |
| Яндекс.Директ | Созданы неактивные черновые кампании | Подтверждено через API и интерфейс | API: `709948992`, `709948993`, `709948994`; интерфейс: дополнительно `709960424` | первые три подтверждены как `Поиск+РСЯ`; 4-я подтверждена в интерфейсе как `Телеграм-каналы`; текущий API-токен пока не возвращает ее так же надежно, как 3 обычные кампании |
| Яндекс.Директ | Кампании не расходуют бюджет | Подтверждено через API | `State=OFF`, `Status=DRAFT` | нет |
| Яндекс.Директ | Группы, объявления и ключевые фразы пока не создавались | Подтверждено через API | аудит аккаунта | это и есть следующий этап |
| Offline conversions | Экспорт `ClientID + yclid` подготовлен | Подтверждено локально | `scripts/export-qualified-leads-for-yandex.sh` | сделать первую реальную выгрузку после появления qualified lead |
| Безопасность | `.env.local` существует, но не отслеживается в git | Подтверждено локально | `git ls-files`, `docs/SECURITY.md` | нет |
| Безопасность | `.gitignore` и `.dockerignore` защищают `.env*` | Подтверждено локально | `.gitignore`, `.dockerignore` | нет |
| Production activation | Shell-доступ к VPS есть | Подтверждено на VPS | прямой `SSH` и вход по ключу | нет |
| Production activation | `/opt/madcore-gena` распознан как snapshot, а не git clone | Подтверждено на VPS | server-side аудит | нет |
| Production activation | Server `.env` приведен к рабочему состоянию для рекламного слоя | Подтверждено на VPS | `server-adtech-readiness` прошел | нет |
| Production activation | Сценарий активации реально выполнен на VPS | Подтверждено на VPS | backup `.env`, rebuild, `prisma migrate deploy`, smoke | нет |
| Production activation | `production-smoke` проходит | Подтверждено на live | боевой smoke | нет |
| Production activation | `production-adtech-smoke` проходит | Подтверждено на live | боевой adtech-smoke | нет |

## Что уже закрыто как бывший блокер

- shell-доступ к VPS больше не является блокером;
- доступ по ключу уже установлен и работает;
- `/admin/leads` больше не отвечает `404`, а защищен авторизацией;
- live-сайт больше не считается “без Метрики”: код счетчика подтвержден в клиентском bundle.

## Что реально осталось на следующий этап

1. Поднять `Matomo` и `analytics.madcore-kavkaz.ru`.
2. Проверить в интерфейсе Метрики первые live-хиты и обновление `code_status`.
3. Подготовить первую боевую выгрузку `qualified_lead` / `sale`.
4. Наполнить 4 подтвержденные кампании Яндекс.Директа группами, объявлениями и ключевыми фразами без запуска бюджета.
