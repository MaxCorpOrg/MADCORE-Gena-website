import { buildLeadMessageText, type LeadMessageData } from "@/lib/lead-message";

type LeadWhatsAppResult = {
  ok: boolean;
  skipped: boolean;
  channel: "whatsapp";
  reason?: string;
};

function getWhatsAppConfig() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_TO_NUMBER;
  const apiVersion = process.env.WHATSAPP_API_VERSION || "v22.0";

  return { accessToken, phoneNumberId, to, apiVersion };
}

export async function sendLeadToWhatsApp(payload: LeadMessageData): Promise<LeadWhatsAppResult> {
  const { accessToken, phoneNumberId, to, apiVersion } = getWhatsAppConfig();

  if (!accessToken || !phoneNumberId || !to) {
    return { ok: false, skipped: true, channel: "whatsapp", reason: "missing_whatsapp_config" };
  }

  const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: {
        preview_url: false,
        body: buildLeadMessageText(payload),
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error("WhatsApp send failed", response.status, body);
    return { ok: false, skipped: false, channel: "whatsapp", reason: `whatsapp_http_${response.status}` };
  }

  return { ok: true, skipped: false, channel: "whatsapp" };
}
