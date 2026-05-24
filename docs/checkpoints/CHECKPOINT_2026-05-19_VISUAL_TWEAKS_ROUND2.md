# MADCORE Gena Checkpoint `2026-05-19` Visual Tweaks Round 2

## Что изменено

- из story-frame полностью убран блок `Наш адрес` и строка с адресом; в рамке оставлен только блок `Как сделать заказ`;
- hero band переведен на:
  - `Мы являемся официальным представителем MADCORE 2.0`
- hero-chip теперь показывает `madcore.site`, но live preview по-прежнему работает на `https://gena.madcore-kavkaz.ru`;
- logo-wordmark переведен с пересвеченного белого варианта на более холодный metallic-asset:
  - `public/images/madcore-logo-metallic-v2.png`
- нижняя product-card переведена на новый Image2-visual под референс пользователя:
  - `public/images/product-metallic-card-v2.png`
- favicon упрощен и переведен на круглый более читаемый знак:
  - `public/images/favicon-metallic-round-v1.png`
  - обновлены `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/favicon.ico`

## Что проверено

- локально:
  - `npm run lint`
  - `npm run build`
  - desktop screenshot
  - mobile full-page screenshot
- live preview:
  - `./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru`
  - `METRIKA_COUNTER_ID=109282367 ./scripts/production-adtech-smoke.sh https://gena.madcore-kavkaz.ru`
  - live desktop screenshot
  - live mobile full-page screenshot
  - live HTML подтверждает:
    - `madcore.site`
    - отсутствие `Наш адрес`
    - отсутствие строки `Тарчокова 50`

## На чем остановились

- текущий preview уже обновлен визуально и остается рабочим;
- финальный домен выбран:
  - `madcore.site`
- сам cutover на `madcore.site` еще не выполнен.

## Что делать дальше

1. Перевести routing, DNS, TLS и окружение с preview-host на `madcore.site`.
2. После доменного cutover обновить Matomo и Яндекс.Метрику под финальный host.
3. При необходимости собрать следующий набор performance-creatives в той же metallic-системе.
