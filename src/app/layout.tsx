import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Matomo from "@/components/Matomo";
import YandexMetrika from "@/components/YandexMetrika";
import { getSiteRuntimeConfig, siteContent } from "@/config/site";

const { productName, publicBaseUrl, publicPhone } = getSiteRuntimeConfig();
const publicPriceValue = String(Number(process.env.PUBLIC_PRICE || "14000"));
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: siteContent.productName,
      url: publicBaseUrl,
      inLanguage: "ru-RU",
    },
    {
      "@type": "Organization",
      name: productName,
      url: publicBaseUrl,
      logo: `${publicBaseUrl}/icon.png`,
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: publicPhone,
          contactType: "sales",
          areaServed: "RU",
          availableLanguage: ["ru"],
        },
      ],
    },
    {
      "@type": "Product",
      name: productName,
      description: siteContent.productDescription.replace(siteContent.productName, productName),
      image: [`${publicBaseUrl}${siteContent.heroImagePath}`],
      brand: {
        "@type": "Brand",
        name: "MADCORE",
      },
      offers: {
        "@type": "Offer",
        url: publicBaseUrl,
        priceCurrency: "RUB",
        price: publicPriceValue,
        availability: "https://schema.org/InStock",
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(publicBaseUrl),
  title: siteContent.siteTitle,
  description: siteContent.siteDescription,
  verification: googleSiteVerification
    ? {
        google: googleSiteVerification,
      }
    : undefined,
  openGraph: {
    title: productName,
    description: siteContent.ogDescription,
    url: publicBaseUrl,
    siteName: productName,
    images: [siteContent.heroImagePath],
    type: "website",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: productName,
    description: siteContent.ogDescription,
    images: [siteContent.heroImagePath],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Matomo
          matomoUrl={matomoUrl}
          siteId={matomoSiteId}
          disableOnSafe={disableOnSafe}
          dimensions={{
            clickId: process.env.MATOMO_DIMENSION_CLICK_ID,
            yclid: process.env.MATOMO_DIMENSION_YCLID,
            utmSource: process.env.MATOMO_DIMENSION_UTM_SOURCE,
            utmMedium: process.env.MATOMO_DIMENSION_UTM_MEDIUM,
            utmCampaign: process.env.MATOMO_DIMENSION_UTM_CAMPAIGN,
            utmContent: process.env.MATOMO_DIMENSION_UTM_CONTENT,
            utmTerm: process.env.MATOMO_DIMENSION_UTM_TERM,
          }}
          goals={{
            telegramClick: process.env.MATOMO_GOAL_TELEGRAM_CLICK_ID,
            whatsappClick: process.env.MATOMO_GOAL_WHATSAPP_CLICK_ID,
            maxClick: process.env.MATOMO_GOAL_MAX_CLICK_ID,
            callClick: process.env.MATOMO_GOAL_CALL_CLICK_ID,
            formSubmit: process.env.MATOMO_GOAL_FORM_SUBMIT_ID,
            lead: process.env.MATOMO_GOAL_LEAD_ID,
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
