import { z } from "zod";

export const modeSchema = z.enum(["ONSITE", "ONLINE", "HOME_VISIT"], {
  message: "نوع الجلسة غير صحيح",
});

const shape = {
  name: z
    .string({ message: "اسم الخدمة مطلوب" })
    .trim()
    .min(2, "اسم الخدمة لازم يكون حرفين على الأقل")
    .max(80, "اسم الخدمة طويل جداً"),
  durationMinutes: z
    .number({ message: "مدة الخدمة مطلوبة" })
    .int("المدة لازم تكون رقم صحيح")
    .min(5, "أقل مدة 5 دقايق")
    .max(480, "أقصى مدة 480 دقيقة"),
  price: z
    .number({ message: "السعر مطلوب" })
    .int("السعر لازم يكون رقم صحيح بالجنيه")
    .min(0, "السعر لا يمكن أن يكون سالباً"),
  depositAmount: z
    .number({ message: "قيمة العربون غير صحيحة" })
    .int("العربون لازم يكون رقم صحيح")
    .min(0, "العربون لا يمكن أن يكون سالباً")
    .nullable()
    .optional(),
  mode: modeSchema,
  meetingUrl: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^https?:\/\/\S+$/.test(v),
      "رابط الاجتماع غير صحيح",
    )
    .nullable()
    .optional(),
  requiresAddress: z.boolean().optional(),
};

export const createServiceSchema = z.object(shape).superRefine((d, ctx) => {
  if (d.depositAmount != null && d.depositAmount > d.price) {
    ctx.addIssue({
      code: "custom",
      path: ["depositAmount"],
      message: "العربون لا يمكن أن يكون أكبر من سعر الخدمة",
    });
  }
});

export const updateServiceSchema = z
  .object(shape)
  .partial()
  .extend({ isActive: z.boolean().optional() })
  .refine((d) => Object.keys(d).length > 0, {
    message: "يجب تعديل بيانات واحدة على الأقل",
  });

/** يوحّد القيم المرتبطة بنوع الجلسة */
export function normalizeService<
  T extends {
    mode: string;
    meetingUrl?: string | null;
    requiresAddress?: boolean;
  },
>(data: T) {
  return {
    requiresAddress:
      data.mode === "HOME_VISIT" ? true : (data.requiresAddress ?? false),
    meetingUrl: data.mode === "ONLINE" ? data.meetingUrl || null : null,
  };
}
