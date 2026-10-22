import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from "@/utils/generateToken";
import { sendVerficationTokenMails } from "@/utils/sendMails";
import { loginSchema } from "@/utils/validation/auth/login";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const INVALID_CREDENTIALS = {
  status: "fail",
  message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json().catch(() => null);
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { status: "fail", message: "بيانات تسجيل الدخول غير صحيحة" },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const user = await prisma.user.findUnique({ where: { email } });

    // إيميل مش موجود، أو حساب جوجل بدون باسورد، أو باسورد غلط: نفس الرسالة
    if (!user || !user.password) {
      return NextResponse.json(INVALID_CREDENTIALS, { status: 401 });
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return NextResponse.json(INVALID_CREDENTIALS, { status: 401 });
    }

    // الباسورد صح بس الإيميل مش متأكد منه
    if (!user.emailVerified) {
      // بنبعت رابط جديد بس لو مفيش رابط ساري، علشان الرابط اللي في الإيميل ما يبوظش
      const existing = await prisma.verificationToken.findFirst({ where: { email } });
      if (!existing || existing.expires < new Date()) {
        const verificationToken = await generateVerificationToken(email);
        await sendVerficationTokenMails(verificationToken.email, verificationToken.token);
      }
      return NextResponse.json(
        {
          status: "fail",
          code: "EMAIL_NOT_VERIFIED",
          message: "فعّل بريدك الإلكتروني أولًا من الرابط اللي وصلك في الرسالة، وبعدها سجّل دخولك.",
        },
        { status: 403 }
      );
    }

    await signIn("credentials", { email, password, redirect: false });

    return NextResponse.json(
      {
        status: "success",
        code: "LOGIN_SUCCESS",
        message: "تم تسجيل الدخول بنجاح",
        data: { role: user.role },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return NextResponse.json(INVALID_CREDENTIALS, { status: 401 });
      }
      return NextResponse.json(
        { status: "error", message: "حدث خطأ أثناء تسجيل الدخول" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { status: "error", message: "حدث خطأ غير متوقع" },
      { status: 500 }
    );
  }
};