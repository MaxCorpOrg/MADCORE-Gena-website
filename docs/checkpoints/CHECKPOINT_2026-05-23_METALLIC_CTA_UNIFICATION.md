# MADCORE Gena Checkpoint `2026-05-23` Metallic CTA Unification

## Что изменено

- все CTA-кнопки приведены к одному metallic silver стилю:
  - WhatsApp
  - Telegram
  - MaX
  - звонок
  - консультация
  - submit-кнопка формы;
- общий `.btn` получил единый жирный шрифт;
- все CTA-варианты используют общий светлый металлический градиент, border, inner highlight и shadow;
- отдельные классы `btn-primary`, `btn-secondary`, `btn-outline`, `btn-call`, `btn-max` сохранены для существующей структуры и аналитики, но визуально теперь унифицированы.

## Что проверено

- локально:
  - `npm run lint`
  - `npm run build`
- на production:
  - `madcore_gena_app` пересобран и пересоздан;
  - live CSS на `https://madcore.site` содержит общий metallic стиль для всех CTA-классов;
  - `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site` проходит.
