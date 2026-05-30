# Checkpoint `2026-05-28` `live hero + product image deploy`

## Что сделано на live

- На сервере создан backup:
  - `/opt/madcore-gena/.backup/20260528-115831-hero-product-image-refresh`
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
- Live HTML `https://madcore.site` preload-ит `hero-metallic-premium-v1.avif`.
- Live metadata оставляют:
  - `og:image` -> `https://madcore.site/images/hero-metallic-premium-v1.png`
  - `twitter:image` -> `https://madcore.site/images/hero-metallic-premium-v1.png`
- Live product-card использует `product-metallic-card-v2.avif`.
- `https://madcore.site/images/hero-metallic-premium-v1.avif` отвечает `200` и имеет `content-length: 45969`.
- `https://madcore.site/images/product-metallic-card-v2.avif` отвечает `200` и имеет `content-length: 123892`.

## Важное замечание

- Hero сохранен как `AVIF quality=50`, потому что локальное сравнение нескольких уровней качества показало, что это лучший компромисс по визуалу и весу.
