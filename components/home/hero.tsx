import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  MessageSquareText,
  Play,
  Star,
  Zap,
} from "lucide-react";

const stats = [
  { label: "مواعيد اليوم", value: "٨" },
  { label: "مؤكدة بالعربون", value: "٦" },
  { label: "عربون محصّل", value: "٣٬٤٥٠", unit: "ج.م", gold: true },
  { label: "معلّق", value: "٤٠٠", unit: "ج.م" },
];

const appointments = [
  {
    initial: "أ",
    name: "د. أحمد الشريف",
    meta: "كشف عيون وتصحيح نظر · ١١:٠٠ ص",
    tag: "فودافون كاش",
    note: "٣٥٠ ج.م مدفوع",
    row: "bg-brand-soft/70 border-brand/10",
    avatar: "bg-brand text-white",
    tagStyle: "bg-white text-brand border-brand/20",
  },
  {
    initial: "س",
    name: "م. سارة محمود",
    meta: "استشارة تصميم داخلي · ١٣:٠٠ م",
    tag: "تذكير أوتوماتيكي",
    note: "إنستاباي معتمد",
    row: "bg-gold-soft/70 border-gold/15",
    avatar: "bg-gold-soft text-gold",
    tagStyle: "bg-white text-gold border-gold/25",
  },
  {
    initial: "ع",
    name: "كابتن عمر خالد",
    meta: "جلسة تدريب شخصي · ٤:٠٠ م",
    tag: "حجز نهائي",
    note: "٢٥٠ ج.م مدفوع",
    row: "bg-muted/70 border-border",
    avatar: "bg-muted text-foreground/70",
    tagStyle: "bg-white text-foreground/70 border-border",
  },
];

