import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import type { Adapter, AdapterUser } from "next-auth/adapters";

const baseAdapter = PrismaAdapter(prisma);

const adapter: Adapter = {
  ...baseAdapter,
  // أي حساب جوجل جديد بيتعمل بـ roleChosen=false علشان يختار دوره (CLIENT / PROVIDER)
  createUser: async (data) => {
    const { id: _ignored, ...rest } = data;
    const user = await prisma.user.create({
      data: { ...rest, roleChosen: false },
    });
    return user as unknown as AdapterUser;
  },
};

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter,
  events: {
    async linkAccount({ account, user }) {
      if (account.provider === "credentials") return;
      const existing = await prisma.user.findUnique({
        where: { id: user.id },
        select: { emailVerified: true },
      });
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: existing?.emailVerified ?? new Date(),
          // لو الإيميل ماكانش متأكد منه، نلغي أي باسورد اتسجل قبل كده
          ...(existing?.emailVerified ? {} : { password: null }),
        },
      });
    },
  },
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider !== "credentials") return true;

      const userFromDB = await prisma.user.findUnique({
        where: { id: user.id },
      });
      if (!userFromDB?.emailVerified) return false;

      return true;
    },
    // الدور بيتحمّل من الداتابيز عند تسجيل الدخول وعند update() فقط
    async jwt({ token, trigger }) {
      if (token.sub && (trigger || !token.role || token.roleChosen === false)) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true, roleChosen: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.roleChosen = dbUser.roleChosen;
        }
      }
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role ?? "CLIENT";
        session.user.roleChosen = token.roleChosen ?? true;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
