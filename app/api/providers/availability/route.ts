import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { availabilityQuerySchema } from "@/utils/validation/booking";
import {
  expireOverdueHeldBookings,
  resolveProviderProfile,
} from "@/lib/bookingHelper";
import { BookingStatus } from "@/generated/prisma/enums";
import { IAvailabilitySlot, IProviderAvailabilityResponse } from "@/utils/dto/booking";

/**
 * GET /api/providers/availability
 * فحص الأوقات المتاحة والمحجوزة لمقدم الخدمة في تاريخ محدد
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 1. Expire overdue holds
    await expireOverdueHeldBookings();

    const providerId = searchParams.get("providerId") || searchParams.get("businessId") || undefined;
    const slug = searchParams.get("slug") || undefined;
    const date = searchParams.get("date") || undefined;
    const serviceId = searchParams.get("serviceId") || undefined;

    const validation = availabilityQuerySchema.safeParse({
      providerId,
      slug,
      date,
      serviceId,
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          status: "fail",
          message: validation.error.issues[0]?.message || "بيانات الاستعلام غير صالحة",
          errors: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const query = validation.data;

    // 2. Resolve Provider Profile
    const provider = await resolveProviderProfile({
      providerId: query.providerId,
      slug: query.slug,
      businessId: query.businessId,
    });

    if (!provider) {
      return NextResponse.json(
        { status: "fail", message: "مقدم الخدمة غير مسجل أو غير متاح" },
        { status: 404 }
      );
    }

    // 3. Resolve Service Duration
    let slotDurationMinutes = 30;
    if (query.serviceId) {
      const s = provider.services.find((serv) => serv.id === query.serviceId);
      if (s) {
        slotDurationMinutes = s.durationMinutes;
      }
    } else if (provider.services.length > 0) {
      slotDurationMinutes = provider.services[0].durationMinutes || 30;
    }

    const bufferMinutes = provider.bufferMinutes || 0;

    // 4. Parse Date and Day of Week
    const [yearStr, monthStr, dayStr] = query.date.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    const day = parseInt(dayStr, 10);

    const targetDate = new Date(year, month, day);
    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 6 = Saturday

    const dayStart = new Date(Date.UTC(year, month, day, 0, 0, 0));
    const dayEnd = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

    // 5. Check Provider Absence on this date
    const absence = await prisma.providerAbsence.findFirst({
      where: {
        providerId: provider.id,
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    });

    if (absence) {
      const responsePayload: IProviderAvailabilityResponse = {
        providerId: provider.id,
        providerName: provider.user.name || "مقدم الخدمة",
        slug: provider.slug,
        date: query.date,
        dayOfWeek,
        isWorkingDay: true,
        isAbsent: true,
        absenceReason: absence.reason || "عطلة طارئة / غير متاح في هذا التاريخ",
        workingHours: null,
        slotDurationMinutes,
        bufferMinutes,
        totalSlots: 0,
        availableSlotsCount: 0,
        slots: [],
      };

      return NextResponse.json({
        status: "success",
        message: "مقدم الخدمة غير متاح في هذا التاريخ",
        data: responsePayload,
      });
    }

    // 6. Check Working Hours for dayOfWeek
    const workingHour = provider.workingHours.find((wh) => wh.dayOfWeek === dayOfWeek);

    if (!workingHour) {
      const responsePayload: IProviderAvailabilityResponse = {
        providerId: provider.id,
        providerName: provider.user.name || "مقدم الخدمة",
        slug: provider.slug,
        date: query.date,
        dayOfWeek,
        isWorkingDay: false,
        isAbsent: false,
        absenceReason: null,
        workingHours: null,
        slotDurationMinutes,
        bufferMinutes,
        totalSlots: 0,
        availableSlotsCount: 0,
        slots: [],
      };

      return NextResponse.json({
        status: "success",
        message: "مقدم الخدمة في عطلة أسبوعية في هذا اليوم",
        data: responsePayload,
      });
    }

    // 7. Fetch active bookings on that date
    const existingBookings = await prisma.booking.findMany({
      where: {
        providerId: provider.id,
        status: { in: [BookingStatus.HELD, BookingStatus.CONFIRMED] },
        startsAt: {
          gte: new Date(year, month, day, 0, 0, 0),
          lte: new Date(year, month, day, 23, 59, 59, 999),
        },
      },
      select: {
        id: true,
        startsAt: true,
        endsAt: true,
        status: true,
      },
    });

    // 8. Generate Time Slots
    const [startH, startM] = workingHour.startTime.split(":").map(Number);
    const [endH, endM] = workingHour.endTime.split(":").map(Number);

    const startMinutesTotal = startH * 60 + startM;
    const endMinutesTotal = endH * 60 + endM;

    const slots: IAvailabilitySlot[] = [];
    const now = new Date();

    const slotInterval = slotDurationMinutes + bufferMinutes;

    for (
      let currentMinute = startMinutesTotal;
      currentMinute + slotDurationMinutes <= endMinutesTotal;
      currentMinute += slotInterval
    ) {
      const slotStartH = Math.floor(currentMinute / 60);
      const slotStartM = currentMinute % 60;

      const slotEndTotal = currentMinute + slotDurationMinutes;
      const slotEndH = Math.floor(slotEndTotal / 60);
      const slotEndM = slotEndTotal % 60;

      const formatTime = (h: number, m: number) =>
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

      const timeStr = formatTime(slotStartH, slotStartM);
      const endTimeStr = formatTime(slotEndH, slotEndM);

      const slotStartDate = new Date(year, month, day, slotStartH, slotStartM, 0);
      const slotEndDate = new Date(year, month, day, slotEndH, slotEndM, 0);

      // Check if slot is in the past
      const isPast = slotStartDate.getTime() <= now.getTime();

      // Check conflict with active bookings
      const conflictingBooking = existingBookings.find((booking) => {
        const bStart = booking.startsAt.getTime();
        const bEnd = booking.endsAt.getTime();
        const sStart = slotStartDate.getTime();
        const sEnd = slotEndDate.getTime();

        return sStart < bEnd && sEnd > bStart;
      });

      let isAvailable = true;
      let slotStatus: "AVAILABLE" | "BOOKED" | "HELD" | "PAST" = "AVAILABLE";

      if (isPast) {
        isAvailable = false;
        slotStatus = "PAST";
      } else if (conflictingBooking) {
        isAvailable = false;
        slotStatus = conflictingBooking.status === BookingStatus.HELD ? "HELD" : "BOOKED";
      }

      slots.push({
        time: timeStr,
        endTime: endTimeStr,
        startsAt: slotStartDate.toISOString(),
        endsAt: slotEndDate.toISOString(),
        isAvailable,
        status: slotStatus,
      });
    }

    const availableSlotsCount = slots.filter((s) => s.isAvailable).length;

    const responsePayload: IProviderAvailabilityResponse = {
      providerId: provider.id,
      providerName: provider.user.name || "مقدم الخدمة",
      slug: provider.slug,
      date: query.date,
      dayOfWeek,
      isWorkingDay: true,
      isAbsent: false,
      absenceReason: null,
      workingHours: {
        startTime: workingHour.startTime,
        endTime: workingHour.endTime,
      },
      slotDurationMinutes,
      bufferMinutes,
      totalSlots: slots.length,
      availableSlotsCount,
      slots,
    };

    return NextResponse.json({
      status: "success",
      data: responsePayload,
    });
  } catch (error: any) {
    console.error("GET /api/providers/availability error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "حدث خطأ أثناء فحص أوقات التوفر",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
