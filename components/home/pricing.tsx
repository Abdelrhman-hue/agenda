// components/landing/pricing.tsx
// Server Component: صفر JS، صفر صور
import Link from "next/link";
import { CircleCheck, Star } from "lucide-react";

const plans: {
  label: string;
  title: string;
  desc: string;
  price: string;
  unit: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}[] = [
  {
    label: "الخطة المجانية",
    title: "ابدأ مجانًا",
    desc: "مثالية للبدايات والطلبات والمدربين المستقلين جدًا.",
    price: "٠",
    unit: "ج.م / شهريًا للأبد",
    features: [
      "حتى ٣٠ حجز شهريًا",
      "صفحة حجز برابط شخصي مخصص",
      "تذكيرات واتساب يدوية بضغطة زر",
      "تحصيل العربون وإشعارات التأكيد",
    ],
    cta: "ابدأ مجانًا الآن",
    href: "/signup",
  },
  {
    label: "الخطة الأساسية",
    title: "النمو الاحترافي",
    desc: "للعيادات والمحترفين الراغبين في أتمتة كاملة للعربون والردود.",
    price: "٢٠٠",
    unit: "ج.م / شهريًا",
    features: [
      "حجوزات ومواعيد غير محدودة",
      "ربط آلي مع فودافون كاش وإنستاباي",
      "بوت واتساب الذكي للرد العامي وطلب التأكيد",
      "تذكيرات أوتوماتيكية قبل ٢٤ ساعة وساعتين",
      "مزامنة لحظية مع تقويم Google",
    ],
    cta: "ابدأ تجربة ١٤ يوم مجانًا",
    href: "/signup?plan=growth",
    featured: true,
  },
  {
    label: "الخطة المتقدمة",
    title: "الشركات والسناتر",
    desc: "لمراكز متعددة الفروع وفريق عمل كبير أو الإداري الكامل.",
    price: "٥٠٠",
    unit: "ج.م / شهريًا",
    features: [
      "كل مميزات الخطة الأساسية",
      "فريق عمل متعدد (أكثر من مقدم خدمة)",
      "ربط رسمي مع WhatsApp Business API",
      "تقارير مالية وتحليلات الذكاء الاصطناعي",
      "مدير حساب مخصص ودعم على الهاتف",
    ],
    cta: "تواصل مع المبيعات",
    href: "/contact",
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      dir="rtl"
      aria-labelledby="pricing-title"
      // تحت الـ fold: يتخطى الرسم لحد ما المستخدم يقرّب، والحجم المحجوز يمنع الـ CLS
      className="[contain-intrinsic-size:auto_620px] [content-visibility:auto]"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold text-brand">خطط شفافة ومناسبة</p>
          <h2
            id="pricing-title"
            className="mt-2 text-3xl leading-snug font-bold tracking-tight sm:text-4xl"
          >
            ابدأ بالطريقة المناسبة لحجم شغلك
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            بدون مصاريف خفية. ابدأ بتجربة مجانية واستمتع بجميع المزايا دون
            الحاجة لبطاقة بنكية.
          </p>
        </header>

        <ul className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {plans.map((p) => (
            <li
              key={p.title}
              className={p.featured ? "order-first lg:order-none lg:-my-3" : ""}
            >
              <article
                className={`relative flex h-full flex-col rounded-2xl bg-white p-6 ${
                  p.featured
                    ? "border-2 border-brand shadow-[0_20px_50px_-24px_rgba(13,110,85,0.35)] lg:py-8"
                    : "border border-border"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 end-5 inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-[10px] font-semibold text-white">
                    <Star className="size-3 fill-current" aria-hidden />
                    الأكثر شعبية في مصر
                  </span>
                )}

                <p className="text-[11px] font-semibold text-brand">{p.label}</p>
                <h3 className="mt-1 text-xl font-bold">{p.title}</h3>
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                  {p.desc}
                </p>

                <p className="mt-5 flex items-baseline gap-1.5">
                  <span
                    className={`text-4xl font-bold ${
                      p.featured ? "text-brand" : "text-foreground"
                    }`}
                  >
                    {p.price}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{p.unit}</span>
                </p>

                <ul className="mt-5 flex-1 space-y-2.5 border-t border-border pt-5">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-start gap-2 text-xs leading-5 ${
                        p.featured ? "font-medium text-foreground" : "text-foreground/80"
                      }`}
                    >
                      <CircleCheck
                        className="mt-0.5 size-3.5 shrink-0 text-brand"
                        aria-hidden
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={p.href}
                  className={`mt-6 inline-flex h-10 items-center justify-center rounded-lg text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    p.featured
                      ? "bg-brand text-white hover:bg-brand/90"
                      : "bg-[#e3ece8] text-foreground hover:bg-[#d8e4de]"
                  }`}
                >
                  {p.cta}
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}