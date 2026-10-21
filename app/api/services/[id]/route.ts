import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProvider } from "@/lib/guards";
import { HttpError, handleError, ok, parseBody } from "@/lib/api";
import { normalizeService, updateServiceSchema } from "@/utils/validation/provider/service";

/**
 * PATCH /api/services/[id] — تعديل أي حقل أو تفعيل/تعطيل.
 * مفيش حذف نهائي (التعطيل بس) لأن حجوزات قديمة ممكن تكون مرتبطة بالخدمة.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { providerProfile } = await requireProvider();
    const { id } = await params;
    const data = await parseBody(req, updateServiceSchema);

    // الخدمة لازم تخص النشاط الحالي، وإلا 404 (مفيش كشف إنها موجودة عند حد تاني)
    const current = await prisma.service.findFirst({
      where: { id, providerId: providerProfile.id },
    });
    if (!current) throw new HttpError(404, "الخدمة غير موجودة");

    const merged = {
      price: data.price ?? current.price,
      mode: data.mode ?? current.mode,
      depositAmount: data.depositAmount === undefined ? current.depositAmount : data.depositAmount,
      meetingUrl: data.meetingUrl === undefined ? current.meetingUrl : data.meetingUrl,
      requiresAddress: data.requiresAddress ?? current.requiresAddress,
    };
    if (merged.depositAmount != null && merged.depositAmount > merged.price) {
      throw new HttpError(400, "العربون لا يمكن أن يكون أكبر من سعر الخدمة");
    }

    const service = await prisma.service.update({
      where: { id: current.id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.durationMinutes !== undefined ? { durationMinutes: data.durationMinutes } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        price: merged.price,
        mode: merged.mode,
        depositAmount: merged.depositAmount ?? null,
        ...normalizeService(merged),
      },
    });
    return ok("تم تعديل الخدمة", { service });
  } catch (error) {
    return handleError(error, "services/[id] PATCH");
  }
}
