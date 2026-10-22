import { prisma } from "@/lib/prisma";
import { TRegisterUser } from "@/utils/dto";
import { generateVerificationToken } from "@/utils/generateToken";
import { sendVerficationTokenMails } from "@/utils/sendMails";
import { registerSchema } from "@/utils/validation/auth/register";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as TRegisterUser;
    const { name, email, password, phone, accountType } = body;

    const isValid = registerSchema.safeParse({ name, email, password, phone, accountType });
    if (!isValid.success) {
      return NextResponse.json(
        { message: isValid.error.issues[0].message, status: "fail" },
        { status: 400 }
      );
    }

    // إيميل أو تليفون مسجّل قبل كده
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, ...(phone ? [{ phone }] : [])] },
      select: { email: true },
    });
    if (existing) {
      const message =
        existing.email === email ? "البريد الإلكتروني مسجل بالفعل" : "رقم الهاتف مسجل بالفعل";
      return NextResponse.json({ message, status: "fail" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, email, password: hashedPassword, role: accountType, phone: phone || null },
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerficationTokenMails(verificationToken.email, verificationToken.token);

    return NextResponse.json(
      {
        message: "تم إرسال رابط التحقق إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.",
        status: "success",
        data: { name },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "حدث خطأ فى السيرفر", status: "error" }, { status: 500 });
  }
};