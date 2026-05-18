# MADCORE Gena Start Here

Этот файл нужен для нового чата как быстрый обязательный вход в проект.

## Что прочитать сначала

1. `AGENTS.md`
2. `docs/START_HERE_FOR_NEW_CHAT.md`
3. `docs/AGENT_CHECKPOINT.md`
4. `docs/PROJECT_STATUS.md`
5. `docs/PROJECT_CHECKPOINT.md`
6. `README.md`
7. `docs/DEPLOYMENT.md`
8. `ARCHITECTURE.md`
9. `NEXT_STEPS.md`
10. последний файл из `docs/checkpoints/`, если он есть

## Что это за проект

- отдельный сайт `MADCORE Gena`
- локальный путь: `/home/max/MADCORE RF`
- целевой remote: `git@github.com:MaxCorpOrg/MADCORE-Gena-website.git`
- стек: `Next.js + TypeScript + Tailwind + Prisma + PostgreSQL`
- текущий live preview: `https://gena.madcore-kavkaz.ru`

## Что уже сделано

- создана самостоятельная копия проекта на базе текущего `MADCORE-website`;
- проект переименован в `MADCORE Gena`;
- база CTA переведена на новые контакты:
  - Telegram `vorgesar`
  - WhatsApp `+7 904 244 0444`
  - MaX ссылка
  - новый номер телефона
- добавлен отдельный канал `MaX` в интерфейс и в lead-flow;
- client tracking, cookie и localStorage переведены на `madcore_gena_*`;
- silver-версия без гор уже живет на публичном preview-host;
- для серверной выкладки уже используются:
  - `/opt/madcore-gena`
  - `madcore_gena_postgres`
  - `madcore_gena_app`
  - общий ingress `madcore_nginx`
- через API Яндекс.Метрики уже создан отдельный счетчик `109282367` и заведены отдельные JS-цели проекта;
- в Matomo уже создан отдельный `site id = 2`;
- для preview уже выпущен TLS на `gena.madcore-kavkaz.ru`.
- отдельный Telegram-бот `@MadcoreGenaLeadsBot` уже создан;
- live notify в новый бот подтвержден тестовой заявкой.

## Что еще не закрыто

- финальный домен проекта пока не выбран;
- финальный cutover с preview-host на постоянный домен пока не выполнен;
- при необходимости нужно перевести receiving-chat бота с текущей рабочей лички `AK5` на другой чат или группу;
- после смены домена нужно обновить DNS, TLS, ingress и доменные привязки аналитики.

## Что уже подтверждено дополнительно

- локальный `git` инициализирован, `origin` привязан к `git@github.com:MaxCorpOrg/MADCORE-Gena-website.git`;
- `npm run lint` и `npm run build` проходят;
- `bash ./scripts/repo-adtech-audit.sh` проходит;
- `./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru` проходит;
- `METRIKA_COUNTER_ID=109282367 ./scripts/production-adtech-smoke.sh https://gena.madcore-kavkaz.ru` проходит;
- основной сайт `https://madcore-kavkaz.ru` после включения preview-host остался живым.

## Что обязательно сделать перед серверными действиями

1. Прочитать `/home/max/SERVWER 2/api.txt`.
2. Сверить `docs/PROJECT_STATUS.md` и `docs/PROJECT_CHECKPOINT.md`.
3. Не менять `/home/max/MADCORE`, если задача касается только `MADCORE Gena`.

## Что обязательно сделать перед рекламными действиями

1. Использовать материалы из `/home/max/АПИ/Яндекс АПИ`.
2. Не переиспользовать старый счетчик Метрики и старые `cmp`.
3. Создавать отдельные цели и отдельную разметку под `MADCORE Gena`.
