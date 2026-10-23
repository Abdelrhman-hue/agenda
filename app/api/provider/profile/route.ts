import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProviderUser } from "@/lib/guards";
import { HttpError, handleError, isUniqueError, ok, parseBody } from "@/lib/api";
import { generateTempSlug, suggestSlug } from "@/lib/slug";
import { upsertProfileSchema } from "@/utils/validation/provider/profile";

const PROFILE_SELECT = {
  id: true,
  slug: true,
  category: true,
  bio: true,
  address: true,
  locationUrl: true,
  whatsappNumber: true,
  depositType: true,
  depositAmount: true,
  bufferMinutes: true,
  timezone: true,
  onboardingCompleted: true,
} as const;

export async function GET() {
  try {
    const session = await requireProviderUser();
    const profile = await prisma.providerProfile.findUnique({
      where: { userId: session.user.id },
      select: PROFILE_SELECT,
    });
    return ok("تم جلب بيانات النشاط", {
      profile,
      suggestedSlug: suggestSlug(session.user.email),
    });
  } catch (error) {
    return handleError(error, "provider/profile GET");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireProviderUser();
    const data = await parseBody(req, upsertProfileSchema);
    const userId = session.user.id;

    const existing = await prisma.providerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!existing && !data.category) throw new HttpError(400, "اختر القطاع أولًا");

    const bio = data.bio === undefined ? undefined : data.bio === "" ? null : data.bio;
    const address = data.address === undefined ? undefined : data.address === "" ? null : data.address;
    const locationUrl = data.locationUrl === undefined ? undefined : data.locationUrl === "" ? null : data.locationUrl;
    const whatsappNumber = data.whatsappNumber === undefined ? undefined : data.whatsappNumber === "" ? null : data.whatsappNumber;

    try {
      const profile = existing
        ? await prisma.providerProfile.update({
            where: { userId },
            data: {
              ...(data.category ? { category: data.category } : {}),
              ...(data.slug ? { slug: data.slug } : {}),
              ...(bio !== undefined ? { bio } : {}),
              ...(address !== undefined ? { address } : {}),
              ...(locationUrl !== undefined ? { locationUrl } : {}),
              ...(whatsappNumber !== undefined ? { whatsappNumber } : {}),
            },
            select: PROFILE_SELECT,
          })
        : await prisma.providerProfile.create({
            data: {
              userId,
              category: data.category!,
              slug: data.slug ?? generateTempSlug(),
              bio: bio ?? null,
              address: address ?? null,
              locationUrl: locationUrl ?? null,
              whatsappNumber: whatsappNumber ?? null,
            },
            select: PROFILE_SELECT,
          });
      return ok("تم حفظ بيانات النشاط", { profile });
    } catch (e) {
      if (isUniqueError(e)) {
        throw new HttpError(409, "رابط الحجز أو رقم الواتساب مستخدم بالفعل، اختر قيمة أخرى");
      }
      throw e;
    }
  } catch (error) {
    return handleError(error, "provider/profile PUT");
  }
}
