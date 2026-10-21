import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { todayIn } from "@/lib/time";
import { AbsencesManager } from "@/components/provider/AbsencesManager";
import { SettingsCards } from "@/components/provider/SettingsCards";
import { WorkingHoursEditor } from "@/components/provider/WorkingHoursEditor";

export default async function AvailabilityPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const profile = await prisma.providerProfile.findUnique({
    where: { userId: session.user.id },
    select: { timezone: true },
  });
  if (!profile) redirect("/onboarding");

  return (
    <main className="min-h-screen w-full bg-canvas px-4 py-8 sm:px-6 lg:px-8" dir="rtl">
      <div className="mx-auto w-full max-w-3xl space-y-10">
        <h1 className="text-headline-lg font-bold text-neutral-primary">المواعيد المتاحة</h1>
        <WorkingHoursEditor />
        <SettingsCards />
        <AbsencesManager today={todayIn(profile.timezone)} />
      </div>
    </main>
  );
}
