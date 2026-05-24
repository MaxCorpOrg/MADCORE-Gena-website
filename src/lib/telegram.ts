import { buildLeadMessageText, type LeadMessageData } from "@/lib/lead-message";

function getTelegramChatIds() {
  const chatIds = [
    process.env.TELEGRAM_CHAT_ID,
    ...(process.env.TELEGRAM_EXTRA_CHAT_IDS ?? "").split(/[,\s]+/),
  ]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

  return Array.from(new Set(chatIds));
}

export async function sendLeadToTelegram(payload: LeadMessageData) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = getTelegramChatIds();

  if (!token || chatIds.length === 0) {
    return { ok: false, skipped: true, channel: "telegram" as const, reason: "missing_telegram_config" };
  }

  const text = buildLeadMessageText(payload);
  const failed: string[] = [];

  for (const chatId of chatIds) {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("Telegram send failed", response.status, body);
      failed.push(`${chatId}:${response.status}`);
    }
  }

  if (failed.length > 0) {
    return {
      ok: false,
      skipped: false,
      channel: "telegram" as const,
      reason: `telegram_partial_failure:${failed.join(",")}`,
    };
  }

  return { ok: true, skipped: false, channel: "telegram" as const };
}
