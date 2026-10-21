import { z } from "zod";
import { slugSchema } from "./slug";

export const categorySchema = z.enum(
  ["CLINIC", "TUTOR", "GYM", "CONSULTANT", "BEAUTY", "CRAFTSMAN", "OTHER"],
  { message: "القطاع غير صحيح" }
);

export const upsertProfileSchema = z
  .object({
    category: categorySchema.optional(),
    bio: z.string().trim().max(300, "النبذة لازم تكون 300 حرف على الأكثر").optional(),
    slug: slugSchema.optional(),
  })
  .refine(
    (d) => d.category !== undefined || d.bio !== undefined || d.slug !== undefined,
    { message: "لا توجد بيانات للحفظ" }
  );
