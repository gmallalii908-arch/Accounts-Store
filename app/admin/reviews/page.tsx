import { getAllReviewsAdmin } from "@/lib/reviews";
import {
  addReviewAction,
  deleteReviewAction,
  toggleReviewAction,
} from "@/app/actions/reviews";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviewsAdmin();

  return (
    <div className="flex flex-col gap-8">
      {/* 1. نموذج إضافة تقييم جديد */}
      <section className="rounded-3xl border border-amber-500/30 bg-surface/90 backdrop-blur-xl p-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-500/10 text-amber-400 text-xl font-bold">
            ⭐
          </div>
          <div>
            <h3 className="text-lg font-black text-fg">إضافة رأي / تقييم جديد للعملاء</h3>
            <p className="text-xs text-muted font-medium">
              أضف تقييمات وآراء مشجعّة للعملاء تظهر أسفل المنتجات في الرئيسية لزيادة الثقة والمبيعات.
            </p>
          </div>
        </div>

        <form action={addReviewAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-fg mb-1">اسم العميل</label>
            <input
              type="text"
              name="name"
              required
              placeholder="مثال: أحمد مصطفى"
              className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs font-bold text-fg focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-fg mb-1">شارة الباقة / نوع الاشتراك</label>
            <input
              type="text"
              name="badge"
              placeholder="مثال: مشترك شاهد VIP 🍿"
              className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs font-bold text-fg focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-fg mb-1">التقييم (النجوم)</label>
            <select
              name="rating"
              defaultValue="5"
              className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs font-bold text-fg focus:border-amber-500 focus:outline-none"
            >
              <option value="5">⭐⭐⭐⭐⭐ (5 نجوم)</option>
              <option value="4">⭐⭐⭐⭐ (4 نجوم)</option>
              <option value="3">⭐⭐⭐ (3 نجوم)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-fg mb-1">تعليق ورأي العميل</label>
            <textarea
              name="comment"
              required
              rows={3}
              placeholder="اكتب تعليق العميل هنا (مثال: تفعيل سريع جداً والدعم محترم...)"
              className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs font-bold text-fg focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-black text-black shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-400 hover:scale-105"
            >
              + إضافة التقييم فوراً
            </button>
          </div>
        </form>
      </section>

      {/* 2. قائمة التقييمات الحالية */}
      <section className="rounded-3xl border border-line bg-surface/90 p-6">
        <h3 className="text-base font-black text-fg mb-4">
          التقييمات الحالية ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-bg p-8 text-center text-xs text-muted">
            لا توجد تقييمات حالياً. أضف أول تقييم من النموذج أعلاه.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className={`flex flex-col justify-between rounded-2xl border p-4 transition-colors ${
                  r.active ? "border-line bg-bg" : "border-red-500/20 bg-red-500/5 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-fg text-sm">{r.name}</span>
                      <span className="text-amber-400 text-xs">{"★".repeat(r.rating)}</span>
                    </div>
                    <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-bold text-brand-300">
                      {r.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed font-medium mb-4">
                    "{r.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-line/40 pt-3 text-xs">
                  <span className="text-[10px] text-muted">{r.createdAt}</span>
                  <div className="flex items-center gap-2">
                    {/* إخفاء / إظهار */}
                    <form action={toggleReviewAction}>
                      <input type="hidden" name="id" value={r.id} />
                      <button
                        type="submit"
                        className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-colors ${
                          r.active
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-neutral-500/30 bg-neutral-500/10 text-muted"
                        }`}
                      >
                        {r.active ? "مفعّل ✅" : "مخفي 👁️"}
                      </button>
                    </form>

                    {/* حذف */}
                    <form action={deleteReviewAction}>
                      <input type="hidden" name="id" value={r.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-bold text-red-400 hover:bg-red-500/20"
                      >
                        حذف 🗑️
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
