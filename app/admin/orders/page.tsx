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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-black text-fg">شاشة إدارة الطلبات ({orders.length})</h2>
          <p className="text-xs text-muted font-medium mt-0.5">
            عرض وتصفية كل الطلبات الواردة (مسجلين وزوار) وتغيير حالتها فوراً.
          </p>
        </div>
      </div>

      {/* فلاتر الحالة */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const isActive = f.key === active;
          return (
            <Link
              key={f.key || "all"}
              href={f.key ? `/admin/orders?status=${f.key}` : "/admin/orders"}
              className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-all ${
                isActive
                  ? "border-brand-500 bg-brand-600/20 text-brand-200 shadow-md"
                  : "border-line bg-surface text-muted hover:text-fg hover:bg-surface-2"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-surface/50 p-12 text-center text-sm text-muted">
          لا توجد طلبات في هذا القسم حالياً.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((o) => (
            <li
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-surface/90 backdrop-blur-xl p-4 shadow-md transition-colors hover:border-white/20"
            >
              <Link href={`/admin/orders/${o.id}`} className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="tnum font-bold text-fg text-sm">{o.orderNumber}</p>
                  {o.userId ? (
                    <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold text-brand-300 border border-brand-500/30">
                      حساب مسجّل
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      زائر (Guest)
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted mt-1">
                  العميل: <strong className="text-fg font-bold">{o.customerName}</strong> ({o.customerPhone}) ·{" "}
                  {o.items.length} منتج · طريقة الدفع:{" "}
                  <span className="text-fg font-semibold">
                    {o.paymentMethod === "cash" ? "كاش" : "تحويل (فودافون كاش / إنستاباي)"}
                  </span>
                </p>
              </Link>
              <div className="flex items-center gap-3">
                <span className="tnum text-sm font-black text-fg">
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
