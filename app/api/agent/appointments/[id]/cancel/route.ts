import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAgentApiKey, normalizePhone } from "@/lib/agent-auth";
import { handleError } from "@/lib/api";
import { BookingStatus } from "@/generated/prisma/enums";

/**
 * POST /api/agent/appointments/[id]/cancel
 * إلغاء حجز — مع التحقق من الملكية
 * Body: { client_phone: string, reason?: string }
 * مُؤمَّن بـ X-API-Key
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAgentApiKey(req);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await req.json();
    const { client_phone, reason } = body;

    if (!client_phone) {
      return NextResponse.json(
        { status: "fail", message: "client_phone مطلوب" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(client_phone);

    // 1. جلب الحجز مع التحقق من الملكية
    const booking = await prisma.booking.findFirst({
      where: {
        id,
        OR: [
          { client: { phone: normalizedPhone } },
          { clientPhone: normalizedPhone },
        ],
      },
      select: { id: true, status: true },
    });

    if (!booking) {
      return NextResponse.json(
        {
          status: "fail",
          message: "الحجز غير موجود أو لا ينتمي لهذا العميل",
        },
        { status: 403 }
      );
    }

    if (booking.status === BookingStatus.CANCELLED) {
      return NextResponse.json(
        { status: "fail", message: "هذا الحجز ملغي بالفعل" },
        { status: 400 }
      );
    }

    if (
      booking.status === BookingStatus.COMPLETED ||
      booking.status === BookingStatus.NO_SHOW
    ) {
      return NextResponse.json(
        { status: "fail", message: "لا يمكن إلغاء حجز مكتمل أو غير حضور" },
        { status: 400 }
      );
    }

    // 2. الإلغاء
    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CANCELLED,
        cancellationReason: reason || "تم الإلغاء عبر الواتساب",
      },
      select: { id: true, status: true, cancellationReason: true },
    });

    return NextResponse.json({
      status: "success",
      message: "تم إلغاء الحجز بنجاح",
      data: updated,
    });
  } catch (error) {
    return handleError(error, "agent/appointments/[id]/cancel");
  }
}
