import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ROLE_CHOOSE = "/auth/role-choose";
// صفحات الـ dashboard اللي العميل (CLIENT) مسموح له بيها
const CLIENT_ALLOWED = ["/dashboard/bookings"];

export const proxy = auth(async (req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const user = req.auth?.user;
  const go = (to: string) => NextResponse.redirect(new URL(to, nextUrl));
  const isProtected =
    path.startsWith("/dashboard") || path.startsWith("/onboarding");
  const LOGIN_REQUIRED = [
    "/dashboard",
    "/onboarding",
    "/book",
    "/bookings",
    "/profile",
    "/auth/profile",
  ];
  const requiresLogin = LOGIN_REQUIRED.some(
    (base) => path === base || path.startsWith(base + "/"),
  );
  // 1) غير مسجل
  if (!user) {
    return requiresLogin || path === ROLE_CHOOSE
      ? go("/auth/login")
      : NextResponse.next();
  }

  // 2) مستخدم جوجل جديد لسه ماختارش دوره: يروح لاختيار الدور قبل أي صفحة
  if (user.roleChosen === false) {
    return path === ROLE_CHOOSE ? NextResponse.next() : go(ROLE_CHOOSE);
  }
  if (path === ROLE_CHOOSE)
    return go(user.role === "PROVIDER" ? "/dashboard" : "/home");

  if (!isProtected) return NextResponse.next();
  if (user.role === "ADMIN") return NextResponse.next();

  // 3) CLIENT
  if (user.role !== "PROVIDER") {
    return CLIENT_ALLOWED.some((p) => path.startsWith(p))
      ? NextResponse.next()
      : go("/home");
  }

  // 4) PROVIDER: جديد → onboarding، مكتمل → dashboard
  const profile = await prisma.providerProfile.findUnique({
    where: { userId: user.id },
    select: { onboardingCompleted: true },
  });
  const done = profile?.onboardingCompleted === true;
  if (!done && !path.startsWith("/onboarding")) return go("/onboarding");
  if (done && path.startsWith("/onboarding")) return go("/dashboard");

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
