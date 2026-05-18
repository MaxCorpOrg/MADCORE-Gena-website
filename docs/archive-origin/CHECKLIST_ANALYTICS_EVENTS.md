# Чек-лист проверки аналитики

1. Открыть `/` -> в Matomo и в `events` появляется `page_view`.
2. Прокрутить страницу >50% -> появляется `scroll_50`.
3. Прокрутить страницу >90% -> появляется `scroll_90`.
4. Нажать WhatsApp -> `whatsapp_click`.
5. Нажать Telegram -> `telegram_click`.
6. Фокус в поле формы -> `form_start`.
7. Успешная отправка формы -> `form_submit` и `lead`.
8. После server notify -> `lead_notify` с `ok`, `channel`, `reason`, `lead_id`.
9. Открыть `/thanks` -> `thanks_view`.
10. Проверить заполнение `src/cmp/cr/click_id` в событиях и заявке.
11. Проверить заполнение `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`.
12. Проверить, что `/safe` не отправляет Matomo (при `SAFE_MODE_DISABLE_MATOMO=true`).
