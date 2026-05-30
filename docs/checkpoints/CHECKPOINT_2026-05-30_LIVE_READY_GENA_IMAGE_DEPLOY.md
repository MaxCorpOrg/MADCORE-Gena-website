# Checkpoint `2026-05-30` `live ready gena image deploy`

## Что выкачено на live

- На сервере создан backup:
  - `/opt/madcore-gena/.backup/20260530-131905-ready-gena-image-refresh`
- На VPS точечно переданы:
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/config/site.ts`
  - `public/images/hero-metallic-premium-v1.png`
  - `public/images/hero-metallic-premium-v1.avif`
  - `public/images/product-metallic-card-v2.png`
  - `public/images/product-metallic-card-v2.avif`
- После синхронизации выполнены:
  - `docker compose build app`
  - `docker compose up -d app`

## Что подтверждено

- `madcore_gena_app` после пересборки имеет статус `healthy`.
- `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site` проходит.
- `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site` проходит.
- Live HTML `https://madcore.site` использует:
  - hero-image -> `hero-metallic-premium-v1.avif`
  - product-card -> `product-metallic-card-v2.avif`
  - `og:image` -> `https://madcore.site/images/hero-metallic-premium-v1.png`
  - `twitter:image` -> `https://madcore.site/images/hero-metallic-premium-v1.png`
- Live ассеты отвечают:
  - `https://madcore.site/images/hero-metallic-premium-v1.avif` -> `200`, `content-length: 57826`
  - `https://madcore.site/images/product-metallic-card-v2.avif` -> `200`, `content-length: 51238`

## Важное замечание

- На live теперь стоит самый свежий набор изображений `1Г/2Г`.
- Hero оставлен на `AVIF quality=44`, product-card собран как `AVIF quality=54` после ресайза исходника до `1024x1024`.
