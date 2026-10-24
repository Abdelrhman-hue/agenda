import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RESERVED_SLUGS } from "@/lib/constants";
import { PublicBookingExperience } from "@/components/booking/PublicBookingExperience";

interface Props {
  params: Promise<{ slug: string }>;
}

const MOCK_PROVIDER = {
  id: "mock-demo-provider-id",
  slug: "demo",
  category: "CLINIC" as const,
  bio: "عيادة د. شريف أحمد التخصصية — رعاية طبية متكاملة وحجز مؤكد بدون انتظار.",
  address: "المعادي، شارع النصر، برج الأطباء، الدور الرابع",
  locationUrl: "https://maps.google.com",
  whatsappNumber: "201012345678",
  depositType: "FIXED" as const,
  depositAmount: 100,
  bufferMinutes: 15,
  timezone: "Africa/Cairo",
  user: {
    name: "د. شريف أحمد",
    phone: "01012345678",
    image: null,
  },
  services: [
    {
      id: "srv-demo-1",
      name: "كشف عيادة عام",
      durationMinutes: 30,
      price: 350,
      depositAmount: 100,
      mode: "ONSITE" as const,
      meetingUrl: null,
      requiresAddress: false,
      isActive: true,
    },
    {
      id: "srv-demo-2",
      name: "استشارة طبية ومتابعة",
      durationMinutes: 20,
      price: 200,
      depositAmount: 50,
      mode: "ONSITE" as const,
      meetingUrl: null,
      requiresAddress: false,
      isActive: true,
    },
    {
      id: "srv-demo-3",
      name: "استشارة أونلاين عبر الفيديو",
      durationMinutes: 30,
      price: 300,
      depositAmount: 100,
      mode: "ONLINE" as const,
      meetingUrl: "https://meet.google.com",
      requiresAddress: false,
      isActive: true,
    },
  ],
  workingHours: [
    { id: "wh-1", providerId: "mock", dayOfWeek: 0, startTime: "10:00", endTime: "20:00" },
    { id: "wh-2", providerId: "mock", dayOfWeek: 1, startTime: "10:00", endTime: "20:00" },
    { id: "wh-3", providerId: "mock", dayOfWeek: 2, startTime: "10:00", endTime: "20:00" },
    { id: "wh-4", providerId: "mock", dayOfWeek: 3, startTime: "10:00", endTime: "20:00" },
    { id: "wh-5", providerId: "mock", dayOfWeek: 4, startTime: "10:00", endTime: "20:00" },
    { id: "wh-6", providerId: "mock", dayOfWeek: 6, startTime: "10:00", endTime: "20:00" },
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = slug.toLowerCase();

  if (RESERVED_SLUGS.includes(cleanSlug)) {
    return { title: "غير موجود" };
  }

  if (cleanSlug === "demo") {
    return {
      title: "د. شريف أحمد | حجز تجريبي - أجندة",
      description: MOCK_PROVIDER.bio,
    };
  }

  try {
    const provider = await prisma.providerProfile.findUnique({
      where: { slug: cleanSlug },
      select: {
        slug: true,
        bio: true,
        user: { select: { name: true } },
      },
    });

    if (!provider) {
      return { title: "مقدم الخدمة غير موجود | أجندة" };
    }

    return {
      title: `${provider.user?.name || provider.slug} | حجز موعد - أجندة`,
      description: provider.bio || "احجز موعدك المؤكد أونلاين في ثوانٍ مع أجندة.",
    };
  } catch {
    return {
      title: `${cleanSlug} | حجز موعد - أجندة`,
    };
  }
}

export default async function ProviderPublicBookingPage({ params }: Props) {
  const { slug } = await params;
  const cleanSlug = slug.toLowerCase();

  // منع التضارب مع المسارات الثابتة المحجوزة
  if (RESERVED_SLUGS.includes(cleanSlug)) {
    notFound();
  }

  // رابط العرض التوضيحي المباشر
  if (cleanSlug === "demo") {
    return (
      <main>
        <PublicBookingExperience provider={MOCK_PROVIDER as any} />
      </main>
    );
  }

  let provider = null;
  try {
    provider = await prisma.providerProfile.findUnique({
      where: { slug: cleanSlug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            image: true,
          },
        },
        services: {
          where: { isActive: true },
          orderBy: { price: "asc" },
        },
        workingHours: true,
      },
    });
  } catch (error) {
    console.warn(`[/[slug]] Database offline for '${cleanSlug}', using demo fallback:`, error);
    return (
      <main>
        <PublicBookingExperience
          provider={{
            ...MOCK_PROVIDER,
            slug: cleanSlug,
            user: { ...MOCK_PROVIDER.user, name: `نشاط ${cleanSlug}` },
          } as any}
        />
      </main>
    );
  }

  if (!provider) {
    notFound();
  }

  return (
    <main>
      <PublicBookingExperience provider={provider as any} />
    </main>
  );
}
