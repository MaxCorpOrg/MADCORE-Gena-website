# Запуск на Ubuntu VPS

Актуальный production-сценарий для проекта уже реализован:

1. технический preview по IP `151.247.197.153:3000` остается как fallback;
2. боевой сайт обслуживается по `https://madcore-kavkaz.ru` через `nginx + Let's Encrypt`.

Ниже описан поток без `origin` и без `git clone`: код заливается на сервер как snapshot через `rsync`.

## 1. Подготовка локального проекта

Перед отправкой на сервер:

```bash
cd /home/max/MADCORE RF
npm run build
npm run lint
```

## 2. Подготовка сервера

Если Docker еще не установлен:

```bash
apt update && apt upgrade -y
apt install -y docker.io docker-compose-plugin rsync
systemctl enable docker
systemctl start docker
```

Подготовка директории проекта:

```bash
mkdir -p /opt/madcore-gena
mkdir -p /opt/madcore-gena/backups
mkdir -p /opt/madcore-gena/certbot/www
mkdir -p /opt/madcore-gena/certbot/conf
```

## 3. Загрузка snapshot на сервер через rsync

Важно: каталоги `/opt/madcore-gena/certbot` и `/opt/madcore-gena/backups` являются server-side operational state и не должны попадать под `rsync --delete`.

С локальной машины:

```bash
rsync -avz --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.next-dev' \
  --exclude '.data' \
  --exclude '.tmp' \
  --exclude '.env' \
  --exclude '.env.local' \
  --exclude '.env.production' \
  --exclude 'certbot/' \
  --exclude 'backups/' \
  --exclude 'tsconfig.tsbuildinfo' \
  --exclude 'docs/deliverables' \
  /home/max/MADCORE RF/ root@151.247.197.153:/opt/madcore-gena/
```

## 4. Preview-этап по IP

На сервере:

```bash
cd /opt/madcore-gena
cp .env.example .env
```

Заполните `.env` минимум так:

```dotenv
DATABASE_URL=postgresql://madcore:madcore@postgres:5432/madcore?schema=public
MADCORE_STORAGE_MODE=prisma

TELEGRAM_GROUP_URL=...
WHATSAPP_URL=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
# WhatsApp Cloud API ниже можно оставить пустым:
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_TO_NUMBER=
WHATSAPP_API_VERSION=v22.0
PUBLIC_PHONE=...
PUBLIC_ADDRESS=Наш офис находится в Нальчике, на улице Тарчокова 50, в офисном здании, 2-ой этаж, офис 24.
PUBLIC_PRICE=14000
PRODUCT_NAME=MADCORE Gena

MATOMO_URL=
MATOMO_SITE_ID=
NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID=109236645
PUBLIC_BASE_URL=http://151.247.197.153:3000
SAFE_MODE_DISABLE_MATOMO=true
GO_SUSPICIOUS_REDIRECT=/safe
RATE_LIMIT_MAX_CLICKS_PER_MINUTE=15
RATE_LIMIT_MAX_LEADS_PER_15_MIN=4
MIN_FORM_FILL_SECONDS=3
```

Запуск preview:

```bash
docker compose -f docker-compose.yml -f docker-compose.preview.yml up -d --build postgres app
```

Проверка:

```bash
docker compose -f docker-compose.yml -f docker-compose.preview.yml ps
docker compose -f docker-compose.yml -f docker-compose.preview.yml logs --tail=100 app
curl -I http://151.247.197.153:3000/
curl -I http://151.247.197.153:3000/privacy
```

## 5. Переход на боевой домен

Перед production cutover обязательно:

1. сохранить backup DNS-зоны;
2. сохранить backup server `nginx.conf` и `.env`;
3. перепроверить live `record id` apex `A`;
4. убедиться, что `80/443` свободны;
5. убедиться, что `docker compose --profile manual run --rm certbot --version` работает;
6. использовать уже созданный счетчик Яндекс.Метрики `109236645` и подготовить его для production `.env`.

На сервере менять только:

- `PUBLIC_BASE_URL=https://madcore-kavkaz.ru`
- `NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID=109236645`

