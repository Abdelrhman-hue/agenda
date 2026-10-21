import { z } from "zod";
import { DAY_NAMES } from "@/lib/constants";
import { toMinutes } from "@/lib/time";

const timeSchema = z
  .string({ message: "الوقت مطلوب" })
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "صيغة الوقت لازم تكون HH:mm")
  .refine((v) => Number(v.slice(3)) % 5 === 0, "الدقائق لازم تكون من مضاعفات 5");

const shiftSchema = z.object({ startTime: timeSchema, endTime: timeSchema });

const daySchema = z.object({
  dayOfWeek: z.number().int().min(0, "رقم اليوم غير صحيح").max(6, "رقم اليوم غير صحيح"),
  isOpen: z.boolean(),
  shifts: z.array(shiftSchema).max(6, "الحد الأقصى 6 فترات في اليوم").default([]),
});

export const workingHoursSchema = z
  .object({ days: z.array(daySchema).min(1, "الجدول فاضي").max(7, "الأسبوع 7 أيام فقط") })
  .superRefine((data, ctx) => {
    const seen = new Set<number>();
    data.days.forEach((day, i) => {
      const name = DAY_NAMES[day.dayOfWeek];
      const issue = (message: string) =>
        ctx.addIssue({ code: "custom", message, path: ["days", i] });

      if (seen.has(day.dayOfWeek)) return issue(`يوم ${name} متكرر`);
      seen.add(day.dayOfWeek);
      if (!day.isOpen) return;
      if (day.shifts.length === 0) return issue(`يوم ${name} مفتوح لكن بدون فترات عمل`);

      const sorted = [...day.shifts].sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
      for (let j = 0; j < sorted.length; j++) {
        const s = sorted[j];
        if (toMinutes(s.endTime) <= toMinutes(s.startTime)) {
          return issue(`يوم ${name}: وقت نهاية الفترة لازم يكون بعد البداية`);
        }
        if (toMinutes(s.endTime) > 23 * 60 + 55) {
          return issue(`يوم ${name}: آخر وقت مسموح 23:55`);
        }
        if (j > 0) {
          if (s.startTime === sorted[j - 1].startTime) {
            return issue(`يوم ${name}: فترتين بنفس وقت البداية`);
          }
          if (toMinutes(s.startTime) < toMinutes(sorted[j - 1].endTime)) {
            return issue(`يوم ${name}: الفترات متداخلة`);
          }
        }
      }
    });
  });
