import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/guards";
import { HttpError } from "@/lib/api";

export type BookingScope =
  | { kind: "ADMIN" }
  | { kind: "PROVIDER"; providerId: string }
  | { kind: "CLIENT"; clientId: string };

/** 401 لو مش مسجل. النطاق بيتحدد من الجلسة مش من الـ query */
export async function getBookingScope(): Promise<{ scope: BookingScope }> {
  const session = await requireSession();
  const { id, role } = session.user;

  if (role === "ADMIN") return { scope: { kind: "ADMIN" } };

  if (role === "PROVIDER") {
    const profile = await prisma.providerProfile.findUnique({
      where: { userId: id },
      select: { id: true },
    });
    if (!profile) throw new HttpError(404, "لم يتم إنشاء ملف النشاط بعد");
    return { scope: { kind: "PROVIDER", providerId: profile.id } };
  }

  return { scope: { kind: "CLIENT", clientId: id } };
}

export function scopeWhere(scope: BookingScope) {
  if (scope.kind === "PROVIDER") return { providerId: scope.providerId };
  if (scope.kind === "CLIENT") return { clientId: scope.clientId };
  return {};
}