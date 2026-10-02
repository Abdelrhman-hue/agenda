import { Button } from '@base-ui/react'
import Link from 'next/link'
import LoginInput from "./LoginInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { ArrowLeft, AtSign, Lock } from "lucide-react";


const LoginForm = () => {
   return (
      <form className="w-full mt-6 flex flex-col gap-4" action="">

         <LoginInput
            label="البريد الالكتروني"
            placeholder="ادخل البريد الالكتروني"
            name="email"
            type="email"
            icon={<AtSign className="text-[#7C8582] size-6" />}
         />

         <LoginInput
            label="كلمة المرور"
            placeholder="ادخل كلمة المرور"
            name="password"
            type="password"
            icon={<Lock className="text-[#7C8582] size-6" />}
         />

         <div className="w-full flex items-center justify-between">
            <FieldGroup className="w-56 ">
               <Field orientation="horizontal">
                  <Checkbox name="remember-me" />
                  <FieldLabel className="text-label-lg text-primary-dark" htmlFor="remember-me">
                     تذكرني علي هذا الجهاز
                  </FieldLabel>
               </Field>
            </FieldGroup>

            <Link
               href={"/auth/forgot-password"}
               className="text-label-lg text-primary-dark hover:underline"
            >
               نسيت كلمة المرور؟
            </Link>

         </div>

         <Button type="submit" className="w-full mt-3 cursor-pointer h-14 rounded-input hover:shadow-level2  bg-primary-dark hover:bg-primary-dark/90 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 flex items-center justify-center gap-2">
            <span className="text-body-lg text-surface">تسجيل الدخول</span>
            <ArrowLeft className="size-6 text-surface" />
         </Button>


      </form>
   )
}

export default LoginForm