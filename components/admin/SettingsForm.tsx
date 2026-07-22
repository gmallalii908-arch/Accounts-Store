"use client";

import { useActionState, useState } from "react";
import {
  saveSettingsAction,
  type SettingsFormState,
} from "@/app/actions/settings";

type Props = {
  settings: Record<string, string>;
  pixelStates: {
    meta: boolean;
    tiktok: boolean;
    ga: boolean;
    snap: boolean;
    bump: boolean;
  };
  products: { id: string; name: string; priceLabel: string }[];
};

const initial: SettingsFormState = {};

export default function SettingsForm({ settings, pixelStates, products }: Props) {
  const [state, formAction, isPending] = useActionState(saveSettingsAction, initial);
  const [bumpOn, setBumpOn] = useState(pixelStates.bump);

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {/* ═══ 1. الواتساب والتسليم المباشر ═══ */}
      <section className="rounded-3xl border border-emerald-500/30 bg-surface/90 backdrop-blur-xl p-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-5">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400 text-xl font-bold">
            🟢
          </div>
          <div>
            <h3 className="text-lg font-black text-fg">تسليم الاشتراكات عبر الواتساب (WhatsApp Direct)</h3>
            <p className="text-xs text-muted">
              رقم الواتساب الرسمي الذي سيتواصل عليه العميل فوراً لاستلام بيانات الحساب والـ PIN بعد تأكيد الطلب.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <label className="block text-sm font-black text-fg mb-1">
            رقم الواتساب الرسمي لاستلام الحسابات (WhatsApp Number)
          </label>
          <input
            type="text"
            name="whatsapp_number"
            defaultValue={settings.whatsapp_number || "201000000000"}
            placeholder="مثال: 201000000000 أو 01000000000"
            dir="ltr"
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm font-bold text-fg placeholder:text-muted/50 focus:border-emerald-500 focus:outline-none"
          />
          <p className="mt-2 text-xs text-emerald-300 font-medium">
            💡 هذا هو الرقم الذي ينتقل إليه العميل بضغطة واحدة فور موافقتك وتأكيدك للطلب.
          </p>
        </div>
      </section>

      {/* ═══ 2. البكسلات والتتبّع ═══ */}
      <section className="rounded-3xl border border-line bg-surface/90 backdrop-blur-xl p-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-5">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/10 text-purple-400 text-xl font-bold">
            📡
          </div>
          <div>
            <h3 className="text-lg font-black text-fg">البكسلات وتتبع الإعلانات (Pixel Tracking)</h3>
            <p className="text-xs text-muted">
              حسابات فيسبوك، تيك توك، جوجل، وسناب شات لتسجيل أحداث الشراء تلقائياً.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PixelRow
            label="Meta Pixel (فيسبوك/إنستجرام)"
            icon="🔵"
            name="meta_pixel_enabled"
            idName="meta_pixel_id"
            defaultEnabled={pixelStates.meta}
            defaultId={settings.meta_pixel_id}
            placeholder="مثال: 123456789012345"
            hint="Events Manager → Pixel ID"
          />
          <PixelRow
            label="TikTok Pixel"
            icon="⬛"
            name="tiktok_pixel_enabled"
            idName="tiktok_pixel_id"
            defaultEnabled={pixelStates.tiktok}
            defaultId={settings.tiktok_pixel_id}
            placeholder="مثال: CABC123DEF456"
            hint="TikTok Ads Manager → Web Events"
          />
          <PixelRow
            label="Google Analytics 4"
            icon="🟡"
            name="ga_enabled"
            idName="ga_measurement_id"
            defaultEnabled={pixelStates.ga}
            defaultId={settings.ga_measurement_id}
            placeholder="مثال: G-XXXXXXXXXX"
            hint="GA4 Data Stream Measurement ID"
          />
          <PixelRow
            label="Snap Pixel"
            icon="🟨"
            name="snap_pixel_enabled"
            idName="snap_pixel_id"
            defaultEnabled={pixelStates.snap}
            defaultId={settings.snap_pixel_id}
            placeholder="مثال: 1a2b3c4d-5e6f-..."
            hint="Snapchat Ads Manager"
          />
        </div>
      </section>

      {/* ═══ 3. العرض الإضافي ═══ */}
      <section
        className={`rounded-3xl border p-6 transition-all shadow-xl ${
          bumpOn ? "border-emerald-500/40 bg-emerald-500/5" : "border-line bg-surface/90 backdrop-blur-xl"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400 text-xl font-bold">
              🎁
            </div>
            <div>
              <h3 className="text-lg font-black text-fg">العرض الإضافي (Order Bump Offer)</h3>
              <p className="text-xs text-muted">منتج مغري يظهر في صفحة الشيك أوت لزيادة المبيعات.</p>
            </div>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              name="bump_enabled"
              defaultChecked={pixelStates.bump}
              onChange={(e) => setBumpOn(e.target.checked)}
              className="peer sr-only"
            />
            <span className="h-6 w-11 rounded-full bg-surface-2 transition-colors peer-checked:bg-emerald-600 after:absolute after:top-0.5 after:right-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:-translate-x-5" />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-fg">المنتج المعروض</label>
            <select
              name="bump_product_id"
              defaultValue={settings.bump_product_id}
              className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-fg focus:border-emerald-500 focus:outline-none"
            >
              <option value="">— اختار منتج —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.priceLabel})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-fg">
              سعر العرض الخاص (جنيه)
            </label>
            <input
              type="text"
              name="bump_price"
              defaultValue={settings.bump_price}
              placeholder="مثال: 99 (اتركها فاضية للسعر العادي)"
              dir="ltr"
              className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-fg">عنوان العرض</label>
            <input
              type="text"
              name="bump_headline"
              defaultValue={settings.bump_headline}
              placeholder="مثال: ⚡ أضف اشتراك يوتيوب بريميم بنصف السعر للطلب ده بس"
              className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-fg">الوصف المختصر</label>
            <input
              type="text"
              name="bump_desc"
              defaultValue={settings.bump_desc}
              placeholder="وصف مشجع يوضح فائدة إضافة المنتج"
              className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* ═══ حالة الحفظ والزر ═══ */}
      {state.error && (
        <p className="rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-300">
          ❌ {state.error}
        </p>
      )}
      {state.ok && !state.error && (
        <p className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-bold text-emerald-300">
          ✅ تم حفظ التغييرات والإعدادات بنجاح وشغّالة على المتجر فوراً.
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 px-10 py-4 font-black text-white shadow-xl shadow-red-600/30 transition-all duration-300 hover:scale-105 hover:shadow-red-600/50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "جارٍ الحفظ…" : "حفظ كل الإعدادات 💾"}
      </button>
    </form>
  );
}

function PixelRow({
  label,
  icon,
  name,
  idName,
  defaultEnabled,
  defaultId,
  placeholder,
  hint,
}: {
  label: string;
  icon: string;
  name: string;
  idName: string;
  defaultEnabled: boolean;
  defaultId: string;
  placeholder: string;
  hint: string;
}) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${
        enabled ? "border-purple-500/40 bg-purple-500/5" : "border-line bg-bg/60"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-bold text-fg text-xs">
          <span aria-hidden="true">{icon}</span> {label}
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            name={name}
            defaultChecked={defaultEnabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="peer sr-only"
          />
          <span className="h-5 w-9 rounded-full bg-surface-2 transition-colors peer-checked:bg-purple-600 after:absolute after:top-0.5 after:right-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:-translate-x-4" />
        </label>
      </div>
      <input
        type="text"
        name={idName}
        defaultValue={defaultId}
        placeholder={placeholder}
        dir="ltr"
        className="mt-3 w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs text-fg placeholder:text-muted/50 focus:border-purple-500 focus:outline-none"
      />
      <p className="mt-1.5 text-[11px] text-muted">{hint}</p>
    </div>
  );
}
