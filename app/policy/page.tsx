import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `سياسة الضمان والاسترجاع والتسليم — ${site.name}`,
  description: "الشروط والسياسات الخاصة بالاسترجاع والتسليم الفوري عبر الواتساب والضمان الشامل.",
};

function Section({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-surface/80 backdrop-blur-md p-6 shadow-xl">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-black text-fg">
        <span>{icon}</span> {title}
      </h2>
      <div className="space-y-2.5 text-sm leading-7 text-muted font-medium">{children}</div>
    </section>
  );
}

export default function PolicyPage() {
  const { returns } = site;
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-brand-300">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-fg">سياسة الضمان والاسترجاع والتسليم</span>
      </nav>

      <h1 className="text-3xl font-black text-fg sm:text-4xl">
        سياسة الضمان والاسترجاع والتسليم
      </h1>
      <p className="mt-2 text-muted font-medium">
        جميع الاشتراكات رسمية 100% ومضمونة طوال مدة الباقة المفعلة.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <Section icon="🟢" title="التسليم والاستلام الفوري (عبر الواتساب حصراً)">
          <p>
            • جميع المنتجات في متجرنا هي <strong className="text-fg">منتجات رقمية واشتراكات ترفيهية حصرية</strong>.
          </p>
          <p>
            • بعد تأكيد عملية الدفع ومراجعة الإدارة لإثبات التحويل، يتم إرسال تفاصيل الاشتراك (اسم المستخدم، كلمة السر، ورقم الـ PIN) عبر <strong className="text-emerald-400 font-bold">الواتساب فقط 🟢</strong> فوراً.
          </p>
          <p>
            • لا يتم إرسال أي تفاصيل أو اشتراكات عبر البريد الإلكتروني؛ تواصل وتسليم جميع الخدمات يكون عبر الواتساب المباشر فقط.
          </p>
          <p>
            • لا توجد أي مصاريف شحن أو رسوم إضافية على الإطلاق.
          </p>
        </Section>

        <Section icon="💸" title="سياسة استرداد الأموال (الاسترجاع)">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 font-extrabold text-sm mb-2">
            ⚠️ تنبيه هام: لا يوجد استرداد للأموال بعد الدفع نهائياً وإطلاقاً تحت أي ظرف، إلا في حالة واحدة فقط وهي عدم توفر الاشتراك المطلوب لدينا.
          </div>
          <p>
            • يتم تأكيد وتسليم الباقات والاشتراكات فورياً، ولذلك فإن العملية نهائية بمجرد الدفع.
          </p>
          <p>
            • في حالة عدم توفر الاشتراك المطلوب في المخزون أو تعذر التفعيل من جانبنا، يتم رد كامل المبلغ المدفوع فوراً على نفس الوسيلة (فودافون كاش / إنستاباي Instapay).
          </p>
        </Section>

        <Section icon="🛡️" title="الضمان والاستبدال">
          <p>
            • نوفر <strong className="text-fg">ضماناً كاملاً طوال مدة الاشتراك</strong> ضد أي انقطاع أو تغيير في بيانات الحساب.
          </p>
          <p>
            • في حال واجهتك أي مشكلة في الحساب أثناء فترة الاشتراك، يتم <strong className="text-fg">حل المشكلة أو استبدال الحساب فوراً عبر الواتساب</strong> بدون أي تكلفة إضافية.
          </p>
        </Section>

        <Section icon="💬" title="الدعم الفني والتواصل">
          <p>
            فريق الدعم الفني متواجد لمساعدتك يومياً على{" "}
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-black text-emerald-400 hover:underline"
            >
              الواتساب الرسمي فقط 🟢
            </a>.
          </p>
          <p>
            تستطيع متابعة حالة طلبك في أي وقت من خلال{" "}
            <Link href="/track" className="font-semibold text-brand-300 hover:underline">
              صفحة تتبع الطلب
            </Link>.
          </p>
        </Section>
      </div>
    </div>
  );
}
