# Автоматическая проверка и выкладка

## Цель

Сделать воспроизводимую проверку и безопасную выкладку без ручного копирования файлов по памяти.

## Что уже подготовлено

- `/.github/workflows/ci.yml`
- `/.github/workflows/deploy.yml`

## Проверка в GitHub Actions

`ci.yml` делает:

1. `npm ci`
2. `npx prisma generate`
3. `npm run lint`
4. `npm run build`
5. проверку утечек через `gitleaks`

## Выкладка в GitHub Actions

`deploy.yml` делает:

1. повторную сборку и проверку
2. подключение по SSH
3. `rsync` снимка проекта в `/opt/madcore-gena`
4. `./scripts/server-db-backup.sh`
5. `docker compose up -d --build postgres app nginx`
6. `docker compose exec -T app npx prisma migrate deploy`
7. `./scripts/production-smoke.sh`

## Какие секреты нужны в GitHub

- `SSH_HOST`
- `SSH_USER`
- `SSH_PRIVATE_KEY`
- `SSH_PORT`
- `DEPLOY_PATH`
- `PRODUCTION_BASE_URL`

## Что не должно перезаписываться

Во время `rsync` исключаются:

- `.env*`
- `.data/`
- `.tmp/`
- `.next/`
- `.next-dev/`
- `node_modules/`
- `certbot/`
- `backups/`

## Почему выбран `rsync`, а не `git pull`

Текущий production-путь `/opt/madcore-gena` используется как снимок проекта для Docker-сборки. Это ближе к стабильной выкладке готового состояния, чем к постоянной работе внутри git-репозитория на сервере.
