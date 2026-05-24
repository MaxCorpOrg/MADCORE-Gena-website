export const CLIENT_EVENT_NAMES = [
  "page_view",
  "time_15_sec",
  "scroll_50",
  "scroll_90",
  "product_view",
  "offer_view",
  "whatsapp_click",
  "telegram_click",
  "max_click",
  "call_click",
  "form_start",
  "form_submit",
  "thanks_view",
  "safe_view",
  "first_interaction",
] as const;

export const SERVER_EVENT_NAMES = [
  "lead",
  "lead_notify",
  "traffic_gate",
  "manager_status",
  "qualified_lead",
  "bad_lead",
  "sale",
] as const;

export const ALL_EVENT_NAMES = [...CLIENT_EVENT_NAMES, ...SERVER_EVENT_NAMES] as const;

export type EventName = (typeof ALL_EVENT_NAMES)[number];
