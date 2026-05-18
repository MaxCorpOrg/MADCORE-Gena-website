"use client";

import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { bootstrapTracking, getMetrikaVisitParams, setTrackingClientId } from "@/lib/client-tracking";

type YandexMetrikaProps = {
  counterId?: string;
};

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

export default function YandexMetrika({ counterId }: YandexMetrikaProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);
  const searchQuery = searchParams.toString();
  const numericCounterId = useMemo(() => Number(counterId), [counterId]);

  useEffect(() => {
    if (!counterId || !Number.isFinite(numericCounterId) || typeof window === "undefined") return;

    if (typeof window.ym === "function") {
      setIsReady(true);
      return;
    }

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (typeof window.ym === "function") {
        setIsReady(true);
        window.clearInterval(timer);
      } else if (attempts >= 50) {
        window.clearInterval(timer);
      }
    }, 200);

    return () => window.clearInterval(timer);
  }, [counterId, numericCounterId]);

  useEffect(() => {
    if (!counterId || !Number.isFinite(numericCounterId) || !isReady || typeof window === "undefined" || !window.ym) {
      return;
    }

    const tracking = bootstrapTracking();
    const visitParams = getMetrikaVisitParams(tracking);
    const hitOptions: Record<string, unknown> = {
      title: document.title,
    };

    if (document.referrer) {
      hitOptions.referer = document.referrer;
    }

    if (Object.keys(visitParams).length > 0) {
      window.ym(numericCounterId, "params", visitParams);
      hitOptions.params = visitParams;
    }

    window.ym(numericCounterId, "hit", window.location.href, hitOptions);
    window.ym(numericCounterId, "getClientID", (clientId: unknown) => {
      if (typeof clientId === "string") {
        setTrackingClientId(clientId);
      }
    });
  }, [counterId, isReady, numericCounterId, pathname, searchQuery]);

  if (!counterId || !Number.isFinite(numericCounterId)) return null;

  const initScript = `
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=${numericCounterId}", "ym");
    ym(${numericCounterId}, "init", {
      ssr: true,
      defer: true,
      webvisor: true,
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true
    });
  `;

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {initScript}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${numericCounterId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
