import { z } from "zod";
import { RESERVED_SLUGS } from "@/lib/constants";

export const slugSchema = z
  .string({ message: "رابط الحجز مطلوب" })
  .trim()
  .toLowerCase()
  .min(3, "رابط الحجز لازم يكون 3 أحرف على الأقل")
  .max(30, "رابط الحجز لازم يكون 30 حرف على الأكثر")
  .regex(
    /^[a-z0-9]+(-[a-z0-9]+)*$/,
    "الرابط يقبل حروف إنجليزية صغيرة وأرقام وشرطة فقط، بدون شرطة في البداية أو النهاية"
  )
  .refine((v) => !RESERVED_SLUGS.includes(v), "الرابط ده محجوز، اختر رابطاً آخر");
