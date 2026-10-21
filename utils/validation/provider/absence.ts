import { z } from "zod";

export const dateString = z
  .string({ message: "التاريخ مطلوب" })
  .regex(/^\d{4}-\d{2}-\d{2}$/, "صيغة التاريخ يجب أن تكون YYYY-MM-DD")
  .refine(
    (v) => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v,
    "التاريخ غير صحيح"
  );

export const createAbsenceSchema = z.object({
  date: dateString,
  reason: z.string().trim().max(200, "السبب طويل جداً").optional(),
});
