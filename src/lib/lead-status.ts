import { LeadStatus } from "@prisma/client";

export const LEAD_STATUS_VALUES = [
  "new",
  "in_progress",
  "qualified",
  "bad",
  "duplicate",
  "sale",
] as const;

export type LeadStatusValue = (typeof LEAD_STATUS_VALUES)[number];

const prismaToPublicMap: Record<LeadStatus, LeadStatusValue> = {
  NEW: "new",
  IN_PROGRESS: "in_progress",
  QUALIFIED: "qualified",
  BAD: "bad",
  DUPLICATE: "duplicate",
  SALE: "sale",
};

const publicToPrismaMap: Record<LeadStatusValue, LeadStatus> = {
  new: LeadStatus.NEW,
  in_progress: LeadStatus.IN_PROGRESS,
  qualified: LeadStatus.QUALIFIED,
  bad: LeadStatus.BAD,
  duplicate: LeadStatus.DUPLICATE,
  sale: LeadStatus.SALE,
};

export function toPublicLeadStatus(status: LeadStatus): LeadStatusValue {
  return prismaToPublicMap[status];
}

export function toPrismaLeadStatus(status: LeadStatusValue): LeadStatus {
  return publicToPrismaMap[status];
}

export function getLeadStatusLabel(status: LeadStatusValue) {
  switch (status) {
    case "new":
      return "Новый";
    case "in_progress":
      return "В работе";
    case "qualified":
      return "Качественный лид";
    case "bad":
      return "Плохой лид";
    case "duplicate":
      return "Дубль";
    case "sale":
      return "Продажа";
  }
}
