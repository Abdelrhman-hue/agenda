import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role, ProviderCategory, DepositType } from "@/generated/prisma/enums";

/**
 * GET /api/providers
 * جلب قائمة مقدمي الخدمات والخدمات التابعة لهم لتسهيل الحجز في الواجهة
 */
export async function GET() {
  try {
    let providers = await prisma.providerProfile.findMany({
      include: {
        user: {
          select: { id: true, name: true, phone: true, email: true },
        },
        services: {
          where: { isActive: true },
        },
        workingHours: true,
      },
    });

    // If database has no providers yet (e.g. fresh development DB), seed a default provider so booking UI is functional out of the box
    if (providers.length === 0) {
      const demoUser = await prisma.user.create({
        data: {
          name: "د. أحمد ممدوح — عيادة النخبة",
          email: "dr.ahmed@agenda.app",
          phone: "01012345678",
          role: Role.PROVIDER,
          providerProfile: {
            create: {
              slug: "dr-ahmed-clinic",
              category: ProviderCategory.CLINIC,
              bio: "استشاري طب وجراحة الفم والأسنان - تجميل وزراعة الأسنان في القاهرة",
              depositType: DepositType.FIXED,
              depositAmount: 150,
              bufferMinutes: 15,
              timezone: "Africa/Cairo",
              services: {
                create: [
                  {
                    name: "كشف واستشارة طبية متخصصة",
                    durationMinutes: 30,
                    price: 350,
                    requiresAddress: false,
                  },
                  {
                    name: "جلسة تنظيف وتلميع وتبييض الأسنان",
                    durationMinutes: 45,
                    price: 650,
                    requiresAddress: false,
                  },
                  {
                    name: "زيارة فحص منزلي للحالات الخاصة",
                    durationMinutes: 60,
                    price: 900,
                    requiresAddress: true,
                  },
                ],
              },
              workingHours: {
                create: [
                  { dayOfWeek: 0, startTime: "09:00", endTime: "18:00" }, // الأحد
                  { dayOfWeek: 1, startTime: "09:00", endTime: "18:00" }, // الاثنين
                  { dayOfWeek: 2, startTime: "09:00", endTime: "18:00" }, // الثلاثاء
                  { dayOfWeek: 3, startTime: "09:00", endTime: "18:00" }, // الأربعاء
                  { dayOfWeek: 4, startTime: "09:00", endTime: "18:00" }, // الخميس
                  { dayOfWeek: 6, startTime: "10:00", endTime: "16:00" }, // السبت
                ],
              },
            },
          },
        },
        include: {
          providerProfile: {
            include: {
              user: { select: { id: true, name: true, phone: true, email: true } },
              services: true,
              workingHours: true,
            },
          },
        },
      });

      if (demoUser.providerProfile) {
        providers = [demoUser.providerProfile];
      }
    }

    return NextResponse.json({
      status: "success",
      data: providers,
    });
  } catch (error: any) {
    console.error("GET /api/providers error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "حدث خطأ أثناء جلب مقدمي الخدمات",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
