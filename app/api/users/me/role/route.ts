import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { unstable_update } from "@/auth";
import { requireSession } from "@/lib/guards";
import { HttpError, handleError, ok, parseBody } from "@/lib/api";
import { roleSchema } from "@/utils/validation/user/role";

/**
 * POST /api/users/me/role
 * اختيار الدور لمرة واحدة (مستخدم جوجل الجديد فقط، roleChosen=false).
 * 400 بيانات غلط · 401 مش مسجل · 409 الدور اتحدد قبل كده
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const { role } = await parseBody(req, roleSchema);

    if (session.user.roleChosen !== false) {
      throw new HttpError(403, "اختيار نوع الحساب متاح للحسابات الجديدة فقط");
    }

    // شرط roleChosen=false جوه الـ WHERE يمنع أي سباق أو محاولة تغيير تانية
    const result = await prisma.user.updateMany({
      where: { id: session.user.id, roleChosen: false },
      data: { role, roleChosen: true },
    });
    if (result.count === 0) {
      throw new HttpError(409, "تم اختيار نوع الحساب من قبل ولا يمكن تغييره");
    }

    // تحديث الـ JWT بالدور الجديد (الـ jwt callback بيقرأ من الداتابيز)
    try {
      await unstable_update({ user: { role, roleChosen: true } } as never);
    } catch (e) {
      console.error("session update failed after role choose =>", e);
    }

    return ok("تم حفظ نوع الحساب", { role });
  } catch (error) {
    return handleError(error, "users/me/role POST");
  }
}
