# MADCORE Gena Agent Checkpoint

Новая сессия должна стартовать не с нуля, а с последней сохраненной контрольной точки по `MADCORE Gena`.

## Последняя рабочая точка

- локальная самостоятельная копия проекта уже создана в `/home/max/MADCORE RF`;
- проектный бренд переведен в `MADCORE Gena`;
- серебряный UI-контур, новые контакты и `MaX` заведены в кодовую базу;
- tracking разведен на `madcore_gena_*`;
- production уже живет на `https://madcore.site`;
- старый временный домен `https://gena.madcore-kavkaz.ru` больше не считается рабочим и должен редиректить на `https://madcore.site`;
- hero CTA на production уже выкачен в live:
  - вместо широкой кнопки `Получить консультацию` в hero стоят две отдельные кнопки:
    - `Перейти в чат Telegram`
    - `Перейти в чат Max`
  - мобильный порядок CTA зафиксирован как:
    - `WhatsApp -> Telegram -> MaX -> [чат Telegram | чат Max] -> звонок`;
  - на production мобильная версия уже отдает эти две кнопки открытых чатов в одном компактном ряду;
- на сервере уже есть отдельная точка развёртывания `/opt/madcore-gena`;
- в Метрике уже существует отдельный счетчик `109282367`;
- `2026-05-24` счетчик Метрики уже переведен на production-host `madcore.site`, а на стороне счетчика включены Вебвизор, карта кликов и measurement;
- `2026-05-24` через живой веб-интерфейс уже сохранена первая воронка Метрики:
  - `Главная -> отправка формы`
  - шаг `1`: просмотр страницы `https://madcore.site/`
  - шаг `2`: достижение JS-цели `form_submit`
- в Matomo уже существует отдельный `site id = 2`;
- `2026-05-24` для `site id = 2` уже настроены:
  - основной site URL под `madcore.site`;
  - visit custom dimensions `Click ID`, `YCLID`, `UTM Source`, `UTM Medium`, `UTM Campaign`;
  - manual goals `telegram_click`, `whatsapp_click`, `max_click`, `call_click`, `form_submit`, `lead`;
- TLS для `madcore.site` уже выпущен до `2026-08-21`;
- TLS для `gena.madcore-kavkaz.ru` уже выпущен.
- отдельный бот `@MadcoreGenaLeadsBot` уже создан;
- live notify до нового Telegram-бота подтвержден тестовой заявкой.
- `2026-05-23` добавлен дополнительный получатель Telegram-уведомлений `@M_a_x_i_m_M_i_k_h_a_i_l_o_v` через `TELEGRAM_EXTRA_CHAT_IDS`;
- `2026-05-24` live deploy hero CTA подтвержден:
  - `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site` проходит;
  - `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site` проходит;
  - `https://madcore-kavkaz.ru` остался отдельным и не подменился.
- `2026-05-25` live-выкладка мобильного ряда кнопок чатов подтверждена:
  - резервная копия перед заменой создана в `/opt/madcore-gena/.backup/20260525-132139-mobile-chat-cta-row`;
  - на сервер передавался только `src/app/globals.css`;
  - `madcore_gena_app` после пересборки имеет статус `healthy`;
  - боевые smoke-проверки на `https://madcore.site` снова проходят;
- `2026-05-25` production performance уже подтянут:
  - тяжелые фоны переведены с PNG на `.webp`;
  - `next/image` снова работает в оптимизированном режиме;
  - ранняя загрузка снята с logo и product-card, hero-image оставлен единственным critical-image;
  - Lighthouse performance улучшился примерно `0.60 -> 0.83`, а LCP примерно `4.9s -> 2.7s`;
- `2026-05-25` по Яндекс.Вебвизору зафиксирован текущий вывод:
  - свежие сессии `madcore.site` открываются нормально;
  - проблема "сайт без картинок и стилей" у части старых replay после выкладок наиболее вероятно связана с тем, что старые hashed-файлы `/_next/static/*` не сохраняются между deploy;
- `2026-05-25` production title очищен от лишней региональной приписки:
  - источник найден в `src/config/site.ts`;
  - live `madcore.site` теперь отдает `MADCORE 2.0 - консультация и заказ`;

## Ключевые незавершенные задачи

- при необходимости сохранить еще 2 прикладные воронки в Яндекс.Метрике:
  - `Главная -> переход в Telegram`
  - `Главная -> lead`
- при необходимости перенос receiving-chat на другую личку или группу и обновление `TELEGRAM_CHAT_ID`;
- при необходимости установка Matomo-плагина `HeatmapSessionRecording`, если нужны встроенные session replay и тепловые карты именно в Matomo;
- при необходимости отдельная инфраструктурная доработка хранения старых `/_next/static/*`, если нужно стабилизировать исторические replay Яндекс.Вебвизора после deploy;
- учитывать, что поисковик может еще какое-то время показывать старый title из кеша, даже если live HTML уже обновлен;
- если нужен отдельный перенос старого домена на DNS-уровне или его полное выключение, это уже отдельная server-side задача вне кода сайта.

## Ограничения

- исходный сайт `/home/max/MADCORE` не ломать;
- не использовать старый production-домен `madcore-kavkaz.ru` как финальный домен нового сайта;
- не переиспользовать старый номер телефона, старые `cmp` и старые client tracking keys;
- не коммитить секреты.
- помнить, что `https://gena.madcore-kavkaz.ru` больше не является рабочим адресом сайта и должен рассматриваться только как legacy-redirect на `madcore.site`.
- помнить, что в текущей Matomo-инсталляции нет `HeatmapSessionRecording`, поэтому полноценный session replay сейчас дается Метрикой, а не Matomo.
