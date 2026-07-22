import type { ProductView } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
}: {
  products: ProductView[];
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-surface p-12 text-center text-muted">
        لا توجد اشتراكات مضافة حالياً. قم بإضافتها من لوحة التحكم.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* الهيدر الموحد الفاخر بتنسيق سنتر أنيق */}
      <div className="flex flex-col items-center text-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-black text-brand-300">
          <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
          اختر المنصة والباقة المناسبة 🎬
        </span>

        <div>
          <h2 className="text-3xl font-black text-fg sm:text-5xl tracking-tight">
            باقات واشتراكات الترفيه
          </h2>
          <p className="mt-2.5 text-sm text-muted max-w-lg font-medium leading-relaxed">
            استمتع بالمشاهدة الفورية بأعلى جودة بملف بروفايل خاص بك وضمان كامل.
          </p>
        </div>
      </div>

      {/* شبكة الكروت التفاعلية */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
