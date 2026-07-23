import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 يوم

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || "accounts_store_jwt_secret_2026_super_secure_key_fallback";
  return new TextEncoder().encode(secret);
}

// ===== كلمة السر =====
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ===== الجلسة (JWT داخل httpOnly cookie) =====
async function signSession(userId: string): Promise<string> {
  return new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());
}

export async function createSession(userId: string): Promise<void> {
  const token = await signSession(userId);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
};

/** إنشاء/تأكيد وجود حساب الأدمن افتراضياً */
export async function ensureAdminUser(): Promise<void> {
  try {
    const adminEmail = "admin@accountsstore.eg";
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existing) {
      const passwordHash = await hashPassword("Admin@2026#Store");
      await prisma.user.create({
        data: {
          name: "إدارة متجر الحسابات",
          email: adminEmail,
          phone: "01508997357",
          passwordHash,
          role: "admin",
        },
      });
    }
  } catch (e) {
    console.error("فشل تأكيد حساب الأدمن:", e);
  }
}

/** المستخدم الحالي من الجلسة، أو null لو مش مسجّل دخول */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    await ensureAdminUser();
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, getSecret());
    const uid = payload.uid as string | undefined;
    if (!uid) return null;
    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
  } catch {
    return null;
  }
}

/** يتطلّب أدمن — يحوّل لصفحة الدخول لو مش أدمن */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/");
  return user;
}
