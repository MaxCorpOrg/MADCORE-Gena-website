import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prismaEnabled = Boolean(process.env.DATABASE_URL) && process.env.MADCORE_STORAGE_MODE !== "file";

export const prisma =
  prismaEnabled
    ? globalForPrisma.prisma ??
      new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      })
    : null;

if (prismaEnabled && prisma && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const isPrismaEnabled = prismaEnabled;
