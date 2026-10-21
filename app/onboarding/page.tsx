import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isTempSlug, suggestSlug } from "@/lib/slug";
import type { Category } from "@/lib/constants";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const profile = await prisma.providerProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      category: true,
      slug: true,
      bio: true,
      _count: { select: { workingHours: true } },
    },
  });

  const activeServices = profile
    ? await prisma.service.count({ where: { providerId: profile.id, isActive: true } })
    : 0;

  // الاستكمال من حيث وقف المستخدم
  let step = 0;
  const slugChosen = !!profile && !isTempSlug(profile.slug);
  if (profile) step = 1;
  if (profile && slugChosen) step = 2;
  if (profile && slugChosen && activeServices > 0) step = 3;

  return (
    <OnboardingWizard
      initial={{
        step,
        category: (profile?.category as Category | undefined) ?? null,
        bio: profile?.bio ?? "",
        slug: slugChosen ? profile!.slug : null,
        suggestedSlug: suggestSlug(session.user.email),
        activeServices,
      }}
    />
  );
}
