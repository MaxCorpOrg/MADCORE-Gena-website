import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toJsonSafe } from "@/lib/serialize";

export async function GET() {
  if (!prisma) {
    return NextResponse.json({ ok: false, error: "prisma_disabled" }, { status: 503 });
  }

  const rows = await prisma.trafficSourceQuality.findMany({
    orderBy: [{ qualifiedLeads: "desc" }, { leads: "desc" }, { clicks: "desc" }],
    take: 100,
  });

  return NextResponse.json({
    ok: true,
    generated_at: new Date().toISOString(),
    rows: toJsonSafe(rows),
  });
}
