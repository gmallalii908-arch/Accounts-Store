import Link from "next/link";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg border-b border-white/10">
      {/* توهّج خلفي عالي الجودة متناسب مع أسلوب النيون */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-red-600/20 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:28px_28px]"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight text-fg sm:text-6xl tracking-tight">
          أقوى اشتراكات <span className="text-gradient">الأفلام والمسلسلات</span> في مصر
        </h1>

        {/* الأزرار الرئيسية بالتصميم العصري الأنيق */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Link
            href="/#products"
            className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-red-600 via-brand-600 to-purple-600 px-8 py-4 text-center font-black text-white shadow-xl shadow-red-600/30 transition-all duration-300 hover:scale-105 hover:shadow-red-600/50"
          >
            اختر باقتك الآن 🍿
          </Link>
          <div className="w-full sm:w-auto rounded-2xl border border-white/10 bg-surface/60 backdrop-blur-xl px-6 py-4 text-center text-xs font-bold text-fg shadow-lg">
            <span>🛡️ خدمة أكثر من +500 عميل في مصر 🇪🇬</span>
          </div>
        </div>

        {/* كروت المميزات الموحدة بالتصميم العالي الجودة */}
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
          <FeatureCard
            icon="⚡"
            title="تسليم خلال 10 دقائق ⚡"
            desc="بيانات الحساب ورقم الـ PIN تصلك فوراً عبر الواتساب بعد تأكيد الطلب."
          />
          <FeatureCard
            icon="🛡️"
            title="ضمان ذهبي 100% 🛡️"
            desc="ضمان شامل طوال فترة الاشتراك مع استبدال فوري وحل سريع لأي استفسار."
          />
          <FeatureCard
            icon="💳"
            title="دفع فوري وآمن 📱"
            desc="دفع بسيط وسريع عبر فودافون كاش، إنستاباي Instapay، أو المحافظ الإلكترونية."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="group relative flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-surface/70 backdrop-blur-2xl p-6 text-center transition-all duration-300 hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1.5">
      {/* خط إضاءة علوي عند التحويم */}
      <div className="pointer-events-none absolute -top-px right-8 left-8 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-surface text-xl shadow-inner transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-sm font-black text-fg">{title}</h3>
      <p className="mt-2 text-xs text-muted leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
