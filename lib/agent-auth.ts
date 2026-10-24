import { NextRequest, NextResponse } from "next/server";

/**
 * تطبيع رقم الواتساب إلى صيغة موحدة بدون +، تبدأ بـ 20
 * مثال: +201012345678 أو 01012345678 → 201012345678
 */
export function normalizePhone(raw: string): string {
  // إزالة المسافات والمحارف الخاصة ما عدا الأرقام
  const digits = raw.replace(/\D/g, "");

  // لو بدأت بـ 0 (مصري محلي) → أضف 20 في الأول
  if (digits.startsWith("0") && digits.length === 11) {
    return "2" + digits;
  }

  // لو بدأت بـ 20 بالفعل → خليها كما هي
  if (digits.startsWith("20")) {
    return digits;
  }

  // أي صيغة تانية نرجعها كما هي
  return digits;
}

/**
 * Guard للتحقق من X-API-Key header
 * يرجع 401 لو المفتاح مش موجود أو غلط
 */
export function requireAgentApiKey(
  req: NextRequest
): NextResponse | null {
  const apiKey = req.headers.get("x-api-key");
  const validKey = process.env.AGENT_API_KEY;

  if (!validKey) {
    console.warn("AGENT_API_KEY is not set in environment variables");
    return NextResponse.json(
      { status: "error", message: "خطأ في إعداد الخادم" },
      { status: 500 }
    );
  }

  if (!apiKey || apiKey !== validKey) {
    return NextResponse.json(
      { status: "fail", message: "مفتاح API غير صحيح أو مفقود" },
      { status: 401 }
    );
  }

  return null; // السماح بالمرور
}
