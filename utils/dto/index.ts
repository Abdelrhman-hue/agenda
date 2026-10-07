import { z } from "zod"
import { registerSchema } from "../validation/auth/register"
import { loginSchema } from "../validation/auth/login"
import { updateUserSchema } from "../validation/user/update"

export type TRegisterUser = z.infer<typeof registerSchema>
export type TLoginUser = z.infer<typeof loginSchema>
export type TUpdateUser = z.infer<typeof updateUserSchema>