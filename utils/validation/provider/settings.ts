import { z } from "zod";
import { isValidTimezone } from "@/lib/time";

export const settingsSchema = z
  .object({
    bufferMinutes: z
      .number({ message: "مدة الراحة مطلوبة" })
      .int("مدة الراحة لازم تكون رقم صحيح")
      .min(0, "مدة الراحة لا يمكن أن تكون سالبة")
      .max(120, "أقصى مدة راحة 120 دقيقة")
      .refine((v) => v % 5 === 0, "مدة الراحة لازم تكون من مضاعفات 5"),
    depositType: z.enum(["NONE", "FIXED", "FULL"], { message: "نوع العربون غير صحيح" }),
    depositAmount: z
      .number({ message: "قيمة العربون غير صحيحة" })
      .int("العربون لازم يكون رقم صحيح")
      .min(0, "العربون لا يمكن أن يكون سالباً")
      .optional(),
    timezone: z.string().refine(isValidTimezone, "المنطقة الزمنية غير صحيحة").default("Africa/Cairo"),
  })
  .superRefine((d, ctx) => {
    if (d.depositType === "FIXED" && (d.depositAmount === undefined || d.depositAmount <= 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["depositAmount"],
        message: "حدد مبلغ العربون الثابت (أكبر من صفر)",
      });
    }
  });
