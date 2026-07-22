import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById, ORDER_STATUSES, statusLabel } from "@/lib/orders";
import { setOrderStatusAction, deleteOrderAction } from "@/app/actions/admin";
import { formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "@/components/OrderStatus";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetail({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const isConfirmed = order.status === "confirmed" || order.status === "delivered";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/orders" className="text-sm text-brand-300 hover:underline">
            ← كل الطلبات
          </Link>
          <h2 className="tnum mt-1 text-xl font-extrabold text-fg">
            الطلب: {order.orderNumber}
          </h2>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* شريط الإجراء الفوري لتأكيد الطلب للدعم والمبيعات */}
      <section className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-emerald-300">
              ⚡ إجراء تأكيد الدفع والتسليم
            </h3>
            <p className="text-xs text-emerald-200/80 mt-1">
              {isConfirmed
                ? "تم تأكيد هذا الطلب بنجاح. زر استلام التلجرام يظهر للعميل حالياً."
                : "بعد مراجعة إثبات التحويل والمبلغ، اضغط على زر (تأكيد الطلب) ليظهر زر استلام الاشتراك للعميل فوراً."}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-end w-full">
            {order.status !== "confirmed" && (
              <form action={setOrderStatusAction} className="flex flex-col gap-2 flex-1 min-w-[240px]">
                <input type="hidden" name="orderId" value={order.id} />
                <input type="hidden" name="status" value="confirmed" />
                <input
                  type="text"
                  name="note"
                  defaultValue={order.note || ""}
                  placeholder="ملاحظة أو بيانات تفعيل الحساب للعميل (اختياري)"
                  className="w-full rounded-xl border border-emerald-500/30 bg-bg px-3.5 py-2.5 text-xs font-bold text-fg placeholder:text-muted/60 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-500 px-6 py-3 font-black text-white shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105"
                >
                  ✅ تأكيد الطلب والموافقة على الدفع
                </button>
              </form>
            )}

            {order.status !== "delivered" && (
              <form action={setOrderStatusAction} className="flex flex-col gap-2">
                <input type="hidden" name="orderId" value={order.id} />
                <input type="hidden" name="status" value="delivered" />
                <button
                  type="submit"
                  className="rounded-xl bg-sky-600 px-5 py-3 font-extrabold text-white transition-opacity hover:opacity-90"
                >
                  📦 تم التسليم
                </button>
              </form>
            )}

            {order.status !== "cancelled" && (
              <form action={setOrderStatusAction} className="flex flex-col gap-2 flex-1 min-w-[240px]">
                <input type="hidden" name="orderId" value={order.id} />
                <input type="hidden" name="status" value="cancelled" />
                <input
                  type="text"
                  name="note"
                  defaultValue={order.note || ""}
                  placeholder="سبب إلغاء الطلب (سيظهر للعميل)"
                  className="w-full rounded-xl border border-red-500/30 bg-bg px-3.5 py-2.5 text-xs font-bold text-fg placeholder:text-muted/60 focus:border-red-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 font-bold text-red-300 transition-colors hover:bg-red-500/20"
                >
                  ❌ إلغاء الطلب
                </button>
              </form>
            )}

            <form action={deleteOrderAction}>
              <input type="hidden" name="id" value={order.id} />
              <button
                type="submit"
                className="w-full sm:w-auto rounded-xl bg-red-600 px-5 py-3 font-black text-white shadow-lg shadow-red-600/30 transition-transform hover:scale-105"
              >
                حذف الطلب نهائياً 🗑️
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* تغيير الحالة بالتفصيل */}
      <section className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="mb-3 font-bold text-fg">جميع الحالات المتاحة</h3>
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUSES.map((s) => {
            const isCurrent = s === order.status;
            return (
              <form action={setOrderStatusAction} key={s}>
                <input type="hidden" name="orderId" value={order.id} />
                <input type="hidden" name="status" value={s} />
                <button
                  type="submit"
                  disabled={isCurrent}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                    isCurrent
                      ? "border-brand-500 bg-brand-600/20 text-brand-200"
                      : "border-line bg-bg text-fg hover:border-brand-600/50 hover:bg-surface-2"
                  }`}
                >
                  {statusLabel(s)}
                </button>
              </form>
            );
          })}
        </div>
      </section>

      {/* المنتجات */}
      <section className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="mb-4 font-bold text-fg">المنتجات المطلوب تفعيلها</h3>
        <ul className="flex flex-col gap-3">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="line-clamp-1 font-medium text-fg">{item.name}</p>
                <p className="tnum text-sm text-muted">
                  {formatPrice(item.priceCents)} × {item.qty} ·{" "}
                  {item.type === "digital" ? "اشتراك رقمي" : "ملموس"}
                </p>
              </div>
              <span className="tnum font-bold text-fg">
                {formatPrice(item.priceCents * item.qty)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-1.5 border-t border-line pt-4 text-sm">
          <div className="flex items-center justify-between text-muted">
            <span>المجموع الفرعي</span>
            <span className="tnum">{formatPrice(order.subtotalCents)}</span>
          </div>
          <div className="flex items-center justify-between text-muted">
            <span>الشحن</span>
            <span className="tnum">
              {order.shippingCents > 0 ? formatPrice(order.shippingCents) : "مجاني"}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1.5">
            <span className="font-semibold text-fg">الإجمالي</span>
            <span className="tnum text-lg font-extrabold text-fg">
              {formatPrice(order.totalCents || order.subtotalCents)}
            </span>
          </div>
        </div>
      </section>

      {/* العميل + الدفع */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <h3 className="mb-3 font-bold text-fg">بيانات العميل</h3>
          <ul className="space-y-1 text-sm text-muted">
            <li>
              الاسم: <span className="text-fg">{order.customerName}</span>
            </li>
            <li className="tnum">
              الموبايل: <span className="text-fg">{order.customerPhone}</span>
            </li>
            {order.customerEmail && (
              <li>
                الإيميل: <span className="text-fg">{order.customerEmail}</span>
              </li>
            )}
            {order.address && (
              <li>
                العنوان: <span className="text-fg">{order.address}</span>
              </li>
            )}
            <li>
              نوع الحساب:{" "}
              <span className="text-fg">
                {order.userId ? "عميل مسجّل" : "زائر"}
              </span>
            </li>
            {order.note && (
              <li>
                ملاحظات: <span className="text-fg">{order.note}</span>
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <h3 className="mb-3 font-bold text-fg">إثبات وسيلة الدفع</h3>
          <p className="text-sm text-muted">
            طريقة الدفع:{" "}
            <span className="text-fg">
              {order.paymentMethod === "cash" ? "كاش عند الاستلام" : "تحويل فودافون كاش / إنستاباي"}
            </span>
          </p>
          {order.paymentMethod === "transfer" && (
            <div className="mt-3">
              <p className="mb-2 text-sm text-muted">صورة إثبات التحويل المرفوعة:</p>
              {order.proofImage ? (
                <a href={order.proofImage} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={order.proofImage}
                    alt="إثبات الدفع"
                    className="max-h-64 rounded-xl border border-line transition-opacity hover:opacity-90"
                  />
                </a>
              ) : (
                <p className="text-sm text-red-300">لم يُرفع إثبات بعد.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
