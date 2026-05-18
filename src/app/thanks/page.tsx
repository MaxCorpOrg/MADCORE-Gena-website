import type { Metadata } from "next";
import CtaButtons from "@/components/CtaButtons";
import TrackClient from "@/components/TrackClient";
import { getSiteRuntimeConfig, siteContent } from "@/config/site";

export const metadata: Metadata = {
  title: siteContent.thanksTitle,
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThanksPage() {
  const { telegramUrl, whatsappUrl, maxUrl, callUrl, publicPhone } = getSiteRuntimeConfig();

  return (
    <main className="page-shell">
      <TrackClient pageType="thanks" />
      <section className="container py-20">
        <div className="card mx-auto max-w-2xl p-6 sm:p-8">
          <h1 className="title text-3xl sm:text-4xl">{siteContent.thanksTitle}</h1>
          <p className="section-copy mt-3">{siteContent.thanksDescription}</p>
          <div className="mt-6">
            <CtaButtons
              telegramUrl={telegramUrl}
              whatsappUrl={whatsappUrl}
              maxUrl={maxUrl}
              callUrl={callUrl}
              callPhone={publicPhone}
              withConsultation={false}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
