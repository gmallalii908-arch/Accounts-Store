import Link from "next/link";
import type { Metadata } from "next";
import { getOrderByNumber } from "@/lib/orders";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { OrderStatusBadge, OrderTimeline } from "@/components/OrderStatus";
import PurchaseTracker from "@/components/PurchaseTracker";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ orderNumber: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { orderNumber } = await params;
  return { title: `الطلب ${decodeURIComponent(orderNumber)}` };
}

export default async function OrderPage({ params }: Params) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(decodeURIComponent(orderNumber));

  if (!order) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl border border-line bg-surface text-3xl">
          🔎
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-fg">
          مفيش طلب بالرقم ده
        </h1>
        <p className="mt-2 text-muted">اتأكد من رقم الطلب وجرّب تاني.</p>
        <Link
          href="/track"
          className="mt-6 rounded-xl bg-brand-gradient px-6 py-3 font-semibold text-white transition-opacity hover:opacity-95"
        >
          تتبّع طلب
        </Link>
      </div>
    );
  }

  const [user, settings] = await Promise.all([
    getCurrentUser(),
    getSettings(),
  ]);
  const isOwnerOrAdmin =
    (order.userId && user?.id === order.userId) || user?.role === "admin";
  const whatsappNumber = (settings.whatsapp_number || site.whatsapp).replace(/[^\d]/g, "");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* حدث Purchase للبكسلات — بيطلق مرة واحدة بعد إتمام الطلب مباشرة */}
      <PurchaseTracker
        orderNumber={order.orderNumber}
        valueEgp={(order.totalCents || order.subtotalCents) / 100}
      />

      {/* رأس التأكيد */}
      <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-6 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-500/15 text-3xl">
          ✅
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-fg">
          استلمنا طلبك، شكراً!
        </h1>
        <p className="mt-1 text-muted">
          رقم طلبك:{" "}
          <span className="tnum select-all font-bold text-brand-300">
            {order.orderNumber}
          </span>
        </p>
        <p className="mt-1 text-xs text-muted">
          احتفظ بالرقم ده عشان تتابع حالة طلبك في أي وقت.
        </p>
      </div>

      {/* الحالة */}
      <section className="mt-6 rounded-2xl border border-line bg-surface p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-bold text-fg">حالة الطلب</h2>
          <OrderStatusBadge status={order.status} />
        </div>
        <OrderTimeline status={order.status} />
      </section>

      {/* العناصر */}
      <section className="mt-6 rounded-2xl border border-line bg-surface p-6">
        <h2 className="mb-4 font-bold text-fg">المنتجات</h2>
        <ul className="flex flex-col gap-3">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="line-clamp-1 font-medium text-fg">{item.name}</p>
                <p className="tnum text-sm text-muted">
                  {formatPrice(item.priceCents)} × {item.qty}
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

      {/* الدفع والتوصيل */}
      <section className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="mb-3 font-bold text-fg">الدفع</h2>
          <p className="text-sm text-muted">
            الطريقة:{" "}
            <span className="text-fg">
              {order.paymentMethod === "cash" ? "كاش عند الاستلام" : "تحويل / محفظة"}
            </span>
          </p>
          {order.paymentMethod === "transfer" && order.proofImage && (
            <div className="mt-3">
              <p className="mb-2 text-sm text-muted">إثبات الدفع:</p>
              {isOwnerOrAdmin ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={order.proofImage}
                  alt="إثبات الدفع"
                  className="max-h-48 rounded-xl border border-line"
                />
              ) : (
                <p className="text-xs text-muted">تم رفع الإثبات ✓</p>
              )}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="mb-3 font-bold text-fg">بيانات المستلِم</h2>
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
          </ul>
        </div>
      </section>

      {/* حالة التفعيل وتسليم الواتساب بناءً على قبول الإدارة للطلب */}
      {order.status === "confirmed" || order.status === "delivered" ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center">
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 max-w-md shadow-lg">
            <p className="text-base font-black text-emerald-300">
              🎉 تم تأكيد وتفعيل الطلب من قِبَل الإدارة بنجاح!
            </p>
            <p className="text-xs text-emerald-200/80 mt-1">
              اضغط على الزر أدناه لاستلام بيانات الحساب ورقم الـ PIN الخاص بك فوراً على الواتساب.
            </p>
            {order.note && (
              <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/20 p-3 text-xs font-bold text-emerald-200">
                📝 ملاحظة الإدارة: {order.note}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`أهلاً، تم تأكيد طلبي رقم (${order.orderNumber}) وأريد استلام بيانات الحساب ورقم الـ PIN 🍿`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 font-black text-white shadow-xl shadow-emerald-600/30 transition-all hover:bg-emerald-700 hover:scale-105"
            >
              <span>🟢</span>
              <span>استلم الحساب والاشتراك على الواتساب فوراً</span>
            </a>
            <Link
              href="/#products"
              className="rounded-2xl border border-line bg-surface px-6 py-4 font-semibold text-fg transition-colors hover:bg-surface-2"
            >
              كمّل التسوّق
            </Link>
          </div>
        </div>
      ) : order.status === "cancelled" ? (
        <div className="mt-8 text-center">
          <div className="mx-auto rounded-2xl border border-red-500/30 bg-red-500/10 p-5 max-w-md">
            <p className="font-bold text-red-300">❌ تم إلغاء هذا الطلب</p>
            {order.note ? (
              <div className="mt-2.5 rounded-xl border border-red-500/30 bg-red-500/20 p-3 text-xs font-bold text-red-200">
                ⚠️ سبب الإلغاء: {order.note}
              </div>
            ) : (
              <p className="text-xs text-muted mt-1">
                لأي استفسار بخصوص هذا الطلب، يسعدنا تواصلك معنا عبر الواتساب.
              </p>
            )}
          </div>
        </div>
      ) : (
        /* الطلب قيد الانتظار لموافقة الإدارة */
        <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center">
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 max-w-lg shadow-lg">
            <div className="text-2xl mb-1">⏳</div>
            <p className="text-base font-extrabold text-amber-300">
              جاري مراجعة إثبات الدفع وتأكيد الطلب...
            </p>
            <p className="text-xs text-muted mt-1.5 leading-relaxed">
              بمجرد موافقة ومراجعة إدارة المتجر لإثبات التحويل، سيظهر لك هنا زر استلام بيانات الحساب والاشتراك على الواتساب فوراً!
            </p>
          </div>

          <Link
            href="/#products"
            className="mt-2 rounded-xl border border-line bg-surface px-6 py-3 font-semibold text-fg transition-colors hover:bg-surface-2"
          >
            تصفّح المزيد من الباقات
          </Link>
        </div>
      )}
    </div>
  );
}
