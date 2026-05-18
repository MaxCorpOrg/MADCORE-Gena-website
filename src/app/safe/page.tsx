import type { Metadata } from "next";
import TrackClient from "@/components/TrackClient";
import { siteContent } from "@/config/site";

export const metadata: Metadata = {
  title: siteContent.safeTitle,
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function SafePage() {
  return (
    <main className="page-shell">
      <TrackClient pageType="safe" />
      <section className="container py-24">
        <div className="card mx-auto max-w-2xl p-7 text-center">
          <h1 className="title text-3xl">{siteContent.safeTitle}</h1>
          <p className="section-copy mt-4">{siteContent.safeDescription}</p>
        </div>
      </section>
    </main>
  );
}
