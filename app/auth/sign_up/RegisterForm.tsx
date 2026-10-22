"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  Store,
  UserRound,
  Loader2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { RegisterInput } from "./RegisterInput";
import Link from "next/link";
import GoogleProvider from "../GoogleProvider";

type AccountType = "PROVIDER" | "CLIENT";

export function RegisterForm() {
  const [accountType, setAccountType] = useState<AccountType>("PROVIDER");

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Status & Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      setServerError(null);
      setServerSuccess(null);
    };
  }, []);
  // Password strength calculations
  const hasMinLength = password.length >= 8;
  const hasSpecialOrNum = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "الاسم بالكامل أو اسم النشاط مطلوب.";
    }

    const cleanPhone = phone.replace(/\s+/g, "");
    if (!cleanPhone) {
      newErrors.phone = "رقم الهاتف المحمول مطلوب.";
    } else if (!/^01[0125]\d{8}$/.test(cleanPhone)) {
      newErrors.phone =
        "أدخل رقم هاتف مصري صحيح مكون من 11 رقمًا (مثال: 01012345678).";
    }

    if (!email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة.";
    }

    if (!password) {
      newErrors.password = "كلمة المرور مطلوبة.";
    } else if (password.length < 8) {
      newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل.";
    }

    if (!termsAccepted) {
      newErrors.terms =
        "يجب الموافقة على شروط الاستخدام وسياسة الخصوصية للاستمرار.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setServerError(null);
    setServerSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          phone,
          email,
          password,
          accountType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.message || "حدث خطأ أثناء التسجيل.");
        return;
      }
      setRegisteredEmail(email.trim());
    } catch (error) {
      console.log(error);
      setServerError(
        "تعذر الاتصال بالخادم. يرجى التأكد من اتصال الإنترنت والمحاولة مجددًا.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  if (registeredEmail) {
    return (
      <div
        dir="rtl"
        className="w-full space-y-4 rounded-[16px] bg-surface p-6 text-center shadow-level1 sm:p-8"
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#DDF4EE] text-[#16855B]">
          <Mail className="size-7" />
        </div>
        <h2 className="text-headline-md font-bold text-neutral-primary">
          افتح بريدك لتفعيل الحساب
        </h2>
        <p className="text-body-md text-neutral-muted">
          أرسلنا رابط التفعيل إلى{" "}
          <strong dir="ltr" className="text-neutral-primary">
            {registeredEmail}
          </strong>
          . اضغط على الرابط في الرسالة، وبعدها سجّل دخولك. لو الرسالة ماوصلتش
          شوف مجلد الـ Spam.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#087F6A] px-6 text-label-lg font-semibold text-white hover:bg-[#066857]"
        >
          الذهاب لتسجيل الدخول
        </Link>
      </div>
    );
  }
  return (
    <div
      dir="rtl"
      className="w-full bg-surface p-5 sm:p-7 rounded-[16px] shadow-level1 text-right"
    >
      {/* Header */}
      <div className="mb-6">
        <Badge className="rounded-full bg-primary-light text-primary-dark font-medium text-label-md px-3 py-1 border-0 inline-flex items-center gap-1.5">
          <span>⚡</span>
          <span>تجربة مجانية لمدة 14 يومًا</span>
        </Badge>

        <h1 className="mt-3 text-headline-lg font-bold text-neutral-primary">
          ابدأ مع أجندة
        </h1>

        <p className="mt-1.5 text-body-md text-neutral-muted">
          أنشئ حسابك وابدأ تنظيم مواعيدك وتحصيل العربون في دقائق معدودة.
        </p>
      </div>

      {/* Global Banners */}
      {serverError && (
        <div className="mb-5 p-3.5 rounded-[10px] bg-[#FFDAD6] border border-[#D94B4B]/30 flex items-start gap-2.5 text-body-md text-[#D94B4B]">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {serverSuccess && (
        <div className="mb-5 p-3.5 rounded-[10px] bg-[#DDF4EE] border border-[#16855B]/30 flex items-start gap-2.5 text-body-md text-[#16855B]">
          <Check className="size-5 shrink-0 mt-0.5" />
          <span>{serverSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Account Type Selector */}
        <div>
          <Label className="mb-2.5 block text-label-md font-semibold text-neutral-primary">
            أنا أسجل بصفتي:
          </Label>

          <RadioGroup
            value={accountType}
            onValueChange={(val) => setAccountType(val as AccountType)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {/* Business Radio */}
            <Label
              htmlFor="type-business"
              className={`
                flex cursor-pointer items-center gap-3
                rounded-[10px] border p-3.5
                transition-all duration-200
                ${
                  accountType === "PROVIDER"
                    ? "border-primary bg-[#EAF6F3] shadow-level1"
                    : "border-border-subtle bg-surface hover:border-primary/50"
                }
              `}
            >
              <RadioGroupItem
                id="type-business"
                value="PROVIDER"
                className="sr-only"
              />

              <div
                className={`
                  flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors
                  ${
                    accountType === "PROVIDER"
                      ? "border-primary bg-primary"
                      : "border-[#AAB8B4] bg-surface"
                  }
                `}
              >
                {accountType === "PROVIDER" && (
                  <Check className="size-3 text-white" strokeWidth={3} />
                )}
              </div>

              <div
                className={`
                  flex size-10 shrink-0 items-center justify-center rounded-[10px]
                  ${accountType === "PROVIDER" ? "bg-primary text-white" : "bg-[#F4F8F6] text-neutral-muted"}
                `}
              >
                <Store className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-body-md font-semibold text-neutral-primary">
                  صاحب خدمة أو نشاط
                </p>
                <p className="text-body-sm text-neutral-muted">
                  عيادة، صالون، أكاديمية، مستقل
                </p>
              </div>
            </Label>

            {/* Client Radio */}
            <Label
              htmlFor="type-client"
              className={`
                flex cursor-pointer items-center gap-3
                rounded-[10px] border p-3.5
                transition-all duration-200
                ${
                  accountType === "CLIENT"
                    ? "border-primary bg-[#EAF6F3] shadow-level1"
                    : "border-border-subtle bg-surface hover:border-primary/50"
                }
              `}
            >
              <RadioGroupItem
                id="type-client"
                value="CLIENT"
                className="sr-only"
              />

              <div
                className={`
                  flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors
                  ${
                    accountType === "CLIENT"
                      ? "border-primary bg-primary"
                      : "border-[#AAB8B4] bg-surface"
                  }
                `}
              >
                {accountType === "CLIENT" && (
                  <Check className="size-3 text-white" strokeWidth={3} />
                )}
              </div>

              <div
                className={`
                  flex size-10 shrink-0 items-center justify-center rounded-[10px]
                  ${accountType === "CLIENT" ? "bg-primary text-white" : "bg-[#F4F8F6] text-neutral-muted"}
                `}
              >
                <UserRound className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-body-md font-semibold text-neutral-primary">
                  عميل مستفيد
                </p>
                <p className="text-body-sm text-neutral-muted">
                  لحجز ومتابعة مواعيدك
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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
          />

          {/* Phone Field */}
          <div className="space-y-1.5 w-full">
            <Label className="text-body-md font-semibold text-neutral-primary flex items-center gap-1">
              رقم الهاتف المحمول
              <span className="text-[#D94B4B]">*</span>
            </Label>

            <div className="relative flex h-11 w-full overflow-hidden rounded-[10px] border border-border-subtle bg-[#F4F8F6] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              {/* Country Code Prefix */}
              <div className="flex h-full shrink-0 items-center gap-1.5 border-l border-border-subtle bg-[#EAF5F2] px-3.5 text-body-sm font-semibold text-neutral-primary select-none">
                <span>EG</span>
                <span dir="ltr" className="tabular-numbers">
                  +20
                </span>
              </div>

              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010 1234 5678"
                dir="ltr"
                className="h-full flex-1 rounded-none border-0 bg-transparent px-3.5 text-body-md text-neutral-primary shadow-none placeholder:text-neutral-muted focus-visible:ring-0 text-right tabular-numbers"
              />

              <div className="flex size-11 shrink-0 items-center justify-center text-neutral-muted">
                <Phone className="size-4.5" />
              </div>
            </div>

            {errors.phone ? (
              <p className="text-body-sm text-[#D94B4B] font-medium">
                {errors.phone}
              </p>
            ) : (
              <p className="text-body-sm text-neutral-muted">
                لتفعيل حسابك وإرسال إشعارات الحجز والواتساب المباشرة
              </p>
            )}
          </div>

          <RegisterInput
            required
            label="البريد الإلكتروني للعمل"
            placeholder="name@company.com"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          {/* Password Field with Security & Live Requirements */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-body-md font-semibold text-neutral-primary flex items-center gap-1">
                كلمة المرور
                <span className="text-[#D94B4B]">*</span>
              </Label>
              <span className="text-body-sm text-neutral-muted">
                8 أحرف على الأقل
              </span>
            </div>

            <div className="relative">
              <LockKeyhole className="absolute right-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-muted pointer-events-none" />

              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`
                  h-11 w-full rounded-[10px] bg-[#F4F8F6] px-10 text-body-md text-neutral-primary border
                  ${errors.password ? "border-[#D94B4B]" : "border-border-subtle focus-visible:border-primary"}
                  placeholder:text-neutral-muted shadow-none focus-visible:ring-1 focus-visible:ring-primary transition-all
                `}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute left-1 top-1/2 size-9 -translate-y-1/2 text-neutral-muted hover:text-neutral-primary cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </div>

            {/* Live Password Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-body-sm">
              <span
                className={`flex items-center gap-1 ${hasMinLength ? "text-[#16855B]" : "text-neutral-muted"}`}
              >
                <Check
                  className={`size-3.5 ${hasMinLength ? "opacity-100" : "opacity-40"}`}
                />
                <span>8 أحرف على الأقل</span>
              </span>
              <span
                className={`flex items-center gap-1 ${hasSpecialOrNum ? "text-[#16855B]" : "text-neutral-muted"}`}
              >
                <Check
                  className={`size-3.5 ${hasSpecialOrNum ? "opacity-100" : "opacity-40"}`}
                />
                <span>رقم أو رمز خاص</span>
              </span>
            </div>

            {errors.password && (
              <p className="text-body-sm text-[#D94B4B] font-medium">
                {errors.password}
              </p>
            )}
          </div>
        </div>

        {/* Security Hashing Notice */}
        <div className="flex items-center gap-2 p-2.5 rounded-[10px] bg-[#EAF6F3] border border-[#DDF4EE] text-body-sm text-primary-dark">
          <ShieldCheck className="size-4.5 shrink-0 text-primary" />
          <span>
            تتم حماية وتشفير كلمة المرور بتقنية{" "}
            <strong>Bcrypt Hash (Salt 12)</strong> عالية الأمان.
          </span>
        </div>

        {/* Terms Agreement */}
        <div className="space-y-1">
          <div className="flex items-start gap-2.5">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
              className="mt-1 size-4 rounded-xs border-border-subtle data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />

            <Label
              htmlFor="terms"
              className="cursor-pointer text-body-sm leading-5 text-neutral-primary font-normal"
            >
              أوافق على{" "}
              <Link
                href="/terms"
                className="font-semibold text-primary hover:underline"
              >
                شروط الاستخدام
              </Link>{" "}
              و{" "}
              <Link
                href="/privacy"
                className="font-semibold text-primary hover:underline"
              >
                سياسة الخصوصية
              </Link>{" "}
              الخاصة بمنصة أجندة وموافق على استلام إشعارات الحجز المباشرة.
            </Label>
          </div>
          {errors.terms && (
            <p className="text-body-sm text-[#D94B4B] font-medium pr-6">
              {errors.terms}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="
            h-11 w-full rounded-[10px] bg-[#087F6A] text-white text-label-lg font-semibold
hover:bg-[#066857] transition-all duration-200 cursor-pointer shadow-level2
            disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2
          "
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>جاري إنشاء الحساب والتشفير...</span>
            </>
          ) : (
            <span>إنشاء الحساب مجانًا ←</span>
          )}
        </Button>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <Separator className="flex-1 bg-border-subtle" />
          <span className="text-body-sm text-neutral-muted">أو</span>
          <Separator className="flex-1 bg-border-subtle" />
        </div>

        {/* Google Provider */}
        <GoogleProvider />

        {/* Existing Account Link */}
        <p className="mt-4 text-center text-body-sm text-neutral-muted">
          لديك حساب بالفعل على أجندة؟{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-primary hover:underline"
          >
            تسجيل الدخول
          </Link>
        </p>
      </form>
    </div>
  );
}
