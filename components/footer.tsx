import Link from "next/link";
import { CircleCheck, Zap } from "lucide-react";
import Image from "next/image";
const YEAR = "٢٠٢٥"; // غيّره أو اجعله ثابت في config مشترك

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "المنتج",
    links: [
      { label: "المميزات", href: "/#features" },
      { label: "الأسعار", href: "/#pricing" },
      { label: "طريقة العمل", href: "/#how-it-works" },
    ],
  },
  {
    title: "الاستخدامات والقطاعات",
    links: [
      { label: "لمن تناسب؟", href: "/#services" },
      { label: "وسائل الدفع المحلية", href: "/#payments" },
      { label: "تكامل واتساب", href: "/#ai-assistant" },
    ],
  },
  {
    title: "المساعدة",
    links: [
      { label: "الأسئلة الشائعة", href: "/#faq" },
      { label: "الدعم الفني", href: "/support" },
    ],
  },
  {
    title: "الشروط والخصوصية",
    links: [
      { label: "الخصوصية", href: "/privacy" },
      { label: "الشروط والأحكام", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      dir="rtl"
      className="border-t border-border bg-white [contain-intrinsic-size:auto_320px] [content-visibility:auto]"
    >
      <div className="mx-auto max-w-6xl px-5 pt-12 pb-6 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.7fr_repeat(4,1fr)]">
          {/* العلامة */}
          <div className="flex flex-col items-start">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              <span className="grid size-8 place-items-center rounded-lg bg-brand text-white">
                <Image src="/logo.jpg" alt="أجندة" width={60} height={60} />
              </span>
              <span className="text-lg font-bold">أجندة</span>
            </Link>
            <p className="mt-4 max-w-xs text-xs leading-6 text-muted-foreground">
              أجندتك الذكية لحجز المواعيد والعربون في مصر، نظام آلي متكامل
              لإدارة الحجوزات، تحصيل الدفعات، والتأكيد القوي عبر واتساب.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-[10px] font-semibold text-brand">
              <CircleCheck className="size-3.5" aria-hidden />
              حلول سحابية مصممة خصيصًا للسوق المصري
            </span>
          </div>

          {/* الأعمدة */}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-xs font-bold">{col.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="rounded-sm text-xs text-muted-foreground transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5">
            <Zap className="size-3.5 text-brand" aria-hidden />
            منصة مصرية متوافقة مع إنستاباي، فودافون كاش، وبطاقات الدفع
          </p>
          <p>© {YEAR} أجندة — Agendah. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
