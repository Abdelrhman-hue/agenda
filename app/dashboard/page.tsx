import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CalendarClock, CalendarDays, CheckCircle2, ConciergeBell } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { CopyLink } from "@/components/provider/CopyLink";

const links = [
  { href: "/dashboard/bookings", title: "الحجوزات", hint: "مواعيد العملاء والعربون", icon: CalendarDays },
  { href: "/dashboard/services", title: "الخدمات", hint: "الأسعار والمدد وأنواع الجلسات", icon: ConciergeBell },
  { href: "/dashboard/availability", title: "المواعيد المتاحة", hint: "ساعات العمل والإجازات والعربون", icon: CalendarClock },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const [{ welcome }, h, profile] = await Promise.all([
    searchParams,
    headers(),
    prisma.providerProfile.findUnique({
      where: { userId: session.user.id },
      select: { slug: true, _count: { select: { services: true } } },
    }),
  ]);
  if (!profile) redirect("/onboarding");

  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const bookingUrl = `${proto}://${host}/${profile.slug}`;

  return (
    <main className="min-h-screen w-full bg-canvas px-4 py-8 sm:px-6 lg:px-8" dir="rtl">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {welcome === "1" && (
          <div className="flex items-start gap-2.5 rounded-[10px] border border-status-success/30 bg-primary-light p-3.5 text-body-md text-status-success">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
            <span>تم تجهيز نشاطك بنجاح! شارك رابط الحجز مع عملائك.</span>
          </div>
        )}

        <div>
          <h1 className="text-headline-lg font-bold text-neutral-primary">لوحة التحكم</h1>
          <p className="mt-1 text-body-md text-neutral-muted">
            عندك <span className="tabular-numbers font-semibold">{profile._count.services}</span> خدمة مسجلة.
          </p>
        </div>

        <Card className="gap-3 rounded-[16px] border border-border-subtle bg-surface p-5 shadow-level1">
          <h2 className="text-title-lg font-bold text-neutral-primary">رابط الحجز الخاص بك</h2>
          <CopyLink url={bookingUrl} />
        </Card>

        <ul className="grid gap-3 sm:grid-cols-3">
          {links.map(({ href, title, hint, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex h-full flex-col gap-2 rounded-[16px] border border-border-subtle bg-surface p-5 shadow-level1 transition-all hover:border-primary/50 hover:shadow-level2"
              >
                <span className="flex size-10 items-center justify-center rounded-[10px] bg-primary-light text-primary-dark">
                  <Icon className="size-5" />
                </span>
                <span className="text-body-lg font-bold text-neutral-primary">{title}</span>
                <span className="text-body-sm text-neutral-muted">{hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
