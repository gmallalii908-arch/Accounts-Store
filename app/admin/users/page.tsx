import { getCustomersList } from "@/lib/orders";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const customers = await getCustomersList();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-black text-fg">شاشة إدارة العملاء ({customers.length})</h2>
          <p className="text-xs text-muted font-medium mt-0.5">
            عرض كافة المستخدمين المسجلين بحسابات والزوار (Guests) الذين قاموا بإنشاء طلبات في المتجر.
          </p>
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-surface/50 p-12 text-center text-sm text-muted">
          لا يوجد عملاء مسجلين أو زوار حتى الآن.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {customers.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-surface/90 backdrop-blur-xl p-4 shadow-md transition-colors hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5 font-black text-fg text-sm">
                  👤
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-fg text-sm">{c.name}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                        c.type === "مسجّل"
                          ? "bg-brand-500/10 text-brand-300 border border-brand-500/30"
                          : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {c.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5 dir-ltr text-right">
                    {c.phone && <span className="font-bold text-fg">{c.phone}</span>}
                    {c.email && <span className="ms-2 text-muted">· {c.email}</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="text-right">
                  <p className="text-[10px] text-muted">عدد الطلبات</p>
                  <p className="tnum text-fg font-black text-sm">{c.ordersCount} طلب</p>
                </div>
                <div className="text-right border-r border-white/10 pr-4">
                  <p className="text-[10px] text-muted">إجمالي المشتريات</p>
                  <p className="tnum text-emerald-400 font-black text-sm">
                    {formatPrice(Math.round(c.totalSpentEgp * 100))}
                  </p>
                </div>
                <div className="text-right border-r border-white/10 pr-4 hidden sm:block">
                  <p className="text-[10px] text-muted">آخر طلب</p>
                  <p className="tnum text-muted text-xs">{c.lastOrderDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
