# MADCORE Traffic Readiness

Обновлено: `2026-05-11`

## Цель этапа

Подготовить сайт к стабильному приему трафика из Яндекс.Директа: заявки должны сохраняться в PostgreSQL, приходить менеджеру в Telegram и иметь достаточные метки для оценки качества.

## Минимум перед запуском рекламы

- Статус на `2026-05-11`: базовая production-проверка пройдена, test lead `id=13` подтвердил `leads + form_submit + lead + lead_notify + Telegram`.
- Production отвечает по `https://madcore-kavkaz.ru`.
- `www` редиректит на `https://madcore-kavkaz.ru`.
- `/privacy`, `/thanks`, `robots.txt`, `sitemap.xml` доступны.
- `/go` принимает UTM и `src/cmp/cr/click_id`, пишет клик и редиректит на главную.
- Форма создает запись в `leads`.
- Telegram получает уведомление по каждой валидной заявке.
- В `events` появляются `form_submit`, `lead`, `lead_notify`, `thanks_view` и CTA-события.
- Адрес на сайте: `Наш офис находится в Нальчике, на улице Тарчокова 50, в офисном здании, 2-ой этаж, офис 24.`

## Проверка production

```bash
./scripts/production-smoke.sh https://madcore-kavkaz.ru
```

Скрипт проверяет публичные маршруты и редирект `www`. Проверка `/go` намеренно создает один тестовый click-record с `src=smoke`.

## Контроль качества заявок

На сервере:

```bash
cd /opt/madcore-gena
DAYS=7 ./scripts/server-export-lead-quality-report.sh
```

Отчет создается в `/opt/madcore-gena/backups/reports` и содержит:
- дату заявки;
- имя, телефон, город, выбранный канал;
- `src`, `cmp`, `cr`, `click_id`;
- UTM-метки;
- IP;
- счетчики дублей по телефону и IP.

## Backup БД

Перед заметными рекламными изменениями и после крупных пачек заявок:

```bash
cd /opt/madcore-gena
./scripts/server-db-backup.sh
```

Backup сохраняется в `/opt/madcore-gena/backups/db`.

## Когда нужен следующий архитектурный этап

- Если заявок станет много и Telegram-чата будет недостаточно, добавить закрытую админку со статусами обработки.
- Если появится CRM, добавить server-интеграцию после сохранения заявки в PostgreSQL.
- Если уведомления станут критичным bottleneck, добавить outbox/queue и повторные попытки отправки.
