import type { TrackingData } from "@/types/tracking";

export type LeadMessageData = {
  name: string;
  phone: string;
  city: string;
  contactMethod: string;
  comment?: string;
  productInterest?: string;
  tracking: TrackingData;
  ip: string;
  userAgent: string;
};

function clean(value?: string | null) {
  return value?.trim() ? value.trim() : "—";
}

function line(label: string, value?: string | null) {
  return `${label}: ${clean(value)}`;
}

export function getLeadContactMethodLabel(contactMethod: string) {
  switch (contactMethod) {
    case "telegram":
      return "Telegram";
    case "whatsapp":
      return "WhatsApp";
    case "max":
      return "MaX";
    case "call":
      return "Звонок";
    default:
      return contactMethod;
  }
}

export function getLeadManagerActionLabel(contactMethod: string) {
  switch (contactMethod) {
    case "telegram":
      return "написать в Telegram";
    case "whatsapp":
      return "написать в WhatsApp";
    case "max":
      return "написать в MaX";
    case "call":
      return "связаться звонком";
    default:
      return `связаться через ${contactMethod}`;
  }
}

export function buildLeadMessageText(payload: LeadMessageData) {
  return [
    "Новая заявка MADCORE Gena",
    "",
    line("Имя", payload.name),
    line("Телефон", payload.phone),
    line("Город", payload.city),
    line("Выбранный канал", getLeadContactMethodLabel(payload.contactMethod)),
    line("Действие менеджера", getLeadManagerActionLabel(payload.contactMethod)),
    line("Интерес к продукту", payload.productInterest),
    line("Комментарий", payload.comment),
    "",
    line("Источник", payload.tracking.src),
    line("Кампания", payload.tracking.cmp),
    line("Креатив", payload.tracking.cr),
    line("Click ID", payload.tracking.click_id),
    line("YCLID", payload.tracking.yclid),
    line("UTM Source", payload.tracking.utm_source),
    line("UTM Medium", payload.tracking.utm_medium),
    line("UTM Campaign", payload.tracking.utm_campaign),
    line("UTM Content", payload.tracking.utm_content),
    line("UTM Term", payload.tracking.utm_term),
    "",
    line("IP", payload.ip),
    line("User-Agent", payload.userAgent),
  ].join("\n");
}
