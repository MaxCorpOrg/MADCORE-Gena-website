import type { LeadMessageData } from "@/lib/lead-message";
import { sendLeadToTelegram } from "@/lib/telegram";

export type LeadNotifyResult = {
  ok: boolean;
  skipped: boolean;
  channel: "telegram";
  reason?: string;
};

export async function sendLeadNotification(payload: LeadMessageData): Promise<LeadNotifyResult> {
  return sendLeadToTelegram(payload);
}
