"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { addReview, deleteReview, toggleReviewActive } from "@/lib/reviews";
import { cleanStr } from "@/lib/validation";

export async function addReviewAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const name = cleanStr(formData.get("name"), 80);
  const comment = cleanStr(formData.get("comment"), 500);
  const badge = cleanStr(formData.get("badge"), 60) || "مشترك مميز ⭐";
  const ratingRaw = Number(formData.get("rating")) || 5;
  const rating = Math.max(1, Math.min(5, ratingRaw));

  if (!name || !comment) return;

  await addReview({
    name,
    comment,
    badge,
    rating,
    active: true,
  });

  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function deleteReviewAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = cleanStr(formData.get("id"), 40);
  if (id) {
    await deleteReview(id);
    revalidatePath("/admin/reviews");
    revalidatePath("/");
  }
}

export async function toggleReviewAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = cleanStr(formData.get("id"), 40);
  if (id) {
    await toggleReviewActive(id);
    revalidatePath("/admin/reviews");
    revalidatePath("/");
  }
}
