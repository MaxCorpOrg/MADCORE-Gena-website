# MADCORE Gena Checkpoint `2026-05-23` Extra Telegram Recipient

## Что изменено

- для Telegram-уведомлений о заявках добавлен дополнительный получатель:
  - `@M_a_x_i_m_M_i_k_h_a_i_l_o_v`
- в `/opt/madcore-gena/.env` добавлен `TELEGRAM_EXTRA_CHAT_IDS`;
- `src/lib/telegram.ts` теперь отправляет уведомления во все уникальные chat id из:
  - `TELEGRAM_CHAT_ID`
  - `TELEGRAM_EXTRA_CHAT_IDS`
- `.env.example` и `.env.preview.example` дополнены переменной `TELEGRAM_EXTRA_CHAT_IDS`;
- `madcore_gena_app` пересобран и пересоздан на VPS.

## Что проверено

- прямой вызов Telegram Bot API по username сначала вернул `chat not found`;
- через `getUpdates` найден числовой chat id для профиля `@M_a_x_i_m_M_i_k_h_a_i_l_o_v`;
- тестовая заявка на `https://madcore.site/api/lead` создана с `lead id = 4`;
- лог приложения подтвердил:
  - `Lead notification result { ok: true, skipped: false, channel: 'telegram' }`
- последняя заявка видна в таблице `leads`.

## На чем остановились

- заявки с сайта отправляются основному Telegram-получателю и дополнительному получателю `@M_a_x_i_m_M_i_k_h_a_i_l_o_v`;
- токен бота и числовые chat id остаются только в server-side `.env`.
