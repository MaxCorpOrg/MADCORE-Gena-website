# MADCORE Gena Project Checkpoint

Обновлено: `2026-05-19`

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
- metallic-версия без гор развернута и публично доступна на preview-поддомене;
- публичный текст preview синхронизирован с `madcore-kavkaz.ru`, при этом отдельные контакты, аналитика и lead-flow `Gena` сохранены;
- на сервере создан отдельный runtime-контур:
  - `madcore_gena_postgres`
  - `madcore_gena_app`
- новый app-контейнер живет в `/opt/madcore-gena` и доступен через общий ingress основного сервера;
- подключение `madcore_gena_app` к внешней сети `madcore_default` с alias `genaapp` теперь закреплено прямо в `docker-compose.yml`;
- отдельный Telegram bot-flow уже работает через `@MadcoreGenaLeadsBot`;
- проектный `madcore_gena_nginx` в коде остается подготовленным, но в текущем live preview TLS и host-routing обслуживаются общим `madcore_nginx`.

## Сделано

- отдельная рабочая директория заполнена кодом нового проекта;
- `src/config/site.ts` переведен на:
  - preview-host по умолчанию
  - новые ссылки Telegram / WhatsApp / MaX
  - новый номер телефона
  - публичный copy с основного `MADCORE-website`
- `CtaButtons`, `LeadForm`, `lead-message`, `validation` и tracking обновлены под `MaX`;
- server routes `/api/lead`, `/api/event`, `/go` переведены на `madcore_gena_tracking`;
- `docker-compose.yml`, `nginx.conf` и server scripts разведены под `/opt/madcore-gena`;
- preview-host вынесен в настраиваемые переменные окружения;
- добавлен отдельный шаблон `.env.preview.example`;
- `.env.example` и `.env.preview.example` обновлены под публичный `PRODUCT_NAME=MADCORE 2.0` и новый `PUBLIC_ADDRESS`;
- через OpenAI Image2 сгенерированы и подключены:
  - `public/images/hero-metallic-premium-v1.png`
  - `public/images/product-metallic-card-v1.png`
  - `public/images/background-metallic-brushed-v1.png`
  - `public/images/favicon-metallic-loop-v1.png`
- исходный gold-logo `madcore-logo-ai-gold-transparent.png` переведен в metallic wordmark через CSS без изменения формы букв;
- `src/app/icon.png`, `src/app/apple-icon.png` и `src/app/favicon.ico` заменены на новый металлический favicon-набор;
- helper `scripts/print-yandex-direct-campaign-links.sh` переведен на `madcore_gena_*`;
- через API Яндекс.Метрики создан отдельный счетчик `109282367` и отдельные JS-цели проекта;
- в Matomo создан отдельный сайт `MADCORE Gena preview` с `site id = 2`;
- через Timeweb DNS добавлены `gena.madcore-kavkaz.ru` и `www.gena.madcore-kavkaz.ru`;
- выпущен Let's Encrypt сертификат для preview-host и `www`, действующий до `2026-08-16`;
- на сервере развернут preview-контур в `/opt/madcore-gena`;
- общий ingress сервера проксирует preview-host на `genaapp:3000`.
- через `BotFather` создан отдельный бот `@MadcoreGenaLeadsBot`;
- в `/opt/madcore-gena/.env` заполнены `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` для текущей рабочей лички Telegram-аккаунта `AK5`;
- `madcore_gena_app` пересоздан на VPS с новым Telegram-конфигом.
- `2026-05-19` live preview перевыкатан с новым metallic visual и source-copy;
- на сервере обновлены live overrides:
  - `PRODUCT_NAME=MADCORE 2.0`
  - `PUBLIC_ADDRESS=Наш офис находится в Нальчике, на улице Тарчокова 50, в офисном здании, 2-ой этаж, офис 24.`

## Что проверено

- `npm run lint` проходит;
- `npm run build` проходит;
- `bash ./scripts/repo-adtech-audit.sh` проходит;
- локальные desktop/mobile screenshots подтверждают metallic first screen без гор;
- `https://gena.madcore-kavkaz.ru/` отвечает `200`;
- `https://gena.madcore-kavkaz.ru/api/health` отвечает `200`;
- `https://www.gena.madcore-kavkaz.ru/` отдает `301` на apex preview-host;
- `./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru` проходит;
- `METRIKA_COUNTER_ID=109282367 ./scripts/production-adtech-smoke.sh https://gena.madcore-kavkaz.ru` проходит;
- live desktop/mobile screenshots подтверждают, что новый логотип, hero, product-card и обновленный copy уже отдаются с preview-host;
- live `curl` подтверждает отдачу:
  - `/icon.png`
  - `/apple-icon.png`
  - `/favicon.ico`
- live test `2026-05-18` через server-side `POST /api/lead` вернул `200` и создал `lead id = 1`;
- уведомление о тестовой заявке пришло в `@MadcoreGenaLeadsBot`;
- после server-side `app recreate` routing preview-host восстановлен и повторный production smoke снова прошел штатно;
- дополнительный post-fix test lead после обновленного `docker-compose.yml` создал `lead id = 2`, и notify снова дошел в `@MadcoreGenaLeadsBot`;
- основной production `https://madcore-kavkaz.ru` после добавления preview-маршрутов отвечает штатно.

## Не завершено

- финальный live-домен не выбран;
- финальный доменный cutover не выполнен.

## Что делать дальше

1. После выбора финального домена заменить preview-host в DNS, TLS, ingress и `.env`.
2. При необходимости обновить привязки Метрики и Matomo под финальный домен.
3. Если лиды должны приходить не в текущую личку `AK5`, запустить бота из нового чата и обновить `TELEGRAM_CHAT_ID`.
4. Если нужен следующий маркетинговый шаг, на базе текущего metallic-pack сделать отдельные рекламные creatives и performance-баннеры.
