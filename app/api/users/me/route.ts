import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TUpdateUser } from "@/utils/dto";
import { updateUserSchema } from "@/utils/validation/user/update";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "سجل دخول أولًا", status: "fail" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
        password: true,
        providerProfile: {
          select: {
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
            _count: {
              select: {
                services: true,
                bookings: true,
              },
            },
          },
        },
        bookings: {
          take: 10,
          orderBy: { startsAt: "desc" },
          select: {
            id: true,
            startsAt: true,
            endsAt: true,
            status: true,
            service: {
              select: {
                id: true,
                name: true,
                price: true,
                durationMinutes: true,
              },
            },
            provider: {
              select: {
                id: true,
                slug: true,
                category: true,
                user: { select: { name: true, phone: true } },
              },
            },
            payment: {
              select: {
                amount: true,
                method: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { status: "fail", message: "المستخدم غير موجود" },
        { status: 401 }
      );
    }

    const { password, ...safeUser } = user;
    const userData = {
      ...safeUser,
      hasPassword: Boolean(password),
    };

    return NextResponse.json(
      { message: "المستخدم موجود", status: "success", data: { user: userData } },
      { status: 200 }
    );
  } catch (error) {
    console.error("error from server users get method => ", error);
    return NextResponse.json(
      { message: "حدث خطأ فى السيرفر", status: "error" },
      { status: 500 }
    );
  }
};

/**
 * PATCH /api/users/me
 * Updates authenticated user's name, phone, or password.
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "سجل دخول أولًا", status: "fail" },
        { status: 401 }
      );
    }

    const body = (await req.json()) as TUpdateUser;
    const { name, password, phone, currentPassword } = body;

    const userFromDB = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!userFromDB) {
      return NextResponse.json(
        { message: "غير مصرح لك بالتعديل على البيانات", status: "fail" },
        { status: 401 }
      );
    }

    const isValid = updateUserSchema.safeParse({ name, password, phone });
    if (!isValid.success) {
      return NextResponse.json(
        { message: isValid.error.issues[0].message, status: "fail" },
        { status: 400 }
      );
    }

    const data = isValid.data;
    const updatedData: { name?: string; phone?: string; password?: string } = {};

    if (data.name !== undefined) {
      updatedData.name = data.name;
    }

    if (data.password !== undefined) {
      if (!userFromDB.password) {
        return NextResponse.json(
          {
            message: "حسابك مرتبط بتسجيل الدخول عبر جوجل، لا يمكن تغيير كلمة المرور بهذه الطريقة",
            status: "fail",
          },
          { status: 400 }
        );
      }

      if (currentPassword === undefined) {
        return NextResponse.json(
          { message: "يرجى إدخال كلمة المرور الحالية", status: "fail" },
          { status: 400 }
        );
      }

      const isCurrentPasswordCorrect = await bcrypt.compare(
        currentPassword,
        userFromDB.password
      );

      if (!isCurrentPasswordCorrect) {
        return NextResponse.json(
          { message: "كلمة المرور الحالية غير صحيحة", status: "fail" },
          { status: 400 }
        );
      }

      const passwordHashed = await bcrypt.hash(data.password, 10);
      updatedData.password = passwordHashed;
    }

    if (data.phone !== undefined) {
      updatedData.phone = data.phone;
    }

    await prisma.user.update({
      where: { id: userFromDB.id },
      data: updatedData,
    });

    return NextResponse.json(
      {
        message: "تم تعديل البيانات بنجاح",
        status: "success",
        data: { name: updatedData.name, phone: updatedData.phone },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("error from update api route in users/me => ", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { message: "رقم الهاتف مسجل بالفعل لحساب آخر", status: "fail" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "حدث خطأ من السيرفر", status: "error" },
      { status: 500 }
    );
  }
}
