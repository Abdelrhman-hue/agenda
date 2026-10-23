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
    address: z.string().trim().max(200, "العنوان يجب ألا يتجاوز 200 حرف").optional().nullable(),
    locationUrl: z.string().trim().max(500).optional().nullable(),
    whatsappNumber: z.string().trim().min(8, "رقم الواتساب غير صحيح").max(20, "رقم الواتساب غير صحيح").optional().nullable(),
  })
  .refine(
    (d) =>
      d.category !== undefined ||
      d.bio !== undefined ||
      d.slug !== undefined ||
      d.address !== undefined ||
      d.locationUrl !== undefined ||
      d.whatsappNumber !== undefined,
    { message: "لا توجد بيانات للحفظ" }
  );
