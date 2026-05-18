"use client";

import Link from "next/link";
import { sendEvent } from "@/lib/client-tracking";

type CtaButtonsProps = {
  telegramUrl: string;
  whatsappUrl: string;
  maxUrl: string;
  callUrl: string;
  callPhone: string;
  withConsultation?: boolean;
};

export default function CtaButtons({
  telegramUrl,
  whatsappUrl,
  maxUrl,
  callUrl,
  callPhone,
  withConsultation = true,
}: CtaButtonsProps) {
  const onTelegram = () => {
    void sendEvent("telegram_click", { target: "telegram" });
  };

  const onWhatsapp = () => {
    void sendEvent("whatsapp_click", { target: "whatsapp" });
  };

  const onMax = () => {
    void sendEvent("max_click", { target: "max" });
  };

  const onConsultation = () => {
    void sendEvent("consultation_click", { target: "consultation" });
  };

  const onCall = () => {
    void sendEvent("call_click", { target: "call" });
  };

  return (
    <div className={`cta-grid ${withConsultation ? "cta-grid--with-consultation" : "cta-grid--compact"}`}>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onWhatsapp}
        className="btn btn-primary cta-whatsapp"
      >
        <span className="btn-stack">
          <span className="btn-kicker">Быстрый ответ</span>
          <span className="btn-title">Написать в WhatsApp</span>
        </span>
      </a>

      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onTelegram}
        className="btn btn-secondary cta-telegram"
      >
        <span className="btn-stack">
          <span className="btn-kicker">Без звонков</span>
          <span className="btn-title">Написать в Telegram</span>
        </span>
      </a>

      <a
        href={maxUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onMax}
        className="btn btn-max cta-max"
      >
        <span className="btn-stack">
          <span className="btn-kicker">Личный канал</span>
          <span className="btn-title">Написать в MaX</span>
        </span>
      </a>

      <a href={callUrl} onClick={onCall} className="btn btn-call cta-call">
        <span className="btn-stack">
          <span className="btn-kicker">Позвонить</span>
          <span className="btn-title">{callPhone}</span>
        </span>
      </a>

      {withConsultation ? (
        <Link href="#consultation" onClick={onConsultation} className="btn btn-outline cta-consultation">
          <span className="btn-stack">
            <span className="btn-kicker">По формату и наличию</span>
            <span className="btn-title">Получить консультацию</span>
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" aria-hidden="true" />
      )}
    </div>
  );
}
