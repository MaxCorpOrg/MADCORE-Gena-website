# Checkpoint `2026-05-28` `product card image correction`

## Что исправлено

- Второе изображение на главной странице было заменено повторно, потому что в прошлый раз был подложен не тот исходник.
- Правильный исходник взят из:
  - `/home/max/Рабочий стол/Заменить изображение на картинке/2/2.png`

## Что сделано

- Обновлен файл:
  - `public/images/product-metallic-card-v2.png`
- Облегченная версия для страницы перевыпущена заново:
  - `public/images/product-metallic-card-v2.avif`
- Код страницы не менялся, потому что `product-card` уже был подключен к отдельному lightweight-ассету.

## Что подтверждено

- `npm run lint` проходит.
- `npm run build` проходит.
- `public/images/product-metallic-card-v2.png` совпадает с новым локальным исходником.
- Вес `public/images/product-metallic-card-v2.avif` составляет `65189` байт вместо `2138425` байт у исходного `png`.

## Важное замечание

- Эта корректировка пока выполнена только локально в `/home/max/MADCORE RF`.
- Live deploy на `https://madcore.site` в рамках этой задачи еще не выполнялся.
