import { z } from "zod";

export const PaymentMethodEnum = z.enum(["INSTAPAY", "VODAFONE_CASH", "CARD", "CASH"]);
export const BookingStatusEnum = z.enum([
  "HELD",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
  "EXPIRED",
]);

export const createBookingSchema = z.object({
  providerId: z.string().trim().optional(),
  businessId: z.string().trim().optional(),
  slug: z.string().trim().optional(),
  serviceId: z.string().trim().min(1, "معرّف الخدمة مطلوب"),
  clientId: z.string().trim().optional(),
  clientName: z.string().trim().min(2, "اسم العميل يجب ألا يقل عن حرفين").optional(),
  clientPhone: z.string().trim().min(8, "رقم الهاتف غير صحيح").optional(),
  clientEmail: z.string().trim().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
  startsAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "تاريخ ووقت الحجز غير صالح",
  }),
  address: z.string().trim().optional(),
  clientNotes: z.string().trim().optional(),
  paymentMethod: PaymentMethodEnum.default("INSTAPAY"),
}).refine(
  (data) => Boolean(data.providerId || data.businessId || data.slug),
  {
    message: "يجب تحديد مقدم الخدمة (providerId أو slug أو businessId)",
    path: ["providerId"],
  }
);

export const updateBookingSchema = z.object({
  action: z.enum(["RESCHEDULE", "CANCEL", "CONFIRM", "COMPLETE", "NO_SHOW"]).optional(),
  startsAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "تاريخ الموعد الجديد غير صالح",
  }).optional(),
  cancellationReason: z.string().trim().optional(),
  status: BookingStatusEnum.optional(),
  clientNotes: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

export const availabilityQuerySchema = z.object({
  providerId: z.string().trim().optional(),
  businessId: z.string().trim().optional(),
  slug: z.string().trim().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "صيغة التاريخ يجب أن تكون YYYY-MM-DD"),
  serviceId: z.string().trim().optional(),
}).refine(
  (data) => Boolean(data.providerId || data.businessId || data.slug),
  {
    message: "يجب تحديد مقدم الخدمة (providerId أو slug أو businessId)",
    path: ["providerId"],
  }
);

export type TCreateBookingInput = z.infer<typeof createBookingSchema>;
export type TUpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type TAvailabilityQueryInput = z.infer<typeof availabilityQuerySchema>;
