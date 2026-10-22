import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProviderUser } from "@/lib/guards";
import { handleError, ok } from "@/lib/api";
import { slugSchema } from "@/utils/validation/provider/slug";

/** GET /api/provider/slug-check?slug=dr-sherif → { available, reason? } */
export async function GET(req: NextRequest) {
  try {
    const session = await requireProviderUser();
    const raw = new URL(req.url).searchParams.get("slug") ?? "";

    const parsed = slugSchema.safeParse(raw);
    if (!parsed.success) {
      return ok("الرابط غير صالح", { available: false, reason: parsed.error.issues[0].message });
    }

    const taken = await prisma.providerProfile.findUnique({
      where: { slug: parsed.data },
      select: { userId: true },
    });
    // لو الرابط بتاعي أنا فهو متاح
    const available = !taken || taken.userId === session.user.id;
    return ok(available ? "الرابط متاح" : "الرابط مستخدم", {
      available,
      ...(available ? {} : { reason: "الرابط ده مستخدم بالفعل" }),
    });
  } catch (error) {
    return handleError(error, "provider/slug-check GET");
  }
}
