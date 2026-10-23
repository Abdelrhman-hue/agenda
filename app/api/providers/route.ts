import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/providers
 * جلب قائمة مقدمي الخدمات والخدمات التابعة لهم لتسهيل الحجز في الواجهة
 */
export async function GET() {
  try {
    const providers = await prisma.providerProfile.findMany({
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
