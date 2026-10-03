// components/landing/solutions.tsx
// Server Component. الصور عبر next/image بنسبة أبعاد ثابتة (aspect ratio) => CLS = 0
import Image from "next/image";

type Tone = "brand" | "gold";

const noteTone: Record<Tone, string> = {
  brand: "text-brand",
  gold: "text-gold",
};

const solutions: {
  title: string;
  text: string;
  badge: string;
  src: string;
  alt: string;
  meta: string;
  note: string;
  tone: Tone;
}[] = [
  {
    title: "المراكز الطبية والعيادات",
    text: "فصل الكشوفات الجديدة عن الإعادات والمتابعات، تنظيم قائمة الانتظار، واستلام رسوم الحجز مسبقًا لتجنب ازدحام الصالة.",
    badge: "عيادات واستشارات",
    src: "/home/onePhoto.png",
    alt: "استقبال عيادة حديثة مع موظفة استقبال وشاشة حجز",
    meta: "تكامل رقمي كامل",
    note: "تقليل زمن الانتظار ٦٠٪",
    tone: "brand",
  },
  {
    title: "المدرسين والسناتر التعليمية",
    text: "تقسيم الحصص للمجموعات ذات سعة محددة، غلق الحجز تلقائيًا عند اكتمال العدد، وإشعار فوري لأولياء الأمور بالحضور.",
    badge: "مدرسين ومراكز",
    src: "/home/twoPhoto.png",
    alt: "فصل دراسي صغير يجلس فيه مدرس مع مجموعة من الطلاب",
    meta: "تنبيهات أولياء الأمور",
    note: "سعة محددة تلقائية",
    tone: "gold",
  },
  {
    title: "المدربين وخبراء اللياقة",
    text: "حجز جلسات التدريب الخاص، وتجديد الباقات الشهرية، وإلزام المتدرب بتأكيد الموعد قبل ٢٤ ساعة لعدم ضياع وقت الكابتن.",
    badge: "جيم وتدريب",
    src: "/home/ThreePhoto.png",
    alt: "مدرب لياقة في صالة جيم يستخدم تطبيق الحجز على الهاتف",
    meta: "ثبات جلسات PT",
    note: "حماية وقت المدرب",
    tone: "brand",
  },
];

export function Solutions() {
  return (
    <section
      id="solutions"
      dir="rtl"
      aria-labelledby="solutions-title"
      // تحت الـ fold: يتخطى الرسم لحد ما المستخدم يقرّب، والحجم المحجوز يمنع الـ CLS
      className="[contain-intrinsic-size:auto_560px] [content-visibility:auto]"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold text-gold">حلول واقعية</p>
          <h2
            id="solutions-title"
            className="mt-2 text-3xl leading-snug font-bold tracking-tight sm:text-4xl"
          >
            أجندة تتكيف مع طبيعة شغلك
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            كل قطاع في مصر له طبيعته وأسلوبه في التعامل مع المواعيد. صممنا
            حلولًا مرنة تناسب كل مهنة بدقة متناهية.
          </p>
        </header>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) => (
            <li key={s.title}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand/10 bg-brand-soft/60">
                {/* نسبة ثابتة + لون خلفية = لا قفزات ولا وميض أثناء التحميل */}
                <div className="relative aspect-[16/9] w-full bg-muted">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes="(min-width:1152px) 368px, (min-width:640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute end-3 top-3 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-brand shadow-sm">
                    {s.badge}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold">{s.title}</h3>
                  <p className="mt-2 flex-1 text-xs leading-6 text-muted-foreground">
                    {s.text}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-brand/10 pt-3 text-[11px]">
                    <span className="text-muted-foreground">{s.meta}</span>
                    <span className={`font-semibold ${noteTone[s.tone]}`}>
                      {s.note}
                    </span>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
