import Link from "next/link";
import { site } from "@/lib/site";

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden py-16 px-4 bg-bg border-t border-white/10">
      {/* توهج ضوئي جذاب */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full bg-gradient-to-r from-red-600/20 via-purple-600/20 to-indigo-600/20 blur-[130px]" />

      <div className="relative mx-auto max-w-5xl">
        <div className="group relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-surface/90 via-surface/70 to-surface/90 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-2xl">
          {/* خط إضاءة علوي ساطع عند التحويم */}
          <div className="pointer-events-none absolute -top-px right-12 left-12 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

          {/* شارة علوية مضيئة */}
          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-black text-red-300">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            تفعيل فوري وضمان كامل 100% 🛡️
          </span>

          <h2 className="mt-4 text-3xl font-black text-fg sm:text-5xl tracking-tight leading-tight">
            جاهز لبدء المشاهدة بأعلى جودة <span className="text-gradient">4K Ultra HD</span>؟
          </h2>

          <p className="mt-3.5 mx-auto max-w-2xl text-xs sm:text-sm text-muted font-medium leading-relaxed">
            اختر باقتك المفضلة الآن واستلم بيانات البروفايل الخاص بك ورقم الـ PIN في خلال 10 دقائق فقط عبر الواتساب.
          </p>

          {/* الأزرار التفاعلية */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/#products"
              className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-red-600 via-brand-600 to-purple-600 px-8 py-4 text-center font-black text-white shadow-xl shadow-red-600/30 transition-all duration-300 hover:scale-105 hover:shadow-red-600/50"
            >
              🚀 اختر باقتك واطلب الآن
            </Link>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-7 py-4 text-center text-xs font-black text-emerald-300 shadow-lg transition-all duration-300 hover:bg-emerald-500/20 hover:scale-105"
            >
              💬 تواصل مباشرة مع الدعم الفني
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
