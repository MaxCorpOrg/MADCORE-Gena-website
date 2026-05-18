import { NextRequest, NextResponse } from "next/server";
import { getSiteRuntimeConfig } from "@/config/site";
import { getIp, getUserAgent } from "@/lib/request";
import { canAcceptLeadFromIp } from "@/lib/antifraud";
import { countLeadsByPhoneSince, createEventRecord, createLeadRecord } from "@/lib/store";
import { recalculateLeadScoreOut } from "@/lib/lead-quality";
import { leadSchema } from "@/lib/validation";
import { sendLeadNotification, type LeadNotifyResult } from "@/lib/lead-notify";
import { fromCookie, mergeTracking } from "@/lib/tracking";

function tooFast(startedAt?: string) {
  if (!startedAt) return false;
  const parsed = Number(startedAt);
  if (!Number.isFinite(parsed)) return false;
  const elapsed = (Date.now() - parsed) / 1000;
  const minSeconds = Number(process.env.MIN_FORM_FILL_SECONDS ?? 3);
  return elapsed < minSeconds;
}

function recordLeadNotifyEvent(params: {
  leadId: string;
  result: LeadNotifyResult;
  tracking: ReturnType<typeof mergeTracking>;
  ip: string;
  userAgent: string;
}) {
  return createEventRecord({
    eventName: "lead_notify",
    eventValue: params.result.channel,
    leadId: params.leadId,
    pageUrl: "/",
    payload: {
      lead_id: params.leadId,
      ok: params.result.ok,
      skipped: params.result.skipped,
      channel: params.result.channel,
      reason: params.result.reason ?? null,
    },
    src: params.tracking.src,
    cmp: params.tracking.cmp,
    cr: params.tracking.cr,
    clickId: params.tracking.click_id,
    utmSource: params.tracking.utm_source,
    utmMedium: params.tracking.utm_medium,
    utmCampaign: params.tracking.utm_campaign,
    utmContent: params.tracking.utm_content,
    utmTerm: params.tracking.utm_term,
    yclid: params.tracking.yclid,
    clientId: params.tracking.client_id,
    ip: params.ip,
    userAgent: params.userAgent,
  });
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const invalidPhone = parsed.error.issues.some((issue) => issue.message === "invalid_phone");
    return NextResponse.json(
      { ok: false, error: invalidPhone ? "invalid_phone" : "invalid_payload" },
      { status: 400 },
    );
  }

  const payload = parsed.data;

  const ip = getIp(request);
  const userAgent = getUserAgent(request);

  if ((payload.honeypot ?? "").trim().length > 0) {
    await createEventRecord({
      eventName: "form_submit",
      pageUrl: "/",
      eventValue: "rejected",
      payload: { suspicious: true, reason: "honeypot_filled" },
      ip,
      userAgent,
    });
    return NextResponse.json({ ok: false, error: "spam_detected" }, { status: 400 });
  }

  if (tooFast(payload.started_at)) {
    await createEventRecord({
      eventName: "form_submit",
      pageUrl: "/",
      eventValue: "rejected",
      payload: { suspicious: true, reason: "too_fast" },
      ip,
      userAgent,
    });
    return NextResponse.json({ ok: false, error: "too_fast" }, { status: 429 });
  }

  const canAccept = await canAcceptLeadFromIp(ip);
  if (!canAccept) {
    await createEventRecord({
      eventName: "form_submit",
      pageUrl: "/",
      eventValue: "rejected",
      payload: { suspicious: true, reason: "rate_limited_ip" },
      ip,
      userAgent,
    });
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const repeatedLeadCount = await countLeadsByPhoneSince(
    payload.phone,
    new Date(Date.now() - 30 * 60 * 1000)
  );

  if (repeatedLeadCount >= 2) {
    await createEventRecord({
      eventName: "form_submit",
      pageUrl: "/",
      eventValue: "rejected",
      payload: { suspicious: true, reason: "duplicate_phone_30m" },
      ip,
      userAgent,
    });
    return NextResponse.json({ ok: false, error: "duplicate_lead" }, { status: 429 });
  }

  const cookieTracking = fromCookie(request.cookies.get("madcore_gena_tracking")?.value);
  const tracking = mergeTracking(cookieTracking, payload.tracking || {});
  const { productName } = getSiteRuntimeConfig();

  const lead = await createLeadRecord({
    name: payload.name,
    phone: payload.phone,
    city: payload.city,
    contactMethod: payload.contact_method,
    comment: payload.comment || null,
    productInterest: payload.product_interest || productName,
    clientId: tracking.client_id,
    yclid: tracking.yclid,
    utmSource: tracking.utm_source,
    utmMedium: tracking.utm_medium,
    utmCampaign: tracking.utm_campaign,
    utmContent: tracking.utm_content,
    utmTerm: tracking.utm_term,
    src: tracking.src,
    cmp: tracking.cmp,
    cr: tracking.cr,
    clickId: tracking.click_id,
    ip,
    userAgent,
  });

  await createEventRecord({
    eventName: "form_submit",
    eventValue: "accepted",
    leadId: lead.id,
    pageUrl: "/",
    payload: {
      success: true,
      lead_id: lead.id.toString(),
      contact_method: payload.contact_method,
      max_scroll_percent: payload.max_scroll_percent,
      first_interaction_at: payload.first_interaction_at,
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
    clientId: tracking.client_id,
    ip,
    userAgent,
  });

  await createEventRecord({
    eventName: "lead",
    eventValue: payload.contact_method,
    leadId: lead.id,
    pageUrl: "/",
    payload: {
      contact_method: payload.contact_method,
      max_scroll_percent: payload.max_scroll_percent,
      first_interaction_at: payload.first_interaction_at,
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
    clientId: tracking.client_id,
    ip,
    userAgent,
  });

  void recalculateLeadScoreOut(BigInt(lead.id.toString())).catch((error) => {
    console.error("Lead score recalculation failed", error);
  });

  void sendLeadNotification({
    name: payload.name,
    phone: payload.phone,
    city: payload.city,
    contactMethod: payload.contact_method,
    comment: payload.comment,
    productInterest: payload.product_interest || productName,
    tracking,
    ip,
    userAgent,
  })
    .then(async (result) => {
      console.info("Lead notification result", result);
      await recordLeadNotifyEvent({
        leadId: lead.id.toString(),
        result,
        tracking,
        ip,
        userAgent,
      });
    })
    .catch(async (error) => {
      console.error("Lead notification failed", error);
      await recordLeadNotifyEvent({
        leadId: lead.id.toString(),
        result: { ok: false, skipped: false, channel: "telegram", reason: "exception" },
        tracking,
        ip,
        userAgent,
      }).catch((eventError) => console.error("Lead notify event failed", eventError));
    });

  return NextResponse.json({ ok: true, id: lead.id.toString() });
}

export const runtime = "nodejs";
