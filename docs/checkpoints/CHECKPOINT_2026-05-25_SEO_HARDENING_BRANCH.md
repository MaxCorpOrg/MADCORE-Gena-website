# Checkpoint `2026-05-25` `seo-hardening branch prepared`

## Что сделано

- Перед SEO-работой рабочий `main` синхронизирован с live-состоянием и отправлен в `origin/main`.
- Создано отдельное дерево для SEO, чтобы не ломать текущую production-ветку:
  - локальная ветка: `seo-hardening`
  - remote-ветка: `origin/seo-hardening`
  - отдельный `worktree`: `/home/max/MADCORE RF SEO`
- В отдельной ветке подготовлен безопасный технический SEO-пакет без визуальных изменений:
  - `canonical` для `/`
  - `canonical` для `/privacy`
  - `JSON-LD` со схемами `WebSite` и `Organization`
  - явный `openGraph.url`

## Что проверено

- В `seo-hardening` прошли:
  - `npm run lint`
  - `npm run build`
- Локальный `next start` на `http://localhost:3010` подтвердил, что HTML уже отдает:
  - `<link rel="canonical" href="https://madcore.site"/>`
  - `<script type="application/ld+json">...`

## Важное ограничение

- Эти SEO-изменения пока существуют только в ветке `seo-hardening`.
- На production `https://madcore.site` они еще не выкатывались.

## Следующий шаг

- Если продолжаем безопасное SEO в этой ветке, дальше логично:
  - подключить `Google Search Console`;
  - отправить `https://madcore.site/sitemap.xml`;
  - запросить переобход главной страницы;
  - затем отдельно решить, когда именно мержить `seo-hardening` в `main`.
