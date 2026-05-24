# MADCORE Gena Next Steps

Обновлено: `2026-05-24` `analytics hardening + metrika funnel`

## Ближайший приоритет

Серверный и аналитический контур после cutover на `madcore.site` уже доведен до рабочего состояния. Следующие шаги теперь не аварийные, а улучшающие.

## Что делать дальше

1. Добавить еще две прикладные воронки Яндекс.Метрики:
   - `Главная -> переход в Telegram`
   - `Главная -> lead`
2. Если в Matomo нужен именно session replay и тепловые карты внутри самой Matomo, отдельно решить установку `HeatmapSessionRecording`.
3. Если лиды должны приходить не в текущую рабочую личку `AK5`, обновить `TELEGRAM_CHAT_ID` и повторить test lead.
4. При следующем server deploy сохранять build args доменных переменных и analytics env:
   - `MATOMO_DIMENSION_UTM_MEDIUM`
   - `MATOMO_GOAL_*`
   - доменные build args для `madcore.site`

## Что не делать

- не править текущий боевой сайт в `/home/max/MADCORE`, если это не нужно для общего ingress;
- не переиспользовать старые `cmp`, старый счетчик Метрики и старый Matomo `site id`;
- не ломать уже работающий `@MadcoreGenaLeadsBot`, пока не выбран другой receiving-chat;
- не оставлять финальный live-контур на пустых `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`.
- не возвращать `gena.madcore-kavkaz.ru` в роль рабочего домена сайта.
