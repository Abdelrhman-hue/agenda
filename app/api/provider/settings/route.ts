import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProvider } from "@/lib/guards";
import { handleError, ok, parseBody } from "@/lib/api";
import { settingsSchema } from "@/utils/validation/provider/settings";

const SETTINGS_SELECT = {
  bufferMinutes: true,
  depositType: true,
  depositAmount: true,
  timezone: true,
} as const;

/** GET /api/provider/settings */
export async function GET() {
  try {
    const { providerProfile } = await requireProvider();
    const { bufferMinutes, depositType, depositAmount, timezone } = providerProfile;
    return ok("تم جلب الإعدادات", {
      settings: { bufferMinutes, depositType, depositAmount, timezone },
    });
  } catch (error) {
    return handleError(error, "provider/settings GET");
  }
}

/** PUT /api/provider/settings — NONE / FULL بيخزنوا depositAmount = 0 */
export async function PUT(req: NextRequest) {
  try {
    const { providerProfile } = await requireProvider();
    const data = await parseBody(req, settingsSchema);

    const settings = await prisma.providerProfile.update({
      where: { id: providerProfile.id },
      data: {
        bufferMinutes: data.bufferMinutes,
        depositType: data.depositType,
        depositAmount: data.depositType === "FIXED" ? (data.depositAmount ?? 0) : 0,
        timezone: data.timezone,
      },
      select: SETTINGS_SELECT,
    });
    return ok("تم حفظ الإعدادات", { settings });
  } catch (error) {
    return handleError(error, "provider/settings PUT");
  }
}
