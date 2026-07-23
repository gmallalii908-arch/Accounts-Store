import { prisma } from "@/lib/prisma";
import type { Product } from "@/app/generated/prisma/client";

// شكل المنتج بعد التجهيز للعرض
export type ProductView = {
  id: string;
  slug: string;
  name: string;
  shortDesc: string | null;
  description: string;
  priceCents: number;
  compareAtCents: number | null;
  currency: string;
  type: "physical" | "digital";
  images: string[];
  featured: boolean;
  active: boolean;
};

const DEFAULT_PRODUCTS = [
  {
    slug: "netflix-premium-4k",
    name: "اشتراك نتفليكس (Netflix Premium 4K)",
    shortDesc: "ملف خاص برقم سرري 4K UHD · ضمان كامل بمصر",
    description: "احصل على بروفايل شخصي خاص بك داخل حساب Netflix Premium رسمي 4K UHD. ملفك مقفول برمز PIN خاص بك، يعمل على الشاشات والموبايل واللاب توب بدون أي تعارض. تسليم فورياً بعد الدفع.",
    priceCents: 12000,
    compareAtCents: 20000,
    type: "digital",
    images: JSON.stringify(["/products/netflix.svg"]),
    featured: true,
    active: true,
  },
  {
    slug: "shahid-vip",
    name: "اشتراك شاهد VIP (الأفلام والمسلسلات)",
    shortDesc: "عروض شاهد الأصلية بدون إعلانات بجودة HD",
    description: "استمتع بجميع مسلسلات وأفلام شاهد VIP الحصرية والقبل السينما بدون فواصل إعلانية. حساب رسمي ومضمون 100% طوال فترة الاشتراك.",
    priceCents: 9500,
    compareAtCents: 15000,
    type: "digital",
    images: JSON.stringify(["/products/shahid.svg"]),
    featured: true,
    active: true,
  },
  {
    slug: "shahid-vip-sports",
    name: "اشتراك شاهد VIP + الباقة الرياضية (SSC)",
    shortDesc: "مشاهدة الدوري السعودي والبطولات + مسلسلات وأفلام",
    description: "الباقة الشاملة لمشاهدة جميع قنوات SSC الرياضية والدوري السعودي والبطولات الآسيوية بجانب مكتبة الأفلام والمسلسلات كاملة.",
    priceCents: 14900,
    compareAtCents: 24900,
    type: "digital",
    images: JSON.stringify(["/products/shahid.svg"]),
    featured: true,
    active: true,
  },
  {
    slug: "osn-plus-premium",
    name: "اشتراك OSN+ (مسلسلات HBO الحصرية)",
    shortDesc: "عالم House of the Dragon و Game of Thrones ومسلسلات هوليوود",
    description: "المنصة الحصرية لعروض HBO ومسلسلات Paramount. مشاهدة بأعلى جودة وصوت سينمائي متكامل مع ترجمة عربية احترافية.",
    priceCents: 11000,
    compareAtCents: 18000,
    type: "digital",
    images: JSON.stringify(["/products/osn.svg"]),
    featured: true,
    active: true,
  },
  {
    slug: "disney-plus-ultra",
    name: "اشتراك ديزني+ (Disney+ Premium)",
    shortDesc: "عالم ديزني، Marvel، Star Wars و Pixar دبلجة وترجمة",
    description: "شاهد كافة أفلام ومسلسلات مارفل، ديزني، وستار وارز بجودة 4K مع دبلجة عربية وترجمة احترافية. ضمان شامل طول مدة الباقة.",
    priceCents: 9900,
    compareAtCents: 16000,
    type: "digital",
    images: JSON.stringify(["/products/disney.svg"]),
    featured: true,
    active: true,
  },
  {
    slug: "entertainment-bundle-vip",
    name: "باقة الترفيه الشاملة (Netflix + Shahid + OSN+)",
    shortDesc: "👑 3 منصات في اشتراك واحد بأقوى خصم في مصر!",
    description: "عرض التوفير الأكبر لعشاق السينما والدراما بمصر! احصل على حساب نتفليكس 4K + شاهد VIP + OSN+ بسعر استثنائي وتوفير أكثر من 50% مع ضمان شامل.",
    priceCents: 29900,
    compareAtCents: 45000,
    type: "digital",
    images: JSON.stringify(["/products/netflix.svg"]),
    featured: true,
    active: true,
  },
];

