import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentMethod, PaymentStatus } from "@/generated/prisma/enums";
import { handleError } from "@/lib/api";

/**
 * POST /api/payments/checkout
 * Mock checkout endpoint — ينشئ طلب دفع ويرجع payment_url وهمي
 * في الإنتاج: هيتبدل بـ Kashier أو Paymob Sandbox
 *
 * Body: {
 *   bookingId: string,
 *   method?: "INSTAPAY" | "VODAFONE_CASH" | "CARD" | "CASH"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, method } = body;

    if (!bookingId) {
      return NextResponse.json(
        { status: "fail", message: "bookingId مطلوب" },
        { status: 400 }
      );
    }

    // 1. جلب الحجز مع بيانات الدفع
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payment: true,
        service: { select: { name: true } },
        provider: {
          select: { slug: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { status: "fail", message: "الحجز غير موجود" },
        { status: 404 }
      );
    }

    if (!booking.payment) {
      return NextResponse.json(
        { status: "fail", message: "لم يتم إنشاء سجل دفع لهذا الحجز" },
        { status: 404 }
      );
    }

    if (booking.payment.status === PaymentStatus.PAID) {
      return NextResponse.json(
        { status: "fail", message: "تم الدفع بالفعل لهذا الحجز" },
        { status: 400 }
      );
    }

    const paymentMethod =
      (method as PaymentMethod) ?? booking.payment.method ?? PaymentMethod.INSTAPAY;

    // 2. Mock: توليد رابط دفع وهمي مع reference ID
    const mockReference = `MOCK-${Date.now()}-${bookingId.slice(0, 6).toUpperCase()}`;
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const mockPaymentUrl = `${baseUrl}/api/payments/webhook?ref=${mockReference}&bookingId=${bookingId}&action=PAY`;

    // 3. تحديث طريقة الدفع والـ gatewayRef
    await prisma.payment.update({
      where: { bookingId },
      data: {
        method: paymentMethod,
        gatewayRef: mockReference,
        status: PaymentStatus.PENDING,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "تم إنشاء طلب الدفع بنجاح (بيئة اختبار)",
      data: {
        paymentId: booking.payment.id,
        bookingId,
        amount: booking.payment.amount,
        method: paymentMethod,
        reference: mockReference,
        payment_url: mockPaymentUrl,
        environment: "mock",
      },
    });
  } catch (error) {
    return handleError(error, "payments/checkout POST");
  }
}
