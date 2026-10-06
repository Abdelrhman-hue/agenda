import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
   adapter: PrismaAdapter(prisma),
   callbacks: {
      async signIn({ account, user }) {
         if (account?.provider !== "credentials") return true

         const userFromDB = await prisma.user.findUnique({ where: { id: user.id } })
         if (!userFromDB?.emailVerified) return false

         return true
      }
   },
   session: {
      strategy: "jwt"
   },
   ...authConfig
})

