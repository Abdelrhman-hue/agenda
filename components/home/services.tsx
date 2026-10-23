// components/landing/services.tsx
// Server Component: صفر JS على العميل، أيقونات SVG مدمجة، بدون صور
import Link from "next/link";
import {
  ArrowLeft,
  Aperture,
  BriefcaseMedical,
  Dumbbell,
  GraduationCap,
  HeartHandshake,
  Scissors,
  type LucideIcon,
} from "lucide-react";

type Tone = "brand" | "gold";

const tones: Record<Tone, { icon: string; link: string }> = {
  brand: { icon: "bg-[#9bf0d4] text-brand", link: "text-brand" },
  gold: { icon: "bg-gold-soft text-gold", link: "text-gold" },
};

const services: {
  title: string;
  text: string;
  link: string;
  href: string;
  tone: Tone;
  Icon: LucideIcon;
}[] = [
  {
    title: "طبيب وعيادة",
    text: "تنظيم كشوفات واستشارات العيادة، تقليل وقت الانتظار في الصالة، وتحصيل رسوم الحجز مسبقًا لمنع التخلف عن الحضور.",
    link: "تخصيص الكشوفات والكود الطبي",
    href: "/solutions/clinics",
    tone: "brand",
    Icon: BriefcaseMedical,
  },
  {
    title: "مدرس وسنتر تعليمي",
    text: "إدارة مجموعات الدروس الخصوصية والحصص الفردية، توزيع مقاعد الستات، وإرسال تذكيرات أوتوماتيكية للأولياء الأمور والطلاب.",
    link: "إدارة مقاعد المجموعات",
    href: "/solutions/education",
    tone: "gold",
    Icon: GraduationCap,
  },
  {
    title: "مدرب وجيم",
    text: "حجز جلسات التدريب الخاص (PT)، جدولة حصص الفيتنس والكروس فيت، وتأكيد الحضور عبر دفع الاشتراكات أو العربون بضغطة واحدة.",
    link: "جدولة الجلسات الفردية",
    href: "/solutions/fitness",
    tone: "brand",
    Icon: Dumbbell,
  },
  {
    title: "معالج واستشاري",
    text: "جلسات الاستشارة النفسية والأسرية والمهنية سواء بالحضور أو عبر زووم، مع خصوصية تامة وحجز سري ومباشر.",
    link: "روابط اجتماعات سريعة وآمنة",
    href: "/solutions/therapy",
    tone: "brand",
    Icon: HeartHandshake,
  },
  {
    title: "صالون وسبا",
    text: "جدولة مواعيد الميك أب والشعر والعناية بالبشرة، توزيع المواعيد بدقة على أفراد الفريق، ومنع عدم تضارب أوقات المراكز.",
    link: "توزيع الحجوزات على الفنيين",
    href: "/solutions/salons",
    tone: "gold",
    Icon: Scissors,
  },
  {
    title: "مستقل ومستشار حر ومصور",
    text: "جلسات التصوير الخارجي والاستوديوهات وخدمات الأعمال بالساعة، مع حجز اليوم المفضل وتثبيته فور دفع العربون بالمحفظة.",
    link: "حجز السيشنات والعقود",
    href: "/solutions/freelancers",
    tone: "brand",
    Icon: Aperture,
  },
];

export function Services() {
  return (
    <section
      id="services"
      dir="rtl"
      aria-labelledby="services-title"
      // القسم تحت الـ fold: المتصفح يتخطى الرسم لحد ما يقرّب، والحجم المحجوز يمنع الـ CLS
      className="[contain-intrinsic-size:auto_820px] [content-visibility:auto]"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold text-gold">منظومة مخصصة</p>
          <h2
            id="services-title"
            className="mt-2 text-3xl leading-snug font-bold tracking-tight sm:text-4xl"
          >
            مصممة خصيصًا لأصحاب الخدمات في مصر
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            مهما كان تخصصك، أجندة تم تصميمها بدقة لتلائم أسلوب عملك، وتمنع تداخل
            المواعيد وتضمن التزام العميل بدفع العربون مسبقًا.
          </p>
        </header>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ title, text, link, href, tone, Icon }) => (
            <li key={title}>
              <article className="flex h-full flex-col rounded-2xl border border-brand/10 bg-brand-soft/60 p-6">
                <span
                  className={`grid size-10 place-items-center rounded-xl ${tones[tone].icon}`}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-bold">{title}</h3>
                <p className="mt-2 flex-1 text-xs leading-6 text-muted-foreground">
                  {text}
                </p>
                <Link
                  href={href}
                  className={`group mt-5 inline-flex w-fit items-center gap-1 rounded-sm text-[11px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${tones[tone].link}`}
                >
                  {link}
                  <ArrowLeft
                    className="size-3 transition-transform group-hover:-translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}