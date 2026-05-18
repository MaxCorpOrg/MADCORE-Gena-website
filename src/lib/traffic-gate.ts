import { UAParser } from "ua-parser-js";
import { lookupGeoLocation } from "@/lib/geo";
import type { TrackingData } from "@/types/tracking";

export type TrafficDecisionValue = "good" | "watch" | "suspicious" | "blocked";

export type TrafficGateAssessment = {
  scoreIn: number;
  decisionIn: TrafficDecisionValue;
  reasons: string[];
  deviceType: string;
  region?: string;
  city?: string;
};

const BAD_UA_PATTERN = /(bot|crawler|spider|headless|curl|wget|python|scrapy|node-fetch|axios)/i;
const ANOMALOUS_UA_PATTERN = /^(unknown|-)?$/i;

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

function isMobileDevice(deviceType: string) {
  return deviceType === "mobile";
}

function hasExpectedYandexReferrer(referrer: string, tracking: TrackingData) {
  if (!referrer) {
    return tracking.src === "yandex" || tracking.utm_source === "yandex";
  }

  try {
    const url = new URL(referrer);
    return /(^|\.)yandex\./i.test(url.hostname);
  } catch {
    return false;
  }
}

function hasSourceMismatch(tracking: TrackingData) {
  if (!tracking.src && !tracking.utm_source) return false;
  if (!tracking.src || !tracking.utm_source) return false;
  return tracking.src !== tracking.utm_source;
}

function hasEmptyOrAnomalousUserAgent(userAgent: string) {
  const trimmed = userAgent.trim();
  return !trimmed || ANOMALOUS_UA_PATTERN.test(trimmed) || trimmed.length < 12;
}

function getDeviceType(userAgent: string) {
  const parser = new UAParser(userAgent);
  return parser.getDevice().type || "desktop";
}

function getDecision(scoreIn: number): TrafficDecisionValue {
  if (scoreIn >= 80) return "good";
  if (scoreIn >= 50) return "watch";
  if (scoreIn >= 20) return "suspicious";
  return "blocked";
}

export function assessIncomingTraffic(params: {
  ip: string;
  userAgent: string;
  referrer: string;
  tracking: TrackingData;
  recentClicksFromIp: number;
  repeatedClickIds: number;
  maxClicksPerMinute: number;
}) {
  const reasons: string[] = [];
  let score = 50;

  const deviceType = getDeviceType(params.userAgent);
  const location = lookupGeoLocation(params.ip);

  if (params.tracking.yclid) {
    score += 20;
    reasons.push("есть_yclid");
  }

  if (params.tracking.utm_source === "yandex") {
    score += 10;
    reasons.push("utm_source_yandex");
  }

  if (!BAD_UA_PATTERN.test(params.userAgent) && !hasEmptyOrAnomalousUserAgent(params.userAgent)) {
    score += 10;
    reasons.push("нормальный_user_agent");
  }

  if (isMobileDevice(deviceType)) {
    score += 10;
    reasons.push("мобильное_устройство");
  }

  if (hasExpectedYandexReferrer(params.referrer, params.tracking)) {
    score += 10;
    reasons.push("ожидаемый_источник");
  }

  if (params.recentClicksFromIp === 0) {
    score += 10;
    reasons.push("первый_клик_с_ip");
  }

  if (BAD_UA_PATTERN.test(params.userAgent)) {
    score -= 30;
    reasons.push("подозрительный_user_agent");
  }

  if (hasEmptyOrAnomalousUserAgent(params.userAgent)) {
    score -= 25;
    reasons.push("пустой_или_аномальный_user_agent");
  }

  if (params.recentClicksFromIp >= params.maxClicksPerMinute) {
    score -= 20;
    reasons.push("слишком_много_кликов_с_ip");
  }

  if (params.tracking.click_id && params.repeatedClickIds >= 2) {
    score -= 20;
    reasons.push("подозрительный_повтор_click_id");
  }

  const expectsYclid = params.tracking.src === "yandex" || params.tracking.utm_source === "yandex";
  if (expectsYclid && !params.tracking.yclid) {
    score -= 15;
    reasons.push("нет_yclid_при_yandex_источнике");
  }

  if (hasSourceMismatch(params.tracking)) {
    score -= 15;
    reasons.push("расхождение_src_и_utm_source");
  }

  const scoreIn = clampScore(score);
  const decisionIn = getDecision(scoreIn);

  return {
    scoreIn,
    decisionIn,
    reasons,
    deviceType,
    region: location.region,
    city: location.city,
  } satisfies TrafficGateAssessment;
}
