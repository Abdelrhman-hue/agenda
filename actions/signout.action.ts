"use server";

import { signOut } from "@/auth";

export const signOutAct = async () => {
  await signOut({ redirectTo: "/" });
};
