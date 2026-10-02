"use client";

import { useState } from "react";
import {
   Check,
   Eye,
   EyeOff,
   LockKeyhole,
   Mail,
   Phone,
   Store,
   UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   RadioGroup,
   RadioGroupItem,
} from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { RegisterInput } from "./RegisterInput";
import Link from "next/link";



type AccountType = "business" | "client";

export function RegisterForm() {
   const [accountType, setAccountType] =
      useState<AccountType>("business");

   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);

   return (
      <div
         dir="rtl"
         className="
        rounded-card
        p-5
        shadow-lg
        sm:p-6
      "
      >
         {/* Header */}
         <div className="mb-5">
            <Badge
               className="
            rounded-full
            bg-primary-light
            text-primary-dark!
            text-label-md
          "
            >
               ⚡ تجربة مجانية لمدة 14 يومًا
            </Badge>

            <h1 className="mt-3 text-headline-lg">
               ابدأ مع أجندة
            </h1>

            <p className="mt-1 text-body-md ">
               أنشئ حسابك وابدأ تنظيم مواعيدك وتحصيل العربون في دقائق معدودة.
            </p>
         </div>

         {/* Account Type */}
         <div className="mb-5">
            <Label className="mb-2 block text-label-md">
               أنا أسجل بصفتي:
            </Label>

            <RadioGroup
               value={accountType}
               onValueChange={(value) =>
                  setAccountType(value as AccountType)
               }
               className="grid grid-cols-2 gap-2"
            >
               {/* Business */}
               <Label
                  htmlFor="business"
                  className={`
      flex cursor-pointer justify-start items-center gap-3
      rounded-[10px]
      border
      py-6
      transition-all
      ${accountType === "business"
                        ? "border-[#D6EBE5] bg-[#EAF6F3]"
                        : "border-[#E5EAE8] bg-white"
                     }
    `}
               >
                  <RadioGroupItem
                     id="business"
                     value="business"
                     className="sr-only"
                  />

                  {/* Custom Radio */}
                  <div
                     className={`
        flex size-5 shrink-0 items-center justify-center
        rounded-full border
        ${accountType === "business"
                           ? "border-[#087F6A] bg-[#087F6A]"
                           : "border-[#AAB8B4] bg-white"
                        }
      `}
                  >
                     {accountType === "business" && (
                        <Check className="size-3 text-white" strokeWidth={3} />
                     )}
                  </div>

                  <div className={`
                     flex size-11 shrink-0 items-center justify-center ${accountType === "business" ? "bg-[#087F6A] text-white" : "bg-emerald-50 border border-[#AAB8B4]"} rounded-[10px] `}>
                     <Store className="size-6" />
                  </div>

                  <div className="min-w-0">
                     <p className="text-[14px] mb-2 font-semibold text-[#17201E]">
                        صاحب خدمة أو نشاط
                     </p>

                     <p className="text-[12px] leading-5 text-[#6B7272]">
                        عيادة، صالون، أكاديمية، مستقل
                     </p>
                  </div>
               </Label>

               {/* Client */}
               <Label
                  htmlFor="client"
                  className={`
      flex cursor-pointer items-center gap-3
      rounded-[10px]
      border
    
      py-5
      transition-all
      ${accountType === "client"
                        ? "border-[#D6EBE5] bg-[#EAF6F3]"
                        : "border-[#E5EAE8] bg-white"
                     }
    `}
               >
                  <RadioGroupItem
                     id="client"
                     value="client"
                     className="sr-only"
                  />

                  {/* Custom Radio */}
                  <div
                     className={`
        flex size-5 shrink-0 items-center justify-center
        rounded-full border
        ${accountType === "client"
                           ? "border-[#087F6A] bg-[#087F6A]"
                           : "border-[#AAB8B4] bg-white"
                        }
      `}
                  >
                     {accountType === "client" && (
                        <Check className="size-3 text-white" strokeWidth={3} />
                     )}
                  </div>

                  <div className={`
                     flex size-11 shrink-0 items-center justify-center ${accountType === "client" ? "bg-[#087F6A] text-white" : "bg-emerald-50 border border-[#AAB8B4]"} rounded-[10px] `}>
                     <UserRound className="size-5" />
                  </div>

                  <div className="min-w-0">
                     <p className="text-[14px] mb-2 font-semibold text-[#17201E]">
                        عميل مستفيد
                     </p>

                     <p className="text-[12px] leading-5 text-[#6B7272]">
                        لحجز ومتابعة وإدارة مواعيدك الشخصية
                     </p>
                  </div>
               </Label>
            </RadioGroup>
         </div>


         {/* Inputs */}
         <div className="space-y-4">
            <RegisterInput
               required
               label="الاسم بالكامل أو اسم النشاط"
               placeholder="د. كريم إبراهيم أو أكاديمية النور"
               icon={UserRound}
            />

            <div dir="rtl" className="w-full space-y-2">
               {/* Label */}
               <Label className="text-[14px] font-semibold text-[#17201E]">
                  رقم الهاتف المحمول
                  <span className="mr-1 text-red-500">*</span>
               </Label>

               {/* Phone Input */}
               <div
                  className="
          relative
          flex
          h-11
          w-full
          overflow-hidden
          rounded-[10px]
          bg-[#EAF5F2]
        "
               >
                  {/* Country Code */}
                  <div
                     className="
            flex
            h-full
            shrink-0
            items-center
            gap-2
            border-l
            border-[#DCEAE6]
            bg-[#E4F1EE]
            px-4
            text-[13px]
            font-medium
            text-[#17201E]
          "
                  >
                     <span className="text-[12px]">EG</span>

                     <span dir="ltr">+20</span>
                  </div>

                  {/* Input */}
                  <Input
                     type="tel"

                     // value={value}
                     // onChange={(e) => onChange?.(e.target.value)}
                     placeholder="010 1234 5678"
                     dir="ltr"
                     className="
            h-full
            flex-1
            rounded-none
            border-0
            bg-transparent
            px-4
            text-[14px]
            text-[#17201E]
            shadow-none
            placeholder:text-[#7B8582]
            focus-visible:ring-0
            focus-visible:ring-offset-0
          "
                  />

                  {/* Phone Icon */}
                  <div
                     className="
            flex
            w-12
            shrink-0
            items-center
            justify-center
            text-[#53615D]
          "
                  >
                     <Phone className="size-4.5" />
                  </div>
               </div>

               {/* Helper text */}
               <p className="text-[12px] leading-5 text-[#6B7272]">
                  لتفعيل حسابك وإرسال رسائل العربون والواتساب
               </p>
            </div>

            <RegisterInput
               label="البريد الإلكتروني للعمل"
               placeholder="name@company.com"
               type="email"
               icon={Mail}
               required
            />

            {/* Password */}
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                  <Label className="text-[14px] font-semibold leading-5.5">
                     كلمة المرور
                     <span className="mr-1 text-red-500">*</span>
                  </Label>

                  <span className="text-[12px] leading-5 text-[#6B7272]">
                     8 أحرف على الأقل
                  </span>
               </div>

               <div className="relative" >
                  <LockKeyhole className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#6B7272]" />

                  <Input
                     type={showPassword ? "text" : "password"}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••"
                     className="
                h-11
                rounded-[10px]
                border-emerald-100
                outline-0
                bg-[#F4F8F6]
                px-10
                text-[14px]
                shadow-none
                focus-visible:border-emerald-200
                focus-visible:ring-0
              "
                  />

                  <Button
                     type="button"
                     variant="ghost"
                     size="icon"
                     onClick={() =>
                        setShowPassword((prev) => !prev)
                     }
                     className="absolute  cursor-pointer left-1 top-1/2 size-9 -translate-y-1/2 text-[#6B7272]"
                  >
                     {showPassword ? (
                        <EyeOff className="size-4" />
                     ) : (
                        <Eye className="size-4" />
                     )}
                  </Button>
               </div>

               <div className="flex justify-between text-[12px] leading-5 text-[#6B7272]">
                  <span>أدخل كلمة مرور قوية</span>
                  <span>رمز خاص مطلوب</span>
               </div>



            </div>
         </div>

         {/* Terms */}
         <div dir="rtl" className="flex mt-2 relative z-10 items-start gap-2">
            <Checkbox
               id="terms"
               className="
          mt-0.5
          size-4
          rounded-xs
          border-[#7B8582]
          bg-white
          shadow-none
          focus-visible:ring-0
          focus-visible:ring-offset-0
          data-[state=checked]:border-primary
          data-[state=checked]:bg-primary
        "
            />

            <Label
               htmlFor="terms"
               className="cursor-pointer text-[12px] font-normal leading-5 text-neutral-primary"
            >
               أوافق على{" "}
               <Link
                  href="/terms"
                  className="text-[#80b1a9] hover:underline"
               >
                  شروط الاستخدام
               </Link>{" "}
               و{" "}
               <Link
                  href="/privacy"
                  className="text-[#80b1a9] hover:underline"
               >
                  سياسة الخصوصية
               </Link>{" "}
               الخاصة بمنصة أجندة وموافق على استلام إشعارات الحجز المباشرة.
            </Label>
         </div>

         {/* Submit */}
         <Button
            className="
          mt-4
          h-11
          w-full
          rounded-[10px]
          bg-[#087F6A]
          text-[14px]
          cursor-pointer
          font-semibold
          hover:bg-[#056653]
        "
         >
            إنشاء الحساب مجانًا ←
         </Button>

         {/* Divider */}
         <div className="my-3 flex items-center gap-3">
            <Separator className="flex-1" />

            <span className="text-[12px] text-[#6B7272]">
               أو
            </span>

            <Separator className="flex-1" />
         </div>

         {/* Google */}
         <Button
            variant="outline"
            className="
          h-11
          w-full
          rounded-[10px]
          border-0
          cursor-pointer
          font-semibold
          shadow
          bg-emerald-50
          text-[14px]
          hover:bg-[#EEF5F2]
        "
         >

            <svg xmlns="http://w3.org" viewBox="0 0 48 48" width="48px" height="48px">
               <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
               <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
               <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
               <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
               <path fill="none" d="M0 0h48v48H0z" />
            </svg>

            التسجيل السريع باستخدام Google
         </Button>

         {/* Login */}
         <p className="mt-3 text-center text-[12px] leading-5 text-[#6B7272]">
            لديك حساب بالفعل على أجندة؟{" "}
            <Link
               href="/login"
               className="font-medium text-[#087F6A] hover:underline"
            >
               تسجيل الدخول
            </Link>
         </p>
      </div>
   );
}