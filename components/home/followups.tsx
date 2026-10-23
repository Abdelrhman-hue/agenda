type Tone = "brand" | "gold" | "neutral";

const tones: Record<Tone, { num: string; label: string }> = {
  brand: { num: "bg-[#c4f0dd] text-brand", label: "text-brand" },
  gold: { num: "bg-[#fde8a8] text-gold", label: "text-gold" },
  neutral: {
    num: "bg-[#d9e0dc] text-foreground/70",
    label: "text-foreground/70",
  },
};

const steps: {
  n: string;
  when: string;
  title: string;
  text: string;
  tone: Tone;
}[] = [
  {
    n: "1",
    when: "بعد الحجز مباشرة",
    title: "تأكيد الموعد والعربون",
    text: "رسالة واتساب رسمية تحتوي على اليوم والتاريخ والساعة، وبيانات التحويل مع رابط لإضافة الموعد في التقويم.",
    tone: "brand",
  },
  {
    n: "2",
    when: "قبل الموعد بـ ٢٤ ساعة",
    title: "تذكير ودي وتأكيد حضور",
    text: "إشعار لطيف يسأل العميل إن كان سيحضر، مع زر لتأكيد الحضور أو طلب تعديل الموعد، ليتاح الموعد لغيره إن اعتذر.",
    tone: "gold",
  },
  {
    n: "3",
    when: "قبل الموعد بساعتين",
    title: "لوكيشن المكان وإرشادات",
    text: "رابط مباشر لموقع العيادة أو المكتب على خرائط Google، وتعليمات الوصول أو رابط جلسة زووم إن كانت أونلاين.",
    tone: "brand",
  },
  {
    n: "4",
    when: "بعد انتهاء الموعد",
    title: "شكر وتقييم التجربة",
    text: "رسالة شكر تلقائية تطلب من العميل تقييم الخدمة على خرائط جوجل، لزيادة ثقة العملاء الجدد وصناعة سمعتك.",
    tone: "neutral",
  },
];

export function Followups() {
  return (
    <section
      id="followups"
      dir="rtl"
      aria-labelledby="followups-title"
      // تحت الـ fold: يتخطى الرسم لحد ما المستخدم يقرّب، والحجم المحجوز يمنع الـ CLS
      className="[contain-intrinsic-size:auto_440px] [content-visibility:auto]"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold text-brand">التزام وجدية الحجز</p>
          <h2
            id="followups-title"
            className="mt-2 text-3xl leading-snug font-bold tracking-tight sm:text-4xl"
          >
            قلل المواعيد الضائعة والتخلف عن الحضور بنسبة ٨٠٪
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            تسلسل ذكي من المتابعات التلقائية يضمن حضور عميلك في موعده بدقة دون
            أن تضطر لإجراء أي مكالمة هاتفية واحدة.
          </p>
        </header>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ n, when, title, text, tone }) => (
            <li key={n}>
              <article className="h-full rounded-2xl border border-brand/10 bg-brand-soft/60 p-5">
                <span
                  className={`grid size-8 place-items-center rounded-full text-sm font-bold ${tones[tone].num}`}
                >
                  {n}
                </span>
                <p
                  className={`mt-4 text-[11px] font-semibold ${tones[tone].label}`}
                >
                  {when}
                </p>
                <h3 className="mt-1 text-base font-bold">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  {text}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
