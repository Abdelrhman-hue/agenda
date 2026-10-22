import { z } from "zod"
import { registerSchema } from "../validation/auth/register"
import { loginSchema } from "../validation/auth/login"
import { updateUserSchema } from "../validation/user/update"
import { roleSchema } from "../validation/user/role"
import { upsertProfileSchema } from "../validation/provider/profile"
import { createServiceSchema, updateServiceSchema } from "../validation/provider/service"
import { workingHoursSchema } from "../validation/provider/workingHours"
import { settingsSchema } from "../validation/provider/settings"
import { createAbsenceSchema } from "../validation/provider/absence"

export type TRegisterUser = z.infer<typeof registerSchema>
export type TLoginUser = z.infer<typeof loginSchema>
export type TUpdateUser = z.infer<typeof updateUserSchema>

export type TChooseRole = z.infer<typeof roleSchema>
export type TUpsertProfile = z.infer<typeof upsertProfileSchema>
export type TCreateService = z.infer<typeof createServiceSchema>
export type TUpdateService = z.infer<typeof updateServiceSchema>
export type TWorkingHours = z.infer<typeof workingHoursSchema>
export type TProviderSettings = z.infer<typeof settingsSchema>
export type TCreateAbsence = z.infer<typeof createAbsenceSchema>
