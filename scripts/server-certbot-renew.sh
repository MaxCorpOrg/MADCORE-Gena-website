#!/usr/bin/env bash
set -euo pipefail

cd /opt/madcore-gena

echo "[madcore-gena-certbot-renew] starting renewal check"
/usr/bin/docker compose --profile manual run --rm certbot renew --quiet --webroot -w /var/www/certbot

echo "[madcore-gena-certbot-renew] reloading nginx"
/usr/bin/docker exec madcore_gena_nginx nginx -s reload

echo "[madcore-gena-certbot-renew] done"
