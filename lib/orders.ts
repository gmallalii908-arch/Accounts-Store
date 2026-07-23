import "server-only";
import { prisma } from "@/lib/prisma";

// ===== حالات الطلب =====
export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "delivered",
  "cancelled",
  "returned",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "قيد المراجعة",
  confirmed: "مؤكّد",
  delivered: "تم التسليم",
  cancelled: "ملغي",
  returned: "مرتجع",
};

// خطوات التقدّم المعروضة في خط الزمن
export const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "delivered"];

export function statusLabel(status: string): string {
  return STATUS_LABELS[status as OrderStatus] ?? status;
}

// ===== توليد رقم طلب مقروء وفريد =====
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCode(len = 6): string {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

async function generateOrderNumber(): Promise<string> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const candidate = `SYX-${randomCode(6)}`;
    const exists = await prisma.order.findUnique({
      where: { orderNumber: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
  }
  return `SYX-${randomCode(9)}`;
}

// ===== إنشاء طلب =====
export type NewOrderItem = {
  productId: string | null;
  name: string;
  priceCents: number;
  qty: number;
  type: string;
};

export type NewOrderInput = {
  userId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  address: string | null;
  paymentMethod: string;
  proofImage: string | null;
  note: string | null;
  shippingCents: number;
  items: NewOrderItem[];
};

export async function createOrder(input: NewOrderInput) {
  const subtotalCents = input.items.reduce(
    (sum, i) => sum + i.priceCents * i.qty,
    0
  );
  const orderNumber = await generateOrderNumber();

  return prisma.order.create({
    data: {
      orderNumber,
      userId: input.userId,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      address: input.address,
      paymentMethod: input.paymentMethod,
      proofImage: input.proofImage,
      note: input.note,
      subtotalCents,
      shippingCents: input.shippingCents,
      totalCents: subtotalCents + input.shippingCents,
      status: "pending",
      items: {
        create: input.items.map((i) => ({
          productId: i.productId,
          name: i.name,
          priceCents: i.priceCents,
          qty: i.qty,
          type: i.type,
        })),
      },
    },
    include: { items: true },
  });
}

// ===== قراءة =====
export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber: orderNumber.trim().toUpperCase() },
    include: { items: true },
  });
}

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

// ===== أدمن =====
export async function getAllOrders(status?: string) {
  return prisma.order.findMany({
    where: status && ORDER_STATUSES.includes(status as OrderStatus)
      ? { status }
      : undefined,
    include: { items: true, user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true, user: true },
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus, note?: string) {
  return prisma.order.update({
    where: { id },
    data: {
      status,
      ...(note !== undefined ? { note } : {}),
    },
  });
}

export async function deleteOrder(id: string) {
  await prisma.orderItem.deleteMany({ where: { orderId: id } });
  return prisma.order.delete({ where: { id } });
}

/** إحصائيات شاملة للوحة التحكم النظرة العامة */
export async function getStats() {
  const [orders, products, usersCount] = await Promise.all([
    prisma.order.findMany({
      select: {
        id: true,
        status: true,
        subtotalCents: true,
        totalCents: true,
        createdAt: true,
        customerPhone: true,
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.product.count(),
    prisma.user.count({ where: { role: "customer" } }),
  ]);

  const byStatus: Record<string, number> = {};
  let revenueCents = 0;
  const uniquePhones = new Set<string>();

  for (const o of orders) {
    byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
    if (o.customerPhone) uniquePhones.add(o.customerPhone);
    if (o.status === "confirmed" || o.status === "delivered") {
      revenueCents += o.totalCents || o.subtotalCents;
    }
  }

  // تجميع المبيعات حسب الأيام للرسم البياني Recharts Chart
  const salesMap = new Map<string, number>();
  for (const o of orders) {
    if (o.status === "confirmed" || o.status === "delivered") {
      const dateStr = new Date(o.createdAt).toLocaleDateString("ar-EG", {
        month: "short",
        day: "numeric",
      });
      const current = salesMap.get(dateStr) || 0;
      salesMap.set(dateStr, current + (o.totalCents || o.subtotalCents) / 100);
    }
  }

  const chartData = Array.from(salesMap.entries()).map(([date, sales]) => ({
    date,
    sales,
  }));

  // لو مفيش بيانات كافية نحط نقاط افتراضية توضيحية
  if (chartData.length === 0) {
    const today = new Date().toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
    chartData.push({ date: today, sales: 0 });
  }

  return {
    ordersCount: orders.length,
    productsCount: products,
    customersCount: Math.max(usersCount, uniquePhones.size),
    revenueCents,
    pending: byStatus["pending"] ?? 0,
    confirmed: byStatus["confirmed"] ?? 0,
    delivered: byStatus["delivered"] ?? 0,
    cancelled: byStatus["cancelled"] ?? 0,
    returned: byStatus["returned"] ?? 0,
    chartData,
  };
}

export type CustomerRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  type: "مسجّل" | "زائر (Guest)";
  ordersCount: number;
  totalSpentEgp: number;
  lastOrderDate: string;
};

/** شاشة إدارة العملاء (المسجلين والـ Guests) */
export async function getCustomersList(): Promise<CustomerRow[]> {
  const [users, orders] = await Promise.all([
    prisma.user.findMany({
      where: { role: "customer" },
      include: { orders: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const list: CustomerRow[] = [];
  const processedPhones = new Set<string>();

  // 1. المستخدمين المسجلين
  for (const u of users) {
    if (u.phone) processedPhones.add(u.phone);
    const totalSpentCents = u.orders.reduce((sum, o) => sum + (o.totalCents || o.subtotalCents), 0);
    const lastOrder = u.orders[0];
    list.push({
      id: u.id,
      name: u.name,
      phone: u.phone,
      email: u.email,
      type: "مسجّل",
      ordersCount: u.orders.length,
      totalSpentEgp: totalSpentCents / 100,
      lastOrderDate: lastOrder ? lastOrder.createdAt.toISOString().split("T")[0] : u.createdAt.toISOString().split("T")[0],
    });
  }

  // 2. عملاء الزوار (Guests)
  const guestMap = new Map<string, { name: string; phone: string; email: string | null; count: number; spent: number; lastDate: string }>();
  for (const o of orders) {
    if (!o.userId && o.customerPhone) {
      const p = o.customerPhone.trim();
      const existing = guestMap.get(p);
      const spent = (o.totalCents || o.subtotalCents) / 100;
      const date = o.createdAt.toISOString().split("T")[0];

      if (existing) {
        existing.count += 1;
        existing.spent += spent;
      } else {
        guestMap.set(p, {
          name: o.customerName,
          phone: p,
          email: o.customerEmail,
          count: 1,
          spent,
          lastDate: date,
        });
      }
    }
  }

  for (const [phone, g] of guestMap.entries()) {
    if (!processedPhones.has(phone)) {
      list.push({
        id: `guest-${phone}`,
        name: g.name,
        phone: g.phone,
        email: g.email,
        type: "زائر (Guest)",
        ordersCount: g.count,
        totalSpentEgp: g.spent,
        lastOrderDate: g.lastDate,
      });
    }
  }

  return list;
}
