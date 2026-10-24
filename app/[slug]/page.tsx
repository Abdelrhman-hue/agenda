import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RESERVED_SLUGS } from "@/lib/constants";
import { PublicBookingExperience } from "@/components/booking/PublicBookingExperience";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.includes(slug.toLowerCase())) {
    return { title: "غير موجود" };
  }

  const provider = await prisma.providerProfile.findUnique({
    where: { slug: slug.toLowerCase() },
    select: {
      slug: true,
      bio: true,
      user: { select: { name: true } },
    },
  });

  if (!provider) {
    return {
      title: "مقدم الخدمة غير موجود | أجندة",
    };
  }

  const title = `${provider.user.name || provider.slug} | حجز موعد - أجندة`;
  const description =
    provider.bio || "احجز موعدك المؤكد أونلاين في ثوانٍ مع أجندة.";

  return {
    title,
    description,
  };
}

export default async function ProviderPublicBookingPage({ params }: Props) {
  const { slug } = await params;
  const cleanSlug = slug.toLowerCase();

  // منع التضارب مع المسارات الثابتة المحجوزة
  if (RESERVED_SLUGS.includes(cleanSlug)) {
    notFound();
  }

  const provider = await prisma.providerProfile.findUnique({
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

  if (!provider) {
    notFound();
  }

  return (
    <main>
      <PublicBookingExperience provider={provider as any} />
    </main>
  );
}
