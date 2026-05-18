"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getTrackingClient, sendEvent, trackExternalAnalyticsGoal } from "@/lib/client-tracking";
import { siteContent } from "@/config/site";
import { formatPhoneInput } from "@/lib/phone";

type LeadFormProps = {
  telegramUrl: string;
  whatsappUrl: string;
  maxUrl: string;
};

type Status = "idle" | "loading" | "error";

export default function LeadForm({ telegramUrl, whatsappUrl, maxUrl }: LeadFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [maxScrollPercent, setMaxScrollPercent] = useState(0);
  const [firstInteractionAt, setFirstInteractionAt] = useState<number | null>(null);
  const startedAt = useMemo(() => Date.now(), []);
  const formStartedSent = useRef(false);

  const phoneId = "lead-phone";
  const nameId = "lead-name";
  const cityId = "lead-city";
  const contactId = "lead-contact-method";
  const commentId = "lead-comment";

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const ratio = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0;
      setMaxScrollPercent((prev) => Math.max(prev, ratio));
    };

    const onInteraction = () => {
      setFirstInteractionAt((prev) => prev ?? Date.now());
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onInteraction, { passive: true });
    window.addEventListener("mousedown", onInteraction, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onInteraction);
      window.removeEventListener("mousedown", onInteraction);
    };
  }, []);

  const handleFocus = () => {
    if (formStartedSent.current) return;
    formStartedSent.current = true;
    void sendEvent("form_start", { source: "lead_form" });
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneValue(formatPhoneInput(event.target.value));
  };

  const toUserErrorMessage = (rawError: string) => {
    switch (rawError) {
      case "invalid_phone":
        return "Укажите корректный номер телефона, чтобы мы могли связаться с вами.";
      case "duplicate_lead":
        return "Такая заявка уже недавно была отправлена. Если нужно, напишите нам в Telegram, WhatsApp или MaX.";
      case "rate_limited":
      case "too_fast":
        return "Отправка временно ограничена. Попробуйте еще раз через минуту.";
      case "spam_detected":
        return "Не удалось отправить заявку. Обновите страницу и попробуйте еще раз.";
      default:
        return "Не удалось отправить заявку. Проверьте данные и попробуйте снова.";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      city: String(formData.get("city") ?? ""),
      contact_method: String(formData.get("contact_method") ?? "telegram"),
      comment: String(formData.get("comment") ?? ""),
      product_interest: siteContent.productName,
      honeypot: String(formData.get("company") ?? ""),
      started_at: String(startedAt),
      first_interaction_at: firstInteractionAt ? String(firstInteractionAt) : undefined,
      max_scroll_percent: maxScrollPercent,
      tracking: getTrackingClient(),
      refLinks: {
        telegramUrl,
        whatsappUrl,
        maxUrl,
      },
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Не удалось отправить заявку");
      }

      trackExternalAnalyticsGoal("form_submit", { source: "lead_form" });
      trackExternalAnalyticsGoal("lead", { source: "lead_form" });
      router.push("/thanks");
    } catch (submitError) {
      setStatus("error");
      const message =
        submitError instanceof Error
          ? toUserErrorMessage(submitError.message)
          : "Не удалось отправить заявку";
      setError(message);
    }
  };

  return (
    <div className="panel-stack" id="consultation">
      <h3 className="section-title">{siteContent.formTitle}</h3>
      <form onSubmit={handleSubmit} className="card panel-card lead-form-card p-5 sm:p-7">
        <div className="lead-form-intro">
          <p className="section-copy">{siteContent.formDescription}</p>
          {siteContent.formTrustHint ? <p className="form-trust-copy">{siteContent.formTrustHint}</p> : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="field-group" htmlFor={nameId}>
            <span className="field-label">Имя</span>
            <input
              id={nameId}
              name="name"
              placeholder="Ваше имя"
              className="field"
              required
              minLength={2}
              maxLength={120}
              autoComplete="name"
              onFocus={handleFocus}
            />
          </label>
          <label className="field-group" htmlFor={phoneId}>
            <span className="field-label">Телефон</span>
            <input
              id={phoneId}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 904 244-04-44"
              className="field"
              required
              minLength={5}
              maxLength={18}
              value={phoneValue}
              onChange={handlePhoneChange}
              onFocus={handleFocus}
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="field-group" htmlFor={cityId}>
            <span className="field-label">Город</span>
            <input
              id={cityId}
              name="city"
              placeholder="Ваш город"
              className="field"
              required
              minLength={2}
              maxLength={80}
              autoComplete="address-level2"
              onFocus={handleFocus}
            />
          </label>
          <label className="field-group" htmlFor={contactId}>
            <span className="field-label">Предпочтительный способ связи</span>
            <select
              id={contactId}
              name="contact_method"
              className="field"
              required
              onFocus={handleFocus}
              defaultValue="telegram"
            >
              <option value="telegram">Telegram</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="max">MaX</option>
              <option value="call">Звонок</option>
            </select>
          </label>
        </div>

        <label className="field-group" htmlFor={commentId}>
          <span className="field-label">Комментарий</span>
          <textarea
            id={commentId}
            name="comment"
            placeholder="Кратко опишите цель или удобное время для связи"
            className="field lead-form-comment"
            maxLength={2000}
            onFocus={handleFocus}
          />
        </label>

        <div className="hidden" aria-hidden="true">
          <label htmlFor="company">Компания</label>
          <input id="company" name="company" autoComplete="off" tabIndex={-1} />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full lead-form-submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Отправляем..." : "Получить консультацию"}
        </button>

        <div className="lead-form-meta">
          <p className="form-consent-copy">
            {siteContent.formConsent}{" "}
            <Link href="/privacy" className="form-consent-link">
              Политика конфиденциальности
            </Link>
            .
          </p>
          <p className="form-contact-shortcuts">
            Можно сразу написать в{" "}
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
              Telegram
            </a>{" "}
            или{" "}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            {" "}или{" "}
            <a href={maxUrl} target="_blank" rel="noopener noreferrer">
              MaX
            </a>
            .
          </p>
        </div>

        {status === "error" ? <p className="form-error-message">{error}</p> : null}
      </form>
    </div>
  );
}
