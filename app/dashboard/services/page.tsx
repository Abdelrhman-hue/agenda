import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Category } from "@/lib/constants";
import { ServicesManager } from "@/components/provider/ServicesManager";

export default async function ServicesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const profile = await prisma.providerProfile.findUnique({
    where: { userId: session.user.id },
    select: { category: true },
  });
  if (!profile) redirect("/onboarding");

  return (
    <main className="min-h-screen w-full bg-canvas px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <ServicesManager category={profile.category as Category} />
      </div>
    </main>
  );
}
