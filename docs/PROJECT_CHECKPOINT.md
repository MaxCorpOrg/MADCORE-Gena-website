# MADCORE Gena Project Checkpoint

Обновлено: `2026-05-18`

## Проект

- название: `MADCORE Gena`
- локальный путь: `/home/max/MADCORE RF`
- плановый remote: `git@github.com:MaxCorpOrg/MADCORE-Gena-website.git`
- временный preview URL: `https://gena.madcore-kavkaz.ru`
- рабочая server directory: `/opt/madcore-gena`

## Текущее состояние

- новый проект уже отделен от исходного сайта на уровне кода и базовых настроек;
- старый сайт `/home/max/MADCORE` при этом не изменяется;
- серебряная тема заведена в глобальные CSS-переменные и CTA-стили;
- новый канал `MaX` проходит через интерфейс, валидацию и lead-notify формат;
- deployment defaults переведены на новый контур и новые container names;
- локальный `git` уже инициализирован и привязан к `MaxCorpOrg/MADCORE-Gena-website`.

## Сделано

- отдельная рабочая директория заполнена кодом нового проекта;
- `src/config/site.ts` переведен на:
  - новый домен по умолчанию
  - новые ссылки Telegram / WhatsApp / MaX
  - новый номер телефона
  - отдельные тексты под `MADCORE Gena`
- `CtaButtons`, `LeadForm`, `lead-message`, `validation` и tracking обновлены под `MaX`;
- server routes `/api/lead`, `/api/event`, `/go` переведены на `madcore_gena_tracking`;
- `docker-compose.yml`, `nginx.conf` и server scripts разведены под `/opt/madcore-gena`;
- preview-host вынесен в настраиваемые переменные окружения для последующей замены на финальный домен без переписывания проекта;
- добавлен отдельный шаблон `.env.preview.example` для временного адреса проверки;
- рекламный helper `scripts/print-yandex-direct-campaign-links.sh` переведен на `madcore_gena_*`.
- через API Яндекс.Метрики создан отдельный счетчик `109282367` и отдельные JS-цели проекта.
- hero, product и wordmark переведены на серебряные ассеты без гор;
- активная документация нового проекта очищена от legacy-контекста, старые материалы вынесены в `docs/archive-origin/`.

## Что проверено

- проектная структура отделена от исходного сайта локально;
- основные кодовые точки конфигурации, CTA, lead-flow и tracking обновлены;
- deployment defaults больше не указывают на `/opt/madcore`;
- `npm run lint` проходит;
- `npm run build` проходит;
- `bash ./scripts/repo-adtech-audit.sh` проходит;
- локальный browser screenshot подтверждает серебряный first screen без гор.
- Matomo admin-учетка логинится, но вызов `SitesManager.addSite` возвращает `401 superuser required`.

## Не завершено

- нет production-бота;
- нет отдельного `site id` Matomo;
- нет финального live-домена и server-side proxy под него;
- не выполнен production deployment на сервер.

## Что делать дальше

1. Отправить подготовленное состояние в удаленный репозиторий.
2. Подготовить отдельные внешние интеграции.
3. Заполнить production `.env`.
4. Подготовить server deployment и доменный proxy.
