import { buildLeadMessageText, type LeadMessageData } from "@/lib/lead-message";

export async function sendLeadToTelegram(payload: LeadMessageData) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { ok: false, skipped: true, channel: "telegram" as const, reason: "missing_telegram_config" };
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildLeadMessageText(payload),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error("Telegram send failed", response.status, body);
    return { ok: false, skipped: false, channel: "telegram" as const, reason: `telegram_http_${response.status}` };
  }

  return { ok: true, skipped: false, channel: "telegram" as const };
}
