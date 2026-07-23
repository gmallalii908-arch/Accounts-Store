import Link from "next/link";
import { getStats, getAllOrders, statusLabel } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "@/components/OrderStatus";
import SalesChart from "@/components/admin/SalesChart";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const stats = await getStats();
  const recent = (await getAllOrders()).slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      {/* بطاقات الأرقام الرئيسة */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="إجمالي الإيرادات المؤكّدة" value={formatPrice(stats.revenueCents)} icon="💰" accent />
        <StatCard label="إجمالي الطلبات" value={String(stats.ordersCount)} icon="🧾" />
        <StatCard label="عدد العملاء والمشتركين" value={String(stats.customersCount)} icon="👥" />
        <StatCard label="المنتجات النشطة" value={String(stats.productsCount)} icon="📦" />
      </div>

      {/* الرسم البياني للمبيعات (Recharts) */}
      <section className="rounded-3xl border border-white/10 bg-surface/90 backdrop-blur-xl p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📈</span>
            <h2 className="font-black text-fg text-lg">رسم بياني لتحليل المبيعات والإيرادات</h2>
          </div>
          <span className="text-xs text-muted font-medium">محدّث لحظياً</span>
        </div>
        <SalesChart data={stats.chartData} />
      </section>

      {/* توزيع الحالات */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <MiniStat label={statusLabel("pending")} value={stats.pending} color="text-amber-300" icon="⏳" />
        <MiniStat label={statusLabel("confirmed")} value={stats.confirmed} color="text-blue-300" icon="🔵" />
        <MiniStat label={statusLabel("delivered")} value={stats.delivered} color="text-emerald-300" icon="🟢" />
        <MiniStat label={statusLabel("cancelled")} value={stats.cancelled} color="text-red-300" icon="❌" />
        <MiniStat label={statusLabel("returned")} value={stats.returned} color="text-purple-300" icon="↩️" />
      </div>

      {/* آخر الطلبات */}
      <section className="rounded-3xl border border-white/10 bg-surface/90 backdrop-blur-xl p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛍️</span>
            <h2 className="font-black text-fg text-lg">أحدث الطلبات الواردة</h2>
          </div>
          <Link href="/admin/orders" className="text-xs font-bold text-brand-300 hover:underline">
            عرض كل الطلبات ⬅️
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-muted text-sm py-4 text-center">لا توجد طلبات مسجلة حتى الآن.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-white/5">
            {recent.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 py-3.5 transition-colors hover:opacity-80"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="tnum font-bold text-fg">{o.orderNumber}</p>
                      {o.userId ? (
                        <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold text-brand-300">
                          حساب مسجّل
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                          زائر (Guest)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5">{o.customerName} · {o.customerPhone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="tnum text-sm font-black text-fg">
                      {formatPrice(o.totalCents || o.subtotalCents)}
                    </span>
                    <OrderStatusBadge status={o.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-5 transition-all shadow-lg ${
        accent
          ? "border-red-500/40 bg-red-500/10 text-red-300"
          : "border-white/10 bg-surface/90 backdrop-blur-xl"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-muted">{label}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="tnum mt-2 text-2xl font-black text-fg">{value}</p>
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface/80 p-4 shadow-md">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-muted">{label}</span>
        <span className="text-sm">{icon}</span>
      </div>
      <p className={`tnum text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}
