import { NextRequest, NextResponse } from "next/server";
import { getSiteRuntimeConfig } from "@/config/site";
import { getIp, getReferrer, getUserAgent } from "@/lib/request";
import { countClicksByClickIdSince, countClicksByIpSince, createClickRecord, createEventRecord } from "@/lib/store";
import { assessIncomingTraffic } from "@/lib/traffic-gate";
import { fromCookie, fromSearchParams, mergeTracking, toCookieValue } from "@/lib/tracking";

function getScoreInBucket(scoreIn: number) {
  if (scoreIn >= 80) return "80_100";
  if (scoreIn >= 50) return "50_79";
  if (scoreIn >= 20) return "20_49";
  return "0_19";
}

export async function GET(request: NextRequest) {
  const ip = getIp(request);
  const userAgent = getUserAgent(request);
  const referrer = getReferrer(request);

  const incoming = fromSearchParams(request.nextUrl.searchParams);
  const cookieTracking = fromCookie(request.cookies.get("madcore_gena_tracking")?.value);
  const tracking = mergeTracking(cookieTracking, incoming);

  const maxClicksPerMinute = Number(process.env.RATE_LIMIT_MAX_CLICKS_PER_MINUTE ?? 15);
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const clickIdWindowStart = new Date(Date.now() - 30 * 60 * 1000);
  const [recentClicksFromIp, repeatedClickIds] = await Promise.all([
    countClicksByIpSince(ip, oneMinuteAgo),
    tracking.click_id ? countClicksByClickIdSince(tracking.click_id, clickIdWindowStart) : Promise.resolve(0),
  ]);

  const assessment = assessIncomingTraffic({
    ip,
    userAgent,
    referrer,
    tracking,
    recentClicksFromIp,
    repeatedClickIds,
    maxClicksPerMinute,
  });

  const { publicBaseUrl } = getSiteRuntimeConfig();
  const publicOrigin = new URL(publicBaseUrl);
  const trackingForClient = {
    ...tracking,
    decision_in: assessment.decisionIn,
    score_in_bucket: getScoreInBucket(assessment.scoreIn),
  };
  const target =
    assessment.decisionIn === "suspicious" || assessment.decisionIn === "blocked"
      ? new URL(process.env.GO_SUSPICIOUS_REDIRECT || "/safe", publicOrigin)
      : new URL("/", publicOrigin);

  if (assessment.decisionIn === "good" || assessment.decisionIn === "watch") {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(trackingForClient)) {
      if (!value) continue;
      params.set(key, value);
    }
    const query = params.toString();
    if (query) target.search = query;
  }

  await createClickRecord({
    ip,
    userAgent,
    referrer,
    yclid: tracking.yclid,
    src: tracking.src,
    cmp: tracking.cmp,
    cr: tracking.cr,
    clickId: tracking.click_id,
    utmSource: tracking.utm_source,
    utmMedium: tracking.utm_medium,
    utmCampaign: tracking.utm_campaign,
    utmContent: tracking.utm_content,
    utmTerm: tracking.utm_term,
    deviceType: assessment.deviceType,
    region: assessment.region,
    city: assessment.city,
    scoreIn: assessment.scoreIn,
    decisionIn:
      assessment.decisionIn === "good"
        ? "GOOD"
        : assessment.decisionIn === "watch"
          ? "WATCH"
          : assessment.decisionIn === "suspicious"
            ? "SUSPICIOUS"
            : "BLOCKED",
    targetUrl: target.toString(),
    isSuspicious: assessment.decisionIn === "suspicious" || assessment.decisionIn === "blocked",
    suspiciousReason: assessment.reasons.join(",") || null,
  });

  await createEventRecord({
    eventName: "traffic_gate",
    eventValue: assessment.decisionIn,
    pageUrl: "/go",
    payload: {
      score_in: assessment.scoreIn,
      decision_in: assessment.decisionIn,
      reasons: assessment.reasons,
      target_url: target.toString(),
      device_type: assessment.deviceType,
      region: assessment.region ?? null,
      city: assessment.city ?? null,
    },
    src: tracking.src,
    cmp: tracking.cmp,
    cr: tracking.cr,
    clickId: tracking.click_id,
    utmSource: tracking.utm_source,
    utmMedium: tracking.utm_medium,
    utmCampaign: tracking.utm_campaign,
    utmContent: tracking.utm_content,
    utmTerm: tracking.utm_term,
    yclid: tracking.yclid,
    ip,
    userAgent,
  });

  const response = NextResponse.redirect(target, { status: 302 });
  response.cookies.set("madcore_gena_tracking", toCookieValue(trackingForClient), {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
