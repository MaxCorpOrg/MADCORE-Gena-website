# MADCORE Gena Changelog

Обновлено: `2026-05-18`

## 2026-05-18

- Создан отдельный проект `MADCORE Gena` в `/home/max/MADCORE RF` на базе текущего `MADCORE-website`.
- В runtime-конфиг и интерфейс переведены новые контакты:
  - WhatsApp и телефон: `+7-904-244-04-44`
  - Telegram: `https://t.me/vorgesar`
  - MaX: `https://max.ru/u/f9LHodD0cOIXADxaRo9U9W_VHmDuRL5fMKsJO5O9YAs5rg0iZYqYmXKw0dw`
- Добавлен новый CTA-канал `MaX`:
  - отдельная кнопка на первом экране и на `/thanks`
  - поддержка в форме заявки
  - поддержка в lead-notify и аналитических событиях
- Tracking разведен в отдельный контур `madcore_gena_*`:
  - cookie
  - `localStorage`
  - `session_id`
- Подготовлены отдельные deployment defaults:
  - `madcore_gena_postgres`
  - `madcore_gena_app`
  - `madcore_gena_nginx`
  - `/opt/madcore-gena`
- Подготовлены отдельные рекламные сегменты:
  - `madcore_gena_site`
  - `madcore_gena_telegram`
  - `madcore_gena_whatsapp`
  - `madcore_gena_max`
  - `madcore_gena_tg_channels`
- Визуальный стиль переведен в серебряную версию:
  - новая палитра
  - новые CTA-акценты
  - серебряные hero/product-иллюстрации без гор
  - абстрактный серебряный фон
- Документация переписана под самостоятельный проект с отдельными checkpoint-файлами и deployment-заметками.

## 2026-05-17

- Подготовлена отдельная локальная копия проекта без `.git`, runtime-данных и production-секретов.
- Переписаны ключевые entry-point документы нового репозитория:
  - `AGENTS.md`
  - `README.md`
  - `ARCHITECTURE.md`
  - `NEXT_STEPS.md`
  - `docs/START_HERE_FOR_NEW_CHAT.md`
  - `docs/PROJECT_STATUS.md`
  - `docs/PROJECT_CHECKPOINT.md`