`TELEGRAM_GROUP_URL`, `WHATSAPP_URL` и `PUBLIC_PHONE` без отдельного согласования не менять.

Для server-уведомлений по заявкам:

- `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` включают единственный активный notify-path.
- Все лиды уходят в один Telegram-чат менеджера.
- Выбранный клиентом канал (`telegram` / `whatsapp` / `call`) приходит в Telegram как пометка для дальнейшего действия.
- `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` и `WHATSAPP_TO_NUMBER` в текущей архитектуре не обязательны и не используются.
- На production эта схема уже подтверждена живыми тестовыми лидами и успешными `Lead notification result { ok: true, skipped: false, channel: 'telegram' }`.

Остановить preview override и подготовить SSL:

```bash
cd /opt/madcore-gena
docker compose -f docker-compose.yml -f docker-compose.preview.yml down
docker compose --profile manual run --rm --service-ports certbot certonly \
  --standalone \
  -d madcore-kavkaz.ru \
  -d www.madcore-kavkaz.ru \
  --email max.corp.org@gmail.com --agree-tos --no-eff-email
docker compose up -d postgres app nginx
```

## 6. Что сейчас реально настроено в production

- DNS apex и `www` указывают на `151.247.197.153`
- `http://madcore-kavkaz.ru` -> `301` на `https://madcore-kavkaz.ru`
- `http://www.madcore-kavkaz.ru` -> `301` на `https://madcore-kavkaz.ru`
- `https://www.madcore-kavkaz.ru` -> `301` на `https://madcore-kavkaz.ru`
- приложение проксируется через `nginx` в `app:3000`

## 7. Продление сертификата

Актуальный production-способ:

1. перевести renewal lineage на `webroot`;
2. установить versioned server script `scripts/server-certbot-renew.sh`;
3. установить `systemd` unit/timer из `ops/systemd/`.

Команды на сервере:

```bash
cd /opt/madcore-gena
docker compose --profile manual run --rm certbot reconfigure -n \
  --cert-name madcore-kavkaz.ru \
  --webroot -w /var/www/certbot

cp /opt/madcore-gena/ops/systemd/madcore-certbot-renew.service /etc/systemd/system/
cp /opt/madcore-gena/ops/systemd/madcore-certbot-renew.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now madcore-certbot-renew.timer

docker compose --profile manual run --rm certbot certonly --dry-run \
  --webroot -w /var/www/certbot \
  -d madcore-kavkaz.ru -d www.madcore-kavkaz.ru \
  --email max.corp.org@gmail.com --agree-tos --no-eff-email --non-interactive
```

Текущий renewal-script:

```bash
/opt/madcore-gena/scripts/server-certbot-renew.sh
```

## 8. Финальная проверка

Preview:

```bash
docker compose -f docker-compose.yml -f docker-compose.preview.yml ps
docker compose -f docker-compose.yml -f docker-compose.preview.yml logs --tail=100 app
curl -I http://151.247.197.153:3000/
curl -I http://151.247.197.153:3000/privacy
```

Production:

```bash
getent hosts madcore-kavkaz.ru
getent hosts www.madcore-kavkaz.ru
docker compose ps
docker compose logs --tail=100 app
docker compose logs --tail=100 nginx
curl -I http://madcore-kavkaz.ru
curl -I https://madcore-kavkaz.ru
curl -I http://www.madcore-kavkaz.ru
curl -I https://www.madcore-kavkaz.ru
curl -I https://madcore-kavkaz.ru/privacy
curl -I https://madcore-kavkaz.ru/thanks
./scripts/production-smoke.sh https://madcore-kavkaz.ru
```

## 9. Backup и отчеты по лидам

Backup PostgreSQL на сервере:

```bash
cd /opt/madcore-gena
./scripts/server-db-backup.sh
```

CSV-отчет качества заявок:

```bash
cd /opt/madcore-gena
DAYS=7 ./scripts/server-export-lead-quality-report.sh
```

Отчеты и backup-файлы создаются в `/opt/madcore-gena/backups` и не должны попадать в git.
