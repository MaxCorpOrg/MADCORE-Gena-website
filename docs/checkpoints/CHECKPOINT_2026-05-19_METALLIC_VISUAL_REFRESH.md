# MADCORE Gena Checkpoint `2026-05-19` Metallic Visual Refresh

## Что сделано

- публичный контент `https://gena.madcore-kavkaz.ru` синхронизирован по смыслу с `https://madcore-kavkaz.ru/` без перестройки текущей архитектуры страниц;
- блок `MADCORE Gena работает как самостоятельный сайт...` заменен на:
  - `Мы являемся официальным представителем Madcore`
- сохранен headline:
  - `Премиальный продукт`
  - `Аналогов нет во всем мире`
- через OpenAI Image2 сгенерирован новый metallic-pack:
  - `public/images/hero-metallic-premium-v1.png`
  - `public/images/product-metallic-card-v1.png`
  - `public/images/background-metallic-brushed-v1.png`
  - `public/images/favicon-metallic-loop-v1.png`
- hero, product-card, background и favicon уже переключены на эти новые ассеты;
- точный wordmark `MADCORE 2.0` сохранен через исходный logo-asset `madcore-logo-ai-gold-transparent.png`, а металлический вид собран CSS-обработкой, чтобы не рисковать ошибкой в написании бренда;
- `.env.example`, `.env.preview.example` и live `/opt/madcore-gena/.env` обновлены под:
  - `PRODUCT_NAME=MADCORE 2.0`
  - `PUBLIC_ADDRESS=Наш офис находится в Нальчике, на улице Тарчокова 50, в офисном здании, 2-ой этаж, офис 24.`
- preview на VPS пересобран и перевыкатан без изменения основного сайта.

## Что проверено

- локально:
  - `npm run lint`
  - `npm run build`
  - desktop screenshot после сборки
  - mobile full-page screenshot после сборки
- live preview:
  - `./scripts/production-smoke.sh https://gena.madcore-kavkaz.ru`
  - `METRIKA_COUNTER_ID=109282367 ./scripts/production-adtech-smoke.sh https://gena.madcore-kavkaz.ru`
  - desktop screenshot `https://gena.madcore-kavkaz.ru`
  - mobile full-page screenshot `https://gena.madcore-kavkaz.ru`
  - `curl` подтвердил отдачу новых `icon.png`, `apple-icon.png` и `favicon.ico`

## На чем остановились

- preview уже живет с новым metallic visual и source-copy;
- отдельные контакты `Gena`, separate analytics, bot-flow и прием заявок сохранены;
- следующий внешний этап по-прежнему не кодовый:
  - выбрать финальный домен
  - сделать финальный доменный cutover

## Что делать дальше

1. После выбора финального домена заменить preview-host в DNS, TLS, ingress и `/opt/madcore-gena/.env`.
2. При необходимости обновить привязки Яндекс.Метрики и Matomo под финальный домен.
3. Если нужен следующий marketing-step, собрать отдельный набор рекламных баннеров и performance-creatives в той же metallic-системе.
