"use client";

import { useState } from "react";
import { useCart, type CartItem } from "@/lib/cart";
import type { ProductView } from "@/lib/products";

type Props = {
  product: ProductView;
  variant?: "card" | "full";
};

function toCartItem(p: ProductView): Omit<CartItem, "qty"> {
  return {
    productId: p.id,
    slug: p.slug,
    name: p.name,
    priceCents: p.priceCents,
    currency: p.currency,
    image: p.images[0] ?? "/products/placeholder.svg",
    type: p.type,
  };
}

export default function AddToCartButton({ product, variant = "card" }: Props) {
  const { add, openCart } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    add(toCartItem(product), variant === "full" ? qty : 1);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      openCart();
    }, 600);
  }

  if (variant === "card") {
    return (
      <button
        type="button"
        onClick={handleAdd}
        className={`shrink-0 rounded-2xl px-4 py-2.5 text-xs font-black transition-all duration-300 ${
          justAdded
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105"
            : "bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-md shadow-red-600/25 hover:shadow-lg hover:shadow-red-600/40 hover:scale-105"
        }`}
        aria-label={`أضف ${product.name} للسلة`}
      >
        {justAdded ? "تمت الإضافة ✓" : "احصل عليه 🛒"}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-muted">عدد الحسابات:</span>
        <div className="flex items-center rounded-2xl border border-white/10 bg-surface">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="grid h-11 w-11 place-items-center text-lg font-black text-fg hover:bg-white/5 disabled:opacity-30"
            aria-label="نقص الكمية"
          >
            −
          </button>
          <span className="tnum w-10 text-center font-black text-fg text-base">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="grid h-11 w-11 place-items-center text-lg font-black text-fg hover:bg-white/5"
            aria-label="زود الكمية"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className={`w-full rounded-2xl px-8 py-4 text-center text-base font-black transition-all duration-300 ${
          justAdded
            ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 scale-102"
            : "bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-red-600/30 hover:scale-102"
        }`}
      >
        {justAdded ? "تمت إضافة الاشتراك للسلة ✓" : "تأكيد واستلام الاشتراك الآن 🔥"}
      </button>
    </div>
  );
}
