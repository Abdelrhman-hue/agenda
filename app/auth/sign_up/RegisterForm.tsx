"use client";

import { useState } from "react";
import {
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



type AccountType = "business" | "client";

export function RegisterForm() {
  const [accountType, setAccountType] =
    useState<AccountType>("business");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordRules = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  const strength = passwordRules.filter(Boolean).length;

  return (
    <div
      dir="rtl"
      className="
        rounded-[16px]
        bg-white
        p-5
        shadow-[0_1px_3px_rgba(23,32,30,0.04),0_1px_2px_rgba(23,32,30,0.02)]
        sm:p-6
      "
    >
      {/* Header */}
      <div className="mb-5">
        <Badge
          className="
            rounded-full
            border-0
            bg-[#DFF4EE]
            px-3
            py-1
            text-[12px]
            font-medium
            text-[#087F6A]
          "
        >
          ⚡ تجربة مجانية لمدة 14 يومًا
        </Badge>

        <h1 className="mt-3 text-[28px] font-semibold leading-10 text-[#17201E]">
          ابدأ مع أجندة
        </h1>

        <p className="mt-1 text-[14px] leading-6 text-[#6B7272]">
          أنشئ حسابك وابدأ تنظيم مواعيدك وتحصيل العربون في دقائق معدودة.
        </p>
      </div>

      {/* Account Type */}
      <div className="mb-5">
        <Label className="mb-2 block text-[14px] font-semibold leading-[22px]">
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
              flex cursor-pointer items-center gap-2
              rounded-[10px]
              border
              p-3
              transition
              ${
                accountType === "business"
                  ? "border-[#087F6A] bg-[#DFF4EE]"
                  : "border-[#E5EAE8] bg-white"
              }
            `}
          >
            <RadioGroupItem
              id="business"
              value="business"
            />

            <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#087F6A] text-white">
              <Store className="size-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[14px] font-semibold leading-5 text-[#17201E]">
                صاحب خدمة أو نشاط
              </p>

              <p className="truncate text-[12px] leading-5 text-[#6B7272]">
                عيادة، صالون، أكاديمية، مستقل
              </p>
            </div>
          </Label>

          {/* Client */}
          <Label
            htmlFor="client"
            className={`
              flex cursor-pointer items-center gap-2
              rounded-[10px]
              border
              p-3
              transition
              ${
                accountType === "client"
                  ? "border-[#087F6A] bg-[#DFF4EE]"
                  : "border-[#E5EAE8] bg-white"
              }
            `}
          >
            <RadioGroupItem
              id="client"
              value="client"
            />

            <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#F1F4F3] text-[#6B7272]">
              <UserRound className="size-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[14px] font-semibold leading-5 text-[#17201E]">
                عميل مستفيد
              </p>

              <p className="truncate text-[12px] leading-5 text-[#6B7272]">
                لحجز ومتابعة مواعيدك الشخصية
              </p>
            </div>
          </Label>
        </RadioGroup>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <RegisterInput
          label="الاسم بالكامل أو اسم النشاط"
          placeholder="د. كريم إبراهيم أو أكاديمية النور"
          icon={UserRound}
        />

        <div>
          <RegisterInput
            label="رقم الهاتف المحمول"
            placeholder="010 1234 5678"
            type="tel"
            icon={Phone}
            required
            prefix="+20 EG"
          />

          <p className="mt-1 text-[12px] leading-5 text-[#6B7272]">
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
            <Label className="text-[14px] font-semibold leading-[22px]">
              كلمة المرور
              <span className="mr-1 text-red-500">*</span>
            </Label>

            <span className="text-[12px] leading-5 text-[#6B7272]">
              8 أحرف على الأقل
            </span>
          </div>

          <div className="relative">
            <LockKeyhole className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#6B7272]" />

            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="
                h-11
                rounded-[10px]
                border-[#E5EAE8]
                bg-[#F4F8F6]
                px-10
                text-[14px]
                shadow-none
                focus-visible:border-[#087F6A]
                focus-visible:ring-[#087F6A]
              "
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              className="absolute left-1 top-1/2 size-9 -translate-y-1/2 text-[#6B7272]"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>

          {/* Strength */}
          <div className="grid grid-cols-4 gap-2">
            {passwordRules.map((valid, index) => (
              <div
                key={index}
                className={`h-1 rounded-full ${
                  valid
                    ? "bg-[#087F6A]"
                    : "bg-[#DDE5E2]"
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between text-[12px] leading-5 text-[#6B7272]">
            <span>أدخل كلمة مرور قوية</span>
            <span>رمز خاص مطلوب</span>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="mt-4 flex items-start gap-2">
        <Checkbox
          id="terms"
          className="mt-1 rounded-[4px]"
        />

        <Label
          htmlFor="terms"
          className="
            cursor-pointer
            text-[12px]
            font-normal
            leading-5
            text-[#6B7272]
          "
        >
          أوافق على شروط الاستخدام وسياسة الخصوصية الخاصة بمنصة
          أجندة وموافق على استلام إشعارات الحجز المباشرة.
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
          bg-[#F4F8F6]
          text-[14px]
          hover:bg-[#EEF5F2]
        "
      >
        <span className="font-bold text-[#4285F4]">
          G
        </span>

        التسجيل السريع باستخدام Google
      </Button>

      {/* Login */}
      <p className="mt-3 text-center text-[12px] leading-5 text-[#6B7272]">
        لديك حساب بالفعل على أجندة؟{" "}
        <a
          href="/login"
          className="font-medium text-[#087F6A] hover:underline"
        >
          تسجيل الدخول
        </a>
      </p>
    </div>
  );
}