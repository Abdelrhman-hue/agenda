import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
   adapter: PrismaAdapter(prisma),
   events: {
      async linkAccount({ account, user }) {
         if (account.provider !== "credentials") {
            await prisma.user.update({
               where: { id: user.id },
               data: {
                  emailVerified: new Date()
               }
            })
         }
      }
   },
   callbacks: {
      async signIn({ account, user }) {
         if (account?.provider !== "credentials") return true

         const userFromDB = await prisma.user.findUnique({ where: { id: user.id } })
         if (!userFromDB?.emailVerified) return false

         return true
      },
      async session({ token, session }) {
         if (token.sub && session.user) {
            session.user.id = token.sub
            return session
         }
         return session
      }
   },
   session: {
      strategy: "jwt"
   },
   ...authConfig
})

