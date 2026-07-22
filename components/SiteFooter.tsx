import Link from "next/link";
import { site } from "@/lib/site";
import Logo from "./Logo";

export default function SiteFooter() {
  const year = 2026;
  return (
    <footer id="contact" className="border-t border-white/10 bg-surface/40 backdrop-blur-xl py-12">
      <div className="mx-auto max-w-4xl px-4 flex flex-col items-center text-center gap-8">
        {/* اللوجو الرسمي في المنتصف */}
        <div className="flex flex-col items-center gap-2">
          <Logo />
          <p className="text-xs text-muted max-w-md font-medium leading-relaxed mt-1">
            {site.tagline}
          </p>
        </div>

        {/* روابط المتجر الرئيسية */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-muted">
          <Link
            href="/#products"
            className="rounded-xl border border-line bg-surface/60 px-4 py-2 transition-all hover:border-brand-500/40 hover:text-fg"
          >
            الاشتراكات والباقات
          </Link>
          <Link
            href="/track"
            className="rounded-xl border border-line bg-surface/60 px-4 py-2 transition-all hover:border-brand-500/40 hover:text-fg"
          >
            تتبّع طلبك
          </Link>
          <Link
            href="/policy"
            className="rounded-xl border border-line bg-surface/60 px-4 py-2 transition-all hover:border-brand-500/40 hover:text-fg"
          >
            السياسة والضمان
          </Link>
        </div>

        {/* خط فاصل ناعم والحقوق وطرق الدفع */}
        <div className="w-full border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted font-medium">
          <p>© {year} <strong className="text-fg">{site.name}</strong> {site.nameSuffix}. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-2 rounded-full border border-line bg-bg px-3.5 py-1 text-fg/80 font-bold">
            <span>فودافون كاش & Instapay 💳</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
