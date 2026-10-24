import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentStatus } from "@/generated/prisma/enums";
import { handleError } from "@/lib/api";

/**
 * POST /api/payments/webhook
 * Mock webhook endpoint لمعالجة تأكيد الدفع من بوابة الدفع
 * في الإنتاج: هيتحقق من توقيع Kashier / Paymob بشكل حقيقي
 *
 * للـ Mock: يشتغل عبر GET بـ query params أو POST بـ JSON body
 * Body/Params: {
 *   ref: string,       ← gatewayRef
 *   bookingId: string,
 *   action: "PAY" | "FAIL"   ← لبيئة الاختبار فقط
 * }
 */

// التحقق من توقيع الـ webhook (Mock — دايمًا صح في بيئة الاختبار)
function verifyWebhookSignature(req: NextRequest): boolean {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;

  // لو مفيش سكرت في الـ env → بيئة mock → نسمح
  if (!secret) {
    console.warn(
      "[payments/webhook] PAYMENT_WEBHOOK_SECRET not set — running in mock mode"
    );
    return true;
  }

  // في الإنتاج: تحقق من HMAC signature من الـ header
  // const signature = req.headers.get("x-payment-signature");
  // return verifyHmac(body, secret, signature);
  return true; // Mock approval
}

export async function POST(req: NextRequest) {
  try {
    const isValid = verifyWebhookSignature(req);
    if (!isValid) {
      return NextResponse.json(
        { status: "fail", message: "توقيع الـ webhook غير صالح" },
        { status: 403 }
      );
    }

    let body: { ref?: string; bookingId?: string; action?: string };
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      // صيغة webhook كلاسيكية من شركات الدفع (form data)
      const formData = await req.formData();
      body = Object.fromEntries(formData) as Record<string, string>;
    }

    const { ref, bookingId, action } = body;

    if (!ref || !bookingId) {
      return NextResponse.json(
        { status: "fail", message: "ref و bookingId مطلوبان" },
        { status: 400 }
      );
    }

    // 1. جلب سجل الدفع
    const payment = await prisma.payment.findFirst({
      where: { bookingId, gatewayRef: ref },
      include: { booking: { select: { id: true, status: true } } },
    });

    if (!payment) {
      return NextResponse.json(
        {
          status: "fail",
          message: "لم يتم العثور على سجل دفع مطابق",
        },
        { status: 404 }
      );
    }

    // 2. منع التكرار — لو الدفع اتعمل بالفعل
    if (payment.status === PaymentStatus.PAID) {
      return NextResponse.json({
        status: "success",
        message: "الدفع تم معالجته بالفعل (idempotent)",
        data: { paymentId: payment.id, status: payment.status },
      });
    }

    // 3. معالجة الحالة حسب الـ action (Mock) أو نجاح الدفع الحقيقي
    const isFailed = action === "FAIL";
    const newPaymentStatus = isFailed ? PaymentStatus.FAILED : PaymentStatus.PAID;
    const newBookingStatus = isFailed
      ? payment.booking.status // مش بنغيّره لو فشل
      : BookingStatus.CONFIRMED;

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: newPaymentStatus },
      });

      if (!isFailed) {
        await tx.booking.update({
          where: { id: bookingId },
          data: {
            status: newBookingStatus,
            holdExpiresAt: null, // إلغاء وقت الحجز المؤقت
          },
        });
      }
    });

    return NextResponse.json({
      status: "success",
      message: isFailed
        ? "تم تسجيل فشل الدفع"
        : "تم تأكيد الدفع وانتقل الحجز لـ CONFIRMED",
      data: {
        paymentId: payment.id,
        bookingId,
        paymentStatus: newPaymentStatus,
        bookingStatus: isFailed ? payment.booking.status : newBookingStatus,
      },
    });
  } catch (error) {
    return handleError(error, "payments/webhook POST");
  }
}

/**
 * GET /api/payments/webhook?ref=&bookingId=&action=
 * للاختبار اليدوي عبر المتصفح (Mock فقط)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");
  const bookingId = searchParams.get("bookingId");
  const action = searchParams.get("action");

  // إعادة توجيه لـ POST handler باستخدام نفس المنطق
  const mockReq = new NextRequest(req.url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ref, bookingId, action }),
  });

  return POST(mockReq);
}
