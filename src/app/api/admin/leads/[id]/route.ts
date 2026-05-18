import { LeadStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recalculateLeadScoreOut } from "@/lib/lead-quality";
import { toPrismaLeadStatus } from "@/lib/lead-status";
import { adminLeadUpdateSchema } from "@/lib/validation";

function parseSaleAmount(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const digits = Number(trimmed.replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(digits) || digits < 0) {
    throw new Error("invalid_sale_amount");
  }

  return Math.round(digits);
}

function getRedirectTarget(request: NextRequest) {
  const referrer = request.headers.get("referer");
  if (!referrer) return new URL("/admin/leads", request.url);

  try {
    return new URL(referrer);
  } catch {
    return new URL("/admin/leads", request.url);
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!prisma) {
    return NextResponse.json({ ok: false, error: "prisma_disabled" }, { status: 503 });
  }

  const formData = await request.formData();
  const parsed = adminLeadUpdateSchema.safeParse({
    lead_id: String(formData.get("lead_id") ?? ""),
    lead_status: String(formData.get("lead_status") ?? ""),
    manager_comment: String(formData.get("manager_comment") ?? ""),
    sale_amount: String(formData.get("sale_amount") ?? ""),
  });

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const { id } = await context.params;
  if (parsed.data.lead_id !== id) {
    return NextResponse.json({ ok: false, error: "lead_id_mismatch" }, { status: 400 });
  }

  let saleAmount: number | null;
  try {
    saleAmount = parseSaleAmount(parsed.data.sale_amount || "");
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_sale_amount" }, { status: 400 });
  }

  const leadId = BigInt(id);
  const leadStatus = toPrismaLeadStatus(parsed.data.lead_status);

  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      leadStatus,
      managerComment: parsed.data.manager_comment || null,
      saleAmount,
    },
    select: {
      id: true,
      clickId: true,
      clientId: true,
      yclid: true,
      src: true,
      cmp: true,
      cr: true,
      utmSource: true,
      utmMedium: true,
      utmCampaign: true,
      utmContent: true,
      utmTerm: true,
      ip: true,
      userAgent: true,
      leadStatus: true,
      saleAmount: true,
    },
  });

  await prisma.event.create({
    data: {
      leadId: lead.id,
      eventName: "manager_status",
      eventValue: parsed.data.lead_status,
      pageUrl: "/admin/leads",
      payload: {
        manager_comment: parsed.data.manager_comment || null,
        sale_amount: saleAmount,
      },
      src: lead.src,
      cmp: lead.cmp,
      cr: lead.cr,
      clickId: lead.clickId,
      utmSource: lead.utmSource,
      utmMedium: lead.utmMedium,
      utmCampaign: lead.utmCampaign,
      utmContent: lead.utmContent,
      utmTerm: lead.utmTerm,
      clientId: lead.clientId,
      yclid: lead.yclid,
      ip: lead.ip,
      userAgent: lead.userAgent,
    },
  });

  if (leadStatus === LeadStatus.QUALIFIED) {
    await prisma.event.create({
      data: {
        leadId: lead.id,
        eventName: "qualified_lead",
        eventValue: "qualified",
        pageUrl: "/admin/leads",
        src: lead.src,
        cmp: lead.cmp,
        cr: lead.cr,
        clickId: lead.clickId,
        utmSource: lead.utmSource,
        utmMedium: lead.utmMedium,
        utmCampaign: lead.utmCampaign,
        utmContent: lead.utmContent,
        utmTerm: lead.utmTerm,
        clientId: lead.clientId,
        yclid: lead.yclid,
        ip: lead.ip,
        userAgent: lead.userAgent,
      },
    });
  }

  if (leadStatus === LeadStatus.BAD) {
    await prisma.event.create({
      data: {
        leadId: lead.id,
        eventName: "bad_lead",
        eventValue: "bad",
        pageUrl: "/admin/leads",
        src: lead.src,
        cmp: lead.cmp,
        cr: lead.cr,
        clickId: lead.clickId,
        utmSource: lead.utmSource,
        utmMedium: lead.utmMedium,
        utmCampaign: lead.utmCampaign,
        utmContent: lead.utmContent,
        utmTerm: lead.utmTerm,
        clientId: lead.clientId,
        yclid: lead.yclid,
        ip: lead.ip,
        userAgent: lead.userAgent,
      },
    });
  }

  if ((saleAmount ?? 0) > 0 || leadStatus === LeadStatus.SALE) {
    await prisma.event.create({
      data: {
        leadId: lead.id,
        eventName: "sale",
        eventValue: String(saleAmount ?? 0),
        pageUrl: "/admin/leads",
        payload: { sale_amount: saleAmount ?? 0 },
        src: lead.src,
        cmp: lead.cmp,
        cr: lead.cr,
        clickId: lead.clickId,
        utmSource: lead.utmSource,
        utmMedium: lead.utmMedium,
        utmCampaign: lead.utmCampaign,
        utmContent: lead.utmContent,
        utmTerm: lead.utmTerm,
        clientId: lead.clientId,
        yclid: lead.yclid,
        ip: lead.ip,
        userAgent: lead.userAgent,
      },
    });
  }

  await recalculateLeadScoreOut(lead.id);

  return NextResponse.redirect(getRedirectTarget(request), { status: 303 });
}
