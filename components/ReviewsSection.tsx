"use client";

import { useState } from "react";
import SocialCards, { type CardItem } from "@/components/ui/card-fan-carousel";

const REAL_REVIEW_IMAGES: CardItem[] = [
  { imgUrl: "/reviews/review1.jpg", alt: "إثبات تحويل فودافون كاش وتفعيل اشتراك نتفليكس 3 شهور" },
  { imgUrl: "/reviews/review2.jpg", alt: "إثبات تحويل إنستاباي 300 جنيه وتفعيل اشتراك TOD" },
  { imgUrl: "/reviews/review3.jpg", alt: "إثبات تحويل إنستاباي 400 جنيه وتأكيد التفعيل" },
  { imgUrl: "/reviews/review4.jpg", alt: "إثبات تحويل 55 جنيه وتأكيد اشتراك نتفليكس شهر" },
  { imgUrl: "/reviews/review5.jpg", alt: "إثبات تحويل 120 جنيه وتفعيل اشتراك نتفليكس 3 شهور" },
];

export default function ReviewsSection() {
  const [activeModalImg, setActiveModalImg] = useState<string | null>(null);

  return (
    <section className="relative overflow-hidden py-16 px-4 border-t border-white/10 bg-gradient-to-b from-bg via-surface/40 to-bg">
      {/* خلفية ضوئية دافئة */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[600px] rounded-full bg-gradient-to-r from-emerald-500/10 via-brand-600/10 to-amber-500/10 blur-[130px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* الهيدر العلوي */}
        <div className="flex flex-col items-center text-center mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-black text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            إثباتات وتحويلات حقيقية 100% 📸
          </span>

          <h2 className="mt-3 text-3xl font-black text-fg sm:text-5xl tracking-tight">
            آراء وتأكيدات تفعيل المشتركين
          </h2>
          <p className="mt-2.5 max-w-xl text-sm sm:text-base text-muted font-medium leading-relaxed">
            لقطات شاشة حقيقية لإثباتات التحويل والتفعيل الفوري على الواتساب مع عملائنا.
          </p>
        </div>

        {/* المروحة التفاعلية ثلاثية الأبعاد Card Fan Carousel */}
        <div className="w-full relative">
          <SocialCards cards={REAL_REVIEW_IMAGES} />
        </div>

        {/* معرض مصغر إضافي لعرض صور الإثباتات بوضوح */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {REAL_REVIEW_IMAGES.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveModalImg(img.imgUrl || null)}
              className="group relative h-24 w-16 sm:h-32 sm:w-20 overflow-hidden rounded-xl border border-white/20 bg-surface/80 shadow-lg transition-all duration-300 hover:scale-110 hover:border-emerald-400 hover:shadow-emerald-500/20"
            >
              <img
                src={img.imgUrl}
                alt={img.alt || `إثبات تحويل ${idx + 1}`}
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs">
                🔍
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* نافذة تكبير الصورة (Modal Viewer) عند الضغط */}
      {activeModalImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          onClick={() => setActiveModalImg(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-md overflow-hidden rounded-3xl border border-white/20 bg-surface p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModalImg(null)}
              className="absolute top-4 left-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/70 font-bold text-white transition-all hover:bg-red-600"
            >
              ✕
            </button>
            <img
              src={activeModalImg}
              alt="معاينة إثبات التحويل"
              className="max-h-[82vh] w-auto rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
