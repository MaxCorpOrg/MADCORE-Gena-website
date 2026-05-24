# MADCORE Gena Checkpoint `2026-05-23` Domain Cutover

## Что изменено

- финальный домен `madcore.site` подключен к VPS `151.247.197.153`;
- DNS `madcore.site` и `www.madcore.site` указывают на `151.247.197.153`;
- через Let's Encrypt выпущен сертификат для:
  - `madcore.site`
  - `www.madcore.site`
- сертификат действует до `2026-08-21`;
- общий ingress `/opt/madcore/nginx.conf` обновлен:
  - `madcore.site` проксируется на `genaapp:3000`;
  - `www.madcore.site` редиректит на `https://madcore.site/`;
  - legacy preview `gena.madcore-kavkaz.ru` оставлен рабочим;
  - основной сайт `madcore-kavkaz.ru` оставлен рабочим;
- `/opt/madcore-gena/.env` переключен на:
  - `SITE_DOMAIN=madcore.site`
  - `SITE_DISPLAY_DOMAIN=madcore.site`
  - `SITE_WWW_DOMAIN=www.madcore.site`
  - `SITE_CERT_NAME=madcore.site`
  - `PUBLIC_BASE_URL=https://madcore.site`
- `Dockerfile` и `docker-compose.yml` дополнены build args для доменных переменных;
- `madcore_gena_app` пересобран и пересоздан, чтобы статические metadata, `robots.txt` и `sitemap.xml` использовали `madcore.site`.

## Что проверено

- `https://madcore.site/` отвечает `200`;
- `https://www.madcore.site/` отдает `301` на `https://madcore.site/`;
- `https://madcore.site/api/health` отвечает `200`;
- `robots.txt` отдает `Host: https://madcore.site`;
- `sitemap.xml` содержит URL на `https://madcore.site`;
- `og:image` и `twitter:image` отдают `https://madcore.site/images/hero-metallic-premium-v1.png`;
- `SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-smoke.sh https://madcore.site` проходит;
- `METRIKA_COUNTER_ID=109282367 SITE_WWW_DOMAIN=www.madcore.site ./scripts/production-adtech-smoke.sh https://madcore.site` проходит;
- `https://gena.madcore-kavkaz.ru/` продолжает отвечать `200`;
- `https://madcore-kavkaz.ru/` продолжает отвечать `200`.

## На чем остановились

- production-домен проекта теперь `https://madcore.site`;
- preview-host сохранен как запасной адрес;
- следующий шаг: при необходимости обновить URL/host в Яндекс.Метрике и Matomo под `madcore.site`.
