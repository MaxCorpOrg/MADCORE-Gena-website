# MADCORE Gena Deployment

Обновлено: `2026-05-18`

## Кратко

- сервер: `151.247.197.153`
- директория проекта на сервере: `/opt/madcore-gena`
- базовый домен по текущему этапу: `https://gena.madcore-kavkaz.ru`
- `www`: `https://www.gena.madcore-kavkaz.ru`

## Изоляция от основного сайта

Новый проект не должен забирать себе `80/443`, занятые основным `MADCORE`, без отдельного proxy-слоя. Поэтому в текущей подготовке:

- `app` публикуется на `127.0.0.1:3001`
- `nginx` проекта слушает `8081/8444`

Это позволяет держать второй сайт на том же сервере отдельно от текущего production.

## Текущий host-side блокер

На сервере подтверждено, что пользователь `max` не может создать `/opt/madcore-gena` без `sudo`: система запрашивает пароль для privileged-операций.

Это значит, что финальный шаг создания server directory и выкладки в `/opt/madcore-gena` требует либо root-сессии, либо ручного выполнения от администратора сервера.

## Что нужно заполнить до выкладки

- `.env` в `/opt/madcore-gena`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID`
- `MATOMO_SITE_ID`
- при необходимости `YANDEX_DIRECT_CLIENT_LOGIN`

## Безопасная выкладка

```bash
cd /home/max/MADCORE RF
rsync -avz --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.next-dev' \
  --exclude '.data' \
  --exclude '.tmp' \
  --exclude '.env' \
  --exclude '.env.*' \
  --exclude 'certbot/' \
  --exclude 'backups/' \
  /home/max/MADCORE\ RF/ root@151.247.197.153:/opt/madcore-gena/
```

После загрузки:

```bash
cd /opt/madcore-gena
./scripts/server-db-backup.sh
docker compose up -d --build postgres app nginx
docker compose exec -T app npx prisma migrate deploy
./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru
```

## Edge proxy

Чтобы сделать новый поддомен публичным, на сервере нужен отдельный доменный маршрут до нового контура. Предпочтительный вариант:

- основной входной proxy принимает `gena.madcore-kavkaz.ru`;
- дальше запросы уходят в новый контур `MADCORE Gena`;
- основной сайт `madcore-kavkaz.ru` при этом остается без изменений по бизнес-логике.

## Проверка после выкладки

```bash
cd /opt/madcore-gena
docker compose ps
docker compose logs --tail=100 app
docker compose logs --tail=100 nginx
./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru
METRIKA_COUNTER_ID=<new_counter_id> ./scripts/production-adtech-smoke.sh https://gena.madcore-kavkaz.ru
```
