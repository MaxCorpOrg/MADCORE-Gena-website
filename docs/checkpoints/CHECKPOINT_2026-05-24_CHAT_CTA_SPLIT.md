# MADCORE Gena Checkpoint `2026-05-24` Chat CTA Split

## Что изменено

- в hero-блоке убрана широкая кнопка `Получить консультацию`;
- вместо нее добавлены две отдельные CTA-кнопки:
  - `Перейти в чат Telegram` -> `https://t.me/MadCoreChat`
  - `Перейти в чат Max` -> `https://max.ru/join/gkeLUFOdvn5QYSNerv59YDPCxDSK388EPyAb7zxc6cw`
- мобильный порядок CTA теперь такой:
  - `WhatsApp`
  - `Telegram`
  - `MaX`
  - `Перейти в чат Telegram`
  - `Перейти в чат Max`
  - `Позвонить`
- на десктопе нижний hero-ряд теперь разбит на две малые кнопки вместо одной широкой кнопки консультации;
- в runtime-конфиг и шаблоны окружения добавлены:
  - `TELEGRAM_CHAT_URL`
  - `MAX_CHAT_URL`

## Что проверено

- локально:
  - `npm run lint`
  - `npm run build`

## Примечание

- в рамках этой задачи правка подготовлена локально в репозитории;
- отдельный live deploy на `https://madcore.site` не выполнялся.
