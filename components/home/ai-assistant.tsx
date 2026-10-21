// components/landing/ai-assistant.tsx
// Server Component: الشات كله HTML/CSS ثابت => صفر JS، صفر صور، صفر CLS
import {
  CalendarCheck,
  CircleCheck,
  Lightbulb,
  Mic,
  MoreVertical,
  Send,
  Smile,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const flow: { title: string; sub: string; Icon: LucideIcon; active?: boolean }[] = [
  { title: "رسالة العميل", sub: "نصية أو فويس", Icon: Mic },
  { title: "فهم عامي مصري", sub: "تحليل الطلب", Icon: Lightbulb },
  { title: "فحص الوقت", sub: "مراجعة حرة", Icon: CalendarCheck },
  { title: "تأكيد الموعد", sub: "إرسال الفاتورة", Icon: CircleCheck, active: true },
];

function Time({ children }: { children: string }) {
  return (
    <span className="mt-1 block text-end text-[8px] text-foreground/45">
      {children}
    </span>
  );
}

export function AiAssistant() {
  return (
    <section
      id="ai-assistant"
      dir="rtl"
      aria-labelledby="ai-title"
      // تحت الـ fold: يتخطى الرسم لحد ما المستخدم يقرّب، والحجم المحجوز يمنع الـ CLS
      className="[contain-intrinsic-size:auto_620px] [content-visibility:auto]"
    >
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-16">
        <div className="grid items-center gap-10 rounded-[2rem] bg-[#e2eae6] p-6 sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-14">
          {/* ───────── النص ───────── */}
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c9efdf] px-3 py-1.5 text-[11px] font-semibold text-brand">
              <Sparkles className="size-3.5" aria-hidden />
              ذكاء اصطناعي فاهم السوق المصري
            </span>

            <h2
              id="ai-title"
              className="mt-5 text-3xl leading-[1.4] font-bold tracking-tight sm:text-4xl"
            >
              عميلك مش محتاج يستنى ردك،
              <br />
              <span className="relative inline-block text-brand">
                أجندة بترد في ثوانٍ
                <svg
                  aria-hidden
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  className="absolute inset-x-0 -bottom-1.5 h-2 w-full"
                >
                  <path
                    d="M2 8 C 70 2, 160 3, 298 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              وتكمل الحجز
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
              معظم العملاء في مصر بيفضلوا واتساب، وفرنا لك بوت ذكي مدرب على
              اللهجة المصرية، يفهم رغبة العميل، يستعرض المواعيد الشاغرة فورًا،
              ويؤكد الحجز والعربون دون أي مجهود منك.
            </p>

            <div className="mt-7 w-full rounded-xl bg-white p-4">
              <p className="mb-3 text-[11px] text-muted-foreground">
                مسار الذكاء الاصطناعي المصري
              </p>
              <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {flow.map(({ title, sub, Icon, active }) => (
                  <li
                    key={title}
                    className={`rounded-lg p-2.5 ${
                      active ? "bg-[#8fe8c9]" : "bg-[#d9e5df]"
                    }`}
                  >
                    <Icon className="size-3.5 text-brand" aria-hidden />
                    <p className="mt-2 text-[11px] leading-tight font-bold text-brand">
                      {title}
                    </p>
                    <p className="mt-0.5 text-[9px] text-brand/70">{sub}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* ───────── محاكاة الشات (HTML/CSS فقط) ───────── */}
          <div
            aria-hidden
            className="mx-auto w-full max-w-[340px] select-none overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_-20px_rgba(13,110,85,0.3)]"
          >
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
              <span className="relative grid size-9 place-items-center rounded-full bg-brand text-sm font-bold text-white">
                أ
                <span className="absolute -bottom-0.5 -start-0.5 size-2.5 rounded-full border-2 border-white bg-[#22c55e]" />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-bold">مساعد أجندة الذكي</p>
                <p className="text-[10px] text-brand">متصل الآن • يرد فوريًا</p>
              </div>
              <MoreVertical className="size-4 text-foreground/50" />
            </div>

            <div className="flex min-h-[330px] flex-col gap-2.5 bg-[#e9f0ed] p-3">
              {/* العميل */}
              <div className="max-w-[78%] self-end rounded-xl rounded-ee-sm bg-[#d6e2dc] p-2.5 text-[10px] leading-5">
                <p className="flex items-center gap-1 text-[9px] font-semibold text-brand">
                  <Mic className="size-3" /> رسالة صوتية (٠:١٥)
                </p>
                <p className="mt-1 text-foreground/80">
                  “مساء الخير يا دكتور، عاوز ميعاد بكرة، ينفع تخليه الخميس بعد
                  العصر؟”
                </p>
                <Time>٩:٤١ ص</Time>
              </div>

              {/* أجندة */}
              <div className="max-w-[88%] self-start rounded-xl rounded-es-sm bg-[#cdf3e2] p-2.5 text-[10px] leading-5">
                <p className="text-[9px] font-bold text-brand">أجندة AI</p>
                <p className="text-foreground/85">
                  أكيد يا فندم، ولا يهمك 👋 فحصت جدول الدكتور الشريف ومتاح يوم{" "}
                  <b>الخميس</b> المواعيد دي:
                </p>
                <div className="my-1.5 flex gap-1.5">
                  {["٤:٣٠ مساءً", "٥:٣٠ مساءً"].map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-white px-2 py-0.5 text-[9px] font-semibold text-brand"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-foreground/85">تحب أثبت لك ميعاد ٥:٣٠ مساءً؟</p>
                <Time>٩:٤٢ ص</Time>
              </div>

              {/* العميل */}
              <div className="max-w-[60%] self-end rounded-xl rounded-ee-sm bg-[#d6e2dc] p-2.5 text-[10px] leading-5">
                <p className="text-foreground/80">“تمام، ٥:٣٠ مضبوط”</p>
                <Time>٩:٤٣ ص</Time>
              </div>

              {/* أجندة */}
              <div className="max-w-[88%] self-start rounded-xl rounded-es-sm bg-[#cdf3e2] p-2.5 text-[10px] leading-5">
                <p className="text-[9px] font-bold text-brand">أجندة AI</p>
                <p className="text-foreground/85">
                  تم تعديل موعدك بنجاح إلى <b>الخميس ٥:٣٠ م</b> ✅ مبروك! تم
                  حجز مقعدك وأرسلنا تفاصيل التأكيد ورابط دفع العربون لتثبيت
                  الحجز. نورتنا يا فندم!
                </p>
                <Time>٩:٤٣ ص</Time>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-border px-3 py-2.5">
              <Smile className="size-4 text-foreground/45" />
              <span className="flex-1 text-[10px] text-foreground/45">
                اكتب رسالة للعميل...
              </span>
              <Mic className="size-4 text-brand" />
              <Send className="size-4 text-brand rtl:-scale-x-100" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}