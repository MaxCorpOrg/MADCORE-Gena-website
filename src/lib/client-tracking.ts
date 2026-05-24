"use client";

import type { TrackingData } from "@/types/tracking";
import { TRACKING_KEYS } from "@/types/tracking";

const STORAGE_KEY = "madcore_gena_tracking_v1";
const COOKIE_KEY = "madcore_gena_tracking";
const METRIKA_COUNTER_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID;
const METRIKA_GOAL_NAMES = new Set([
  "telegram_click",
  "whatsapp_click",
  "max_click",
  "call_click",
  "form_start",
  "form_submit",
  "lead",
]);

declare global {
  interface Window {
    _paq?: unknown[];
    ym?: (...args: unknown[]) => void;
  }
}

function parseTrackingRecord(raw: unknown): TrackingData {
  if (!raw || typeof raw !== "object") return {};
  const input = raw as Record<string, unknown>;
  const parsed: TrackingData = {};
  for (const key of TRACKING_KEYS) {
    const value = input[key];
    if (typeof value === "string" && value.trim()) {
      parsed[key] = value.trim().slice(0, 256);
    }
  }
  return parsed;
}

function fromSearchParams(searchParams: URLSearchParams): TrackingData {
  const data: TrackingData = {};
  for (const key of TRACKING_KEYS) {
    const value = searchParams.get(key);
    if (value && value.trim()) {
      data[key] = value.trim().slice(0, 256);
    }
  }
  return data;
}

function fromCookie(): TrackingData {
  if (typeof document === "undefined") return {};
  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${COOKIE_KEY}=`));

  if (!cookie) return {};
  const raw = decodeURIComponent(cookie.slice(`${COOKIE_KEY}=`.length));
  return fromSearchParams(new URLSearchParams(raw));
}

function toCookieValue(data: TrackingData): string {
  const params = new URLSearchParams();
  for (const key of TRACKING_KEYS) {
    const value = data[key];
    if (value) params.set(key, value);
  }
  return params.toString();
}

function readStorage(): TrackingData {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return parseTrackingRecord(JSON.parse(raw));
  } catch {
    return {};
  }
}

function writeStorage(data: TrackingData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function writeCookie(data: TrackingData) {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(toCookieValue(data));
  const maxAge = 60 * 60 * 24 * 30;
  document.cookie = `${COOKIE_KEY}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

function compactRecord(input: Record<string, string | undefined>) {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => Boolean(value)));
}

export function mergeTracking(...parts: TrackingData[]): TrackingData {
  const merged: TrackingData = {};
  for (const part of parts) {
    for (const key of TRACKING_KEYS) {
      const value = part[key];
      if (!value) continue;
      merged[key] = value;
    }
  }
  return merged;
}

export function getTrackingClient(): TrackingData {
  return mergeTracking(fromCookie(), readStorage());
}

export function bootstrapTracking(): TrackingData {
  if (typeof window === "undefined") return {};

  const fromUrl = fromSearchParams(new URLSearchParams(window.location.search));
  const merged = mergeTracking(fromCookie(), readStorage(), fromUrl);
  writeStorage(merged);
  writeCookie(merged);

  return merged;
}

export function upsertTracking(partial: TrackingData): TrackingData {
  if (typeof window === "undefined") return partial;

  const merged = mergeTracking(fromCookie(), readStorage(), partial);
  writeStorage(merged);
  writeCookie(merged);
  return merged;
}

export function setTrackingClientId(clientId?: string) {
  if (!clientId || typeof window === "undefined") return;
  const normalized = clientId.trim().slice(0, 256);
  if (!normalized) return;

  const current = getTrackingClient().client_id;
  if (current === normalized) return;
  upsertTracking({ client_id: normalized });
}

export function getMetrikaVisitParams(tracking: TrackingData) {
  return compactRecord({
    src: tracking.src,
    cmp: tracking.cmp,
    cr: tracking.cr,
    click_id: tracking.click_id,
    yclid: tracking.yclid,
    utm_source: tracking.utm_source,
    utm_medium: tracking.utm_medium,
    utm_campaign: tracking.utm_campaign,
    utm_content: tracking.utm_content,
    utm_term: tracking.utm_term,
    decision_in: tracking.decision_in,
    score_in_bucket: tracking.score_in_bucket,
  });
}

export function trackMatomoEvent(action: string, name?: string) {
  if (typeof window === "undefined" || !window._paq) return;
  window._paq.push(["trackEvent", "MADCORE_GENA", action, name ?? window.location.pathname]);
}

export function trackMetrikaGoal(goalId: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.ym || !METRIKA_COUNTER_ID) return;
  if (!METRIKA_GOAL_NAMES.has(goalId)) return;
  window.ym(Number(METRIKA_COUNTER_ID), "reachGoal", goalId, params);
}

export function trackExternalAnalyticsGoal(goalId: string, params: Record<string, unknown> = {}) {
  trackMatomoEvent(goalId, window.location.pathname);
  trackMetrikaGoal(goalId, params);
}

export async function sendEvent(eventName: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const tracking = getTrackingClient();
  const body = {
    event_name: eventName,
    page: window.location.pathname,
    payload,
    tracking,
    session_id: window.localStorage.getItem("madcore_gena_session_id") ?? undefined,
  };

  try {
    await fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
      cache: "no-store",
    });
  } catch {
    // fire-and-forget
  }

  if (eventName !== "page_view") {
    trackExternalAnalyticsGoal(eventName, payload);
  }
}

export function setSessionIdIfNeeded() {
  if (typeof window === "undefined") return;

  const key = "madcore_gena_session_id";
  const exists = window.localStorage.getItem(key);
  if (exists) return;

  const sessionId = `mcg_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(key, sessionId);
}
