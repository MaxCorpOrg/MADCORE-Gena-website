# MADCORE Gena Project Status

Обновлено: `2026-05-18`

## Контрольная точка

- проект: `MADCORE Gena`
- локальный путь: `/home/max/MADCORE RF`
- целевой репозиторий: `MaxCorpOrg/MADCORE-Gena-website`
- базовый production-домен по текущему этапу: `https://gena.madcore-kavkaz.ru`
- отдельная точка развёртывания: `/opt/madcore-gena`

## Что уже сделано

- создана самостоятельная копия проекта на базе `MADCORE-website`;
- проект переименован в `MADCORE Gena`;
- контент и runtime-конфиг переведены на новые контакты и новый бренд;
- добавлен CTA-канал `MaX`;
- lead-flow научен принимать `max` как способ связи;
- client tracking переведен на отдельные cookie/localStorage ключи;
- dev-store переведен на `.data/madcore-gena-dev-store.json`;
- локальный `git` инициализирован и подключен к `git@github.com:MaxCorpOrg/MADCORE-Gena-website.git`;
- подготовлены отдельные deployment defaults:
  - `madcore_gena_postgres`
  - `madcore_gena_app`
  - `madcore_gena_nginx`
  - `/opt/madcore-gena`
- подготовлены отдельные рекламные `cmp`-шаблоны:
  - `madcore_gena_site`
  - `madcore_gena_telegram`
  - `madcore_gena_whatsapp`
  - `madcore_gena_max`
  - `madcore_gena_tg_channels`
- визуальный слой переведен в серебряное направление через палитру, кнопки, подсветки и фильтры ассетов;
- hero, product и wordmark переведены на новые серебряные ассеты без гор;
- активная документация нового проекта отделена от унаследованных материалов, архив исходного контекста вынесен в `docs/archive-origin/`;
- успешно пройдены:
  - `npm run lint`
  - `npm run build`
  - `bash ./scripts/repo-adtech-audit.sh`
  - визуальная проверка через браузерный скриншот локальной production-сборки.

## Что еще не завершено

- отдельный Telegram-бот еще не создан;
- отдельный счетчик Яндекс.Метрики и цели еще не заведены;
- отдельный `site id` в Matomo еще не создан;
- production `.env` нового проекта не заполнен;
- production deployment не выполнен;
- `/opt/madcore-gena` не создан: для записи в `/opt` на текущем хосте нужен `sudo`;
- публичный домен и proxy еще не подняты.

## На чем остановились

- локальное отделение нового проекта уже выполнено и подтверждено сборкой;
- кодовая база, CTA, tracking, документация и server defaults уже разведены;
- следующий шаг — заполнить внешние интеграции и отправить результат в удаленный репозиторий.

## Что делать дальше

1. Создать отдельного бота и заполнить `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`.
2. Создать отдельные идентификаторы Яндекс.Метрики и Matomo.
3. Подготовить production `.env` и развернуть проект в `/opt/madcore-gena`.
4. Добавить доменный маршрут для `gena.madcore-kavkaz.ru` и проверить сайт в сети.
