# MADCORE Gena Checkpoint `2026-05-18` Telegram Bot Live

## Что завершено

- через `BotFather` создан отдельный Telegram-бот `@MadcoreGenaLeadsBot`;
- текущий preview-inbox привязан к рабочей личке Telegram-аккаунта `AK5`;
- на VPS `151.247.197.153` в `/opt/madcore-gena/.env` заполнены `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`;
- перед обновлением окружения создан backup `.env` по шаблону `.env.backup-YYYYMMDD-HHMMSS`;
- `madcore_gena_app` пересоздан командой `docker compose up -d --force-recreate app`.
- `docker-compose.yml` исправлен так, чтобы `madcore_gena_app` всегда подключался к внешней сети `madcore_default` с alias `genaapp`.

## Что подтверждено

- `docker compose ps` на VPS показывает:
  - `madcore_gena_postgres` healthy
  - `madcore_gena_app` healthy
- `curl http://127.0.0.1:3001/api/health` на VPS возвращает `{"ok":true,...}`;
- live test `2026-05-18` через server-side `POST /api/lead` вернул `200` и создал `lead id = 1`;
- notify о тестовой заявке пришел в `@MadcoreGenaLeadsBot`.
- после фикса сети `genaapp` публичный `./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru` снова проходит.
- дополнительный post-fix test lead после обновленного `docker-compose.yml` создал `lead id = 2`, и notify снова пришел в `@MadcoreGenaLeadsBot`.

## Что важно помнить

- токен бота не хранится в git и должен оставаться только в server-side `.env`;
- текущий preview-host `https://gena.madcore-kavkaz.ru` остается временным адресом для проверки;
- основной проект `/home/max/MADCORE` не тронут.

## Что делать дальше

1. Выбрать финальный домен проекта.
2. Обновить DNS, TLS, ingress и `.env` под финальный домен.
3. Если receiving-chat должен быть не текущая личка `AK5`, запустить бота из нужного чата и обновить `TELEGRAM_CHAT_ID`.
