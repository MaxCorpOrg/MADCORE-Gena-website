# Checkpoint `2026-05-28` `product card image correction round 3`

## Что исправлено

- Второе изображение на главной странице снова заменено, потому что пользователь ещё раз обновил файл-исходник.
- Актуальный исходник взят из:
  - `/home/max/Рабочий стол/Заменить изображение на картинке/2/2.png`

## Что сделано

- Обновлен файл:
  - `public/images/product-metallic-card-v2.png`
- Облегченная версия для страницы перевыпущена заново:
  - `public/images/product-metallic-card-v2.avif`
- Код страницы не менялся, потому что `product-card` уже был подключен к lightweight-ассету.

## Что подтверждено

- `npm run lint` проходит.
- `npm run build` проходит.
- `public/images/product-metallic-card-v2.png` совпадает с актуальным локальным исходником.
- Вес `public/images/product-metallic-card-v2.avif` составляет `123892` байт вместо `2800398` байт у актуального `png`.

## Важное замечание

- Эта корректировка пока выполнена только локально в `/home/max/MADCORE RF`.
- Live deploy на `https://madcore.site` в рамках этой задачи еще не выполнялся.
