import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProvider } from "@/lib/guards";
import { handleError, ok, parseBody } from "@/lib/api";
import { createServiceSchema, normalizeService } from "@/utils/validation/provider/service";

/** GET /api/services?active=true */
export async function GET(req: NextRequest) {
  try {
    const { providerProfile } = await requireProvider();
    const activeOnly = new URL(req.url).searchParams.get("active") === "true";

    const services = await prisma.service.findMany({
      where: { providerId: providerProfile.id, ...(activeOnly ? { isActive: true } : {}) },
      orderBy: { id: "asc" },
    });
    return ok("تم جلب الخدمات", { services });
  } catch (error) {
    return handleError(error, "services GET");
  }
}

/** POST /api/services */
export async function POST(req: NextRequest) {
  try {
    const { providerProfile } = await requireProvider();
    const data = await parseBody(req, createServiceSchema);

    const service = await prisma.service.create({
      data: {
        providerId: providerProfile.id,
        name: data.name,
        durationMinutes: data.durationMinutes,
        price: data.price,
        depositAmount: data.depositAmount ?? null,
        mode: data.mode,
        ...normalizeService(data),
      },
    });
    return ok("تمت إضافة الخدمة", { service }, 201);
  } catch (error) {
    return handleError(error, "services POST");
  }
}
