import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProvider } from "@/lib/guards";
import { HttpError, handleError, isUniqueError, ok, parseBody } from "@/lib/api";
import { todayIn } from "@/lib/time";
import { createAbsenceSchema, dateString } from "@/utils/validation/provider/absence";

const toDto = (a: { id: string; date: Date; reason: string | null }) => ({
  id: a.id,
  date: a.date.toISOString().slice(0, 10),
  reason: a.reason,
});

/** GET /api/provider/absences?from=YYYY-MM-DD&to=YYYY-MM-DD (الافتراضي من النهاردة) */
export async function GET(req: NextRequest) {
  try {
    const { providerProfile } = await requireProvider();
    const params = new URL(req.url).searchParams;
    const from = params.get("from") ?? todayIn(providerProfile.timezone);
    const to = params.get("to");

    for (const value of [from, to]) {
      if (value !== null && !dateString.safeParse(value).success) {
        throw new HttpError(400, "صيغة التاريخ يجب أن تكون YYYY-MM-DD");
      }
    }

    const absences = await prisma.providerAbsence.findMany({
      where: {
        providerId: providerProfile.id,
        date: { gte: new Date(from), ...(to ? { lte: new Date(to) } : {}) },
      },
      orderBy: { date: "asc" },
    });
    return ok("تم جلب الإجازات", { absences: absences.map(toDto) });
  } catch (error) {
    return handleError(error, "provider/absences GET");
  }
}

/** POST /api/provider/absences — من النهاردة فصاعداً فقط، و409 لو اليوم متسجل */
export async function POST(req: NextRequest) {
  try {
    const { providerProfile } = await requireProvider();
    const { date, reason } = await parseBody(req, createAbsenceSchema);

    if (date < todayIn(providerProfile.timezone)) {
      throw new HttpError(400, "لا يمكن إضافة إجازة في تاريخ سابق");
    }

    try {
      const absence = await prisma.providerAbsence.create({
        data: { providerId: providerProfile.id, date: new Date(date), reason: reason || null },
      });
      return ok("تمت إضافة الإجازة", { absence: toDto(absence) }, 201);
    } catch (e) {
      if (isUniqueError(e)) throw new HttpError(409, "اليوم ده متسجل كإجازة بالفعل");
      throw e;
    }
  } catch (error) {
    return handleError(error, "provider/absences POST");
  }
}
