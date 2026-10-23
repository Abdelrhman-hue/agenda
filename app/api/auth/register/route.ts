import { prisma } from "@/lib/prisma";
import { TRegisterUser } from "@/utils/dto";
import { generateVerificationToken } from "@/utils/generateToken";
import { sendVerficationTokenMails } from "@/utils/sendMails";
import { registerSchema } from "@/utils/validation/auth/register";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { createEmailVerificationStatusToken } from "@/lib/email-verification-status";

export const POST = async (request: NextRequest) => {
   try {

      const body = (await request.json()) as TRegisterUser

      const { name, email, password, phone, accountType } = body

      // validation check
      const isValid = registerSchema.safeParse({ name, email, password, phone, accountType })
      if (!isValid.success) {
         return NextResponse.json({ message: isValid.error.issues[0].message, status: "fail" }, { status: 400 })
      }

      // CHECK USER EXISTED
      const isUserExist = await prisma.user.findUnique({ where: { email } })
      if (isUserExist) {
         return NextResponse.json({ message: "الحساب موجود بالفعل", status: "fail" }, { status: 409 }) // conflict
      }

      // hashing password
      const hashedPassword = await bcrypt.hash(password, 10)

      //  register user
      await prisma.user.create({
         data: {
            name,
            email,
            password: hashedPassword,
            role: accountType,
            phone,
         }
      })

      const verificationToken = await generateVerificationToken(email)
      await sendVerficationTokenMails(verificationToken.email, verificationToken.token)

      

      return NextResponse.json({
         message: "تم إرسال رابط التحقق إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.",
         status: "success",
         data: { name, verificationStatusToken: createEmailVerificationStatusToken(email) },
      }, { status: 201 })

   } catch (error) {
      console.log(error)
      return NextResponse.json({ messgae: "حدث خطأ فى السيرفر", status: "error" }, { status: 500 })
   }
};
