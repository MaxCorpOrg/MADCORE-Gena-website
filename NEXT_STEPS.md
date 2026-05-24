# MADCORE Gena Next Steps

Обновлено: `2026-05-24`

## Ближайший приоритет

Довести серверный и аналитический контур после уже выполненного cutover на `madcore.site` и live-выкатки нового hero CTA.

## Что делать дальше

1. Определиться с аналитикой после смены домена:
   - оставить счетчик Метрики `109282367` и обновить host
   - или создать отдельный финальный счетчик
   - обновить URL сайта в Matomo `site id = 2` или завести отдельный финальный сайт
2. Если legacy preview `https://gena.madcore-kavkaz.ru` должен остаться полноценным запасным контуром, вернуть ему собственный `/go`-redirect без ухода на `https://madcore.site/safe`.
3. Если лиды должны приходить не в текущую рабочую личку `AK5`, обновить `TELEGRAM_CHAT_ID` и повторить test lead.
4. При следующем server deploy сохранять build args доменных переменных в `Dockerfile` и `docker-compose.yml`, чтобы metadata оставались на `madcore.site`.

## Что не делать

- не править текущий боевой сайт в `/home/max/MADCORE`, если это не нужно для общего ingress;
- не переиспользовать старые `cmp`, старый счетчик Метрики и старый Matomo `site id`;
- не ломать уже работающий `@MadcoreGenaLeadsBot`, пока не выбран другой receiving-chat;
- не оставлять финальный live-контур на пустых `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`.
- не считать текущий `/go` на `gena.madcore-kavkaz.ru` самостоятельной preview-проверкой, пока не восстановлен отдельный redirect host.
