import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateBookingSchema } from "@/utils/validation/booking";
import { BookingStatus, PaymentStatus } from "@/generated/prisma/enums";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * PATCH /api/bookings/[id]
 * تحديث الحجز (نقل الموعد RESCHEDULE أو إلغاؤه CANCEL أو تحديث حالته)
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { status: "fail", message: "معرف الحجز مطلوب" },
        { status: 400 }
      );
    }

    const json = await request.json();
    const validation = updateBookingSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json(
        {
          status: "fail",
          message: validation.error.issues[0]?.message || "البيانات المدخلة غير صحيحة",
          errors: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const body = validation.data;

    // 1. Fetch current booking
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        provider: {
          include: {
            workingHours: true,
          },
        },
        payment: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { status: "fail", message: "الحجز غير موجود" },
        { status: 404 }
      );
    }

    // 2. Handle Action: CANCEL
    if (body.action === "CANCEL" || body.status === BookingStatus.CANCELLED) {
      if (booking.status === BookingStatus.CANCELLED) {
        return NextResponse.json(
          { status: "fail", message: "هذا الحجز ملغي بالفعل" },
          { status: 400 }
        );
      }

      const updated = await prisma.booking.update({
        where: { id },
        data: {
          status: BookingStatus.CANCELLED,
          cancellationReason: body.cancellationReason || "تم إلغاء الحجز من قبل المستخدم",
        },
        include: {
          client: { select: { id: true, name: true, phone: true } },
          service: true,
          payment: true,
        },
      });

      return NextResponse.json({
        status: "success",
        message: "تم إلغاء الحجز بنجاح",
        data: updated,
      });
    }

    // 3. Handle Action: RESCHEDULE
    if (body.action === "RESCHEDULE") {
      if (!body.startsAt) {
        return NextResponse.json(
          { status: "fail", message: "تاريخ ووقت الموعد الجديد مطلوب لنقل الموعد" },
          { status: 400 }
        );
      }

      if (booking.status === BookingStatus.CANCELLED) {
        return NextResponse.json(
          { status: "fail", message: "لا يمكن تعديل موعد حجز ملغي، يرجى إنشاء حجز جديد" },
          { status: 400 }
        );
      }

      const newStartsAt = new Date(body.startsAt);
      const now = new Date();

      if (isNaN(newStartsAt.getTime()) || newStartsAt < now) {
        return NextResponse.json(
          { status: "fail", message: "تاريخ الموعد الجديد غير صالح أو في وقت مضى" },
          { status: 400 }
        );
      }

      const newEndsAt = new Date(
        newStartsAt.getTime() + booking.service.durationMinutes * 60 * 1000
      );

      // Check Provider Absence on the new date
      const dateStart = new Date(newStartsAt);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(newStartsAt);
      dateEnd.setHours(23, 59, 59, 999);

      const absence = await prisma.providerAbsence.findFirst({
        where: {
          providerId: booking.providerId,
          date: { gte: dateStart, lte: dateEnd },
        },
      });

      if (absence) {
        return NextResponse.json(
          {
            status: "fail",
            message: `مقدم الخدمة في عطلة في هذا اليوم المحدد ${absence.reason ? `(${absence.reason})` : ""}`,
          },
          { status: 409 }
        );
      }

      // Check Working Hours
      const dayOfWeek = newStartsAt.getDay();
      const workingHour = booking.provider.workingHours.find((wh) => wh.dayOfWeek === dayOfWeek);

      if (!workingHour) {
        return NextResponse.json(
          { status: "fail", message: "مقدم الخدمة لا يعمل في هذا اليوم" },
          { status: 409 }
        );
      }

      const slotStartStr = newStartsAt.toTimeString().slice(0, 5);
      const slotEndStr = newEndsAt.toTimeString().slice(0, 5);

      if (slotStartStr < workingHour.startTime || slotEndStr > workingHour.endTime) {
        return NextResponse.json(
          {
            status: "fail",
            message: `الموعد الجديد يقع خارج ساعات العمل الرسمية (${workingHour.startTime} - ${workingHour.endTime})`,
          },
          { status: 400 }
        );
      }

      // Check Conflicts (excluding current booking)
      const conflict = await prisma.booking.findFirst({
        where: {
          id: { not: id },
          providerId: booking.providerId,
          status: { in: [BookingStatus.HELD, BookingStatus.CONFIRMED] },
          OR: [
            { startsAt: newStartsAt },
            {
              AND: [
                { startsAt: { lt: newEndsAt } },
                { endsAt: { gt: newStartsAt } },
              ],
            },
          ],
        },
      });

      if (conflict) {
        return NextResponse.json(
          {
            status: "fail",
            message: "الموعد المختار محجوز بالفعل، يرجى اختيار موعد آخر",
          },
          { status: 409 }
        );
      }

      // Reset hold window if it was in HELD status
      const updatedHold =
        booking.status === BookingStatus.HELD
          ? new Date(Date.now() + 10 * 60 * 1000)
          : booking.holdExpiresAt;

      const updated = await prisma.booking.update({
        where: { id },
        data: {
          startsAt: newStartsAt,
          endsAt: newEndsAt,
          holdExpiresAt: updatedHold,
          clientNotes: body.clientNotes !== undefined ? body.clientNotes : booking.clientNotes,
        },
        include: {
          client: { select: { id: true, name: true, phone: true } },
          service: true,
          payment: true,
        },
      });

      return NextResponse.json({
        status: "success",
        message: "تم نقل الموعد وتحديث الحجز بنجاح",
        data: updated,
      });
    }

    // 4. Handle other Status changes (CONFIRM, COMPLETE, NO_SHOW)
    let nextStatus = body.status;
    if (body.action === "CONFIRM") nextStatus = BookingStatus.CONFIRMED;
    if (body.action === "COMPLETE") nextStatus = BookingStatus.COMPLETED;
    if (body.action === "NO_SHOW") nextStatus = BookingStatus.NO_SHOW;

    const dataToUpdate: any = {};
    if (nextStatus) {
      dataToUpdate.status = nextStatus;
      if (nextStatus === BookingStatus.CONFIRMED) {
        dataToUpdate.holdExpiresAt = null;
      }
    }
    if (body.clientNotes !== undefined) dataToUpdate.clientNotes = body.clientNotes;
    if (body.address !== undefined) dataToUpdate.address = body.address;

    const updated = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id },
        data: dataToUpdate,
        include: {
          client: { select: { id: true, name: true, phone: true } },
          service: true,
          payment: true,
        },
      });

      // If confirming, also update payment status to PAID if it was PENDING
      if (nextStatus === BookingStatus.CONFIRMED && booking.payment?.status === PaymentStatus.PENDING) {
        await tx.payment.update({
          where: { bookingId: id },
          data: { status: PaymentStatus.PAID },
        });
      }

      return b;
    });

    return NextResponse.json({
      status: "success",
      message: "تم تحديث بيانات الحجز بنجاح",
      data: updated,
    });
  } catch (error: any) {
    console.error("PATCH /api/bookings/[id] error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "حدث خطأ أثناء تحديث الحجز",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings/[id]
 * جلب تفاصيل حجز محدد
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, phone: true, email: true } },
        service: true,
        provider: {
          include: {
            user: { select: { name: true, phone: true } },
          },
        },
        payment: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { status: "fail", message: "الحجز غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: booking,
    });
  } catch (error: any) {
    console.error("GET /api/bookings/[id] error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "حدث خطأ أثناء جلب تفاصيل الحجز",
      },
      { status: 500 }
    );
  }
}