export function Hero() {
  return (
    <section
      dir="rtl"
      className="relative isolate overflow-hidden bg-[radial-gradient(60%_60%_at_15%_35%,#d6f2e5_0%,transparent_70%),linear-gradient(180deg,#f3fbf7_0%,#ffffff_100%)]"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12  px-2 py-20 sm:px-8 lg:grid-cols-2 lg:gap-10 lg:py-5">
        {/* ───────── النص ───────── */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-right">
          <span className="inline-flex items-center sm:text-center gap-1.5 rounded-full border border-brand/15 bg-[#E0EAE7] px-3.5 py-1.5 text-[14px] font-semibold text-[#006453]">
            <Zap className="size-3.5 fill-brand font-[#006453]" aria-hidden />
            أول منصة مواعيد ذكية مصممة خصيصًا لمصر
          </span>

          {/* h1 هو عنصر الـ LCP: نص فقط، بدون صور */}
          <h1 className="mt-6 text-4xl leading-[1.35] font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
            أجندتك الذكية لحجز
            <span className="text-[#006453] relative mt-1 block w-fit">
              المواعيد والعربون
              <svg
                aria-hidden
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                className="absolute inset-x-0 -bottom-2 h-2.5 w-full text-[#F0C052]"
              >
                <path
                  d="M2 8 C 60 2, 150 2, 298 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="font-normal mt-7 max-w-lg text-[16px] leading-8 text-muted-foreground">
            خلّي عملاءك يحجزوا بسهولة، يدفعوا العربون، واستقبل التأكيدات
            والتذكيرات تلقائيًا — من مكان واحد وبدون تضييع وقت في المكالمات
            والرسائل اليدوية المرهقة.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href="auth/login"
              className="bg-[#006453] inline-flex h-12 items-center gap-2 rounded-xl px-6 text-sm font-semibold text-white shadow-[0_8px_20px_-8px] shadow-brand/60 transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              ابدأ مجانًا الآن
              <ArrowLeft className="size-4" aria-hidden />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-white px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <Play className="size-4 fill-brand text-brand" aria-hidden />
              شاهد كيف تعمل
            </Link>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BadgeCheck className="size-4 text-brand" aria-hidden />
              <span>بدون تعقيد · بدون مكالمات لا تنتهي ·</span>
              <b className="font-semibold text-foreground">
                جاهز للسوق المصري ومحافظ الكاش
              </b>
            </p>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 space-x-reverse" aria-hidden>
                {["ع", "م", "س", "د"].map((c, i) => (
                  <span
                    key={c}
                    className={`grid size-9 place-items-center rounded-full border-2 border-white text-xs font-bold ${
                      [
                        "bg-brand-soft text-brand",
                        "bg-gold-soft text-gold",
                        "bg-brand/15 text-brand",
                        "bg-muted text-foreground/70",
                      ][i]
                    }`}
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div>
                <div
                  className="text-[#795900] flex gap-0.5 text-gold"
                  aria-label="تقييم ٥ من ٥"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-3.5 fill-current"
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  أكثر من ١٬٥٠٠ صاحب عمل في مصر يعتمدون على أجندة
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ───────── لوحة التحكم (HTML/CSS فقط، بدون صورة) ───────── */}
        <div
          aria-hidden
          className="mx-auto w-full max-w-[460px] select-none rounded-2xl border border-border/70 bg-white p-4 shadow-[0_24px_60px_-24px_rgba(13,110,85,0.25)] sm:p-5 lg:mx-0 lg:ms-auto"
        >
          <div
            aria-hidden
            className="mx-auto w-full max-w-[480px] select-none rounded-2xl border-2 border-[#B8D8E8]/60 bg-white p-5 shadow-[0_24px_60px_-24px_rgba(13,110,85,0.20)] sm:p-6 lg:mx-0 lg:ms-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-[#B8E8D8] text-[#006453]">
                  <CalendarDays className="size-5" />
                </span>
                <div>
                  <p className="text-[15px] font-bold text-[#1a1a1a]">
                    لوحة التحكم اليومية
                  </p>
                  <p className="text-[11px] text-[#8B9DAF]">
                    الخميس، ٤ أكتوبر ٢٠٢٥
                  </p>
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-foreground/70">
              <span className="size-1.5 rounded-full bg-brand" />
              مباشر
            </span>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            {stats.map((s) => (
              <div
                key={s.label}
                className="min-h-[68px] rounded-xl border border-border/70 bg-white p-2.5"
              >
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
                <p
                  className={`mt-1 text-lg leading-none font-bold ${
                    s.gold ? "text-gold" : "text-foreground"
                  }`}
                >
                  {s.value}
                  {s.unit && (
                    <span className="ms-1 text-[10px] font-medium">
                      {s.unit}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 mb-2 text-xs font-bold">المواعيد القادمة اليوم</p>
          <ul className="space-y-2">
            {appointments.map((a) => (
              <li
                key={a.name}
                className={`flex items-center gap-3 rounded-xl border p-2.5 ${a.row}`}
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-lg text-sm font-bold ${a.avatar}`}
                >
                  {a.initial}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold">{a.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {a.meta}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className={`rounded-md border px-1.5 py-0.5 text-[9px] font-semibold ${a.tagStyle}`}
                  >
                    {a.tag}
                  </span>
                  <span className="text-[9px] text-muted-foreground">
                    {a.note}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-3 rounded-xl border border-brand/10 bg-brand-soft/50 p-3">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-brand text-white">
                <MessageSquareText className="size-4" />
              </span>
              <p className="flex-1 text-[12px] font-bold">
                تأكيد واتساب ذكي فوري
              </p>
              <span className="text-[9px] text-muted-foreground">
                منذ ٨ دقائق
              </span>
            </div>
            <p className="mt-2 rounded-lg bg-white p-2.5 text-[11px] leading-5 text-foreground/80">
              “أهلاً سارة! موعد استشارتك اليوم الساعة ١:٣٠ م. تم تأكيد العربون
              عبر إنستاباي بنجاح. لتعديل الموعد اضغطي هنا.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
