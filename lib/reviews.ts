import "server-only";
import { prisma } from "@/lib/prisma";

export type Review = {
  id: string;
  name: string;
  comment: string;
  rating: number; // 1-5
  badge: string; // e.g. "مشترك شاهد VIP", "مشترك نتفليكس 4K"
  active: boolean;
  createdAt: string;
};

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "أحمد مصطفى",
    comment: "اشتراك شاهد VIP شغال تمام وبدون أي تقطيع، والتسليم كان في أقل من 5 دقائق على الواتساب. شكراً جداً 👍",
    rating: 5,
    badge: "مشترك شاهد VIP 🍿",
    active: true,
    createdAt: "2026-07-20",
  },
  {
    id: "rev-2",
    name: "محمود حسن",
    comment: "أحسن متجر اتعاملت معاه، يوزر نتفليكس 4K خاص بيا وشغال بقالي 3 شهور بدون أي مشكلة والضمان حقيقي.",
    rating: 5,
    badge: "مشترك نتفليكس 4K 🍿",
    active: true,
    createdAt: "2026-07-18",
  },
  {
    id: "rev-3",
    name: "عمر الشريف",
    comment: "تفعيل IPTV سريع جداً وسيرفر ثابت للمباريات. الدعم على الواتساب محترم وبيساعد في أي وقت.",
    rating: 5,
    badge: "مشترك IPTV ⚽",
    active: true,
    createdAt: "2026-07-15",
  },
  {
    id: "rev-4",
    name: "سارة الباز",
    comment: "اشتراك يوتيوب بريميوم ممتاز وبدون إعلانات. أمان وسرعة في التعامل وتفعيل فوري على الواتساب ⭐️",
    rating: 5,
    badge: "مشترك YouTube Premium 🔴",
    active: true,
    createdAt: "2026-07-12",
  },
];

const SETTING_KEY = "customer_reviews_data";

export async function getAllReviewsAdmin(): Promise<Review[]> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: SETTING_KEY } });
    if (!row || !row.value.trim()) {
      return DEFAULT_REVIEWS;
    }
    const parsed = JSON.parse(row.value);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_REVIEWS;
  } catch (e) {
    console.error("فشل قراءة آراء العملاء:", e);
    return DEFAULT_REVIEWS;
  }
}

export async function getActiveReviews(): Promise<Review[]> {
  const all = await getAllReviewsAdmin();
  return all.filter((r) => r.active);
}

export async function saveReviews(reviews: Review[]): Promise<void> {
  await prisma.setting.upsert({
    where: { key: SETTING_KEY },
    update: { value: JSON.stringify(reviews) },
    create: { key: SETTING_KEY, value: JSON.stringify(reviews) },
  });
}

export async function addReview(input: Omit<Review, "id" | "createdAt">): Promise<void> {
  const all = await getAllReviewsAdmin();
  const newReview: Review = {
    ...input,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
  };
  all.unshift(newReview);
  await saveReviews(all);
}

export async function deleteReview(id: string): Promise<void> {
  const all = await getAllReviewsAdmin();
  const filtered = all.filter((r) => r.id !== id);
  await saveReviews(filtered);
}

export async function toggleReviewActive(id: string): Promise<void> {
  const all = await getAllReviewsAdmin();
  const updated = all.map((r) => (r.id === id ? { ...r, active: !r.active } : r));
  await saveReviews(updated);
}
