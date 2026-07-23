import Link from "next/link";
import { site } from "@/lib/site";
import { getCurrentUser } from "@/lib/auth";
import Logo from "./Logo";
import CartButton from "./CartButton";

export default async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4">
        {/* أزرار الحساب والدخول (في اليمين في RTL) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {user ? (
            <Link
              href="/account"
              className="flex items-center gap-1.5 rounded-xl bg-brand-gradient px-3 py-2 text-xs sm:text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition-opacity hover:opacity-95"
            >
              <UserIcon />
              <span className="inline">{user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-brand-gradient px-3 py-2 text-xs sm:text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition-opacity hover:opacity-95 whitespace-nowrap"
            >
              دخول / حساب
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="hidden items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-xs sm:text-sm font-semibold text-fg transition-colors hover:bg-surface-2 md:flex"
            >
              <GridIcon />
              لوحة التحكم
            </Link>
          )}
        </div>

        {/* روابط التنقل في المنتصف (للشاشات المتوسطة والكبيرة) */}
        <nav className="hidden items-center gap-1 text-sm md:flex">
          {site.nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                i === 0
                  ? "rounded-xl border border-line bg-surface px-3 py-2 font-semibold text-fg"
                  : "rounded-xl px-3 py-2 text-muted transition-colors hover:text-fg"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* السلة واللوجو الرسمى (في اليسار في RTL) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <CartButton />
          <Logo />
        </div>
      </div>
    </header>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}
