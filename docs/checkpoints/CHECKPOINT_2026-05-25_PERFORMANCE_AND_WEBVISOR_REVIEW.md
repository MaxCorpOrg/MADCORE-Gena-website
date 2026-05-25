# Checkpoint `2026-05-25` `performance review и разбор Webvisor`

## Что сделано

- Проведен production review сайта `https://madcore.site` по скорости загрузки и поведению Вебвизора.
- В коде выполнена image-оптимизация:
  - в `next.config.ts` убран `images.unoptimized`;
  - `src/app/globals.css` переведен на `background-metallic-brushed-v1.webp` и `background-metallic-mobile-v1.webp`;
  - `src/components/MadcoreWordmark.tsx` обновлен: снят `priority`, добавлен `sizes`;
  - `src/app/page.tsx` обновлен: hero-image получил `sizes`, product-card перестал грузиться eagerly.
- Созданы новые ассеты:
  - `public/images/background-metallic-brushed-v1.webp`
  - `public/images/background-metallic-mobile-v1.webp`
- Перед live-выкладкой на сервере создан backup:
  - `/opt/madcore-gena/.backup/20260525-140649-performance-and-webvisor-review`
- Изменения точечно выкачены на `/opt/madcore-gena`, затем выполнены:
  - `docker compose build app`
  - `docker compose up -d app`

## Что подтверждено

- `npm run lint` проходит.
- `npm run build` проходит.
- `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site` проходит.
- `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site` проходит.
- `madcore_gena_app` после пересоздания имеет статус `healthy`.
- Home HTML ускорился по `curl`: примерно `0.55s -> 0.42s` по `time_starttransfer`.
- Lighthouse performance улучшился примерно `0.60 -> 0.83`.
- LCP улучшился примерно `4.9s -> 2.7s`.
- `interactive` улучшился примерно `24.4s -> 5.0s`.
- Суммарный сетевой вес страницы в Lighthouse снизился примерно `7.38 MB -> 0.47 MB`.

## Вывод по Вебвизору

- Для свежих live-открытий `madcore.site` страница отдается нормально: с CSS, изображениями и рабочим layout.
- На стороне ingress условное снятие `X-Frame-Options` для referer Яндекс.Метрики уже работает, значит текущая причина проблемы не в iframe-блокировке.
- Наиболее вероятная причина "сломанного" вида у части replay-сессий: старые hashed-файлы `/_next/static/*` не переживают deploy, потому что новый app-контейнер содержит только ассеты текущей сборки.
- Из-за этого исторические записи Вебвизора после rebuild могут открываться без старого CSS/JS и выглядеть как "сайт без картинок и оформления".

## Следующий практический шаг

- Если нужно стабилизировать именно исторические replay Яндекс.Вебвизора после новых выкладок, отдельно внедрить хранение и отдачу предыдущих `/_next/static/*` из persistent storage или через fallback-слой ingress.
