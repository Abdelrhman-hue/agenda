import { z } from "zod"
import { registerSchema } from "../validation/register"
import { loginSchema } from "../validation/login"

export type TRegisterUser = z.infer<typeof registerSchema>
export type TLoginUser = z.infer<typeof loginSchema>