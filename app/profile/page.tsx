import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileView, ProfileUserData } from "@/components/profile/ProfileView";

export const metadata: Metadata = {
  title: "الملف الشخصي — أجندة",
  description: "إدارة بيانات حسابك، كلمة المرور، وإعدادات نشاطك على منصة أجندة.",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const [h, user] = await Promise.all([
    headers(),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
        password: true,
        providerProfile: {
          select: {
            id: true,
            slug: true,
            category: true,
            bio: true,
            address: true,
            locationUrl: true,
            whatsappNumber: true,
            depositType: true,
            depositAmount: true,
            bufferMinutes: true,
            timezone: true,
            onboardingCompleted: true,
            _count: {
              select: {
                services: true,
                bookings: true,
              },
            },
          },
        },
        bookings: {
          take: 10,
          orderBy: { startsAt: "desc" },
          select: {
            id: true,
            startsAt: true,
            endsAt: true,
            status: true,
            service: {
              select: {
                id: true,
                name: true,
                price: true,
                durationMinutes: true,
              },
            },
            provider: {
              select: {
                id: true,
                slug: true,
                category: true,
                user: { select: { name: true, phone: true } },
              },
            },
            payment: {
              select: {
                amount: true,
                method: true,
                status: true,
              },
            },
          },
        },
      },
    }),
  ]);

  if (!user) {
    redirect("/auth/login");
  }

  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = `${proto}://${host}`;

  const { password, ...safeUser } = user;
  const initialUserData: ProfileUserData = {
    ...safeUser,
    hasPassword: Boolean(password),
    // convert Date instances to ISO string for safe client serialization
    emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
    createdAt: user.createdAt.toISOString(),
    bookings: user.bookings.map((b) => ({
      ...b,
      startsAt: b.startsAt.toISOString(),
      endsAt: b.endsAt.toISOString(),
    })),
  };

  return (
    <main className="min-h-screen w-full bg-canvas px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <ProfileView initialUser={initialUserData} baseUrl={baseUrl} />
      </div>
    </main>
  );
}
