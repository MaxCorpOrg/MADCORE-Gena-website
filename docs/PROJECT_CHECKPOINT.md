# MADCORE Gena Project Checkpoint

Обновлено: `2026-05-18`

## Проект

- название: `MADCORE Gena`
- локальный путь: `/home/max/MADCORE RF`
- remote: `git@github.com:MaxCorpOrg/MADCORE-Gena-website.git`
- текущий live preview: `https://gena.madcore-kavkaz.ru`
- server directory: `/opt/madcore-gena`
- `MATOMO_SITE_ID`: `2`
- `NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID`: `109282367`

## Текущее состояние

- новый проект полностью отделен от исходного сайта на уровне кода;
- основной сайт `/home/max/MADCORE` и его production-маршрут оставлены рабочими;
- silver-версия без гор развернута и публично доступна на preview-поддомене;
- на сервере создан отдельный runtime-контур:
  - `madcore_gena_postgres`
  - `madcore_gena_app`
- новый app-контейнер живет в `/opt/madcore-gena` и доступен через общий ingress основного сервера;
- проектный `madcore_gena_nginx` в коде остается подготовленным, но в текущем live preview TLS и host-routing обслуживаются общим `madcore_nginx`.

## Сделано

- отдельная рабочая директория заполнена кодом нового проекта;
- `src/config/site.ts` переведен на:
  - preview-host по умолчанию
  - новые ссылки Telegram / WhatsApp / MaX
  - новый номер телефона
  - отдельные тексты под `MADCORE Gena`
- `CtaButtons`, `LeadForm`, `lead-message`, `validation` и tracking обновлены под `MaX`;
- server routes `/api/lead`, `/api/event`, `/go` переведены на `madcore_gena_tracking`;
- `docker-compose.yml`, `nginx.conf` и server scripts разведены под `/opt/madcore-gena`;
- preview-host вынесен в настраиваемые переменные окружения;
- добавлен отдельный шаблон `.env.preview.example`;
- helper `scripts/print-yandex-direct-campaign-links.sh` переведен на `madcore_gena_*`;
- через API Яндекс.Метрики создан отдельный счетчик `109282367` и отдельные JS-цели проекта;
- в Matomo создан отдельный сайт `MADCORE Gena preview` с `site id = 2`;
- через Timeweb DNS добавлены `gena.madcore-kavkaz.ru` и `www.gena.madcore-kavkaz.ru`;
- выпущен Let's Encrypt сертификат для preview-host и `www`, действующий до `2026-08-16`;
- на сервере развернут preview-контур в `/opt/madcore-gena`;
- общий ingress сервера проксирует preview-host на `genaapp:3000`.

## Что проверено

- `npm run lint` проходит;
- `npm run build` проходит;
- `bash ./scripts/repo-adtech-audit.sh` проходит;
- локальный browser screenshot подтверждает серебряный first screen без гор;
- `https://gena.madcore-kavkaz.ru/` отвечает `200`;
- `https://gena.madcore-kavkaz.ru/api/health` отвечает `200`;
- `https://www.gena.madcore-kavkaz.ru/` отдает `301` на apex preview-host;
- `./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru` проходит;
- `METRIKA_COUNTER_ID=109282367 ./scripts/production-adtech-smoke.sh https://gena.madcore-kavkaz.ru` проходит;
- основной production `https://madcore-kavkaz.ru` после добавления preview-маршрутов отвечает штатно.

## Не завершено

- нет отдельного Telegram-бота;
- `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` не заполнены;
- финальный live-домен не выбран;
- финальный доменный cutover не выполнен.

## Что делать дальше

1. Создать отдельного Telegram-бота и заполнить его токены в `/opt/madcore-gena/.env`.
2. Перезапустить `madcore_gena_app` и проверить test lead до нового бота.
3. После выбора финального домена заменить preview-host в DNS, TLS, ingress и `.env`.
4. При необходимости обновить привязки Метрики и Matomo под финальный домен.
