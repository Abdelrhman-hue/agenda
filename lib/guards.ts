import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { HttpError } from "@/lib/api";

/** يرمي 401 لو مفيش جلسة */
export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) throw new HttpError(401, "سجل دخول أولًا");
  return session;
}

/** يرمي 401 / 403 — بدون ما يحتاج ProviderProfile (يستخدم في إنشاء الـ profile نفسه) */
export async function requireProviderUser() {
  const session = await requireSession();
  if (session.user.role !== "PROVIDER") {
    throw new HttpError(403, "هذه الخدمة متاحة لأصحاب الخدمات فقط");
  }
  return session;
}

/** يرجع { session, providerProfile } أو يرمي 401 / 403 / 404 */
export async function requireProvider() {
  const session = await requireProviderUser();
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!providerProfile) {
    throw new HttpError(404, "لم يتم إنشاء ملف النشاط بعد، اختر القطاع أولًا");
  }
  return { session, providerProfile };
}
