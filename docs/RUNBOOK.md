# MADCORE Gena Runbook

## Локальная проверка

```bash
npm install
npx prisma generate
npm run lint
npm run build
```

## Локальный запуск

```bash
npm run dev:start
npm run dev:status
npm run dev:stop
```

## Smoke-проверки

```bash
./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru
METRIKA_COUNTER_ID=<new_counter_id> ./scripts/production-adtech-smoke.sh https://gena.madcore-kavkaz.ru
```

Если новый счетчик Яндекс.Метрики еще не создан, `production-adtech-smoke.sh` допускает запуск без `METRIKA_COUNTER_ID` и пропускает live-проверку presence-кода.

## Что проверять после развертывания

1. `https://gena.madcore-kavkaz.ru` отвечает по HTTPS.
2. `https://www.gena.madcore-kavkaz.ru` редиректит на основной поддомен.
3. Кнопки `Telegram`, `WhatsApp`, `MaX`, `Позвонить` и `Получить консультацию` работают.
4. `/go` сохраняет `yclid`, `click_id`, `decision_in`, `score_in_bucket`.
5. `/safe` отдается с `noindex`.
6. `/admin/leads` и `/api/admin/*` защищены basic auth.

## Переменные, которые должны быть заполнены перед production

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `MATOMO_SITE_ID`
- `NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID`
- `YANDEX_METRIKA_TOKEN`, если нужен API-доступ
- `YANDEX_DIRECT_TOKEN`
- `PUBLIC_BASE_URL=https://gena.madcore-kavkaz.ru`
