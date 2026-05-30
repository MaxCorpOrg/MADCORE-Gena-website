# Checkpoint `2026-05-28` `product card image correction round 2`

## Что исправлено

- Второе изображение на главной странице заменено еще раз, потому что пользователь повторно обновил файл-исходник.
- Актуальный исходник взят из:
  - `/home/max/Рабочий стол/Заменить изображение на картинке/2/2.png`

## Что сделано

- Обновлен файл:
  - `public/images/product-metallic-card-v2.png`
- Облегченная версия для страницы перевыпущена заново:
  - `public/images/product-metallic-card-v2.avif`
- Код страницы не менялся, потому что `product-card` уже был подключен к этому lightweight-ассету.

## Что подтверждено

- `npm run lint` проходит.
- `npm run build` проходит.
- `public/images/product-metallic-card-v2.png` совпадает с самым свежим локальным исходником.
- Вес `public/images/product-metallic-card-v2.avif` составляет `118523` байт вместо `2595110` байт у актуального `png`.

## Важное замечание

- Эта корректировка пока выполнена только локально в `/home/max/MADCORE RF`.
- Live deploy на `https://madcore.site` в рамках этой задачи еще не выполнялся.
