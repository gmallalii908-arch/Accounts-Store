"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createReview, deleteReview, toggleReviewApproved } from "@/lib/reviews";
import { cleanStr } from "@/lib/validation";

export async function addReviewAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const name = cleanStr(formData.get("name"), 80);
  const comment = cleanStr(formData.get("comment"), 500);
  const badge = cleanStr(formData.get("badge"), 60) || "مشترك مميز ⭐";
  const ratingRaw = Number(formData.get("rating")) || 5;
  const rating = Math.max(1, Math.min(5, ratingRaw));
  const orderId = cleanStr(formData.get("orderId"), 40) || undefined;

  if (!name || !comment) return;

  await createReview({
    orderId,
    name,
    comment,
    badge,
    rating,
  });

  // إذا أضافه الأدمن بنفسه، نفعل الموافقة تلقائياً
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  redirect("/admin/reviews");
}

export async function submitCustomerReviewAction(formData: FormData): Promise<void> {
  const name = cleanStr(formData.get("name"), 80);
  const comment = cleanStr(formData.get("comment"), 500);
  const orderId = cleanStr(formData.get("orderId"), 40) || undefined;
  const ratingRaw = Number(formData.get("rating")) || 5;
  const rating = Math.max(1, Math.min(5, ratingRaw));

  if (!name || !comment) return;

  await createReview({
    orderId,
    name,
    comment,
    rating,
    badge: "عميل مؤكد 🟢",
  });

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
  redirect("/admin/reviews");
}

export async function toggleReviewAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = cleanStr(formData.get("id"), 40);
  if (id) {
    await toggleReviewApproved(id);
    revalidatePath("/admin/reviews");
    revalidatePath("/");
  }
  redirect("/admin/reviews");
}
