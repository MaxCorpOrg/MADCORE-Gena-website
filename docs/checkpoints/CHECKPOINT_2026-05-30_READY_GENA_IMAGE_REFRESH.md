# Checkpoint `2026-05-30` `ready gena image refresh`

## Что сделано локально

- Первое изображение главной страницы перевыпущено из файла:
  - `/home/max/Рабочий стол/Заменить изображение на картинке/2/Готовый Гена/1Г.png`
- Второе изображение главной страницы перевыпущено из файла:
  - `/home/max/Рабочий стол/Заменить изображение на картинке/2/Готовый Гена/2Г.png`
- Обновлены рабочие ассеты:
  - `public/images/hero-metallic-premium-v1.png`
  - `public/images/hero-metallic-premium-v1.avif`
  - `public/images/product-metallic-card-v2.png`
  - `public/images/product-metallic-card-v2.avif`
- Для hero оставлен `AVIF quality=44` как хороший компромисс между весом и деталями металла.
- Для product-card выполнен ресайз `1254x1254 -> 1024x1024`, после чего собран `AVIF quality=54`.
- `src/app/page.tsx` синхронизирован с фактическими размерами новых файлов:
  - hero-image `1024x1536`
  - product-card image `1024x1024`

## Что подтверждено

- `npm run lint` проходит.
- `npm run build` проходит.
- Итоговые размеры файлов:
  - `public/images/hero-metallic-premium-v1.png` -> `2406538` байт
  - `public/images/hero-metallic-premium-v1.avif` -> `57826` байт
  - `public/images/product-metallic-card-v2.png` -> `1522422` байт
  - `public/images/product-metallic-card-v2.avif` -> `51238` байт
- Снижение веса page-ассетов относительно новых исходников:
  - hero: `2721525 -> 57826` байт
  - product-card: `2271049 -> 51238` байт

## Важное замечание

- Эта итерация подготовлена только локально в `/home/max/MADCORE RF`.
- На момент фиксации этой локальной точки live `https://madcore.site` еще не был обновлен под новый набор `1Г/2Г`.
