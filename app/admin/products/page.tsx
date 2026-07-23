import Link from "next/link";
import { getAllProductsAdmin } from "@/lib/products";
import { deleteProductAction, deleteAllProductsAction } from "@/app/actions/admin";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await getAllProductsAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-black text-fg">شاشة إدارة المنتجات والباقات ({products.length})</h2>
          <p className="text-xs text-muted font-medium mt-0.5">
            إضافة، تعديل، إخفاء، أو حذف المنتجات المعروضة في المتجر.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {products.length > 0 && (
            <form action={deleteAllProductsAction}>
              <button
                type="submit"
                className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-300 transition-all hover:bg-red-500/20"
              >
                حذف جميع المنتجات 🗑️
              </button>
            </form>
          )}
          <Link
            href="/admin/products/new"
            className="rounded-xl bg-brand-gradient px-4 py-2 text-xs font-bold text-white shadow-lg shadow-brand-600/20 transition-all hover:opacity-95"
          >
            + منتج جديد
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-surface/50 p-12 text-center text-sm text-muted">
          لا توجد منتجات حالياً. اضغط على "+ منتج جديد" لإضافة منتجاتك الخاصة.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-surface/90 backdrop-blur-xl p-4 shadow-md transition-colors hover:border-white/20"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.images[0] ?? "/products/placeholder.svg"}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 font-bold text-fg text-sm">{p.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                  <span className="tnum font-black text-emerald-400">
                    {formatPrice(p.priceCents, p.currency)}
                  </span>
                  <span className="text-muted">
                    {p.type === "digital" ? "رقمي" : "ملموس"}
                  </span>
                  {p.featured && (
                    <span className="rounded-full bg-brand-600/20 border border-brand-500/30 px-2 py-0.5 text-[10px] font-bold text-brand-200">
                      مميّز
                    </span>
                  )}
                  {!p.active && (
                    <span className="rounded-full bg-neutral-600/30 border border-neutral-500/30 px-2 py-0.5 text-[10px] font-bold text-muted">
                      مخفي
                    </span>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/products/${p.id}`}
                  className="rounded-xl border border-line bg-bg px-3.5 py-1.5 text-xs font-bold text-fg transition-colors hover:bg-surface-2"
                >
                  تعديل ✏️
                </Link>
                <form action={deleteProductAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="rounded-xl border border-red-500/40 bg-red-500/10 px-3.5 py-1.5 text-xs font-bold text-red-300 transition-colors hover:bg-red-500/20"
                  >
                    حذف 🗑️
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
