import Link from "next/link";
import { getAllOrders, ORDER_STATUSES, statusLabel } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "@/components/OrderStatus";
import { deleteOrderAction } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ status?: string }> };

export default async function AdminOrders({ searchParams }: Props) {
  const { status } = await searchParams;
  const active = status && ORDER_STATUSES.includes(status as never) ? status : "";
  const orders = await getAllOrders(active || undefined);

  const filters = [
    { key: "", label: "الكل" },
    ...ORDER_STATUSES.map((s) => ({ key: s, label: statusLabel(s) })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-fg">الطلبات ({orders.length})</h2>
      </div>

      {/* فلاتر الحالة */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const isActive = f.key === active;
          return (
            <Link
              key={f.key || "all"}
              href={f.key ? `/admin/orders?status=${f.key}` : "/admin/orders"}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-brand-500 bg-brand-600/15 text-brand-200"
                  : "border-line bg-surface text-muted hover:text-fg"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center text-muted">
          مفيش طلبات حالياً.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((o) => (
            <li
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand-600/50"
            >
              <Link href={`/admin/orders/${o.id}`} className="min-w-0 flex-1">
                <p className="tnum font-bold text-fg">{o.orderNumber}</p>
                <p className="text-sm text-muted">
                  {o.customerName} · {o.items.length} منتج ·{" "}
                  {o.paymentMethod === "cash" ? "كاش" : "تحويل"}
                </p>
              </Link>
              <div className="flex items-center gap-3">
                <span className="tnum text-sm font-semibold text-fg">
                  {formatPrice(o.totalCents || o.subtotalCents)}
                </span>
                <OrderStatusBadge status={o.status} />

                {/* زر حذف الطلب */}
                <form action={deleteOrderAction}>
                  <input type="hidden" name="id" value={o.id} />
                  <button
                    type="submit"
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-colors"
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
