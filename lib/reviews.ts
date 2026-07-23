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

export async function getApprovedReviews(): Promise<ReviewView[]> {
  const rows = await prisma.review.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    orderId: r.orderId,
    name: r.name,
    comment: r.comment,
    rating: r.rating,
    badge: r.badge,
    isApproved: r.isApproved,
    createdAt: r.createdAt.toISOString().split("T")[0],
  }));
}

export async function getActiveReviews(): Promise<ReviewView[]> {
  return getApprovedReviews();
}

export async function getAllReviewsAdmin(): Promise<ReviewView[]> {
  const rows = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    orderId: r.orderId,
    name: r.name,
    comment: r.comment,
    rating: r.rating,
    badge: r.badge,
    isApproved: r.isApproved,
    createdAt: r.createdAt.toISOString().split("T")[0],
  }));
}

export async function approveReview(id: string): Promise<void> {
  await prisma.review.update({
    where: { id },
    data: { isApproved: true },
  });
}

export async function deleteReview(id: string): Promise<void> {
  await prisma.review.delete({
    where: { id },
  });
}

export async function toggleReviewApproved(id: string): Promise<void> {
  const r = await prisma.review.findUnique({ where: { id } });
  if (r) {
    await prisma.review.update({
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
  await prisma.review.create({
    data: {
      orderId: data.orderId || null,
      name: data.name,
      comment: data.comment,
      rating: data.rating,
      badge: data.badge || null,
      isApproved: false, // تتطلب موافقة الأدمن لتظهر في الصفحة الرئيسية
    },
  });
}
