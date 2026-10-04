import { signIn } from "@/auth";
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

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return NextResponse.json(
      {
        status: "success",
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