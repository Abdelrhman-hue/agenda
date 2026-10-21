import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProvider } from "@/lib/guards";
import { HttpError, handleError, ok } from "@/lib/api";

/** DELETE /api/provider/absences/[id] — إجازات النشاط الحالي فقط */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { providerProfile } = await requireProvider();
    const { id } = await params;

    const result = await prisma.providerAbsence.deleteMany({
      where: { id, providerId: providerProfile.id },
    });
    if (result.count === 0) throw new HttpError(404, "الإجازة غير موجودة");

    return ok("تم حذف الإجازة");
  } catch (error) {
    return handleError(error, "provider/absences/[id] DELETE");
  }
}
