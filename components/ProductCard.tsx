import Link from "next/link";
import type { ProductView } from "@/lib/products";
import { formatPrice, discountLabel } from "@/lib/format";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: ProductView }) {
  const img = product.images[0] ?? "/products/placeholder.svg";
  const discount = discountLabel(product.priceCents, product.compareAtCents);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface/90 backdrop-blur-md transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_12px_35px_-10px_rgba(229,9,20,0.35)] hover:-translate-y-1.5">
      {/* الصورة ذات التكبير الناعم والإصلاح الذكي للأخطاء */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-surface-2"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes("placeholder")) {
              target.src = "/products/placeholder.svg";
            }
          }}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />

        {/* تدرّج تظليل على الصورة لتوضيح العنوان */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/40 opacity-60" />

        {/* الشارات المضيئة بالمنتج */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
          {discount && (
            <span className="rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-3 py-1 text-xs font-black text-white shadow-lg shadow-red-600/40">
              وفر {discount}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            تسليم فوري
          </span>
        </div>
      </Link>

      {/* تفاصيل الاشتراك */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-base font-black leading-snug text-fg transition-colors group-hover:text-red-400">
            {product.name}
          </h3>
        </Link>
        {product.shortDesc && (
          <p className="mt-1.5 line-clamp-2 text-xs font-medium text-muted leading-relaxed">
            {product.shortDesc}
          </p>
        )}

        {/* السعر والأزرار */}
        <div className="mt-5 flex items-end justify-between gap-2 border-t border-white/5 pt-4">
          <div className="flex flex-col">
            <span className="tnum text-xl font-black text-emerald-400">
              {formatPrice(product.priceCents, product.currency)}
            </span>
            {product.compareAtCents && (
              <span className="tnum text-xs text-muted line-through font-medium opacity-75">
                {formatPrice(product.compareAtCents, product.currency)}
              </span>
            )}
          </div>

          <AddToCartButton product={product} variant="card" />
        </div>
      </div>
    </div>
  );
}
