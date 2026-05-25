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
- текущий production: `https://madcore.site`
- старый временный домен: `https://gena.madcore-kavkaz.ru` -> должен редиректить на `https://madcore.site`

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
- silver-версия без гор уже живет на production-домене `madcore.site`;
- для серверной выкладки уже используются:
  - `/opt/madcore-gena`
  - `madcore_gena_postgres`
  - `madcore_gena_app`
  - общий ingress `madcore_nginx`
- через API Яндекс.Метрики уже создан отдельный счетчик `109282367` и заведены отдельные JS-цели проекта;
- `2026-05-24` счетчик Метрики уже переведен на `madcore.site`, в нем включены Вебвизор и карты кликов;
- `2026-05-24` в Метрике уже сохранена первая воронка:
  - `Главная -> отправка формы`
  - `https://madcore.site/` -> `form_submit`
- в Matomo уже создан отдельный `site id = 2`;
- `2026-05-24` для Matomo уже настроены:
  - основной site URL под `madcore.site`;
  - visit custom dimensions `Click ID`, `YCLID`, `UTM Source`, `UTM Medium`, `UTM Campaign`;
  - manual goals `telegram_click`, `whatsapp_click`, `max_click`, `call_click`, `form_submit`, `lead`;
- для production уже выпущен TLS на `madcore.site`;
- для старого временного домена `gena.madcore-kavkaz.ru` сертификат пока остается, чтобы redirect работал без ошибок.
- отдельный Telegram-бот `@MadcoreGenaLeadsBot` уже создан;
- live notify в новый бот подтвержден тестовой заявкой.
- `2026-05-23` добавлен дополнительный получатель Telegram-уведомлений `@M_a_x_i_m_M_i_k_h_a_i_l_o_v` через `TELEGRAM_EXTRA_CHAT_IDS`;
- `2026-05-24` hero CTA с двумя отдельными chat-кнопками уже выкачен на `https://madcore.site`;
- `2026-05-25` на production уже выкачена мобильная правка этих двух кнопок:
  - `Перейти в чат Telegram` и `Перейти в чат Max` на экранах до `639px` стоят в одном компактном ряду;
  - остальные CTA-кнопки hero не менялись;
- `2026-05-25` production дополнительно оптимизирован по загрузке:
  - тяжелые фоновые PNG переведены на `.webp`;
  - `next/image` снова включен в оптимизированном режиме;
  - ранний preload оставлен только у hero-image;
- `2026-05-25` по Вебвизору уже есть рабочая версия объяснения:
  - свежие live-сессии открываются штатно;
  - часть старых replay после deploy может выглядеть сломанной из-за потери прежних hashed-файлов `/_next/static/*`;
- `2026-05-25` production metadata title уже сокращен:
  - вместо `MADCORE 2.0 - консультация и заказ на Северном Кавказе` live теперь отдает `MADCORE 2.0 - консультация и заказ`;

## Что еще не закрыто

- при необходимости добавить еще прикладные воронки Метрики:
  - `Главная -> переход в Telegram`
  - `Главная -> lead`
- при необходимости нужно перевести receiving-chat бота с текущей рабочей лички `AK5` на другой чат или группу;
- если в Matomo нужны встроенные session replay и тепловые карты, нужно отдельно решать установку `HeatmapSessionRecording`.
- если нужно стабилизировать исторические replay Яндекс.Вебвизора после deploy, отдельно решать хранение старых `/_next/static/*`.

## Что уже подтверждено дополнительно

- локальный `git` инициализирован, `origin` привязан к `git@github.com:MaxCorpOrg/MADCORE-Gena-website.git`;
- `npm run lint` и `npm run build` проходят;
- `bash ./scripts/repo-adtech-audit.sh` проходит;
- `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site` проходит;
- `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site` проходит;
- для обычных пользователей `madcore.site` по-прежнему отдает `X-Frame-Options: SAMEORIGIN`, а для referer Яндекс.Метрики заголовок снимается, чтобы Вебвизор мог открывать страницу;
- основной сайт `https://madcore-kavkaz.ru` после включения preview-host остался живым.
- `https://madcore.site` в live HTML отдает:
  - `Перейти в чат Telegram`
  - `Перейти в чат Max`
- в live CSS `https://madcore.site` уже есть мобильные правила для компактного ряда этих двух кнопок чатов;
- старый домен `https://gena.madcore-kavkaz.ru` больше не нужен как рабочий адрес и должен переводить трафик на `https://madcore.site`.

Важно:

- `gena.madcore-kavkaz.ru` больше не считать preview-контуром; это только legacy-адрес, который должен редиректить на production.

## Что обязательно сделать перед серверными действиями

1. Прочитать `/home/max/SERVWER 2/api.txt`.
2. Сверить `docs/PROJECT_STATUS.md` и `docs/PROJECT_CHECKPOINT.md`.
3. Не менять `/home/max/MADCORE`, если задача касается только `MADCORE Gena`.

## Что обязательно сделать перед рекламными действиями

1. Использовать материалы из `/home/max/АПИ/Яндекс АПИ`.
2. Не переиспользовать старый счетчик Метрики и старые `cmp`.
3. Создавать отдельные цели и отдельную разметку под `MADCORE Gena`.
