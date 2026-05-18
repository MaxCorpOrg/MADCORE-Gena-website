import { NextRequest, NextResponse } from "next/server";
import { getIp, getUserAgent } from "@/lib/request";
import { createEventRecord } from "@/lib/store";
import { canAcceptEventFromIp } from "@/lib/antifraud";
import { eventSchema } from "@/lib/validation";
import { fromCookie, mergeTracking } from "@/lib/tracking";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const maxBytes = Number(process.env.MAX_EVENT_BODY_BYTES ?? 8192);

  if (Buffer.byteLength(rawBody, "utf8") > maxBytes) {
    return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
  }

  let body: unknown;

  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const ip = getIp(request);
  const userAgent = getUserAgent(request);
  const canAccept = await canAcceptEventFromIp(ip);

  if (!canAccept) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const cookieTracking = fromCookie(request.cookies.get("madcore_gena_tracking")?.value);
  const tracking = mergeTracking(cookieTracking, parsed.data.tracking || {});

  await createEventRecord({
    sessionId: parsed.data.session_id,
    leadId: parsed.data.lead_id,
    eventName: parsed.data.event_name,
    eventValue: parsed.data.event_value,
    pageUrl: parsed.data.page,
    payload: parsed.data.payload,
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
    clientId: tracking.client_id,
    ip,
    userAgent,
  });

  return NextResponse.json({ ok: true });
}

export const runtime = "nodejs";
