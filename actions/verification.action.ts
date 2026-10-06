"use server"

import { prisma } from "@/lib/prisma"
import { ActionType } from "@/utils/types"

export const verifyingEmail = async (token: string): Promise<ActionType> => {

   const verificationToken = await prisma.verificationToken.findFirst({ where: { token } })
   if (!verificationToken) {
      return { isSuccess: false, message: "التوكن غير صحيح" }
   }

   const isExpired = verificationToken.expires < new Date()
   if (isExpired) {
      return { isSuccess: false, message: "انتهت صلاحية التوكن" }
   }

   const user = await prisma.user.findUnique({ where: { email: verificationToken.email } })
   if (!user) {
      return { isSuccess: false, message: "المستخدم غير موجود" }
   }

   // make email's user verified
   await prisma.user.update({
      where: {
         id: user.id
      },
      data: {
         emailVerified: new Date()
      }
   })

   // delete verification token record
   await prisma.verificationToken.delete({ where: { identifier: verificationToken.identifier } })

   return { isSuccess: true, message: "تم تأكيد حسابك بنجاح" }
}