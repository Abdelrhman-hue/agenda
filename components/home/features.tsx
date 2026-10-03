// components/landing/features.tsx
// Server Component: صفر JS على العميل، أيقونات SVG مدمجة، بدون صور
import {
  Banknote,
  Bell,
  Bot,
  CalendarCheck,
  Link2,
  Mic,
  RefreshCw,
  Share2,
  Smartphone,
  TrendingDown,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";

type Tone = "brand" | "gold" | "neutral";

const tones: Record<Tone, { icon: string; badge: string; note: string }> = {
  brand: {
    icon: "bg-[#d3f3e6] text-brand",
    badge: "bg-brand-soft text-brand",
    note: "text-brand",
  },
  gold: {
    icon: "bg-gold-soft text-gold",
    badge: "bg-gold-soft text-gold",
    note: "text-gold",
  },
  neutral: {
    icon: "bg-muted text-foreground/70",
    badge: "bg-muted text-foreground/70",
    note: "text-gold",
  },
};

const features: {
  title: string;
  text: string;
  badge: string;
  note: string;
  tone: Tone;
  Icon: LucideIcon;
  NoteIcon: LucideIcon;
}[] = [
  {
    title: "حجز أونلاين ٢٤/٧",
    text: "صفحة حجز سريعة وبشعارك وألوانك، يدخل عميلك ويختار التاريخ والساعة المتاحة من هاتفه في ثوانٍ، دون اتصال أو انتظار.",
    badge: "صفحة احترافية",
    note: "تعمل بكفاءة عبر الموبايل بدون تحميل تطبيق",
    tone: "neutral",
    Icon: CalendarCheck,
    NoteIcon: Zap,
  },
  {
    title: "تحصيل العربون مسبقًا",
    text: "اربط محفظتك فودافون كاش، إنستاباي، أو فوري، ولا يُحجز الموعد إلا بعد تحويل العربون المطلوب وتأكيده فورًا.",
    badge: "ضمان الجدية",
    note: "أموالك تصل مباشرة إلى محفظتك أو حسابك",
    tone: "gold",
    Icon: Banknote,
    NoteIcon: Wallet,
  },
  {
    title: "مساعد ذكي عبر واتساب",
    text: "يفهم اللغة العامية المصرية والرسائل الصوتية والنصية، يرد على استفسارات الأسعار والمواعيد المتاحة ويحجز لعملائك مباشرة.",
    badge: "ذكاء اصطناعي",
    note: "يدعم الفويس نوت بكفاءة عالية",
    tone: "brand",
    Icon: Bot,
    NoteIcon: Mic,
  },
  {
    title: "تذكيرات تمنع النسيان",
    text: "رسائل تنبيه قبل ٢٤ ساعة وساعتين عبر واتساب مرفقة بلوكيشن العيادة أو العنوان، لتأكيد الحضور أو الاعتذار المبكر.",
    badge: "تأكيد تلقائي",
    note: "تخفيض نسبة الغياب المفاجئ بأكثر من ٤٠٪",
    tone: "brand",
    Icon: Bell,
    NoteIcon: TrendingDown,
  },
  {
    title: "ربط تقويم Google و Apple",
    text: "أي موعد جديد تضيفه يظهر تلقائيًا في تقويم هاتفك، وأي موعد في هاتفك يُحجب في صفحة الحجز، مما يمنع الحجز المزدوج أو التضارب.",
    badge: "مزامنة تلقائية",
    note: "تحديث فوري دون أي تأخير زمني",
    tone: "neutral",
    Icon: RefreshCw,
    NoteIcon: Zap,
  },
  {
    title: "روابط حجز مخصصة لكل خدمة",
    text: "رابط عام لكل خدماتك لصفحة إنستجرام أو بايو تيك توك، وروابط منفصلة لكل خدمة أو عرض خاص ترسله لعميل بعينه.",
    badge: "روابط ذكية",
    note: "مشاركة سهلة عبر جميع المنصات",
    tone: "gold",
    Icon: Link2,
    NoteIcon: Share2,
  },
];

export function Features() {
  return (
    <section
      id="features"
      dir="rtl"
      aria-labelledby="features-title"
      // تحت الـ fold: يتخطى الرسم لحد ما المستخدم يقرّب، والحجم المحجوز يمنع الـ CLS
      className="[contain-intrinsic-size:auto_760px] [content-visibility:auto]"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold text-gold">
            ميزات فريدة للسوق المحلي
          </p>
          <h2
            id="features-title"
            className="mt-2 text-3xl leading-snug font-bold tracking-tight sm:text-4xl"
          >
            كل ما تحتاجه لإدارة مواعيدك باحترافية تامة
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            أدوات قوية وبسيطة صُنعت خصيصًا لتناسب طبيعة العميل المصري وسلوكيات
            الدفع والتواصل المحلية.
          </p>
        </header>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, text, badge, note, tone, Icon, NoteIcon }) => {
            const t = tones[tone];
            return (
              <li key={title}>
                <article className="flex h-full flex-col rounded-2xl border border-border bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`grid size-10 place-items-center rounded-xl ${t.icon}`}
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${t.badge}`}
                    >
                      {badge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold">{title}</h3>
                  <p className="mt-2 flex-1 text-xs leading-6 text-muted-foreground">
                    {text}
                  </p>
                  <p
                    className={`mt-4 flex items-center gap-1.5 border-t border-border pt-3 text-[11px] font-semibold ${t.note}`}
                  >
                    <NoteIcon className="size-3.5 shrink-0" aria-hidden />
                    {note}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}