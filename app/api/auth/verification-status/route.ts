import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateVerificationToken,
} from "@/utils/generateToken";
import { sendVerficationTokenMails } from "@/utils/sendMails";
import { isValidEmailVerificationStatusToken } from "@/lib/email-verification-status";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const token = typeof body.token === "string" ? body.token : "";
    const action = body.action === "resend" ? "resend" : "status";

    if (!email || !isValidEmailVerificationStatusToken(email, token)) {
      return NextResponse.json({ message: "طلب التحقق غير صالح" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true },
    });

    if (!user) {
      return NextResponse.json({ verified: false }, { headers: { "Cache-Control": "no-store" } });
    }

    if (user.emailVerified) {
      return NextResponse.json({ verified: true }, { headers: { "Cache-Control": "no-store" } });
    }

    if (action === "resend") {
      const verificationToken = await generateVerificationToken(email);
      await sendVerficationTokenMails(verificationToken.email, verificationToken.token);
      return NextResponse.json(
        { verified: false, resent: true, message: "أرسلنا رابط تحقق جديدًا إلى بريدك الإلكتروني." },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json({ verified: false }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[auth/verification-status]", error);
    return NextResponse.json({ message: "تعذر التحقق من حالة البريد الإلكتروني" }, { status: 500 });
  }
}
