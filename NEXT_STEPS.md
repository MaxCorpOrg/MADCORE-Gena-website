# MADCORE Gena Next Steps

Обновлено: `2026-05-18`

## Ближайший приоритет

Довести `MADCORE Gena` от локально отделенной копии до полноценного независимого production-контура.

## Что делать дальше

1. Создать GitHub-репозиторий `MaxCorpOrg/MADCORE-Gena-website` и привязать `origin`.
2. Создать отдельный Telegram-бот для заявок и заполнить:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
3. Создать отдельный счетчик Яндекс.Метрики и цели:
   - `telegram_click`
   - `whatsapp_click`
   - `max_click`
   - `call_click`
   - `consultation_click`
   - `form_start`
   - `form_submit`
   - `lead`
4. Создать отдельный сайт в Matomo и получить `MATOMO_SITE_ID`.
5. Подготовить production `.env` для `/opt/madcore-gena`.
6. Развернуть проект на сервере.
7. Добавить доменный proxy для `gena.madcore-kavkaz.ru`.
8. Прогнать smoke и adtech-smoke проверки.

## Что не делать

- не править текущий боевой сайт в `/home/max/MADCORE`, если это не нужно для серверного proxy;
- не переиспользовать старые `cmp` и старый счетчик Метрики;
- не публиковать проект с пустыми значениями `TELEGRAM_BOT_TOKEN`, `MATOMO_SITE_ID` и `NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID`.
