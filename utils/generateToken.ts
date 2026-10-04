import { prisma } from "@/lib/prisma"
import { randomUUID } from "node:crypto"

export const generateVerificationToken = async (email: string) => {

   const verificationToken = await prisma.verificationToken.findFirst({ where: { email } })
   if (verificationToken) {
      await prisma.verificationToken.delete({ where: { identifier: verificationToken.identifier } })
   }

   const newVerficationToken = await prisma.verificationToken.create({
      data: {
         email,
         expires: new Date(new Date().getTime() + 3600 * 1000 * 2), // for two hours,
         token: randomUUID()
      }
   })

   return newVerficationToken
}