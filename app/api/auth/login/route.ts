import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from "@/utils/generateToken";
import { sendVerficationTokenMails } from "@/utils/sendMails";
import { loginSchema } from "@/utils/validation/login";
import { AuthError } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          status: "fail",
          message: "بيانات تسجيل الدخول غير صحيحة",
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user?.emailVerified) {
      const verificationToken = await generateVerificationToken(email)
      await sendVerficationTokenMails(verificationToken.email, verificationToken.token)

      return NextResponse.json(
        {
          status: "success",
          code: "EMAIL_NOT_VERIFIED",
          message:
            "تم إرسال رابط التحقق إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.",
        },
        { status: 200 }
      );

    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return NextResponse.json(
      {
        status: "success",
        code: "LOGIN_SUCCESS",
        message: "تم تسجيل الدخول بنجاح",
      },
      { status: 200 }
    );

  } catch (error) {
    console.log(error);

    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return NextResponse.json(
          {
            status: "fail",
            message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          status: "error",
          message: "حدث خطأ أثناء تسجيل الدخول",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: "error",
        message: "حدث خطأ غير متوقع",
      },
      { status: 500 }
    );
  }
};