import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import {
  createBookingSchema,
} from "@/utils/validation/booking";
import {
  expireOverdueHeldBookings,
  resolveProviderProfile,
  calculateDeposit,
} from "@/lib/bookingHelper";
import { BookingStatus, PaymentStatus, Role } from "@/generated/prisma/enums";

/**
 * POST /api/bookings
 * إنشاء حجز جديد وتحديد الموعد ومبلغ العربون المطلوب
 */
export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const validation = createBookingSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json(
        {
          status: "fail",
          message: validation.error.issues[0]?.message || "بيانات الحجز غير صحيحة",
          errors: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const body = validation.data;

    // 1. Expire any stale holds
    await expireOverdueHeldBookings();

    // 2. Resolve Provider
    const provider = await resolveProviderProfile({
      providerId: body.providerId,
      slug: body.slug,
      businessId: body.businessId,
    });

    if (!provider) {
      return NextResponse.json(
        { status: "fail", message: "مقدم الخدمة غير مسجل أو غير متاح" },
        { status: 404 }
      );
    }

    // 3. Resolve Service
    const service = provider.services.find((s) => s.id === body.serviceId && s.isActive);
    if (!service) {
      return NextResponse.json(
        { status: "fail", message: "الخدمة المطلوبة غير متوفرة حالياً" },
        { status: 404 }
      );
    }

    if (service.requiresAddress && !body.address?.trim()) {
      return NextResponse.json(
        { status: "fail", message: "عنوان الحضور مطلوب لإتمام حجز هذه الخدمة" },
        { status: 400 }
      );
    }

    // 4. Timing calculations
    const startsAt = new Date(body.startsAt);
    const now = new Date();

    if (isNaN(startsAt.getTime())) {
      return NextResponse.json(
        { status: "fail", message: "صيغة تاريخ ووقت الحجز غير صحيحة" },
        { status: 400 }
      );
    }

    if (startsAt < now) {
      return NextResponse.json(
        { status: "fail", message: "لا يمكن حجز موعد في وقت مضى" },
        { status: 400 }
      );
    }

    const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60 * 1000);

    // 5. Check Provider Absence
    const dateStart = new Date(startsAt);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(startsAt);
    dateEnd.setHours(23, 59, 59, 999);

    const absence = await prisma.providerAbsence.findFirst({
      where: {
        providerId: provider.id,
        date: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
    });

    if (absence) {
      return NextResponse.json(
        {
          status: "fail",
          message: `مقدم الخدمة غير متاح في هذا التاريخ ${absence.reason ? `(${absence.reason})` : ""}`,
        },
        { status: 409 }
      );
    }

    // 6. Check Provider Working Hours
    const dayOfWeek = startsAt.getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday
    const workingHour = provider.workingHours.find((wh) => wh.dayOfWeek === dayOfWeek);

    if (!workingHour) {
      return NextResponse.json(
        { status: "fail", message: "مقدم الخدمة في يوم عطلة أسبوعية في هذا اليوم" },
        { status: 409 }
      );
    }

    // Convert slot hours to comparison
    const slotStartStr = startsAt.toTimeString().slice(0, 5); // "HH:MM"
    const slotEndStr = endsAt.toTimeString().slice(0, 5); // "HH:MM"

    if (slotStartStr < workingHour.startTime || slotEndStr > workingHour.endTime) {
      return NextResponse.json(
        {
          status: "fail",
          message: `الموعد خارج ساعات العمل الرسمية (${workingHour.startTime} إلى ${workingHour.endTime})`,
        },
        { status: 400 }
      );
    }

    // 7. Check for Slot Conflicts (overlapping bookings)
    const existingConflict = await prisma.booking.findFirst({
      where: {
        providerId: provider.id,
        status: { in: [BookingStatus.HELD, BookingStatus.CONFIRMED] },
        OR: [
          // exact start match
          { startsAt: startsAt },
          // overlap condition: startsAt < existing.endsAt AND endsAt > existing.startsAt
          {
            AND: [
              { startsAt: { lt: endsAt } },
              { endsAt: { gt: startsAt } },
            ],
          },
        ],
      },
    });

    if (existingConflict) {
      return NextResponse.json(
        {
          status: "fail",
          message: "هذا الموعد محجوز بالفعل أو محجوز مؤقتاً لعميل آخر، يرجى اختيار موعد آخر",
        },
        { status: 409 }
      );
    }

    // 8. Resolve Client User
    const session = await auth();
    let clientId = session?.user?.id || body.clientId;

    if (!clientId) {
      // Find or create a client record by phone or email
      const clientEmail = body.clientEmail?.trim() || null;
      const clientPhone = body.clientPhone?.trim() || null;

      let existingUser = null;
      if (clientEmail || clientPhone) {
        existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              ...(clientEmail ? [{ email: clientEmail }] : []),
              ...(clientPhone ? [{ phone: clientPhone }] : []),
            ],
          },
        });
      }

      if (existingUser) {
        clientId = existingUser.id;
      } else {
        const newUser = await prisma.user.create({
          data: {
            name: body.clientName?.trim() || "عميل",
            email: clientEmail,
            phone: clientPhone,
            role: Role.CLIENT,
          },
        });
        clientId = newUser.id;
      }
    }

    // 9. Deposit & Price Breakdown Calculation
    const pricing = calculateDeposit({
      depositType: provider.depositType,
      depositAmount: provider.depositAmount,
      servicePrice: service.price,
    });

    const isZeroDeposit = pricing.depositAmount === 0;
    const initialStatus = isZeroDeposit ? BookingStatus.CONFIRMED : BookingStatus.HELD;
    // 10-minute hold window for deposit settlement (as specified in Agendah Design System)
    const holdExpiresAt = isZeroDeposit ? null : new Date(Date.now() + 10 * 60 * 1000);

    // 10. Persist Booking & Payment in Transaction
    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          providerId: provider.id,
          serviceId: service.id,
          clientId: clientId!,
          startsAt,
          endsAt,
          status: initialStatus,
          holdExpiresAt,
          address: body.address?.trim() || null,
          clientNotes: body.clientNotes?.trim() || null,
        },
        include: {
          client: {
            select: { id: true, name: true, phone: true, email: true },
          },
          service: true,
          provider: {
            include: {
              user: { select: { name: true, phone: true } },
            },
          },
        },
      });

      const payment = await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount: pricing.depositAmount,
          method: body.paymentMethod,
          status: isZeroDeposit ? PaymentStatus.PAID : PaymentStatus.PENDING,
        },
      });

      return { booking, payment };
    });

    return NextResponse.json(
      {
        status: "success",
        message: isZeroDeposit
          ? "تم تأكيد حجز الموعد بنجاح دون الحاجة لعربون"
          : "تم إنشاء الحجز وقفل الموعد مؤقتاً لمدة 10 دقائق، يرجى سداد العربون لتأكيد الحجز",
        data: {
          bookingId: result.booking.id,
          startsAt: result.booking.startsAt,
          endsAt: result.booking.endsAt,
          status: result.booking.status,
          holdExpiresAt: result.booking.holdExpiresAt,
          address: result.booking.address,
          clientNotes: result.booking.clientNotes,
          service: {
            id: result.booking.service.id,
            name: result.booking.service.name,
            durationMinutes: result.booking.service.durationMinutes,
            price: result.booking.service.price,
          },
          pricing,
          payment: {
            id: result.payment.id,
            amount: result.payment.amount,
            method: result.payment.method,
            status: result.payment.status,
          },
          client: result.booking.client,
          provider: {
            id: result.booking.provider.id,
            slug: result.booking.provider.slug,
            name: result.booking.provider.user.name,
            phone: result.booking.provider.user.phone,
          },
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/bookings error:", error);

    // Check Prisma unique constraint violation (P2002 on @@unique([providerId, startsAt]))
    if (error?.code === "P2002") {
      return NextResponse.json(
        {
          status: "fail",
          message: "هذا الموعد تم حجزه للتو، يرجى اختيار موعد آخر",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        status: "error",
        message: "حدث خطأ غير متوقع أثناء معالجة الحجز",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings
 * جلب قائمة الحجوزات مع دعم الفلترة (حسب businessId/providerId، التاريخ، أو الحالة) لعرضها في الداشبورد
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Expire any stale holds
    await expireOverdueHeldBookings();

    const providerId = searchParams.get("providerId") || searchParams.get("businessId");
    const slug = searchParams.get("slug");
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status") as BookingStatus | null;
    const date = searchParams.get("date"); // "YYYY-MM-DD"
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search")?.trim();

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    // Resolve provider ID if slug or businessId provided
    let resolvedProviderId = providerId || undefined;
    if (!resolvedProviderId && slug) {
      const p = await prisma.providerProfile.findUnique({
        where: { slug },
        select: { id: true },
      });
      if (p) resolvedProviderId = p.id;
    }

    // Build Prisma filter
    const where: any = {};

    if (resolvedProviderId) {
      where.providerId = resolvedProviderId;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    if (status && Object.values(BookingStatus).includes(status)) {
      where.status = status;
    }

    // Date filtering
    if (date) {
      const dStart = new Date(date);
      dStart.setHours(0, 0, 0, 0);
      const dEnd = new Date(date);
      dEnd.setHours(23, 59, 59, 999);
      where.startsAt = {
        gte: dStart,
        lte: dEnd,
      };
    } else if (startDate || endDate) {
      where.startsAt = {};
      if (startDate) where.startsAt.gte = new Date(startDate);
      if (endDate) where.startsAt.lte = new Date(endDate);
    }

    // Search query by client name, client phone, or service name
    if (search) {
      where.OR = [
        { client: { name: { contains: search, mode: "insensitive" } } },
        { client: { phone: { contains: search, mode: "insensitive" } } },
        { client: { email: { contains: search, mode: "insensitive" } } },
        { service: { name: { contains: search, mode: "insensitive" } } },
        { clientNotes: { contains: search, mode: "insensitive" } },
      ];
    }

    // Query data in parallel with total count and status metrics
    const [bookings, totalCount, statsGroup] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          client: {
            select: { id: true, name: true, phone: true, email: true },
          },
          service: {
            select: {
              id: true,
              name: true,
              price: true,
              durationMinutes: true,
              requiresAddress: true,
            },
          },
          provider: {
            select: {
              id: true,
              slug: true,
              category: true,
              depositType: true,
              depositAmount: true,
              user: { select: { name: true, phone: true } },
            },
          },
          payment: {
            select: { id: true, amount: true, method: true, status: true },
          },
        },
        orderBy: { startsAt: "desc" },
        skip,
        take: limit,
      }),

      prisma.booking.count({ where }),

      prisma.booking.groupBy({
        by: ["status"],
        where: resolvedProviderId ? { providerId: resolvedProviderId } : {},
        _count: { _all: true },
      }),
    ]);

    // Metrics summary for dashboard
    const metrics = {
      total: totalCount,
      confirmed: statsGroup.find((s) => s.status === BookingStatus.CONFIRMED)?._count._all || 0,
      held: statsGroup.find((s) => s.status === BookingStatus.HELD)?._count._all || 0,
      cancelled: statsGroup.find((s) => s.status === BookingStatus.CANCELLED)?._count._all || 0,
      completed: statsGroup.find((s) => s.status === BookingStatus.COMPLETED)?._count._all || 0,
      noShow: statsGroup.find((s) => s.status === BookingStatus.NO_SHOW)?._count._all || 0,
    };

    return NextResponse.json({
      status: "success",
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      metrics,
      data: bookings,
    });
  } catch (error: any) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "حدث خطأ أثناء جلب قائمة الحجوزات",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
