import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

function getDatabaseUrl(): string {
  if (process.env.VERCEL || (process.env.NODE_ENV === "production" && process.platform !== "win32")) {
    try {
      const tmpDir = "/tmp";
      const tmpDbPath = path.join(tmpDir, "dev.db");
      const rootDbPath = path.join(process.cwd(), "dev.db");

      if (fs.existsSync(rootDbPath)) {
        if (!fs.existsSync(tmpDir)) {
          fs.mkdirSync(tmpDir, { recursive: true });
        }
        let shouldCopy = !fs.existsSync(tmpDbPath);

        if (!shouldCopy) {
          try {
            const rootStat = fs.statSync(rootDbPath);
            const tmpStat = fs.statSync(tmpDbPath);
            if (rootStat.size !== tmpStat.size || rootStat.mtime > tmpStat.mtime) {
              shouldCopy = true;
            }
          } catch {
            shouldCopy = true;
          }
        }

        if (shouldCopy) {
          fs.copyFileSync(rootDbPath, tmpDbPath);
        }
      }

      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (err) {
      console.error("فشل نسخ قاعدة البيانات لـ /tmp على الفيرسل:", err);
    }
  }

  return process.env.DATABASE_URL ?? "file:./dev.db";
}

function makeClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN;

  if (tursoUrl && (tursoUrl.startsWith("libsql://") || tursoUrl.startsWith("https://"))) {
    const libsql = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  }

  const dbUrl = getDatabaseUrl();
  const adapter = new PrismaBetterSqlite3({ url: dbUrl });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// Singleton لمنع تكرار الاتصالات
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof makeClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
