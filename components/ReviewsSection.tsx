"use client";

import { type Review } from "@/lib/reviews";
import SocialCards, { type CardItem } from "@/components/ui/card-fan-carousel";

type Props = {
  reviews: Review[];
};

export default function ReviewsSection({ reviews }: Props) {
  if (!reviews || reviews.length === 0) return null;

  const cardItems: CardItem[] = reviews.map((r) => ({
    name: r.name,
    comment: r.comment,
    rating: r.rating || 5,
    badge: r.badge || undefined,
    date: r.createdAt,
  }));

  return (
    <section className="relative overflow-hidden py-16 px-4 border-t border-white/10 bg-gradient-to-b from-bg via-surface/40 to-bg">
      {/* خلفية ضوئية دافئة */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[600px] rounded-full bg-gradient-to-r from-amber-500/10 via-brand-600/10 to-red-500/10 blur-[130px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* الهيدر العلوي */}
        <div className="flex flex-col items-center text-center mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-black text-amber-300">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            تقييمات حقيقية من عملائنا 🍿
          </span>

          <h2 className="mt-3 text-3xl font-black text-fg sm:text-5xl tracking-tight">
            تجارب وآراء المشتركين
          </h2>
          <p className="mt-2.5 max-w-xl text-sm sm:text-base text-muted font-medium leading-relaxed">
            استعرض تقييمات وتجارب المشتركين الحقيقية بعد التفعيل الفوري على الواتساب.
          </p>
        </div>

        {/* المروحة التفاعلية ثلاثية الأبعاد Card Fan Carousel */}
        <div className="w-full relative">
          <SocialCards cards={cardItems} />
        </div>
      </div>
    </section>
  );
}
