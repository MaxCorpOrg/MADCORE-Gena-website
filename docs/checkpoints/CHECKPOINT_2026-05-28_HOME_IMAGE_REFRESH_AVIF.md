# Checkpoint `2026-05-28` `home image refresh + avif delivery`

## Что исправлено

- Заменены первое и второе изображения на главной странице `MADCORE Gena`.
- Новые исходники взяты из:
  - `/home/max/Рабочий стол/Заменить изображение на картинке/2/1.png`
  - `/home/max/Рабочий стол/Заменить изображение на картинке/2/2.png`
- Для боевой клиентской выдачи подготовлены и подключены более легкие версии:
  - `public/images/hero-metallic-premium-v1.avif`
  - `public/images/product-metallic-card-v2.avif`

## Что сделано

- Обновлены исходные PNG-файлы:
  - `public/images/hero-metallic-premium-v1.png`
  - `public/images/product-metallic-card-v2.png`
- Hero-блок страницы переведен на `AVIF` через `src/config/site.ts`.
- `openGraph` в `src/app/layout.tsx` оставлен на `PNG`, чтобы не терять совместимость превью в соцсетях и мессенджерах.
- Product-card в `src/app/page.tsx` переведен на `AVIF`.

## Что подтверждено

- `npm run lint` проходит.
- `npm run build` проходит.
- Вес hero-ассета для страницы снижен примерно `2098056 -> 61516` байт.
- Вес product-ассета для страницы снижен примерно `1976246 -> 28438` байт.

## Важное замечание

- Эта правка пока подготовлена локально в `/home/max/MADCORE RF`.
- Server deploy и проверка live `https://madcore.site` в рамках этой задачи еще не выполнялись.
