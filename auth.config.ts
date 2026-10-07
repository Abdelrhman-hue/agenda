import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { loginSchema } from "./utils/validation/auth/login";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Credentials({
      async authorize(data) {
        const validation = loginSchema.safeParse(data);

        if (!validation.success) {
          return null;
        }

        const { email, password } = validation.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordMatched = await bcrypt.compare(
          password,
          user.password
        );

        if (!isPasswordMatched) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    })
  ],
} satisfies NextAuthConfig;