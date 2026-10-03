// components/landing/steps.tsx
// Server Component: صفر JS على العميل، أيقونات SVG مدمجة، بدون صور
import {
  CircleCheck,
  Copy,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

type Tone = "brand" | "gold";

const tones: Record<Tone, { num: string; badge: string }> = {
  brand: { num: "bg-brand", badge: "bg-[#d3f3e6] text-brand" },
  gold: { num: "bg-gold", badge: "bg-gold-soft text-gold" },
};

const steps: {
  n: string;
  title: string;
  text: string;
  badge: string;
  tone: Tone;
  Icon: LucideIcon;
  footer: React.ReactNode;
}[] = [
  {
    n: "01",
    title: "أنشئ صفحتك المخصصة",
    text: "حدد ساعات عملك وأيام إجازتك، أضف خدماتك ومدتها وسعرها، وضع قيمة العربون الذي تفضله ووسائل استقباله.",
    badge: "أقل من دقيقتين",
    tone: "brand",
    Icon: SlidersHorizontal,
    footer: "تحديد الشفتات ومواعيد الاستراحة بسهولة",
  },
  {
    n: "02",
    title: "شارك رابط الحجز",
    text: "ضع الرابط الخاص بك في بايو إنستجرام، فيسبوك، أو رسالة الرد التلقائي على واتساب بزنس، أو أرسله لعملائك مباشرة.",
    badge: "بلمسة واحدة",
    tone: "gold",
    Icon: Copy,
    footer: (
      <>
        رابط أنيق وسهل:{" "}
        <bdi dir="ltr" className="font-semibold text-foreground">
          agendah.me/dr-sherif
        </bdi>
      </>
    ),
  },
  {
    n: "03",
    title: "أجندة تدير الباقي بدقة",
    text: "العميل يختار الموعد، يدفع العربون، يستلم رسالة التأكيد على واتساب، والمنظومة تذكّره قبل الموعد دون أي تدخل منك.",
    badge: "أوتوماتيك ١٠٠٪",
    tone: "brand",
    Icon: CircleCheck,
    footer: "جدولك معتمد وعربونك محفوظ بأمان",
  },
];

export function Steps() {
  return (
    <section
      id="how-it-works"
      dir="rtl"
      aria-labelledby="steps-title"
      // تحت الـ fold: يتخطى الرسم لحد ما المستخدم يقرّب، والحجم المحجوز يمنع الـ CLS
      className="[contain-intrinsic-size:auto_480px] [content-visibility:auto]"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold text-brand">بساطة مطلقة</p>
          <h2
            id="steps-title"
            className="mt-2 text-3xl leading-snug font-bold tracking-tight sm:text-4xl"
          >
            من أول حجز لحد التأكيد – كل حاجة أسهل
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            ثلاث خطوات سريعة تفصلك عن أتمتة مواعيدك بالكامل، دون الحاجة لأي خبرة
            تقنية سابقة.
          </p>
        </header>

        <ol className="mt-12 grid gap-4 lg:grid-cols-3">
          {steps.map(({ n, title, text, badge, tone, Icon, footer }) => (
            <li key={n}>
              <article className="flex h-full flex-col rounded-2xl border border-brand/10 bg-brand-soft/60 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`grid size-10 place-items-center rounded-lg text-base font-bold text-white ${tones[tone].num}`}
                  >
                    {n}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${tones[tone].badge}`}
                  >
                    {badge}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold">{title}</h3>
                <p className="mt-2 flex-1 text-xs leading-6 text-muted-foreground">
                  {text}
                </p>
                <p className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-[11px] text-muted-foreground">
                  <Icon className="size-3.5 shrink-0 text-brand" aria-hidden />
                  <span className="min-w-0 truncate">{footer}</span>
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
