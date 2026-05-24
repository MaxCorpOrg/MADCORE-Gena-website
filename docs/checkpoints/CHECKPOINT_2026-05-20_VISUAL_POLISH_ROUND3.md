# MADCORE Gena Checkpoint `2026-05-20` Visual Polish Round 3

## Что изменено

- hero-wordmark переведен на новый холодный metallic/chrome asset:
  - `public/images/madcore-logo-metallic-v3.png`
- в `src/components/MadcoreWordmark.tsx` подключен новый logo-asset без изменения структуры hero;
- в `src/app/globals.css` усилен металлический характер логотипа:
  - обновлен `aspect-ratio`
  - ослаблен лишний белый glow
  - усилена читаемость chrome-деталей
- у светлой WhatsApp-кнопки затемнен текст, чтобы CTA читался контрастно и без слияния с кнопкой;
- для мобильных экранов подключен отдельный full-screen background:
  - `public/images/background-metallic-mobile-v1.png`
- в mobile override убрана яркая правая полоса; фон теперь заполняет экран ровнее и ближе к референсу пользователя;
- упаковки и product renders не менялись.

## Что проверено

- локально:
  - `npm run lint`
  - `npm run build`
  - desktop screenshot первого экрана
  - mobile screenshot первого экрана
- на preview-host:
  - snapshot deploy в `/opt/madcore-gena`
  - `docker compose build app`
  - `docker compose up -d app`
  - `./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru`
  - `METRIKA_COUNTER_ID=109282367 ./scripts/production-adtech-smoke.sh https://gena.madcore-kavkaz.ru`
  - live desktop screenshot первого экрана
  - live mobile screenshot первого экрана
- визуально подтверждено:
  - логотип стал именно серебристо-металлическим, без ухода в золото;
  - WhatsApp CTA читается заметно лучше;
  - на mobile first screen больше нет яркого правого шва.

## На чем остановились

- `round 3` visual polish уже выкачен на live preview `https://gena.madcore-kavkaz.ru`;
- финальный домен проекта по-прежнему:
  - `madcore.site`

## Что делать дальше

1. Переходить к доменному cutover на `madcore.site`.
2. После cutover обновить host-привязки в Метрике и Matomo.
3. Если понадобится следующий creative-step, собирать новые performance-visuals уже от финального домена.
