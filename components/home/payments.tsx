// components/landing/payments.tsx
// Server Component: صفر JS، صفر صور (شعارات الوسائل حروف داخل دوائر ملونة)
import { CircleCheck, ShieldCheck, Wallet, Zap, type LucideIcon } from "lucide-react";

const methods = [
  { name: "فودافون كاش", sub: "محفظة الموبايل", mark: "V", color: "#e60000" },
  { name: "إنستاباي (InstaPay)", sub: "تحويل بنكي لحظي", mark: "IP", color: "#6d28d9" },
  { name: "أورنج كاش", sub: "دفع سريع", mark: "O", color: "#ff7900" },
  { name: "اتصالات كاش", sub: "محفظة فورية", mark: "E", color: "#00873c" },
  { name: "وي باي", sub: "محفظة الهاتف", mark: "WE", color: "#4338ca" },
  { name: "كروت ميزة والفيزا", sub: "تجميع البطاقات", mark: "M", color: "#1d4ed8" },
];

const perks: { label: string; Icon: LucideIcon }[] = [
  { label: "تأكيد فوري للتحويل", Icon: CircleCheck },
  { label: "بدون عمولات خفية", Icon: ShieldCheck },
  { label: "إيداع لحظي", Icon: Zap },
];

export function Payments() {
  return (
    <section
      id="payments"
      dir="rtl"
      aria-labelledby="payments-title"
      // تحت الـ fold: يتخطى الرسم لحد ما المستخدم يقرّب، والحجم المحجوز يمنع الـ CLS
      className="[contain-intrinsic-size:auto_480px] [content-visibility:auto]"
    >
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-16">
        <div className="grid items-center gap-10 rounded-[2rem] bg-[#e4f2ea] p-6 sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-14">
          {/* ───────── النص ───────── */}
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1.5 text-[11px] font-semibold text-gold">
              <Wallet className="size-3.5" aria-hidden />
              شراكات ودعم محلي شامل
            </span>

            <h2
              id="payments-title"
              className="mt-5 text-3xl leading-[1.45] font-bold tracking-tight sm:text-4xl"
            >
              العربون يتحصل قبل الموعد —
              <span className="block text-gold">
                بأسهل الطرق اللي عميلك بيستخدمها كل يوم
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
              مش محتاج تفتح حسابات بنكية معقدة أو تدفع رسوم شهرية لبوابات دفع
              دولية. اربط رقم محفظتك الإلكترونية واستلم العربون مباشرة في جيبك
              لحظة الحجز.
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {perks.map(({ label, Icon }) => (
                <li
                  key={label}
                  className="flex items-center gap-1.5 text-xs font-semibold text-brand"
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* ───────── كارت الوسائل (HTML/CSS فقط) ───────── */}
          <div className="mx-auto w-full max-w-[420px] rounded-2xl bg-white p-4 shadow-[0_20px_50px_-24px_rgba(13,110,85,0.25)] sm:p-5">
            <h3 className="mb-3 text-xs font-bold">الوسائل المدعومة فوريًا في مصر</h3>

            <ul className="grid grid-cols-2 gap-2">
              {methods.map((m) => (
                <li
                  key={m.name}
                  className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-[#e9f1ed] p-2.5"
                >
                  <span
                    aria-hidden
                    className="grid size-7 shrink-0 place-items-center rounded-full text-[9px] font-bold text-white"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.mark}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-bold">
                      {m.name}
                    </span>
                    <span className="block truncate text-[9px] text-muted-foreground">
                      {m.sub}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex items-center justify-between rounded-lg bg-[#d3eee0] px-3 py-3 text-xs">
              <span className="font-bold text-brand">
                إجمالي العربون المستلم اليوم:
              </span>
              <span className="font-bold text-gold">١٬٨٥٠ ج.م</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}