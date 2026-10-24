import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAgentApiKey, normalizePhone } from "@/lib/agent-auth";
import { BookingStatus } from "@/generated/prisma/enums";

/**
 * GET /api/agent/appointments/current?business_id=xxx&client_phone=yyy
 * يرجع الحجز النشط (HELD أو CONFIRMED) للعميل في نشاط معيّن
 * أو null لو مفيش حجز نشط
 * مُؤمَّن بـ X-API-Key
 */
export async function GET(req: NextRequest) {
  // 1. التحقق من المفتاح
  const authError = requireAgentApiKey(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const business_id = searchParams.get("business_id");
  const client_phone_raw = searchParams.get("client_phone");

  if (!business_id || !client_phone_raw) {
    return NextResponse.json(
      {
        status: "fail",
        message: "business_id و client_phone مطلوبان",
      },
      { status: 400 }
    );
  }

  // 2. تطبيع رقم العميل
  const client_phone = normalizePhone(client_phone_raw);

  // 3. التحقق إن النشاط موجود (ضمان ownership)
  const provider = await prisma.providerProfile.findUnique({
    where: { id: business_id },
    select: { id: true },
  });

  if (!provider) {
    return NextResponse.json(
      { status: "fail", message: "النشاط غير موجود" },
      { status: 404 }
    );
  }

  // 4. البحث عن الحجز النشط
  const booking = await prisma.booking.findFirst({
    where: {
      providerId: business_id,
      status: { in: [BookingStatus.HELD, BookingStatus.CONFIRMED] },
      OR: [
        { client: { phone: client_phone } },
        { clientPhone: client_phone },
      ],
    },
    include: {
      service: {
        select: { id: true, name: true, durationMinutes: true, price: true },
      },
    },
    orderBy: { startsAt: "asc" },
  });

  if (!booking) {
    return NextResponse.json({
      status: "success",
      data: null,
    });
  }

  return NextResponse.json({
    status: "success",
    data: {
      id: booking.id,
      date: booking.startsAt.toISOString().split("T")[0],
      time: booking.startsAt.toISOString().split("T")[1]?.substring(0, 5),
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
      status: booking.status,
      service: booking.service,
    },
  });
}
