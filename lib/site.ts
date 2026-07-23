// إعدادات المتجر العامة — Accounts Store
export const site = {
  name: "Accounts Store",
  nameSuffix: "Egypt 🇪🇬",
  tagline: "منصتك الأولى لاشتراكات الترفيه والأفلام والمسلسلات في مصر",
  description:
    "نوفر لك بروفايل خاص بك داخل حسابات ترفيهية رسمية بأعلى جودة لمشاهدة ممتعة وبأقل سعر في مصر 🤍",
  // روابط تُستخدم في الهيدر والفوتر
  nav: [
    { label: "الاشتراكات والباقات", href: "/#products" },
    { label: "الأسئلة الشائعة", href: "/#faq" },
    { label: "تتبّع طلبك", href: "/track" },
    { label: "الضمان والسياسة", href: "/policy" },
  ],
  whatsapp: "201508997357",
  // بيانات الدفع بالتحويل في مصر (فودافون كاش / إنستاباي Instapay)
  payment: {
    walletNumber: "01508997357",
    walletName: "Accounts Store",
    bankAccount: "01508997357",
    instapay: "01508997357",
    note: "بعد التحويل الفوري ارفع لقطة الشاشة/الإيصال وسيصلك تفعيل الحساب فوراً عبر الواتساب حصراً.",
  },
  // تسليم رقمي مجاني وفوري في مصر
  shipping: {
    flatCents: 0,
    freeAboveCents: 0,
    etaText: "تسليم وتفعيل فوري خلال 10 دقائق عبر الواتساب فقط 🟢",
  },
  // الضمان والاستبدال
  returns: {
    windowDays: 30,
    refundDays: 1,
  },
} as const;

/** حساب تكلفة الشحن بالقروش — صفر دائماً للمنتجات الرقمية */
export function shippingCostCents(
  _subtotalCents: number,
  _hasPhysical: boolean
): number {
  return 0;
}
