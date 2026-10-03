// components/landing/cta.tsx
// Server Component: صفر JS، صفر صور (الخلفية gradient بـ CSS)
import Link from "next/link";
import { ArrowLeft, CircleCheck, Headset, Star, Zap, type LucideIcon } from "lucide-react";

const perks: { label: string; Icon: LucideIcon }[] = [
  { label: "إعداد سريع في أقل من دقيقتين", Icon: Zap },
  { label: "إلغاء الاشتراك في أي وقت بدون قيود", Icon: CircleCheck },
  { label: "فريق دعم مصري متاح ٢٤/٧", Icon: Headset },
];

export function Cta() {
  return (
    <section
      id="get-started"
      dir="rtl"
      aria-labelledby="cta-title"
      // تحت الـ fold: يتخطى الرسم لحد ما المستخدم يقرّب، والحجم المحجوز يمنع الـ CLS
      className="bg-[radial-gradient(55%_70%_at_18%_105%,#2c8a68_0%,transparent_70%),linear-gradient(180deg,#0a5a45_0%,#0c6350_100%)] text-white [contain-intrinsic-size:auto_460px] [content-visibility:auto]"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-16 text-center sm:px-8 lg:py-20">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-medium text-[#c9f2e0]">
          <Star className="size-3 fill-[#fbc94a] text-[#fbc94a]" aria-hidden />
          ابدأ اليوم مجانًا خلال دقيقتين فقط
        </span>

        <h2
          id="cta-title"
          className="mt-6 text-3xl leading-[1.45] font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]"
        >
          جاهز تخلي مواعيدك أسهل وعربوناتك مضمونة بدون وجع دماغ؟
        </h2>

        <p className="mt-5 max-w-xl text-sm leading-7 text-white/70">
          انضم لأكثر من ١٬٨٠٠ طبيب ومدرب ومعالج ومقدم خدمة في مصر ووفّر أكثر من
          ١٥ ساعة أسبوعيًا كانت تضيع في المكالمات ورسائل الحجز اليدوية.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#fbc94a] px-6 text-sm font-bold text-[#1f2a24] transition-colors hover:bg-[#f7bd2c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            ابدأ مجانًا الآن — بدون بطاقة بنكية
            <ArrowLeft className="size-4" aria-hidden />
          </Link>
          <Link
            href="/demo"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Headset className="size-4" aria-hidden />
            احجز عرضًا توضيحيًا مباشرًا
          </Link>
        </div>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {perks.map(({ label, Icon }) => (
            <li
              key={label}
              className="flex items-center gap-1.5 text-[11px] text-white/65"
            >
              <Icon className="size-3.5" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}