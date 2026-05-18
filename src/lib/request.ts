import type { NextRequest } from "next/server";

const FALLBACK_IP = "0.0.0.0";

function normalizeIp(candidate: string) {
  if (!candidate) return FALLBACK_IP;
  const trimmed = candidate.trim();
  if (!trimmed) return FALLBACK_IP;

  if (trimmed.startsWith("::ffff:")) {
    return trimmed.slice("::ffff:".length).slice(0, 128);
  }

  return trimmed.slice(0, 128);
}

export function getIp(request: NextRequest): string {
  const xForwardedFor = request.headers.get("x-forwarded-for") ?? "";
  const xRealIp = request.headers.get("x-real-ip") ?? "";

  const candidate = xForwardedFor.split(",")[0]?.trim() || xRealIp.trim();
  return normalizeIp(candidate);
}

export function getUserAgent(request: NextRequest): string {
  return (request.headers.get("user-agent") ?? "unknown").slice(0, 1024);
}

export function getReferrer(request: NextRequest): string {
  return (request.headers.get("referer") ?? "").slice(0, 1024);
}
