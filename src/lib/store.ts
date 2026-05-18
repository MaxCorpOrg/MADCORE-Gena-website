import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { LeadStatus, Prisma, TrafficDecision } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type LeadInput = {
  name: string;
  phone: string;
  city: string;
  contactMethod: string;
  comment: string | null;
  productInterest?: string | null;
  clientId?: string;
  yclid?: string;
  leadStatus?: LeadStatus;
  managerComment?: string | null;
  scoreOut?: number;
  saleAmount?: number | null;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  src?: string;
  cmp?: string;
  cr?: string;
  clickId?: string;
  ip?: string;
  userAgent?: string;
};

type ClickInput = {
  ip?: string;
  userAgent?: string;
  referrer?: string;
  yclid?: string;
  src?: string;
  cmp?: string;
  cr?: string;
  clickId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  deviceType?: string;
  region?: string;
  city?: string;
  scoreIn: number;
  decisionIn?: TrafficDecision | null;
  targetUrl?: string;
  isSuspicious: boolean;
  suspiciousReason?: string | null;
};

type EventInput = {
  sessionId?: string;
  leadId?: bigint | number | string;
  eventName: string;
  eventValue?: string;
  pageUrl?: string;
  payload?: unknown;
  src?: string;
  cmp?: string;
  cr?: string;
  clickId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  yclid?: string;
  clientId?: string;
  ip?: string;
  userAgent?: string;
};

type DevStore = {
  seq: {
    leads: number;
    clicks: number;
    events: number;
  };
  leads: Array<LeadInput & { id: number; createdAt: string }>;
  clicks: Array<ClickInput & { id: number; createdAt: string }>;
  events: Array<EventInput & { id: number; createdAt: string }>;
};

const STORE_PATH = join(process.cwd(), ".data", "madcore-gena-dev-store.json");
const fileStoreEnabled = process.env.MADCORE_STORAGE_MODE === "file" || !process.env.DATABASE_URL;

function emptyStore(): DevStore {
  return {
    seq: { leads: 0, clicks: 0, events: 0 },
    leads: [],
    clicks: [],
    events: [],
  };
}

function ensureStore() {
  const dir = join(process.cwd(), ".data");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  if (!existsSync(STORE_PATH)) {
    writeFileSync(STORE_PATH, JSON.stringify(emptyStore(), null, 2));
  }
}

function readStore(): DevStore {
  ensureStore();

  try {
    return JSON.parse(readFileSync(STORE_PATH, "utf8")) as DevStore;
  } catch {
    const freshStore = emptyStore();
    writeFileSync(STORE_PATH, JSON.stringify(freshStore, null, 2));
    return freshStore;
  }
}

function writeStore(store: DevStore) {
  ensureStore();
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function withStore<T>(mutator: (store: DevStore) => T): T {
  const store = readStore();
  const result = mutator(store);
  writeStore(store);
  return result;
}

function isSameOrAfter(isoDate: string, since: Date) {
  return new Date(isoDate).getTime() >= since.getTime();
}

function toPrismaJson(
  value: unknown,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalized = JSON.parse(
    JSON.stringify(value, (_key, current) => {
      if (typeof current === "bigint") return current.toString();
      if (typeof current === "number" && !Number.isFinite(current)) return null;
      if (current instanceof Date) return current.toISOString();
      if (
        typeof current === "undefined" ||
        typeof current === "function" ||
        typeof current === "symbol"
      ) {
        return null;
      }
      return current;
    }),
  ) as Prisma.InputJsonValue | null;

  return normalized === null ? Prisma.JsonNull : normalized;
}

function normalizeLeadIdInput(value?: bigint | number | string) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  try {
    return BigInt(value);
  } catch {
    return undefined;
  }
}

export function isFileStoreEnabled() {
  return fileStoreEnabled;
}

export async function createLeadRecord(data: LeadInput) {
  if (!fileStoreEnabled && prisma) {
    return prisma.lead.create({ data });
  }

  return withStore((store) => {
    const id = store.seq.leads + 1;
    store.seq.leads = id;
    const record = {
      id,
      createdAt: new Date().toISOString(),
      ...data,
    };
    store.leads.push(record);
    return record;
  });
}

export async function createClickRecord(data: ClickInput) {
  if (!fileStoreEnabled && prisma) {
    return prisma.click.create({ data });
  }

  return withStore((store) => {
    const id = store.seq.clicks + 1;
    store.seq.clicks = id;
    const record = {
      id,
      createdAt: new Date().toISOString(),
      ...data,
    };
    store.clicks.push(record);
    return record;
  });
}

export async function createEventRecord(data: EventInput) {
  if (!fileStoreEnabled && prisma) {
    return prisma.event.create({
      data: {
        sessionId: data.sessionId,
        leadId: normalizeLeadIdInput(data.leadId),
        eventName: data.eventName,
        eventValue: data.eventValue,
        pageUrl: data.pageUrl,
        src: data.src,
        cmp: data.cmp,
        cr: data.cr,
        clickId: data.clickId,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        utmContent: data.utmContent,
        utmTerm: data.utmTerm,
        clientId: data.clientId,
        yclid: data.yclid,
        ip: data.ip,
        userAgent: data.userAgent,
        payload: toPrismaJson(data.payload),
      },
    });
  }

  return withStore((store) => {
    const id = store.seq.events + 1;
    store.seq.events = id;
    const record = {
      id,
      createdAt: new Date().toISOString(),
      ...data,
      leadId: normalizeLeadIdInput(data.leadId)?.toString(),
    };
    store.events.push(record);
    return record;
  });
}

export async function countClicksByIpSince(ip: string, since: Date) {
  if (!fileStoreEnabled && prisma) {
    return prisma.click.count({ where: { ip, createdAt: { gte: since } } });
  }

  const store = readStore();
  return store.clicks.filter((item) => item.ip === ip && isSameOrAfter(item.createdAt, since)).length;
}

export async function countClicksByClickIdSince(clickId: string, since: Date) {
  if (!fileStoreEnabled && prisma) {
    return prisma.click.count({ where: { clickId, createdAt: { gte: since } } });
  }

  const store = readStore();
  return store.clicks.filter((item) => item.clickId === clickId && isSameOrAfter(item.createdAt, since)).length;
}

export async function countLeadsByIpSince(ip: string, since: Date) {
  if (!fileStoreEnabled && prisma) {
    return prisma.lead.count({ where: { ip, createdAt: { gte: since } } });
  }

  const store = readStore();
  return store.leads.filter((item) => item.ip === ip && isSameOrAfter(item.createdAt, since)).length;
}

export async function countLeadsByPhoneSince(phone: string, since: Date) {
  if (!fileStoreEnabled && prisma) {
    return prisma.lead.count({ where: { phone, createdAt: { gte: since } } });
  }

  const store = readStore();
  return store.leads.filter((item) => item.phone === phone && isSameOrAfter(item.createdAt, since)).length;
}

export async function countEventsByIpSince(ip: string, since: Date) {
  if (!fileStoreEnabled && prisma) {
    return prisma.event.count({ where: { ip, createdAt: { gte: since } } });
  }

  const store = readStore();
  return store.events.filter((item) => item.ip === ip && isSameOrAfter(item.createdAt, since)).length;
}
