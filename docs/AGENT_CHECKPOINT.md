# MADCORE Gena Agent Checkpoint

Новая сессия должна стартовать не с нуля, а с последней сохраненной контрольной точки по `MADCORE Gena`.

## Последняя рабочая точка

- локальная самостоятельная копия проекта уже создана в `/home/max/MADCORE RF`;
- проектный бренд переведен в `MADCORE Gena`;
- серебряный UI-контур и новые контакты заведены в кодовую базу;
- добавлен новый канал `MaX` в CTA и lead-flow;
- подготовлены отдельные ключи client tracking:
  - `madcore_gena_tracking`
  - `madcore_gena_session_id`
- подготовлены deployment defaults для отдельного контура `/opt/madcore-gena`;
- подготовлены отдельные рекламные `cmp`-сегменты.

## Ключевые незавершенные задачи

- GitHub-репозиторий `MaxCorpOrg/MADCORE-Gena-website`
- отдельный Telegram-бот
- отдельный счетчик Яндекс.Метрики и цели
- отдельный Matomo `site id`
- production deployment
- DNS / SSL / proxy для нового поддомена

## Ограничения

- исходный сайт `/home/max/MADCORE` не ломать;
- не использовать старый production-домен `madcore-kavkaz.ru` как домен нового сайта;
- не переиспользовать старый номер телефона, старые `cmp` и старые client tracking keys;
- не коммитить секреты.
