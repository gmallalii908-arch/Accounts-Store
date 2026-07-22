import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// حساب الأدمن
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@syntax.eg";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

// منتجات Accounts Store المستهدفة لعشاق الأفلام والمسلسلات في مصر (19 - 40 سنة)
const products = [
  {
    slug: "netflix-premium-4k",
    name: "اشتراك نتفليكس (Netflix Premium 4K)",
    shortDesc: "ملف خاص برقم سرري 4K UHD · ضمان كامل بمصر",
    description:
      "احصل على بروفايل شخصي خاص بك داخل حساب Netflix Premium رسمي 4K UHD. ملفك مقفول برمز PIN خاص بك، يعمل على الشاشات والموبايل واللاب توب بدون أي تعارض. تسليم فورياً بعد الدفع.",
    priceCents: 12000, // 120 جنيه
    compareAtCents: 20000,
    type: "digital",
    images: JSON.stringify(["/products/netflix.svg"]),
    featured: true,
  },
  {
    slug: "shahid-vip",
    name: "اشتراك شاهد VIP (الأفلام والمسلسلات)",
    shortDesc: "عروض شاهد الأصلية بدون إعلانات بجودة HD",
    description:
      "استمتع بجميع مسلسلات وأفلام شاهد VIP الحصرية والقبل السينما بدون فواصل إعلانية. حساب رسمي ومضمون 100% طوال فترة الاشتراك.",
    priceCents: 9500, // 95 جنيه
    compareAtCents: 15000,
    type: "digital",
    images: JSON.stringify(["/products/shahid.svg"]),
    featured: true,
  },
  {
    slug: "shahid-vip-sports",
    name: "اشتراك شاهد VIP + الباقة الرياضية (SSC)",
    shortDesc: "مشاهدة الدوري السعودي والبطولات + مسلسلات وأفلام",
    description:
      "الباقة الشاملة لمشاهدة جميع قنوات SSC الرياضية والدوري السعودي والبطولات الآسيوية بجانب مكتبة الأفلام والمسلسلات كاملة.",
    priceCents: 14900, // 149 جنيه
    compareAtCents: 24900,
    type: "digital",
    images: JSON.stringify(["/products/shahid.svg"]),
    featured: true,
  },
  {
    slug: "osn-plus-premium",
    name: "اشتراك OSN+ (مسلسلات HBO الحصرية)",
    shortDesc: "عالم House of the Dragon و Game of Thrones ومسلسلات هوليوود",
    description:
      "المنصة الحصرية لعروض HBO ومسلسلات Paramount. مشاهدة بأعلى جودة وصوت سينمائي متكامل مع ترجمة عربية احترافية.",
    priceCents: 11000, // 110 جنيه
    compareAtCents: 18000,
    type: "digital",
    images: JSON.stringify(["/products/osn.svg"]),
    featured: true,
  },
  {
    slug: "disney-plus-ultra",
    name: "اشتراك ديزني+ (Disney+ Premium)",
    shortDesc: "عالم ديزني، Marvel، Star Wars و Pixar دبلجة وترجمة",
    description:
      "شاهد كافة أفلام ومسلسلات مارفل، ديزني، وستار وارز بجودة 4K مع دبلجة عربية وترجمة احترافية. ضمان شامل طول مدة الباقة.",
    priceCents: 9900, // 99 جنيه
    compareAtCents: 16000,
    type: "digital",
    images: JSON.stringify(["/products/disney.svg"]),
    featured: true,
  },
  {
    slug: "entertainment-bundle-vip",
    name: "باقة الترفيه الشاملة (Netflix + Shahid + OSN+)",
    shortDesc: "👑 3 منصات في اشتراك واحد بأقوى خصم في مصر!",
    description:
      "عرض التوفير الأكبر لعشاق السينما والدراما بمصر! احصل على حساب نتفليكس 4K + شاهد VIP + OSN+ بسعر استثنائي وتوفير أكثر من 50% مع ضمان شامل.",
    priceCents: 29900, // 299 جنيه
    compareAtCents: 45000,
    type: "digital",
    images: JSON.stringify(["/products/netflix.svg"]),
    featured: true,
  },
];

async function main() {
  console.log("🌱 Seeding Accounts Store Egypt products...");
  await prisma.product.deleteMany({});

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
    console.log(`  ✓ ${p.name}`);
  }
  const count = await prisma.product.count();
  console.log(`✅ Done. Total digital products: ${count}`);

  // حساب الأدمن
  console.log("👤 Seeding admin...");
  await prisma.user.deleteMany({ where: { role: "admin" } });
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "admin", passwordHash },
    create: {
      name: "أدمن Accounts Store",
      email: ADMIN_EMAIL,
      passwordHash,
      role: "admin",
    },
  });
  console.log(`✅ Admin ready → ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
