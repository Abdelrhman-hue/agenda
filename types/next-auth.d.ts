import type { DefaultSession } from "next-auth";

type AppRole = "ADMIN" | "PROVIDER" | "CLIENT";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: AppRole; roleChosen: boolean } & DefaultSession["user"];
  }
  interface User {
    role?: AppRole;
    roleChosen?: boolean;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: AppRole;
    roleChosen?: boolean;
  }
}
