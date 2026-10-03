import Link from "next/link";
import { UserRound, Menu } from "lucide-react";
import Image from "next/image";
/**
 * Type used for the navbar links.
 * Keeping it local because it is only needed by this component.
 */
type NavItem = {
  label: string;
  href: string;
};

/**
 * Main navigation links.
 *
 * Note:
 * The order here is written for RTL layout,
 * so the first item starts from the right side.
 */
const navItems: NavItem[] = [
  {
    label: "الرئيسية",
    href: "/",
  },
  {
    label: "المميزات",
    href: "#features",
  },
  {
    label: "كيف تعمل",
    href: "#how-it-works",
  },
  {
    label: "لمن تناسب؟",
    href: "#who-is-it-for",
  },
  {
    label: "الأسعار",
    href: "#pricing",
  },
  {
    label: "الأسئلة الشائعة",
    href: "#faq",
  },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background">
      <nav
        dir="rtl"
        aria-label="التنقل الرئيسي"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* =========================================================
            Logo
            ========================================================= */}
        <Link
          href="/"
          aria-label="أجندة - الصفحة الرئيسية"
          className="flex shrink-0 items-center gap-2"
        >
          {/* Small brand icon */}
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-md text-emerald-700"
          >
            <Image src="/logo.jpg" alt="Logo" width={60} height={60} />
          </span>

          <span className="text-lg font-bold tracking-tight text-foreground">
            أجندة
          </span>
        </Link>

        {/* =========================================================
            Desktop Navigation
            Hidden on small screens.
            ========================================================= */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item, index) => {
            const isActive = index === 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* =========================================================
            Desktop Actions
            ========================================================= */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Login */}
          <Link
            href="/auth/login"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            تسجيل الدخول
          </Link>

          {/* Free CTA */}
          <Link
            href="/auth/sign_up"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <span>ابدأ مجانًا</span>
          </Link>
          <Link
            href="/auth/profile"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-2 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <UserRound className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* =========================================================
            Mobile Menu
            No client-side state is required.
            ========================================================= */}
        <details className="relative md:hidden">
          <summary
            aria-label="فتح القائمة"
            className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden"
          >
            <Menu className="h-5 w-5" />
          </summary>

          {/* Mobile dropdown */}
          <div className="absolute left-0 top-12 z-50 w-72 rounded-xl border border-border bg-background p-2 shadow-lg">
            {/* Navigation links */}
            <div className="flex flex-col gap-1">
              {navItems.map((item, index) => {
                const isActive = index === 0;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "rounded-lg px-4 py-3 text-sm font-medium",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "bg-emerald-50 text-emerald-800"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="my-2 h-px bg-border" />

            {/* Mobile actions */}
            <div className="flex flex-col gap-1">
              <Link
                href="/auth/login"
                className="rounded-lg px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
              >
                تسجيل الدخول
              </Link>

              <Link
                href="/auth/sign_up"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                <UserRound className="h-4 w-4" />
                <span>ابدأ مجانًا</span>
              </Link>
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
