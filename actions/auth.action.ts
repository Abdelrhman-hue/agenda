"use server"

import { signIn } from "@/auth"
import { ActionType } from "@/utils/types"
import { isRedirectError } from "next/dist/client/components/redirect-error"

export const authWithGoogleAct = async (): Promise<ActionType> => {
   try {
      await signIn("google", { redirectTo: "/" })
      return { isSuccess: true, message: "تم التسجيل بنجاح" }
   } catch (error) {
      if (isRedirectError(error)) throw error   // السطر ده هو المهم

      console.log("error from action auth with google, ", error)
      return { isSuccess: false, message: "حدث خطأ غير متوقع" }
   }
}