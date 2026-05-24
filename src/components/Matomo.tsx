"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getTrackingClient } from "@/lib/client-tracking";

type MatomoProps = {
  matomoUrl?: string;
  siteId?: string;
  disableOnSafe?: boolean;
  dimensions?: {
    clickId?: string;
    yclid?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
  };
  goals?: {
    telegramClick?: string;
    whatsappClick?: string;
    maxClick?: string;
    callClick?: string;
    formSubmit?: string;
    lead?: string;
  };
};

function setDimension(queue: unknown[], dimensionId: string | undefined, value?: string) {
  if (!dimensionId || !value) return;
  queue.push(["setCustomDimension", Number(dimensionId), value]);
}

export default function Matomo({
  matomoUrl,
  siteId,
  disableOnSafe = true,
  dimensions,
  goals,
}: MatomoProps) {
  const pathname = usePathname();
  const base = matomoUrl ? (matomoUrl.endsWith("/") ? matomoUrl : `${matomoUrl}/`) : "";
  const serializedGoals = JSON.stringify(goals ?? {});

  const setup = `
    window._paq = window._paq || [];
    window.__madcoreMatomoGoals = ${serializedGoals};
    window._paq.push(['setTrackerUrl', '${base}matomo.php']);
    window._paq.push(['setSiteId', '${siteId}']);
    window._paq.push(['alwaysUseSendBeacon']);
    window._paq.push(['enableLinkTracking']);
  `;

  useEffect(() => {
    if (!matomoUrl || !siteId) return;
    if (disableOnSafe && pathname === "/safe") return;
    if (typeof window === "undefined") return;

    const tracking = getTrackingClient();
    const queue = (window._paq = window._paq || []);
    setDimension(queue, dimensions?.clickId, tracking.click_id);
    setDimension(queue, dimensions?.yclid, tracking.yclid);
    setDimension(queue, dimensions?.utmSource, tracking.utm_source);
    setDimension(queue, dimensions?.utmMedium, tracking.utm_medium);
    setDimension(queue, dimensions?.utmCampaign, tracking.utm_campaign);
    setDimension(queue, dimensions?.utmContent, tracking.utm_content);
    setDimension(queue, dimensions?.utmTerm, tracking.utm_term);
    queue.push(["setCustomUrl", window.location.pathname + window.location.search]);
    queue.push(["setDocumentTitle", document.title]);
    queue.push(["trackPageView"]);
  }, [dimensions, disableOnSafe, matomoUrl, pathname, siteId]);

  if (!matomoUrl || !siteId) return null;
  if (disableOnSafe && pathname === "/safe") return null;

  return (
    <>
      <Script id="matomo-init" strategy="afterInteractive">
        {setup}
      </Script>
      <Script id="matomo-loader" strategy="afterInteractive" src={`${base}matomo.js`} />
    </>
  );
}
