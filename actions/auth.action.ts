"use server"

import { signIn } from "@/auth"
import { ActionType } from "@/utils/types"
import { isRedirectError } from "next/dist/client/components/redirect-error"

export const authWithGoogleAct = async (): Promise<ActionType> => {
   try {
      // الـ proxy هو اللي بيوجه المستخدم (اختيار الدور / onboarding / dashboard)
      await signIn("google", { redirectTo: "/dashboard" })
      return { isSuccess: true, message: "تم التسجيل بنجاح" }
   } catch (error) {
      if (isRedirectError(error)) throw error

      console.log("error from action auth with google, ", error)
      return { isSuccess: false, message: "حدث خطأ غير متوقع" }
   }
}
