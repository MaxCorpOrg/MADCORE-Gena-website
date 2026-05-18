import { LeadStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type LeadEventSignal = {
  time15Sec: boolean;
  scroll50: boolean;
  productView: boolean;
  offerView: boolean;
  telegramClick: boolean;
  whatsappClick: boolean;
  formSubmit: boolean;
};

function collectLeadEventSignals(eventNames: string[]): LeadEventSignal {
  const set = new Set(eventNames);

  return {
    time15Sec: set.has("time_15_sec"),
    scroll50: set.has("scroll_50"),
    productView: set.has("product_view"),
    offerView: set.has("offer_view"),
    telegramClick: set.has("telegram_click"),
    whatsappClick: set.has("whatsapp_click"),
    formSubmit: set.has("form_submit"),
  };
}

export function calculateLeadScoreOut(params: {
  signals: LeadEventSignal;
  leadStatus: LeadStatus;
  saleAmount?: number | null;
}) {
  if ((params.saleAmount ?? 0) > 0 || params.leadStatus === LeadStatus.SALE) {
    return 100;
  }

  let score = 0;

  if (params.signals.time15Sec) score += 10;
  if (params.signals.scroll50) score += 10;
  if (params.signals.productView || params.signals.offerView) score += 15;
  if (params.signals.telegramClick || params.signals.whatsappClick) score += 20;
  if (params.signals.formSubmit) score += 30;

  if (params.leadStatus === LeadStatus.QUALIFIED) score += 50;
  if (params.leadStatus === LeadStatus.BAD) score -= 50;

  return Math.max(0, Math.min(100, score));
}

export async function recalculateLeadScoreOut(leadId: bigint) {
  if (!prisma) {
    throw new Error("prisma_disabled");
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      id: true,
      clickId: true,
      leadStatus: true,
      saleAmount: true,
      createdAt: true,
    },
  });

  if (!lead) {
    throw new Error("lead_not_found");
  }

  const eventWhere = lead.clickId
    ? {
        OR: [{ leadId }, { clickId: lead.clickId }],
        createdAt: { gte: new Date(lead.createdAt.getTime() - 24 * 60 * 60 * 1000) },
      }
    : {
        leadId,
        createdAt: { gte: new Date(lead.createdAt.getTime() - 24 * 60 * 60 * 1000) },
      };

  const events = await prisma.event.findMany({
    where: eventWhere,
    select: { eventName: true },
  });

  const scoreOut = calculateLeadScoreOut({
    signals: collectLeadEventSignals(events.map((event) => event.eventName)),
    leadStatus: lead.leadStatus,
    saleAmount: lead.saleAmount,
  });

  return prisma.lead.update({
    where: { id: leadId },
    data: { scoreOut },
  });
}
