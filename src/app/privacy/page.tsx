import type { Metadata } from "next";
import TrackClient from "@/components/TrackClient";
import { siteContent } from "@/config/site";

export const metadata: Metadata = {
  title: siteContent.privacyTitle,
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <TrackClient pageType="privacy" />
      <section className="container py-14">
        <article className="card max-w-4xl space-y-4 p-6 sm:p-8">
          <h1 className="title text-3xl">{siteContent.privacyTitle}</h1>
          <p className="section-copy">
            Мы обрабатываем персональные данные только для обратной связи по заявке и консультации.
          </p>
          <ul className="policy-list">
            <li>Фиксируем имя, телефон, город, способ связи, комментарий.</li>
            <li>
              Используем cookies и localStorage для сохранения рекламных меток: `src`, `cmp`, `cr`, `click_id`,
              `yclid` и `utm_*`.
            </li>
            <li>
              Передаём обезличенные события в Matomo и Яндекс.Метрику для оценки качества трафика и рекламных
              источников.
            </li>
            <li>Храним заявку и события в собственной базе данных на нашем сервере.</li>
            <li>По заявке можем связаться через Telegram, WhatsApp, MaX или звонок.</li>
            <li>Информация на сайте не является медицинской рекомендацией.</li>
            <li>Результат индивидуален, перед применением требуется консультация специалиста.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
