import {
  countClicksByClickIdSince,
  countClicksByIpSince,
  countEventsByIpSince,
  countLeadsByIpSince,
} from "@/lib/store";

const BAD_UA_PATTERN = /(bot|crawler|spider|headless|curl|wget|python|scrapy|node-fetch|axios)/i;

function shortUserAgent(userAgent: string): boolean {
  return userAgent.trim().length < 12;
}

export async function detectSuspiciousClick(params: {
  ip: string;
  userAgent: string;
  clickId?: string;
}) {
  const reasons: string[] = [];

  if (!params.userAgent || params.userAgent === "unknown") {
    reasons.push("empty_user_agent");
  }

  if (BAD_UA_PATTERN.test(params.userAgent)) {
    reasons.push("bad_user_agent_pattern");
  }

  if (shortUserAgent(params.userAgent)) {
    reasons.push("short_user_agent");
  }

  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const recentClicks = await countClicksByIpSince(params.ip, oneMinuteAgo);

  const maxClicks = Number(process.env.RATE_LIMIT_MAX_CLICKS_PER_MINUTE ?? 15);
  if (recentClicks >= maxClicks) {
    reasons.push("too_many_clicks_from_ip");
  }

  if (params.clickId) {
    const repeatedClickIds = await countClicksByClickIdSince(
      params.clickId,
      new Date(Date.now() - 30 * 60 * 1000)
    );

    if (repeatedClickIds >= 3) {
      reasons.push("repeated_click_id");
    }
  }

  return {
    isSuspicious: reasons.length > 0,
    reason: reasons.join(",") || null,
  };
}

export async function canAcceptLeadFromIp(ip: string) {
  const windowStart = new Date(Date.now() - 15 * 60 * 1000);
  const count = await countLeadsByIpSince(ip, windowStart);

  const max = Number(process.env.RATE_LIMIT_MAX_LEADS_PER_15_MIN ?? 4);
  return count < max;
}

export async function canAcceptEventFromIp(ip: string) {
  const windowStart = new Date(Date.now() - 60 * 1000);
  const count = await countEventsByIpSince(ip, windowStart);
  const max = Number(process.env.RATE_LIMIT_MAX_EVENTS_PER_MINUTE ?? 90);
  return count < max;
}
