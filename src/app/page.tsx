import Image from "next/image";
import type { Metadata } from "next";
import CtaButtons from "@/components/CtaButtons";
import LeadForm from "@/components/LeadForm";
import MadcoreWordmark from "@/components/MadcoreWordmark";
import TrackClient from "@/components/TrackClient";
import { getSiteRuntimeConfig, siteContent } from "@/config/site";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  const {
    telegramUrl,
    telegramChatUrl,
    whatsappUrl,
    maxUrl,
    maxChatUrl,
    callUrl,
    publicPhone,
    publicAddress,
    productName,
    publicPrice,
    displayDomain,
  } = getSiteRuntimeConfig();
  const showOfficeBlock = Boolean(
    siteContent.officeTitle.trim() && siteContent.officeAddress.trim() && publicAddress.trim(),
  );

  return (
    <main className="page-shell">
      <TrackClient pageType="home" />

      <section className="hero-wrap">
        <div className="container hero-shell">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="hero-copy-main">
                <span className="eyebrow hero-eyebrow">
                  {siteContent.heroEyebrowLines.map((line) => (
                    <span className="hero-eyebrow-line" key={line}>
                      {line}
                    </span>
                  ))}
                </span>
                <div className="hero-logo-shell">
                  <h1 className="sr-only">{productName}</h1>
                  <MadcoreWordmark />
                </div>
                <div className="hero-intro-block">
                  <div className="hero-feature-block" aria-label="Ключевые эффекты MADCORE">
                    {siteContent.heroFeatures.map((lines) => (
                      <div className="hero-feature-item" key={lines.join(" ")}>
                        <span className="hero-feature-mark" aria-hidden="true">
                          —
                        </span>
                        <span className="hero-feature-lines">
                          {lines.map((line) => (
                            <span className="hero-feature-line" key={line}>
                              {line}
                            </span>
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hero-copy-foot">
                <div className="stats hero-stats">
                  <div>
                    <span className="stat-key">{siteContent.heroStatFormatLabel}</span>
                    <span className="stat-value">{siteContent.heroStatFormatValue}</span>
                  </div>
                  <div>
                    <span className="stat-key">Цена</span>
                    <span className="stat-value">{publicPrice} ₽</span>
                  </div>
                </div>

                <div className="hero-actions">
                  <CtaButtons
                    telegramUrl={telegramUrl}
                    telegramChatUrl={telegramChatUrl}
                    whatsappUrl={whatsappUrl}
                    maxUrl={maxUrl}
                    maxChatUrl={maxChatUrl}
                    callUrl={callUrl}
                    callPhone={publicPhone}
                  />
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="card hero-visual-frame">
                <div className="hero-visual-chip" aria-hidden="true">
                  {displayDomain}
                </div>
                <div className="product-glow" aria-hidden="true" />
                <Image
                  src={siteContent.heroImagePath}
                  alt="Премиальная металлическая иллюстрация продукта MADCORE 2.0"
                  width={1100}
                  height={1400}
                  priority
                  sizes="(min-width: 1024px) 44vw, 100vw"
                  className="hero-image"
                />
              </div>
            </div>
          </div>

          <div className="card hero-official-band">
            <p className="section-copy hero-official-text">
              <span className="hero-official-copy">{siteContent.officialBandText}</span>
              <span className="hero-official-product">{productName}</span>
            </p>
          </div>

          <div className="card hero-consultation-band" data-track-section="offer">
            <div className="hero-consultation-head">
              <p className="section-title hero-consultation-heading">{siteContent.benefitsTitle}</p>
            </div>
            <div className="hero-consultation-grid">
              {siteContent.benefitsItems.map((item) => (
                <article className="hero-consultation-item" key={item}>
                  <span className="hero-consultation-mark" aria-hidden="true" />
                  <p className="hero-consultation-text">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container section-space section-space--story section-space--first">
        <div className={`story-shell ${showOfficeBlock ? "" : "story-shell--steps-only"}`}>
          {showOfficeBlock ? (
            <>
              <h2 className="section-title">{siteContent.officeTitle}</h2>
              <div className="card story-card p-5 sm:p-7">
                <p className="section-copy">{publicAddress}</p>
              </div>
            </>
          ) : null}
          <div className="story-steps-block">
            <h2 className="section-title">{siteContent.stepsTitle}</h2>
            <ol className="story-steps-grid">
              {siteContent.steps.map((step, index) => (
                <li className="card story-step-card" key={step}>
                  <span className="step-index">{index + 1}</span>
                  <p className="section-copy">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="container section-space section-space--panels">
        <div className="panel-stage">
          <div className="panel-grid grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-stretch">
            <LeadForm telegramUrl={telegramUrl} whatsappUrl={whatsappUrl} maxUrl={maxUrl} />
            <div className="panel-stack">
              <h3 className="section-title">{siteContent.productTitle}</h3>
              <div className="card panel-card product-card p-5 sm:p-7" data-track-section="product">
                <div className="panel-head">
                  <p className="section-copy">
                    {siteContent.productDescription.replace(siteContent.productName, productName)}
                  </p>
                </div>
                <div className="product-media-frame relative overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#0c0c0c]">
                  <Image
                    src="/images/product-metallic-card-v2.png"
                    alt="Премиальная металлическая карточка продукта MADCORE 2.0"
                    width={1254}
                    height={1254}
                    sizes="(min-width: 1024px) 34vw, 90vw"
                    className="product-card-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
