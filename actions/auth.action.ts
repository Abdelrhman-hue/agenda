"use server"

import { signIn } from "@/auth"
import { ActionType } from "@/utils/types"

export const authWithGoogleAct = async (): Promise<ActionType> => {
   try {

      await signIn("google", { redirect: false })

      return { isSuccess: true, message: "تم التسجيل بنجاح" }
      
   } catch (error) {
      console.log("error from action auth with google, ", error)
      return { isSuccess: false, message: "حدث خطأ غير متوقع" }
   }
}