import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProvider } from "@/lib/guards";
import { handleError, ok, parseBody } from "@/lib/api";
import { WEEK_ORDER } from "@/lib/constants";
import { workingHoursSchema } from "@/utils/validation/provider/workingHours";

type Row = { dayOfWeek: number; startTime: string; endTime: string };

// الأسبوع كله من السبت، واليوم اللي ملوش صفوف = مقفول
function buildWeek(rows: Row[]) {
  return WEEK_ORDER.map((dayOfWeek) => {
    const shifts = rows
      .filter((r) => r.dayOfWeek === dayOfWeek)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .map(({ startTime, endTime }) => ({ startTime, endTime }));
    return { dayOfWeek, isOpen: shifts.length > 0, shifts };
  });
}

const rowSelect = { dayOfWeek: true, startTime: true, endTime: true } as const;

/** GET /api/provider/working-hours */
export async function GET() {
  try {
    const { providerProfile } = await requireProvider();
    const rows = await prisma.workingHours.findMany({
      where: { providerId: providerProfile.id },
      select: rowSelect,
    });
    return ok("تم جلب ساعات العمل", { days: buildWeek(rows) });
  } catch (error) {
    return handleError(error, "provider/working-hours GET");
  }
}

/** PUT /api/provider/working-hours — يستبدل الجدول بالكامل داخل transaction */
export async function PUT(req: NextRequest) {
  try {
    const { providerProfile } = await requireProvider();
    const { days } = await parseBody(req, workingHoursSchema);

    const data = days
      .filter((d) => d.isOpen)
      .flatMap((d) =>
        d.shifts.map((s) => ({
          providerId: providerProfile.id,
          dayOfWeek: d.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
        }))
      );

    await prisma.$transaction([
      prisma.workingHours.deleteMany({ where: { providerId: providerProfile.id } }),
      prisma.workingHours.createMany({ data }),
    ]);

    return ok("تم حفظ ساعات العمل", { days: buildWeek(data) });
  } catch (error) {
    return handleError(error, "provider/working-hours PUT");
  }
}
