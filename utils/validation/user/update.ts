import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "الاسم يجب أن يكون حرفين على الأقل")
      .optional(),

    phone: z
      .string()
      .trim()
      .min(8, "رقم الهاتف غير صحيح")
      .max(15, "رقم الهاتف غير صحيح")
      .optional(),

    currentPassword: z
      .string()
      .min(8, "كلمة المرور الحالية يجب أن تكون 8 أحرف على الأقل")
      .optional(),

    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .regex(
        /[A-Z]/,
        "كلمة المرور يجب أن تحتوي على حرف إنجليزي كبير واحد على الأقل"
      )
      .regex(
        /[a-z]/,
        "كلمة المرور يجب أن تحتوي على حرف إنجليزي صغير واحد على الأقل"
      )
      .regex(
        /[!@#$%^&*(),.?":{}|<>\_\-\\[\]\/~`';&+=]/,
        "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل"
      )
      .optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.phone !== undefined ||
      data.password !== undefined,
    {
      message: "يجب تعديل بيانات واحدة على الأقل",
      path: [],
    }
  )