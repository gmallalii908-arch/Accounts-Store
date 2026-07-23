import "server-only";
import { prisma } from "@/lib/prisma";

export type ReviewView = {
  id: string;
  orderId: string | null;
  name: string;
  comment: string;
  rating: number;
  badge: string | null;
  isApproved: boolean;
  createdAt: string;
};

// cast prisma to any for resilient review delegate access
const db = prisma as any;

export async function getApprovedReviews(): Promise<ReviewView[]> {
  try {
    const rows = await db.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r: any) => ({
      id: r.id,
      orderId: r.orderId,
      name: r.name,
      comment: r.comment,
      rating: r.rating,
      badge: r.badge,
      isApproved: r.isApproved,
      createdAt: new Date(r.createdAt).toISOString().split("T")[0],
    }));
  } catch (e) {
    console.error("فشل قراءة التقييمات:", e);
    return [];
  }
}

export async function getActiveReviews(): Promise<ReviewView[]> {
  return getApprovedReviews();
}

export async function getAllReviewsAdmin(): Promise<ReviewView[]> {
  try {
    const rows = await db.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r: any) => ({
      id: r.id,
      orderId: r.orderId,
      name: r.name,
      comment: r.comment,
      rating: r.rating,
      badge: r.badge,
      isApproved: r.isApproved,
      createdAt: new Date(r.createdAt).toISOString().split("T")[0],
    }));
  } catch (e) {
    console.error("فشل قراءة التقييمات للأدمن:", e);
    return [];
  }
}

export async function approveReview(id: string): Promise<void> {
  await db.review.update({
    where: { id },
    data: { isApproved: true },
  });
}

export async function deleteReview(id: string): Promise<void> {
  await db.review.delete({
    where: { id },
  });
}

export async function toggleReviewApproved(id: string): Promise<void> {
  const r = await db.review.findUnique({ where: { id } });
  if (r) {
    await db.review.update({
      where: { id },
      data: { isApproved: !r.isApproved },
    });
  }
}

export async function createReview(data: {
  orderId?: string;
  name: string;
  comment: string;
  rating: number;
  badge?: string;
}): Promise<void> {
  await db.review.create({
    data: {
      orderId: data.orderId || null,
      name: data.name,
      comment: data.comment,
      rating: data.rating,
      badge: data.badge || null,
      isApproved: false,
    },
  });
}
