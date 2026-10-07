import { z } from "zod"

export const registerSchema = z.object({
   name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters"),

   accountType: z.enum(["PROVIDER", "CLIENT"], {
      message: "Account type must be PROVIDER or CLIENT",
   }),

   email: z
      .string()
      .trim()
      .email("Invalid email address"),

   phone: z
      .string()
      .trim()
      .min(8, "Invalid phone number")
      .max(15, "Invalid phone number"),

   password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(
         /[!@#$%^&*(),.?":{}|<>_\-\\[\]\/~`';&+=]/,
         "Password must contain at least one special character"
      ),
});

