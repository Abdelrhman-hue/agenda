import { z } from "zod";

export const roleSchema = z.object({
  role: z.enum(["PROVIDER", "CLIENT"], { message: "نوع الحساب لازم يكون PROVIDER أو CLIENT" }),
});
