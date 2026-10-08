import Link from "next/link";
import Image from "next/image";
import { UserRound, Menu, LogOut } from "lucide-react";
import { auth } from "@/auth";
import { signOutAct } from "@/actions/signout.action";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "الرئيسية", href: "/" },
  { label: "المميزات", href: "#features" },
  { label: "كيف تعمل", href: "#how-it-works" },
  { label: "لمن تناسب؟", href: "#who-is-it-for" },
  { label: "الأسعار", href: "#pricing" },
  { label: "الأسئلة الشائعة", href: "#faq" },
];

export default async function Navbar() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background">
      <nav
        dir="rtl"
        aria-label="التنقل الرئيسي"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="أجندة - الصفحة الرئيسية"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/logo.jpg"
            alt="أجندة"
            width={240}
            height={240}
            quality={100}
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
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

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              <Link
                href="/auth/profile"
                aria-label="الملف الشخصي"
                className="inline-flex items-center justify-center rounded-full bg-emerald-700 p-2.5 text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                <UserRound className="h-4 w-4" />
              </Link>

              <form action={signOutAct}>
                <button
                  type="submit"
                  aria-label="تسجيل الخروج"
                  title="تسجيل الخروج"
                  className="inline-flex cursor-pointer items-center justify-center rounded-full border border-border p-2.5 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                تسجيل الدخول
              </Link>

              <Link
                href="/auth/sign_up"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                <span>ابدأ مجانًا</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <details className="relative md:hidden">
          <summary
            aria-label="فتح القائمة"
            className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden"
          >
            <Menu className="h-5 w-5" />
          </summary>

          <div className="absolute left-0 top-12 z-50 w-72 rounded-xl border border-border bg-background p-2 shadow-lg">
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

            <div className="flex flex-col gap-1">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/auth/profile"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    <UserRound className="h-4 w-4" />
                    <span>الملف الشخصي</span>
                  </Link>

                  <form action={signOutAct}>
                    <button
                      type="submit"
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </form>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
