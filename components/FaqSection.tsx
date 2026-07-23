"use client";

import { useState } from "react";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category?: string;
};

const faqs: FaqItem[] = [
  {
    id: "1",
    question: "كيف يتم تسليم الطلب بعد الشراء؟",
    answer:
      "يتم تسليم الطلبات عبر رسالة واتساب على الرقم الذي استخدمته في تسجيل الدخول. قد يكون التسليم في صورة كود جاهز أو رابط أو بيانات حساب أو تجهيز مخصص حسب نوع المنتج.",
    category: "التسليم والتفعيل",
  },
  {
    id: "2",
    question: "ما طرق الدفع المتاحة داخل المتجر؟",
    answer:
      "يمكنك الدفع عبر فودافون كاش أو إنستاباي فقط. بعد التحويل ستقوم برفع رقم الجهة المحول منها وصورة التحويل ليتم مراجعة الدفع واعتتماد الطلب.",
    category: "الدفع والتحويل",
  },
  {
    id: "3",
    question: "هل يمكن استرجاع الأموال بعد الدفع؟",
    answer:
      "لا يمكن طلب استرجاع أو إلغاء بعد بدء تجهيز الطلب. الاستثناء الوحيد هو عدم توفر الخدمة أو تعذر تجهيز الطلب من جانبنا، وفي هذه الحالة يتم التواصل معك لاسترداد المبلغ.",
    category: "الاسترجاع والضمان",
  },
  {
    id: "4",
    question: "ما المدة المتوقعة لتجهيز الطلب؟",
    answer:
      "مدة التجهيز المتوقعة من 10 دقائق حتى 48 ساعة كحد أقصى حسب نوع المنتج وتوفر الكمية وضغط العمل. بعض المنتجات يتم تسليمها بسرعة فور اعتماد الدفع، وبعضها يحتاج تدخل مخصص.",
    category: "التسليم والتفعيل",
  },
  {
    id: "5",
    question: "هل أحتاج لإرسال كلمة المرور أو البريد الإلكتروني دائماً؟",
    answer:
      "لا. بعض الخدمات تعتمد على أكواد أو روابط جاهزة ولا تحتاج أي بيانات إضافية، بينما منتجات التفعيل على حساب العميل فقط هي التي قد تطلب بيانات مخصصة مثل Player ID أو بيانات دخول يحددها المنتج داخل صفحة الشراء.",
    category: "الأمان والحسابات",
  },
  {
    id: "6",
    question: "هل جميع الاشتراكات مضمونة خارج مصر؟",
    answer:
      "الضمان الأساسي للخدمات المعروضة في المتجر موجهة للاستخدام داخل جمهورية مصر العربية. إذا كنت خارج مصر يفضل التواصل مع الدعم أولاً للتأكد من توافق الخدمة مع بلدك وطريقة الاستخدام.",
    category: "الاسترجاع والضمان",
  },
  {
    id: "7",
    question: "كم يستغرق الرد على الشكاوى وحلها؟",
    answer:
      "نحرص على حل أي عقبة تواجهك بأسرع وقت ممكن، وتعتمد المدة على نوع المشكلة:\n• المشاكل المباشرة: يتم حلها من قبل فريق الدعم لدينا خلال 48 ساعة كحد أقصى.\n• المشاكل المتقدمة: في حال استدعى الأمر التواصل مع مزود الخدمة الأساسي (الطرف الثالث) لمعالجة مشكلة في الاشتراك، قد تمتد المدة حتى 14 يوماً وربما أكثر. كن واثقاً أننا نتابع طلبك معهم باستمرار وسنبقيك على اطلاع دائم بحالة تذكرتك.",
    category: "الدعم والشكاوى",
  },
  {
    id: "8",
    question: "من المسؤول عن حل المشاكل التقنية في الخدمة التي اشتريتها؟",
    answer:
      "• مسؤوليتنا: على سبيل المثال كل ما يخص حالة الطلب، تسليم التفعيل، استرجاع الحسابات في حال تعطل الاشتراك نفسه، والمتابعة الإدارية.\n• مسؤولية مزود الخدمة الأصلي: جودة الخدمة الداخلية، طريقة عمل المميزات، انقطاعات الخدمات، والأعطال البرمجية داخل التطبيقات. نحن لا نقدم الدعم الفني لهذه الجوانب نيابة عن المزود، ويُفضل التواصل مع قنوات الدعم الرسمية الخاصة بهم لحلها.",
    category: "الدعم والشكاوى",
  },
  {
    id: "9",
    question: "ما هو الضمان المقدم على الاشتراكات؟",
    answer:
      "نحن نضمن لك عمل الاشتراك واستقراره طوال المدة المتفق عليها. في حال تعطل الاشتراك لسبب من طرفنا، نلتزم بحل المشكلة، أو تعويضك، أو توفير بديل مناسب يضمن حقك بالكامل.",
    category: "الاسترجاع والضمان",
  },
  {
    id: "10",
    question: "هل يمكنني استرجاع أموالي إذا غيرت رأيي؟",
    answer:
      "نظراً لطبيعة المنتجات الرقمية، لا يمكن استرجاع المبلغ أو إلغاء الطلب. الاسترجاع يكون متاحاً فقط في حال فشلنا في توفير الخدمة التي قمت بطلبها.",
    category: "الاسترجاع والضمان",
  },
  {
    id: "11",
    question: "هل هذه الاشتراكات رسمية وآمنة على حسابي الشخصي؟",
    answer:
      "بكل تأكيد. نحن نتعامل فقط من خلال الطرق الرسمية والآمنة لتوفير الخدمات. إذا كان التفعيل يتم على حسابك الشخصي، فإننا نضمن لك أمان حسابك بنسبة 100% ولا نستخدم أي طرق ملتوية قد تعرضه للخطر.",
    category: "الأمان والحسابات",
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filteredFaqs = faqs.filter(
    (item) =>
      item.question.includes(searchQuery) ||
      item.answer.includes(searchQuery) ||
      (item.category && item.category.includes(searchQuery))
  );

  return (
    <section id="faq" className="scroll-mt-20 bg-bg py-16 relative">
      {/* خلفية جمالية مدمجة */}
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]" />

      <div className="mx-auto max-w-4xl px-4 relative z-10">
        {/* العناوين الرئيسية */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-bold text-red-400">
            <span>❓</span> إجابات لكل تساؤلاتك
          </span>
          <h2 className="mt-3 text-2xl font-black text-fg sm:text-4xl">
            الأسئلة الشائعة والأجوبة
          </h2>
          <p className="mt-2 text-sm text-muted max-w-lg mx-auto font-medium">
            كل ما تحتاجه لمعرفته حول طريقة الشراء، التسليم، الضمان وطرق الدفع في Accounts Store
          </p>

          {/* مربع البحث السريع */}
          <div className="mt-6 max-w-md mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن سؤالك هنا..."
              className="w-full rounded-2xl border border-white/10 bg-surface/90 backdrop-blur-md px-4 py-3 pr-10 text-sm font-semibold text-fg placeholder:text-muted/60 focus:border-red-500 focus:outline-none transition-all shadow-lg"
            />
            <span className="absolute right-3.5 top-3.5 text-muted text-base">🔍</span>
          </div>
        </div>

        {/* قائمة الأسئلة بالأكورديون الناعم */}
        <div className="flex flex-col gap-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-red-500/50 bg-surface/90 shadow-[0_8px_30px_-5px_rgba(229,9,20,0.15)]"
                    : "border-white/10 bg-surface/60 hover:border-white/20 hover:bg-surface/80"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-right font-bold text-fg transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/5 text-sm transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-red-500/20 text-red-400" : "text-muted"
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-white/5 px-5 pb-5 pt-3 text-sm font-medium leading-relaxed text-muted whitespace-pre-line animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-surface/50 p-8 text-center text-muted">
              لم نجد نتائج مطابقة لمبحثك. تواصل معنا على الواتساب لمساعدتك فوراً! 🟢
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
