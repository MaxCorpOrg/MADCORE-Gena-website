"use client";

import { sendEvent } from "@/lib/client-tracking";

type CtaButtonsProps = {
  telegramUrl: string;
  whatsappUrl: string;
  maxUrl: string;
  telegramChatUrl?: string;
  maxChatUrl?: string;
  callUrl: string;
  callPhone: string;
  withChatLinks?: boolean;
};

export default function CtaButtons({
  telegramUrl,
  whatsappUrl,
  maxUrl,
  telegramChatUrl,
  maxChatUrl,
  callUrl,
  callPhone,
  withChatLinks = true,
}: CtaButtonsProps) {
  const telegramChatHref = telegramChatUrl || telegramUrl;
  const maxChatHref = maxChatUrl || maxUrl;

  const onTelegram = () => {
    void sendEvent("telegram_click", { target: "telegram" });
  };

  const onWhatsapp = () => {
    void sendEvent("whatsapp_click", { target: "whatsapp" });
  };

  const onMax = () => {
    void sendEvent("max_click", { target: "max" });
  };

  const onTelegramChat = () => {
    void sendEvent("telegram_click", { target: "telegram_chat" });
  };

  const onMaxChat = () => {
    void sendEvent("max_click", { target: "max_chat" });
  };

  const onCall = () => {
    void sendEvent("call_click", { target: "call" });
  };

  return (
    <div className={`cta-grid ${withChatLinks ? "cta-grid--with-chat-links" : "cta-grid--compact"}`}>
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

      {withChatLinks ? (
        <>
          <a
            href={telegramChatHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onTelegramChat}
            className="btn btn-secondary cta-telegram-chat"
          >
            <span className="btn-stack">
              <span className="btn-kicker">Открытый чат</span>
              <span className="btn-title">Перейти в чат Telegram</span>
            </span>
          </a>

          <a
            href={maxChatHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onMaxChat}
            className="btn btn-max cta-max-chat"
          >
            <span className="btn-stack">
              <span className="btn-kicker">Открытый чат</span>
              <span className="btn-title">Перейти в чат Max</span>
            </span>
          </a>
        </>
      ) : null}

      <a href={callUrl} onClick={onCall} className="btn btn-call cta-call">
        <span className="btn-stack">
          <span className="btn-kicker">Позвонить</span>
          <span className="btn-title">{callPhone}</span>
        </span>
      </a>
    </div>
  );
}
