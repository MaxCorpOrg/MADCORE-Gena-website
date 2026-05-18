import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Matomo from "@/components/Matomo";
import YandexMetrika from "@/components/YandexMetrika";
import { getSiteRuntimeConfig, siteContent } from "@/config/site";

const { publicBaseUrl } = getSiteRuntimeConfig();

export const metadata: Metadata = {
  metadataBase: new URL(publicBaseUrl),
  title: siteContent.siteTitle,
  description: siteContent.siteDescription,
  openGraph: {
    title: siteContent.productName,
    description: siteContent.ogDescription,
    images: [siteContent.heroImagePath],
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const matomoUrl = process.env.MATOMO_URL;
  const matomoSiteId = process.env.MATOMO_SITE_ID;
  const yandexMetrikaCounterId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID;
  const disableOnSafe = process.env.SAFE_MODE_DISABLE_MATOMO !== "false";

  return (
    <html lang="ru">
      <body>
        <Matomo
          matomoUrl={matomoUrl}
          siteId={matomoSiteId}
          disableOnSafe={disableOnSafe}
          dimensions={{
            clickId: process.env.MATOMO_DIMENSION_CLICK_ID,
            yclid: process.env.MATOMO_DIMENSION_YCLID,
            utmSource: process.env.MATOMO_DIMENSION_UTM_SOURCE,
            utmCampaign: process.env.MATOMO_DIMENSION_UTM_CAMPAIGN,
            utmContent: process.env.MATOMO_DIMENSION_UTM_CONTENT,
            utmTerm: process.env.MATOMO_DIMENSION_UTM_TERM,
          }}
        />
        <Suspense fallback={null}>
          <YandexMetrika counterId={yandexMetrikaCounterId} />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
