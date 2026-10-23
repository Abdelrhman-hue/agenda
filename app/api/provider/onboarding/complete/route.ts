import { prisma } from "@/lib/prisma";
import { requireProvider } from "@/lib/guards";
import { HttpError, handleError, ok } from "@/lib/api";
import { isTempSlug } from "@/lib/slug";

/**
 * POST /api/provider/onboarding/complete
 * السيرفر هو اللي يتحقق: قطاع + slug + خدمة فعالة + يوم عمل، وإلا 400 بقائمة النواقص.
 */
export async function POST() {
  try {
    const { providerProfile } = await requireProvider();

    const [activeServices, hoursRows] = await Promise.all([
      prisma.service.count({
        where: { providerId: providerProfile.id, isActive: true },
      }),
      prisma.workingHours.count({ where: { providerId: providerProfile.id } }),
    ]);

    const missing: string[] = [];
    if (!providerProfile.category) missing.push("اختيار القطاع");
    if (!providerProfile.slug || isTempSlug(providerProfile.slug))
      missing.push("اختيار رابط الحجز");
    if (activeServices === 0) missing.push("إضافة خدمة فعالة واحدة على الأقل");
    if (hoursRows === 0) missing.push("تحديد يوم عمل واحد على الأقل");
    if (
      providerProfile.depositType === "FIXED" &&
      providerProfile.depositAmount <= 0
    ) {
      missing.push("تحديد إعدادات العربون");
    }
    if (missing.length > 0) {
      throw new HttpError(400, `الإعداد ناقص: ${missing.join("، ")}`, {
        missing,
      });
    }

    await prisma.providerProfile.update({
      where: { id: providerProfile.id },
      data: { onboardingCompleted: true },
    });
    return ok("تم إنهاء إعداد النشاط", { slug: providerProfile.slug });
  } catch (error) {
    return handleError(error, "provider/onboarding/complete POST");
  }
}
