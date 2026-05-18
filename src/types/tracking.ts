export type TrackingData = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  yclid?: string;
  src?: string;
  cmp?: string;
  cr?: string;
  click_id?: string;
  decision_in?: string;
  score_in_bucket?: string;
  client_id?: string;
};

export const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "yclid",
  "src",
  "cmp",
  "cr",
  "click_id",
  "decision_in",
  "score_in_bucket",
  "client_id",
] as const;

export type TrackingKey = (typeof TRACKING_KEYS)[number];
