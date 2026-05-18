# MADCORE Gena Project Status

Обновлено: `2026-05-18`

## Контрольная точка

- проект: `MADCORE Gena`
- локальный путь: `/home/max/MADCORE RF`
- целевой репозиторий: `MaxCorpOrg/MADCORE-Gena-website`
- временный preview-домен по текущему этапу: `https://gena.madcore-kavkaz.ru`
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
- добавлен отдельный preview-шаблон окружения `.env.preview.example`;
- через API Яндекс.Метрики создан отдельный счетчик `109282367` для preview-host `gena.madcore-kavkaz.ru`;
- в счетчике `109282367` заведены отдельные JS-цели:
  - `telegram_click`
  - `whatsapp_click`
  - `max_click`
  - `call_click`
  - `consultation_click`
  - `form_start`
  - `form_submit`
  - `lead`
- успешно пройдены:
  - `npm run lint`
  - `npm run build`
  - `bash ./scripts/repo-adtech-audit.sh`
  - визуальная проверка через браузерный скриншот локальной production-сборки.

## Что еще не завершено

- отдельный Telegram-бот еще не создан;
- отдельный `site id` в Matomo еще не создан;
- production `.env` нового проекта не заполнен;
- production deployment не выполнен;
- `/opt/madcore-gena` не создан: для записи в `/opt` на текущем хосте нужен `sudo`;
- финальный домен проекта еще не задан;
- публичный доменный proxy под финальный домен еще не поднят.
- Matomo admin-учетка логинится, но не имеет `superuser`-прав для `SitesManager.addSite`, поэтому новый сайт Matomo пока не создан автоматически.

## На чем остановились

- локальное отделение нового проекта уже выполнено и подтверждено сборкой;
- отдельный счетчик Метрики и отдельные JS-цели уже созданы;
- кодовая база, CTA, tracking, документация и server defaults уже разведены;
- следующий шаг — добить Matomo, bot-flow и server-side выкладку.

## Что делать дальше

1. Получить `superuser`-доступ или отдельный token для Matomo и создать новый `site id`.
2. Создать отдельного бота и заполнить `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`.
3. Подготовить production `.env` и развернуть проект в `/opt/madcore-gena`.
4. После выбора финального домена заменить preview-host и добавить под него доменный маршрут.
