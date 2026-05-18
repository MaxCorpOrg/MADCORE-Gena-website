import { NextResponse } from "next/server";
import { isPrismaEnabled } from "@/lib/prisma";

export function GET() {
  return NextResponse.json({
    ok: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    prisma_enabled: isPrismaEnabled,
  });
}
