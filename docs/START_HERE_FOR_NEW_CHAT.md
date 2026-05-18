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
- основное доменное допущение по текущему этапу: `https://gena.madcore-kavkaz.ru`

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
- для серверной выкладки подготовлены отдельные defaults:
  - `/opt/madcore-gena`
  - `app` через `127.0.0.1:3001`
  - `nginx` через `8081/8444`
- для рекламы подготовлены отдельные `cmp`-сегменты `madcore_gena_*`.

## Что еще не закрыто

- отдельный бот Telegram пока не создан и токены не заполнены;
- отдельный счетчик Яндекс.Метрики и отдельные цели пока не созданы;
- отдельный `site id` в Matomo пока не создан;
- production deployment и DNS cutover пока не выполнены;
- внешние production-интеграции еще не заполнены.

## Что уже подтверждено дополнительно

- локальный `git` инициализирован, `origin` привязан к `git@github.com:MaxCorpOrg/MADCORE-Gena-website.git`;
- `npm run lint` и `npm run build` проходят;
- `bash ./scripts/repo-adtech-audit.sh` проходит;
- first screen визуально проверен в браузере: серебряная версия без гор активна.

## Что обязательно сделать перед серверными действиями

1. Прочитать `/home/max/SERVWER 2/api.txt`.
2. Сверить `docs/PROJECT_STATUS.md` и `docs/PROJECT_CHECKPOINT.md`.
3. Не менять `/home/max/MADCORE`, если задача касается только `MADCORE Gena`.

## Что обязательно сделать перед рекламными действиями

1. Использовать материалы из `/home/max/АПИ/Яндекс АПИ`.
2. Не переиспользовать старый счетчик Метрики и старые `cmp`.
3. Создавать отдельные цели и отдельную разметку под `MADCORE Gena`.
