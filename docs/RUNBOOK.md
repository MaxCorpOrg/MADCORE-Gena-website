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

Для preview-контура можно взять готовую основу:

```bash
cp .env.preview.example .env
```

## Smoke-проверки

```bash
SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site
METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site
```

Если новый счетчик Яндекс.Метрики еще не создан, `production-adtech-smoke.sh` допускает запуск без `METRIKA_COUNTER_ID` и пропускает live-проверку presence-кода.

Для legacy preview используйте отдельные проверки с оговоркой:

```bash
curl -Iks https://gena.madcore-kavkaz.ru
curl -Iks https://www.gena.madcore-kavkaz.ru
curl -Iks https://gena.madcore-kavkaz.ru/api/health
```

Важно: `https://gena.madcore-kavkaz.ru/go?...` сейчас редиректит на `https://madcore.site/safe`, поэтому полный preview smoke больше не является эталонной проверкой самостоятельного host redirect.

## Что проверять после развертывания

1. `https://madcore.site` отвечает по HTTPS.
2. `https://www.madcore.site` редиректит на apex-домен.
3. Кнопки `Telegram`, `WhatsApp`, `MaX`, `Перейти в чат Telegram`, `Перейти в чат Max` и `Позвонить` работают.
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
- `PUBLIC_BASE_URL=https://madcore.site` для production
- `SITE_DOMAIN`, `SITE_WWW_DOMAIN`, `SITE_CERT_NAME` под текущий host
