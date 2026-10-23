// components/landing/faq.tsx
// Server Component. الأكورديون بـ <details> الأصلي => صفر JS، INP ممتاز، وبيشتغل بالكيبورد وقارئ الشاشة
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "هل أحتاج إلى سجل تجاري أو بطاقة ضريبية للبدء؟",
    a: "لا. تقدر تنشئ حسابك وتبدأ استقبال الحجوزات فورًا بدون أي أوراق رسمية. كل اللي محتاجه رقم موبايلك ومحفظتك الإلكترونية لاستلام العربون.",
  },
  {
    q: "كيف يتم تحصيل العربون عبر فودافون كاش وإنستاباي؟",
    a: "بتربط رقم محفظتك أو حساب إنستاباي في إعدادات الحساب مرة واحدة. العميل يحوّل قيمة العربون وقت الحجز، والموعد بيتأكد تلقائيًا، والمبلغ بيوصل مباشرة لمحفظتك.",
  },
  {
    q: "هل يفهم المساعد الذكي اللهجة العامية والرسائل الصوتية في مصر؟",
    a: "أيوه. المساعد مدرب على اللهجة المصرية ويفهم الرسائل النصية والصوتية على واتساب، ويرد على الاستفسارات ويعرض المواعيد المتاحة ويكمل الحجز.",
  },
  {
    q: "كيف يتصرف النظام إذا أراد العميل إلغاء موعده أو تعديله؟",
    a: "العميل يقدر يؤكد أو يعدل أو يلغي من نفس رسالة التذكير. لو اعتذر، الموعد بيتفتح تلقائيًا لغيره، وبتطبق سياسة العربون اللي إنت حددتها.",
  },
  {
    q: "هل يمكنني ربط أجندة مع تقويم Google على هاتفي الشخصي؟",
    a: "أيوه. أي موعد جديد بيظهر في تقويمك تلقائيًا، وأي وقت مشغول في تقويمك بيتحجب من صفحة الحجز، عشان تتجنب الحجز المزدوج.",
  },
  {
    q: "ما الذي يحتاجه عميلي ليحجز موعدًا؟ هل يتطلب تطبيقًا؟",
    a: "لا يحتاج تطبيقًا ولا تسجيل حساب. يفتح رابط الحجز من موبايله، يختار الخدمة والوقت، ويدفع العربون، وتوصله رسالة التأكيد على واتساب.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export function Faq() {
  return (
    <section
      id="faq"
      dir="rtl"
      aria-labelledby="faq-title"
      // تحت الـ fold: يتخطى الرسم لحد ما المستخدم يقرّب، والحجم المحجوز يمنع الـ CLS
      className="[contain-intrinsic-size:auto_560px] [content-visibility:auto]"
    >
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-20">
        <header className="text-center">
          <p className="text-xs font-semibold text-brand">إجابات واضحة</p>
          <h2
            id="faq-title"
            className="mt-2 text-3xl leading-snug font-bold tracking-tight sm:text-4xl"
          >
            الأسئلة الأكثر شيوعًا
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            كل ما تحتاج معرفته عن بدء استخدام أجندة في مصر بدون أي التزامات.
          </p>
        </header>

        <div className="mt-10 space-y-3">
          {faqs.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-xl border border-brand/10 bg-brand-soft/60 px-4 open:bg-brand-soft"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl py-3.5 text-xs font-bold marker:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
                {q}
                <ChevronDown
                  className="size-4 shrink-0 text-brand transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="pb-4 text-xs leading-6 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}