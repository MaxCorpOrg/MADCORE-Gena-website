FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-fund --no-audit

ARG NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID=""
ARG MATOMO_URL=""
ARG MATOMO_SITE_ID=""
ARG MATOMO_DIMENSION_CLICK_ID=""
ARG MATOMO_DIMENSION_YCLID=""
ARG MATOMO_DIMENSION_UTM_SOURCE=""
ARG MATOMO_DIMENSION_UTM_CAMPAIGN=""
ARG MATOMO_DIMENSION_UTM_CONTENT=""
ARG MATOMO_DIMENSION_UTM_TERM=""
ARG SAFE_MODE_DISABLE_MATOMO="true"
ARG SITE_DOMAIN=""
ARG SITE_DISPLAY_DOMAIN=""
ARG SITE_WWW_DOMAIN=""
ARG SITE_CERT_NAME=""
ARG PUBLIC_BASE_URL=""

ENV NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID="${NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID}" \
    MATOMO_URL="${MATOMO_URL}" \
    MATOMO_SITE_ID="${MATOMO_SITE_ID}" \
    MATOMO_DIMENSION_CLICK_ID="${MATOMO_DIMENSION_CLICK_ID}" \
    MATOMO_DIMENSION_YCLID="${MATOMO_DIMENSION_YCLID}" \
    MATOMO_DIMENSION_UTM_SOURCE="${MATOMO_DIMENSION_UTM_SOURCE}" \
    MATOMO_DIMENSION_UTM_CAMPAIGN="${MATOMO_DIMENSION_UTM_CAMPAIGN}" \
    MATOMO_DIMENSION_UTM_CONTENT="${MATOMO_DIMENSION_UTM_CONTENT}" \
    MATOMO_DIMENSION_UTM_TERM="${MATOMO_DIMENSION_UTM_TERM}" \
    SAFE_MODE_DISABLE_MATOMO="${SAFE_MODE_DISABLE_MATOMO}" \
    SITE_DOMAIN="${SITE_DOMAIN}" \
    SITE_DISPLAY_DOMAIN="${SITE_DISPLAY_DOMAIN}" \
    SITE_WWW_DOMAIN="${SITE_WWW_DOMAIN}" \
    SITE_CERT_NAME="${SITE_CERT_NAME}" \
    PUBLIC_BASE_URL="${PUBLIC_BASE_URL}"

COPY . .
RUN npx prisma generate && npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --no-fund --no-audit

COPY --from=build /app/prisma ./prisma
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/src ./src
COPY --from=build /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=build /app/tailwind.config.ts ./tailwind.config.ts
COPY --from=build /app/next-env.d.ts ./next-env.d.ts

EXPOSE 3000
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run start"]
