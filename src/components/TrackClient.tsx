"use client";

import { useEffect, useRef } from "react";
import { bootstrapTracking, sendEvent, setSessionIdIfNeeded } from "@/lib/client-tracking";

type TrackClientProps = {
  pageType: "home" | "thanks" | "privacy" | "safe";
};

export default function TrackClient({ pageType }: TrackClientProps) {
  const sentScroll50 = useRef(false);
  const sentScroll90 = useRef(false);
  const sentInteraction = useRef(false);
  const sentOfferView = useRef(false);
  const sentProductView = useRef(false);

  useEffect(() => {
    setSessionIdIfNeeded();
    bootstrapTracking();
    void sendEvent("page_view", { pageType });

    if (pageType === "thanks") {
      void sendEvent("thanks_view", { pageType: "thanks" });
    }

    if (pageType === "safe") {
      void sendEvent("safe_view", { pageType: "safe" });
    }

    const timeSpentTimer = window.setTimeout(() => {
      void sendEvent("time_15_sec", { pageType, seconds: 15 });
    }, 15000);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          const sectionType = target.dataset.trackSection;

          if (sectionType === "offer" && !sentOfferView.current) {
            sentOfferView.current = true;
            void sendEvent("offer_view", { pageType: "home" });
          }

          if (sectionType === "product" && !sentProductView.current) {
            sentProductView.current = true;
            void sendEvent("product_view", { pageType: "home" });
          }
        }
      },
      { threshold: 0.35 },
    );

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const ratio = max > 0 ? (window.scrollY / max) * 100 : 0;

      if (!sentScroll50.current && ratio >= 50) {
        sentScroll50.current = true;
        void sendEvent("scroll_50", { ratio: 50 });
      }

      if (!sentScroll90.current && ratio >= 90) {
        sentScroll90.current = true;
        void sendEvent("scroll_90", { ratio: 90 });
      }
    };

    const onInteraction = () => {
      if (sentInteraction.current) return;
      sentInteraction.current = true;
      void sendEvent("first_interaction", { ts: Date.now() });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onInteraction, { passive: true });
    window.addEventListener("touchstart", onInteraction, { passive: true });
    window.addEventListener("mousemove", onInteraction, { passive: true, once: true });

    if (pageType === "home") {
      document
        .querySelectorAll<HTMLElement>("[data-track-section='offer'], [data-track-section='product']")
        .forEach((node) => observer.observe(node));
    }

    return () => {
      window.clearTimeout(timeSpentTimer);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onInteraction);
      window.removeEventListener("touchstart", onInteraction);
      window.removeEventListener("mousemove", onInteraction);
    };
  }, [pageType]);

  return null;
}
