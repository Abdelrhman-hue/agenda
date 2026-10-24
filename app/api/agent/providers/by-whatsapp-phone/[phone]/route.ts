import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAgentApiKey, normalizePhone } from "@/lib/agent-auth";

/**
 * GET /api/agent/providers/by-whatsapp-phone/[phone]
 * يرجع business_id و business_name و sector بناءً على رقم الواتساب المرتبط بالنشاط
 * مُؤمَّن بـ X-API-Key
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ phone: string }> }
) {
  // 1. التحقق من المفتاح
  const authError = requireAgentApiKey(req);
  if (authError) return authError;

  const { phone: rawPhone } = await params;

  if (!rawPhone) {
    return NextResponse.json(
      { status: "fail", message: "رقم الواتساب مطلوب" },
      { status: 400 }
    );
  }

  // 2. تطبيع الرقم
  const normalizedPhone = normalizePhone(decodeURIComponent(rawPhone));

  // 3. البحث عن النشاط
  const provider = await prisma.providerProfile.findFirst({
    where: {
      whatsappNumber: normalizedPhone,
    },
    select: {
      id: true,
      slug: true,
      category: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!provider) {
    return NextResponse.json(
      {
        status: "fail",
        message: "لا يوجد نشاط مرتبط بهذا الرقم",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: "success",
    data: {
      business_id: provider.id,
      business_name: provider.user.name ?? provider.slug,
      sector: provider.category,
      slug: provider.slug,
    },
  });
}
