import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import fs from "fs";
import path from "path";

function getDatabaseUrl(): string {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    try {
      const tmpDbPath = path.join("/tmp", "dev.db");
      const rootDbPath = path.join(process.cwd(), "dev.db");

      // نسخ ملف قاعدة البيانات إلى المجلد المؤقت الشغال على الفيرسل /tmp
      if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(rootDbPath)) {
          fs.copyFileSync(rootDbPath, tmpDbPath);
        }
      }
      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (err) {
      console.error("فشل إعداد قاعدة البيانات على الفيرسل:", err);
    }
  }

  return process.env.DATABASE_URL ?? "file:./dev.db";
}

function makeClient() {
  const dbUrl = getDatabaseUrl();
  const adapter = new PrismaBetterSqlite3({
    url: dbUrl,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// Singleton لمنع تكرار الاتصالات في وضع التعديل الفوري
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof makeClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
