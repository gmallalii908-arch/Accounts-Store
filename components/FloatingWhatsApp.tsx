import { site } from "@/lib/site";

export default function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
      <a
        href={`https://wa.me/${site.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا على الواتساب"
        className="group relative flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-600/90 px-3.5 py-2.5 text-white shadow-xl shadow-emerald-600/40 backdrop-blur-xl transition-all duration-300 hover:bg-emerald-500 hover:scale-105"
      >
        {/* حلقة وهج نبضي دائرية */}
        <span className="absolute -inset-0.5 rounded-full bg-emerald-500/40 blur animate-ping pointer-events-none opacity-60" />

        {/* أيقونة الواتساب والنص المصغر الأنيق */}
        <span className="relative text-base">💬</span>
        <span className="relative text-[11px] font-black tracking-tight hidden sm:inline-block">
          تواصل مع الدعم
        </span>
      </a>
    </div>
  );
}
