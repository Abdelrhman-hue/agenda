import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAgentApiKey, normalizePhone } from "@/lib/agent-auth";
import { HttpError, handleError } from "@/lib/api";
import { BookingStatus } from "@/generated/prisma/enums";
import {
  dateInTimezone,
  timeInTimezone,
  weekdayInTimezone,
} from "@/lib/time";
import { expireOverdueHeldBookings } from "@/lib/bookingHelper";

/**
 * POST /api/agent/appointments/[id]/reschedule
 * نقل الحجز إلى موعد جديد — مع التحقق من الملكية والتوفر
 * Body: { client_phone: string, new_starts_at: string (ISO) }
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
    const { client_phone, new_starts_at } = body;

    if (!client_phone || !new_starts_at) {
      return NextResponse.json(
        {
          status: "fail",
          message: "client_phone و new_starts_at مطلوبان",
        },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(client_phone);

    // 1. جلب الحجز مع التحقق من الملكية (الحجز لازم يخص العميل ده)
    const booking = await prisma.booking.findFirst({
      where: {
        id,
        status: { in: [BookingStatus.HELD, BookingStatus.CONFIRMED] },
        OR: [
          { client: { phone: normalizedPhone } },
          { clientPhone: normalizedPhone },
        ],
      },
      include: {
        service: true,
        provider: {
          include: { workingHours: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          status: "fail",
          message: "الحجز غير موجود أو لا ينتمي لهذا العميل أو تم إلغاؤه",
        },
        { status: 403 }
      );
    }

    const newStartsAt = new Date(new_starts_at);
    const now = new Date();

    if (isNaN(newStartsAt.getTime()) || newStartsAt < now) {
      return NextResponse.json(
        {
          status: "fail",
          message: "الموعد الجديد غير صالح أو في وقت مضى",
        },
        { status: 400 }
      );
    }

    const newEndsAt = new Date(
      newStartsAt.getTime() + booking.service.durationMinutes * 60 * 1000
    );

    // 2. التحقق من الغياب
    const providerDate = dateInTimezone(newStartsAt, booking.provider.timezone);
    const absence = await prisma.providerAbsence.findFirst({
      where: {
        providerId: booking.providerId,
        date: new Date(`${providerDate}T00:00:00.000Z`),
      },
    });

    if (absence) {
      return NextResponse.json(
        {
          status: "fail",
          message: `المزوّد في عطلة في هذا اليوم${absence.reason ? ` (${absence.reason})` : ""}`,
        },
        { status: 409 }
      );
    }

    // 3. التحقق من ساعات العمل
    const dayOfWeek = weekdayInTimezone(newStartsAt, booking.provider.timezone);
    const workingHours = booking.provider.workingHours.filter(
      (wh) => wh.dayOfWeek === dayOfWeek
    );

    if (workingHours.length === 0) {
      return NextResponse.json(
        { status: "fail", message: "المزوّد لا يعمل في هذا اليوم" },
        { status: 409 }
      );
    }

    const slotStartStr = timeInTimezone(newStartsAt, booking.provider.timezone);
    const slotEndStr = timeInTimezone(newEndsAt, booking.provider.timezone);

    const fitsWorkingHours = workingHours.some(
      (wh) => slotStartStr >= wh.startTime && slotEndStr <= wh.endTime
    );

    if (!fitsWorkingHours) {
      const ranges = workingHours
        .map((wh) => `${wh.startTime}–${wh.endTime}`)
        .join("، ");
      return NextResponse.json(
        {
          status: "fail",
          message: `الموعد خارج ساعات العمل الرسمية (${ranges})`,
        },
        { status: 400 }
      );
    }

    // 4. التحقق من التعارض مع حجوزات أخرى
    const updated = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "id" FROM "ProviderProfile" WHERE "id" = ${booking.providerId} FOR UPDATE`;

      const conflict = await tx.booking.findFirst({
        where: {
          id: { not: id },
          providerId: booking.providerId,
          status: { in: [BookingStatus.HELD, BookingStatus.CONFIRMED] },
          startsAt: { lt: newEndsAt },
          endsAt: { gt: newStartsAt },
        },
        select: { id: true },
      });

      if (conflict) {
        throw new HttpError(
          409,
          "الموعد الجديد محجوز بالفعل، يرجى اختيار موعد آخر"
        );
      }

      return tx.booking.update({
        where: { id },
        data: { startsAt: newStartsAt, endsAt: newEndsAt },
        include: {
          client: { select: { id: true, name: true, phone: true } },
          service: true,
        },
      });
    });

    return NextResponse.json({
      status: "success",
      message: "تم نقل الموعد بنجاح",
      data: {
        id: updated.id,
        startsAt: updated.startsAt,
        endsAt: updated.endsAt,
        status: updated.status,
        service: updated.service,
      },
    });
  } catch (error) {
    return handleError(error, "agent/appointments/[id]/reschedule");
  }
}