async function ensureSeedProducts() {
  try {
    const seededMarker = await prisma.setting.findUnique({ where: { key: "db_seeded_v1" } });
    if (seededMarker && seededMarker.value === "1") {
      return;
    }

    const count = await prisma.product.count();
    if (count === 0) {
      for (const p of DEFAULT_PRODUCTS) {
        await prisma.product.upsert({
          where: { slug: p.slug },
          update: {},
          create: p,
        });
      }
    }

    await prisma.setting.upsert({
      where: { key: "db_seeded_v1" },
      update: { value: "1" },
      create: { key: "db_seeded_v1", value: "1" },
    });
  } catch (e) {
    console.error("فشل التغذية التلقائية للمنتجات:", e);
  }
}

/** يحوّل صف قاعدة البيانات لشكل جاهز للعرض */
export function toProductView(p: Product): ProductView {
  let images: string[] = [];
  try {
    const parsed = JSON.parse(p.images);
    if (Array.isArray(parsed)) images = parsed.filter((x) => typeof x === "string");
  } catch {
    images = [];
  }
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDesc: p.shortDesc,
    description: p.description,
    priceCents: p.priceCents,
    compareAtCents: p.compareAtCents,
    currency: p.currency,
    type: p.type === "digital" ? "digital" : "physical",
    images,
    featured: p.featured,
    active: p.active,
  };
}

/** كل المنتجات المتاحة للبيع */
export async function getActiveProducts(): Promise<ProductView[]> {
  await ensureSeedProducts();
  const rows = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(toProductView);
}

/** المنتجات المميزة */
export async function getFeaturedProducts(limit = 6): Promise<ProductView[]> {
  await ensureSeedProducts();
  const rows = await prisma.product.findMany({
    where: { active: true, featured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toProductView);
}

/** منتج واحد بالـ slug */
export async function getProductBySlug(
  rawSlug: string
): Promise<ProductView | null> {
  await ensureSeedProducts();
  let decoded = rawSlug;
  try {
    decoded = decodeURIComponent(rawSlug).trim();
  } catch {}
  const slug = rawSlug.trim();

  const row = await prisma.product.findFirst({
    where: {
      OR: [
        { slug: decoded },
        { slug: slug },
        { id: decoded },
      ],
    },
  });
  return row ? toProductView(row) : null;
}

// ===== أدمن =====
export async function getAllProductsAdmin(): Promise<ProductView[]> {
  const rows = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProductView);
}

export async function getProductByIdAdmin(
  id: string
): Promise<ProductView | null> {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? toProductView(row) : null;
}

export type ProductInput = {
  slug: string;
  name: string;
  shortDesc: string | null;
  description: string;
  priceCents: number;
  compareAtCents: number | null;
  type: string;
  images: string[];
  featured: boolean;
  active: boolean;
};

export async function createProduct(input: ProductInput) {
  return prisma.product.create({
    data: { ...input, images: JSON.stringify(input.images) },
  });
}

export async function updateProduct(id: string, input: ProductInput) {
  return prisma.product.update({
    where: { id },
    data: { ...input, images: JSON.stringify(input.images) },
  });
}

export async function deleteProduct(id: string) {
  try {
    await prisma.orderItem.updateMany({
      where: { productId: id },
      data: { productId: null },
    });
  } catch (e) {
    console.error("فشل فك ارتباط الطلبات:", e);
  }
  return prisma.product.delete({ where: { id } });
}

export async function isSlugTaken(
  slug: string,
  exceptId?: string
): Promise<boolean> {
  const row = await prisma.product.findUnique({
    where: { slug },
    select: { id: true },
  });
  return !!row && row.id !== exceptId;
}
