import type { TrackingData, TrackingKey } from "@/types/tracking";
import { TRACKING_KEYS } from "@/types/tracking";

function setIfExists(target: TrackingData, key: TrackingKey, raw: string | null) {
  if (!raw) return;
  const value = raw.trim();
  if (!value) return;
  target[key] = value.slice(0, 256);
}

export function fromSearchParams(search: URLSearchParams): TrackingData {
  const tracking: TrackingData = {};
  for (const key of TRACKING_KEYS) {
    setIfExists(tracking, key, search.get(key));
  }
  return tracking;
}

export function fromCookie(rawCookie?: string): TrackingData {
  if (!rawCookie) return {};
  const params = new URLSearchParams(rawCookie);
  return fromSearchParams(params);
}

export function toCookieValue(data: TrackingData): string {
  const params = new URLSearchParams();
  for (const key of TRACKING_KEYS) {
    const value = data[key];
    if (value) params.set(key, value);
  }
  return params.toString();
}

export function mergeTracking(...parts: TrackingData[]): TrackingData {
  const result: TrackingData = {};
  for (const part of parts) {
    for (const key of TRACKING_KEYS) {
      const value = part[key];
      if (!value) continue;
      result[key] = value.slice(0, 256);
    }
  }
  return result;
}
